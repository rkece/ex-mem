export type MemoryType = 
  | 'decision' 
  | 'discussion' 
  | 'requirement' 
  | 'action' 
  | 'change' 
  | 'result' 
  | 'event';

export interface MemorySource {
  id: string;
  title: string;
  section?: string;
  timestamp?: string;
  excerpt?: string;
  author?: string;
  type?: 'document' | 'slack' | 'meeting' | 'git' | 'pr';
}

export interface Memory {
  id: string;
  project: string;
  content: string;
  type: MemoryType;
  date: string; // ISO format
  people: string[];
  entities: string[];
  reason: string | null; // Crucial: null/empty triggers gap detection when a query needs decision rationale!
  source: MemorySource;
  confidence: number; // 0 to 100
  relatedMemories: string[]; // IDs of connected memories
  embedding?: number[];
  relevanceScore?: number; // Calculated on-the-fly for proactive recall
  status?: 'verified' | 'unverified' | 'conflicted';
  whySurfaced?: string; // Proactive reasoning explanation
}

export interface MemoryConflict {
  id: string;
  topic: string;
  project: string;
  status: 'unresolved';
  memoryA: {
    memoryId: string;
    statement: string;
    sourceTitle: string;
    date: string;
    author: string;
    confidence: number;
  };
  memoryB: {
    memoryId: string;
    statement: string;
    sourceTitle: string;
    date: string;
    author: string;
    confidence: number;
  };
  explanation: string;
}

export interface CurrentContext {
  project: string;
  task: string;
  topic: string;
  detectedKeywords: string[];
  activeEntities: string[];
  activePeople: string[];
  activeFile?: string;
  lastUpdated: string;
}

export interface SourceDocument {
  id: string;
  name: string;
  type: 'spec' | 'transcript' | 'handover' | 'rfc' | 'notes';
  project: string;
  date: string;
  processingStatus: 'completed' | 'processing' | 'queued';
  memoriesExtracted: {
    events: number;
    decisions: number;
    entities: number;
    discussions: number;
    requirements: number;
    actions: number;
  };
  rawContent: string;
  author: string;
}

export interface MemoryGap {
  detected: boolean;
  query: string;
  targetEntity: string;
  missingProperty: 'reason' | 'decision_maker' | 'dependency' | 'validation';
  identifiedMemoryId?: string;
  knownContent?: string;
  recoveryChecklist: {
    step: string;
    status: 'pending' | 'in_progress' | 'found' | 'not_found';
    detail?: string;
  }[];
  resolutionStatus: 'searching' | 'recovered' | 'unrecoverable';
  recoveredEvidence?: {
    sourceTitle: string;
    excerpt: string;
    confidence: number;
    recoveredReason: string;
  };
  honestReport?: string;
}

export interface ReconstructionNode {
  id: string;
  category: 'what' | 'when' | 'why' | 'who' | 'connector';
  label: string;
  detail: string;
  sourceDoc?: string;
  confidence: number;
  order: number;
}

export interface ReconstructionGraph {
  targetMemoryId: string;
  title: string;
  nodes: ReconstructionNode[];
  edges: { from: string; to: string; label?: string }[];
  summary: string;
}
