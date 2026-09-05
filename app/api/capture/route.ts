import { NextRequest, NextResponse } from 'next/server';
import { saveMemory, saveSource } from '@/lib/memory-store';
import { Memory } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { title, text, type, project, author } = await request.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ success: false, error: 'Document or note text is required' }, { status: 400 });
    }

    const docTitle = title || 'Captured Memory Document';
    const docAuthor = author || 'Engineering Team';
    const docProject = project || 'Ex-Mem Core';

    // Extraction simulation logic:
    // Extract people mentions (e.g. capitalized names or common prefixes)
    const potentialPeople = ['Sarah Chen', 'Marcus Vance', 'Alex Rivera', 'David Kim', 'Elena Rostova'];
    const matchedPeople = potentialPeople.filter((p) => text.toLowerCase().includes(p.toLowerCase().split(' ')[0]));
    if (matchedPeople.length === 0) matchedPeople.push(docAuthor);

    // Extract entities & technologies
    const techEntities = ['JWT', 'REST', 'Redis', 'React 19', 'Angular 18', 'PostgreSQL', 'Docker', 'GraphQL', 'OAuth 2.0'];
    const matchedEntities = techEntities.filter((t) => text.toLowerCase().includes(t.toLowerCase()));
    if (matchedEntities.length === 0) matchedEntities.push('Core Architecture');

    // Extract dates
    const dateMatch = text.match(/\b(May|June|July|August|September|October|November|December)\s+\d{1,2}(,\s+\d{4})?\b/i);
    const extractedDate = dateMatch ? new Date().toISOString() : new Date().toISOString();

    // Create source document
    const sourceDoc = await saveSource({
      id: `src-${Date.now()}`,
      name: docTitle,
      type: type === 'note' ? 'notes' : 'spec',
      project: docProject,
      date: new Date().toISOString().split('T')[0],
      processingStatus: 'completed',
      memoriesExtracted: {
        events: 1,
        decisions: text.toLowerCase().includes('decid') || text.toLowerCase().includes('select') ? 1 : 0,
        entities: matchedEntities.length,
        discussions: text.toLowerCase().includes('discuss') || text.toLowerCase().includes('evaluat') ? 1 : 0,
        requirements: text.toLowerCase().includes('must') || text.toLowerCase().includes('requir') ? 1 : 0,
        actions: 1,
      },
      rawContent: text,
      author: docAuthor,
    });

    // Create extracted memory
    const memoryType = (
      text.toLowerCase().includes('decid') || text.toLowerCase().includes('select')
        ? 'decision'
        : text.toLowerCase().includes('must') || text.toLowerCase().includes('require')
        ? 'requirement'
        : text.toLowerCase().includes('start') || text.toLowerCase().includes('implement')
        ? 'action'
        : 'discussion'
    ) as Memory['type'];

    // Reason detection
    let reason: string | null = null;
    const reasonMatches = text.match(/(?:because|reason:|rationale:|due to|in order to)\s+([^.\n]+)/i);
    if (reasonMatches && reasonMatches[1]) {
      reason = reasonMatches[1].trim();
    }

    const createdMemory = await saveMemory({
      project: docProject,
      content: text.length > 280 ? text.substring(0, 277) + '...' : text,
      type: memoryType,
      date: extractedDate,
      people: matchedPeople,
      entities: matchedEntities,
      reason,
      source: {
        id: sourceDoc.id,
        title: sourceDoc.name,
        timestamp: 'Just extracted',
        author: docAuthor,
        excerpt: text.substring(0, 160) + (text.length > 160 ? '...' : ''),
      },
      confidence: 94,
      status: 'verified',
    });

    return NextResponse.json({
      success: true,
      source: sourceDoc,
      memory: createdMemory,
      extractionSummary: {
        eventsCount: 1,
        decisionsCount: memoryType === 'decision' ? 1 : 0,
        peopleFound: matchedPeople,
        entitiesFound: matchedEntities,
        reasonDetected: Boolean(reason),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
