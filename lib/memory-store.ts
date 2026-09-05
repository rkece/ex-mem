import { Memory, SourceDocument, CurrentContext, MemoryConflict } from './types';
import { INITIAL_MEMORIES, INITIAL_SOURCES, INITIAL_CONTEXT, INITIAL_CONFLICTS } from './seed-data';
import { getDatabase, isMongoConfigured } from './mongodb';

// In-memory fallback / cache that stays in sync
let inMemoryMemories: Memory[] = [...INITIAL_MEMORIES];
let inMemorySources: SourceDocument[] = [...INITIAL_SOURCES];
let inMemoryContext: CurrentContext = { ...INITIAL_CONTEXT };
let inMemoryConflicts: MemoryConflict[] = [...INITIAL_CONFLICTS];
let hasInitializedMongo = false;

async function syncWithMongoIfAvailable() {
  if (!isMongoConfigured()) return;
  try {
    const db = await getDatabase();
    if (!db) return;

    if (!hasInitializedMongo) {
      const memoriesColl = db.collection('memories');
      const count = await memoriesColl.countDocuments();
      if (count === 0) {
        // Seed MongoDB Atlas with initial data
        await memoriesColl.insertMany(INITIAL_MEMORIES);
        await db.collection('sources').insertMany(INITIAL_SOURCES);
        await db.collection('conflicts').insertMany(INITIAL_CONFLICTS);
        await db.collection('context').insertOne(INITIAL_CONTEXT);
      }
      hasInitializedMongo = true;
    }
  } catch (err) {
    console.warn('MongoDB Atlas sync note: falling back to local memory store.', err);
  }
}

export async function getMemories(filter?: {
  project?: string;
  type?: string;
  person?: string;
  search?: string;
}): Promise<Memory[]> {
  await syncWithMongoIfAvailable();

  try {
    const db = await getDatabase();
    if (db) {
      const query: Record<string, any> = {};
      if (filter?.project && filter.project !== 'all') {
        query.project = filter.project;
      }
      if (filter?.type && filter.type !== 'all') {
        query.type = filter.type;
      }
      if (filter?.person && filter.person !== 'all') {
        query.people = filter.person;
      }
      if (filter?.search) {
        const term = filter.search.toLowerCase();
        query.$or = [
          { content: { $regex: term, $options: 'i' } },
          { entities: { $regex: term, $options: 'i' } },
          { reason: { $regex: term, $options: 'i' } },
        ];
      }
      const results = await db.collection<Memory>('memories').find(query).sort({ date: -1 }).toArray();
      if (results.length > 0) return results;
    }
  } catch (err) {
    console.warn('Atlas read fallback:', err);
  }

  // In-memory fallback
  let list = [...inMemoryMemories];
  if (filter?.project && filter.project !== 'all') {
    list = list.filter((m) => m.project.toLowerCase() === filter.project?.toLowerCase());
  }
  if (filter?.type && filter.type !== 'all') {
    list = list.filter((m) => m.type.toLowerCase() === filter.type?.toLowerCase());
  }
  if (filter?.person && filter.person !== 'all') {
    list = list.filter((m) => m.people.some((p) => p.toLowerCase().includes(filter.person!.toLowerCase())));
  }
  if (filter?.search) {
    const s = filter.search.toLowerCase();
    list = list.filter(
      (m) =>
        m.content.toLowerCase().includes(s) ||
        (m.reason && m.reason.toLowerCase().includes(s)) ||
        m.entities.some((e) => e.toLowerCase().includes(s)) ||
        m.people.some((p) => p.toLowerCase().includes(s))
    );
  }
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getMemoryById(id: string): Promise<Memory | null> {
  const all = await getMemories();
  return all.find((m) => m.id === id) || null;
}

export async function saveMemory(memoryData: Partial<Memory>): Promise<Memory> {
  const newMemory: Memory = {
    id: memoryData.id || `mem-${Date.now()}`,
    project: memoryData.project || inMemoryContext.project || 'Ex-Mem Core',
    content: memoryData.content || '',
    type: memoryData.type || 'decision',
    date: memoryData.date || new Date().toISOString(),
    people: memoryData.people || [],
    entities: memoryData.entities || [],
    reason: memoryData.reason ?? null,
    source: memoryData.source || {
      id: 'user-input',
      title: 'Manual Memory Capture',
      timestamp: 'Just now',
      author: 'Current User',
    },
    confidence: memoryData.confidence ?? 95,
    relatedMemories: memoryData.relatedMemories || [],
    status: memoryData.status || 'verified',
  };

  inMemoryMemories.unshift(newMemory);

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection('memories').insertOne(newMemory);
    }
  } catch (err) {
    console.warn('Atlas save note: stored in active memory.', err);
  }

  return newMemory;
}

export async function getCurrentContext(): Promise<CurrentContext> {
  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection<CurrentContext>('context').findOne({});
      if (doc) return doc;
    }
  } catch (err) {
    // fallback
  }
  return inMemoryContext;
}

export async function updateCurrentContext(update: Partial<CurrentContext>): Promise<CurrentContext> {
  inMemoryContext = {
    ...inMemoryContext,
    ...update,
    lastUpdated: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection('context').updateOne({}, { $set: inMemoryContext }, { upsert: true });
    }
  } catch (err) {
    // fallback
  }

  return inMemoryContext;
}

export async function getSources(): Promise<SourceDocument[]> {
  try {
    const db = await getDatabase();
    if (db) {
      const docs = await db.collection<SourceDocument>('sources').find({}).toArray();
      if (docs.length > 0) return docs;
    }
  } catch (err) {
    // fallback
  }
  return inMemorySources;
}

export async function getSourceById(id: string): Promise<SourceDocument | null> {
  const sources = await getSources();
  return sources.find((s) => s.id === id) || null;
}

export async function saveSource(source: SourceDocument): Promise<SourceDocument> {
  inMemorySources.unshift(source);
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection('sources').insertOne(source);
    }
  } catch (err) {
    // fallback
  }
  return source;
}

export async function getConflicts(): Promise<MemoryConflict[]> {
  try {
    const db = await getDatabase();
    if (db) {
      const docs = await db.collection<MemoryConflict>('conflicts').find({}).toArray();
      if (docs.length > 0) return docs;
    }
  } catch (err) {
    // fallback
  }
  return inMemoryConflicts;
}

export async function resetToInitialData(): Promise<void> {
  inMemoryMemories = [...INITIAL_MEMORIES];
  inMemorySources = [...INITIAL_SOURCES];
  inMemoryContext = { ...INITIAL_CONTEXT };
  inMemoryConflicts = [...INITIAL_CONFLICTS];
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection('memories').deleteMany({});
      await db.collection('sources').deleteMany({});
      await db.collection('conflicts').deleteMany({});
      await db.collection('context').deleteMany({});

      await db.collection('memories').insertMany(INITIAL_MEMORIES);
      await db.collection('sources').insertMany(INITIAL_SOURCES);
      await db.collection('conflicts').insertMany(INITIAL_CONFLICTS);
      await db.collection('context').insertOne(INITIAL_CONTEXT);
    }
  } catch (err) {
    // fallback
  }
}
