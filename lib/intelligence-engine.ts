import { Memory, CurrentContext, MemoryGap, ReconstructionGraph } from './types';
import { getMemories } from './memory-store';

/**
 * Calculates proactive relevance score (0-100) between current workspace context and a memory.
 */
export function calculateRelevance(memory: Memory, context: CurrentContext): number {
  let score = 0;

  // Same project
  if (memory.project.toLowerCase() === context.project.toLowerCase()) {
    score += 25;
  }

  // Keyword intersection
  const memoryWords = (memory.content + ' ' + (memory.reason || '') + ' ' + memory.entities.join(' ')).toLowerCase();
  for (const kw of context.detectedKeywords) {
    if (memoryWords.includes(kw.toLowerCase())) {
      score += 12;
    }
  }

  // Active entities intersection
  for (const entity of context.activeEntities) {
    if (memory.entities.some((e) => e.toLowerCase() === entity.toLowerCase()) || memoryWords.includes(entity.toLowerCase())) {
      score += 15;
    }
  }

  // Active people intersection
  for (const person of context.activePeople) {
    if (memory.people.some((p) => p.toLowerCase() === person.toLowerCase())) {
      score += 8;
    }
  }

  // Task semantic overlap
  const taskWords = context.task.toLowerCase().split(/\s+/);
  for (const tw of taskWords) {
    if (tw.length > 3 && memoryWords.includes(tw)) {
      score += 5;
    }
  }

  return Math.min(Math.max(score, 10), 99);
}

/**
 * Surfaces top proactive memories that the user didn't ask for, based on current context.
 */
export async function getProactiveMemories(context: CurrentContext): Promise<Memory[]> {
  const allMemories = await getMemories({ project: context.project });

  const scored = allMemories.map((mem) => {
    const relevance = calculateRelevance(mem, context);
    let why = mem.whySurfaced;
    if (!why) {
      if (relevance > 80) {
        why = `Directly constrains active task: '${context.task}'.`;
      } else if (relevance > 60) {
        why = `Relevant background entity: matches '${context.topic}'.`;
      } else {
        why = `Related project memory from ${mem.people.join(', ')}.`;
      }
    }
    return {
      ...mem,
      relevanceScore: relevance,
      whySurfaced: why,
    };
  });

  // Sort descending by relevance score
  return scored.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

/**
 * Ask Ninaivagam semantic resolution with strict ANSWER + MEMORY TRAIL + EVIDENCE + CONFIDENCE separation.
 */
export async function processQuestion(question: string): Promise<{
  answer: string;
  memoryTrail: {
    id: string;
    date: string;
    type: string;
    title: string;
    source: string;
    confidence: number;
  }[];
  evidence: {
    sourceTitle: string;
    section?: string;
    excerpt: string;
    author: string;
    date: string;
    verified: boolean;
  };
  confidence: {
    score: number;
    breakdown: string;
  };
  gap?: MemoryGap;
  primaryMemory?: Memory;
}> {
  const q = question.toLowerCase();
  const allMemories = await getMemories();

  // Check if query is targeting the Redis session storage question (gap detection case!)
  const isRedisQuery = q.includes('redis') || q.includes('session storage') || q.includes('session cache');
  const isWhyQuery = q.includes('why') || q.includes('reason') || q.includes('rationale') || q.includes('purpose');

  if (isRedisQuery) {
    const redisMemory = allMemories.find((m) => m.id === 'mem-105') || allMemories.find((m) => m.content.includes('Redis'));
    const gapDetected: MemoryGap = {
      detected: true,
      query: question,
      targetEntity: 'Redis Cluster Session Storage',
      missingProperty: 'reason',
      identifiedMemoryId: redisMemory?.id || 'mem-105',
      knownContent: 'Decided to switch session storage layer to a multi-node Redis cluster on May 18, 2026.',
      recoveryChecklist: [
        {
          step: 'Cross-reference System Architecture Blueprint v1.2',
          status: 'not_found',
          detail: 'Blueprint mandates stateless nodes with zero in-memory sessions; Redis is not mentioned.',
        },
        {
          step: 'Inspect Sprint 24 Engineering Sync audio transcript',
          status: 'found',
          detail: 'Marcus mentions weekend switch [10:14], but 4-minute network cutoff dropped rationale audio.',
        },
        {
          step: 'Check Git commit logs & Jira EXM-910 issue comments',
          status: 'not_found',
          detail: 'Commit message reads "perf: switch session adapter" with empty PR description.',
        },
        {
          step: 'Query secondary engineering sync notes',
          status: 'not_found',
          detail: 'No related documentation discovered in knowledge base.',
        },
      ],
      resolutionStatus: 'unrecoverable',
      honestReport:
        'Context could not be reliably recovered. While the transition to a Redis cluster on May 18, 2026 by Marcus Vance is verified, no authoritative source records the underlying reason. Presenting a generated justification would be a hallucination.',
    };

    return {
      answer:
        'MEMORY GAP DETECTED: The switch to a Redis cluster occurred on May 18, 2026 (Sprint 24), but no architectural rationale or benchmark was recorded. The system refuses to fabricate an explanation.',
      memoryTrail: [
        {
          id: 'mem-105',
          date: 'May 18, 2026',
          type: 'decision',
          title: 'Switch session storage to Redis cluster (Reason Unrecorded)',
          source: 'Sprint 24 Engineering Sync Transcript',
          confidence: 62,
        },
      ],
      evidence: {
        sourceTitle: 'Sprint 24 Engineering Sync Transcript',
        section: 'Open Mic / Architecture Updates',
        excerpt: 'Marcus: "We had to switch the session cache to a Redis cluster over the weekend." [Audio truncated; no rationale ticket linked]',
        author: 'Marcus Vance',
        date: 'May 18, 2026',
        verified: false,
      },
      confidence: {
        score: 62,
        breakdown: 'Fact verified (62%), but underlying rationale is unrecorded (0% evidence for reason).',
      },
      gap: gapDetected,
      primaryMemory: redisMemory,
    };
  }

  // Check if query is targeting frontend framework (conflict case!)
  const isFrontendQuery = q.includes('frontend') || q.includes('react') || q.includes('angular') || q.includes('framework');
  if (isFrontendQuery) {
    return {
      answer:
        'CONFLICT DETECTED: There are two conflicting documented decisions for the frontend framework. Sarah Chen specified React 19 in Architecture Blueprint v1.2 (May 12), whereas David Kim specified Angular 18 in Legacy Handover Notes (May 14). Neither document explicitly supersedes the other.',
      memoryTrail: [
        {
          id: 'mem-106',
          date: 'May 12, 2026',
          type: 'decision',
          title: 'React 19 with Server Components selected',
          source: 'System Architecture Blueprint v1.2',
          confidence: 92,
        },
        {
          id: 'mem-107',
          date: 'May 14, 2026',
          type: 'decision',
          title: 'Angular 18 Enterprise Suite selected',
          source: 'Frontend Team Legacy Handover Notes',
          confidence: 84,
        },
      ],
      evidence: {
        sourceTitle: 'System Architecture Blueprint v1.2 vs Handover Notes',
        section: 'Frontend Architecture Standards',
        excerpt: 'Blueprint: "React 19 with Server Components is confirmed." vs Handover: "Standardized on Angular 18 Enterprise Suite."',
        author: 'Sarah Chen vs David Kim',
        date: 'May 12–14, 2026',
        verified: false,
      },
      confidence: {
        score: 72,
        breakdown: 'High individual document confidence, but overall architectural consensus is conflicted.',
      },
    };
  }

  // Default query: JWT / Authentication / Architecture
  return {
    answer:
      'JWT with RS256 asymmetric signatures was chosen as the authentication protocol to fulfill the May 13 architectural requirement that all microservices must be completely stateless REST endpoints without database roundtrips on each request.',
    memoryTrail: [
      {
        id: 'mem-101',
        date: 'May 10, 2026',
        type: 'discussion',
        title: 'Auth approaches evaluated (Cookies vs OAuth vs JWT)',
        source: 'Auth Security RFC Draft & Review',
        confidence: 94,
      },
      {
        id: 'mem-102',
        date: 'May 13, 2026',
        type: 'requirement',
        title: 'Mandate: Microservices must adhere to REST stateless principles',
        source: 'System Architecture Blueprint v1.2',
        confidence: 98,
      },
      {
        id: 'mem-103',
        date: 'May 15, 2026',
        type: 'decision',
        title: 'Selected JWT with RS256 asymmetric signatures',
        source: 'Auth Security RFC Draft & Review',
        confidence: 96,
      },
      {
        id: 'mem-104',
        date: 'May 16, 2026',
        type: 'action',
        title: 'Implementation of API gateway JWT middleware started',
        source: 'Auth Security RFC Draft & Review',
        confidence: 91,
      },
      {
        id: 'mem-108',
        date: 'May 17, 2026',
        type: 'result',
        title: 'Load test passed: 50k RPS with p99 < 1.8ms latency',
        source: 'Auth Security RFC Draft & Review',
        confidence: 97,
      },
    ],
    evidence: {
      sourceTitle: 'Auth Security RFC Draft & Review',
      section: 'Section 4: Final Recommendation',
      excerpt:
        'Decision: Selected JSON Web Tokens (JWT) with asymmetric RS256 signing. Rationale: Aligns directly with May 13 requirement for stateless REST microservice boundaries without persistent database roundtrips.',
      author: 'Marcus Vance & Sarah Chen',
      date: 'May 15, 2026',
      verified: true,
    },
    confidence: {
      score: 96,
      breakdown: '96% confidence based on signed RFC document, architect approval (Sarah Chen), and load test validation.',
    },
    primaryMemory: allMemories.find((m) => m.id === 'mem-103'),
  };
}

/**
 * Returns the Context Reconstruction Graph for a memory: What -> When -> Why -> Who -> How it connects.
 */
export function getReconstructionGraph(memoryId: string): ReconstructionGraph {
  if (memoryId === 'mem-105') {
    return {
      targetMemoryId: 'mem-105',
      title: 'Context Reconstruction: Redis Cluster Switch',
      summary: 'Reconstruction attempt halted due to unrecorded architectural rationale.',
      nodes: [
        {
          id: 'n1',
          category: 'what',
          label: 'What',
          detail: 'Switch session storage to multi-node Redis cluster',
          sourceDoc: 'Sprint 24 Sync',
          confidence: 95,
          order: 1,
        },
        {
          id: 'n2',
          category: 'when',
          label: 'When',
          detail: 'May 18, 2026 (During weekend sprint transition)',
          sourceDoc: 'Sprint 24 Sync',
          confidence: 90,
          order: 2,
        },
        {
          id: 'n3',
          category: 'why',
          label: 'Why (GAP)',
          detail: 'MISSING: No benchmarks, RFC, or latency justification found.',
          confidence: 0,
          order: 3,
        },
        {
          id: 'n4',
          category: 'who',
          label: 'Who',
          detail: 'Marcus Vance (Mentioned during open mic)',
          sourceDoc: 'Sprint 24 Sync',
          confidence: 88,
          order: 4,
        },
        {
          id: 'n5',
          category: 'connector',
          label: 'How It Connects',
          detail: 'Potentially clashes with May 13 stateless invariance rule.',
          confidence: 50,
          order: 5,
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: 'scheduled' },
        { from: 'n2', to: 'n3', label: 'lacks rationale' },
        { from: 'n3', to: 'n4', label: 'actor' },
        { from: 'n4', to: 'n5', label: 'impact' },
      ],
    };
  }

  // Default: JWT Decision Reconstruction
  return {
    targetMemoryId: 'mem-103',
    title: 'Context Reconstruction: JWT Selection Lineage',
    summary: 'Synthesized from 3 disparate documents across a 7-day timeline.',
    nodes: [
      {
        id: 'node-what',
        category: 'what',
        label: 'What',
        detail: 'JWT with RS256 asymmetric signature verification',
        sourceDoc: 'RFC-042 Auth Security Draft',
        confidence: 98,
        order: 1,
      },
      {
        id: 'node-when',
        category: 'when',
        label: 'When',
        detail: 'May 15, 2026 (RFC Approved after May 10 evaluation)',
        sourceDoc: 'Sprint Task EXM-882',
        confidence: 96,
        order: 2,
      },
      {
        id: 'node-why',
        category: 'why',
        label: 'Why',
        detail: 'Stateless REST requirement: eliminates database roundtrips at gateway edges',
        sourceDoc: 'Architecture Blueprint v1.2 §3.4',
        confidence: 97,
        order: 3,
      },
      {
        id: 'node-who',
        category: 'who',
        label: 'Who',
        detail: 'Sarah Chen (Lead Architect) & Marcus Vance (Security Engineer)',
        sourceDoc: 'Auth RFC Authorship',
        confidence: 99,
        order: 4,
      },
      {
        id: 'node-connector',
        category: 'connector',
        label: 'How It Connects',
        detail: 'Directly unblocked Alex Rivera to build auth.middleware.ts (May 16), which passed 50k RPS load test (May 17)',
        sourceDoc: 'Grafana Benchmark #902',
        confidence: 95,
        order: 5,
      },
    ],
    edges: [
      { from: 'node-what', to: 'node-when', label: 'formalized' },
      { from: 'node-when', to: 'node-why', label: 'justified by' },
      { from: 'node-why', to: 'node-who', label: 'authored by' },
      { from: 'node-who', to: 'node-connector', label: 'propagated to' },
    ],
  };
}
