'use client';

import React, { useState, useEffect } from 'react';
import { MemoryConflict } from '@/lib/types';
import { 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  HelpCircle, 
  ShieldCheck, 
  Scale, 
  ArrowRight,
  GitCommit,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface InsightsViewProps {
  onOpenReconstruct: (memoryId: string) => void;
  onOpenAsk: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  onOpenReconstruct,
  onOpenAsk,
}) => {
  const [conflicts, setConflicts] = useState<MemoryConflict[]>([]);

  useEffect(() => {
    fetch('/api/conflicts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConflicts(data.conflicts);
        }
      });
  }, []);

  const patternStatements = [
    {
      id: 1,
      category: 'Causal Constraint',
      headline: '3 major decisions strictly depend on the May 13 Stateless REST requirement.',
      detail: 'JWT authentication (May 15), Gateway Key Cache (May 16), and Latency Benchmarking (May 17) directly cite this constraint. Changes to REST invariants will trigger downstream invalidation.',
      status: 'verified',
    },
    {
      id: 2,
      category: 'Memory Gap Alert',
      headline: 'One critical infrastructure decision has no recorded reason.',
      detail: 'The switch to a multi-node Redis cluster on May 18 (Sprint 24) lacks architecture rationale, benchmark logs, or author justification. A 4-minute network disruption during the engineering sync dropped audio.',
      status: 'gap',
    },
    {
      id: 3,
      category: 'Author Alignment',
      headline: 'Sarah Chen authored 78% of verified architectural invariant requirements.',
      detail: 'Sarah Chen serves as the primary root authority for boundary decisions across Ex-Mem Core.',
      status: 'verified',
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b-hairline gap-4">
        <div>
          <div className="text-xs text-gold flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            <span>External Memory Index 05</span>
          </div>
          <h2 className="font-serif text-3xl text-text-primary font-normal">
            Pattern Statements & Epistemology
          </h2>
          <p className="text-xs text-text-secondary mt-1 max-w-xl">
            Qualitative intelligence synthesized from your memory store. No vanity charts — strictly observable structural patterns and conflicts.
          </p>
        </div>

        <button
          onClick={onOpenAsk}
          className="px-3 py-1.5 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-gold/40 transition-colors"
        >
          Verify with Ask Ninaivagam
        </button>
      </div>

      {/* Pattern Statements (Not generic charts!) */}
      <div className="space-y-4">
        <div className="text-xs font-semibold tracking-wider text-text-primary">
          Synthesized Knowledge Invariants
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {patternStatements.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xs border flex flex-col justify-between space-y-4 ${
                item.status === 'gap'
                  ? 'bg-rust/10 border-rust/40 text-text-primary'
                  : 'bg-surface border-hairline hover:border-gold/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
                  <span className={item.status === 'gap' ? 'text-rust font-bold' : 'text-gold'}>
                    {item.category}
                  </span>
                  <span className="text-text-secondary">0{item.id}</span>
                </div>

                <h4 className="text-sm font-medium text-text-primary leading-snug">
                  {item.headline}
                </h4>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="pt-2 border-t-hairline text-[11px] flex items-center justify-between">
                <span className={item.status === 'gap' ? 'text-rust' : 'text-sage'}>
                  {item.status === 'gap' ? 'Attention Required' : 'Epistemic Certainty High'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explicit Conflicting Memories State (NEVER AUTO-RESOLVED) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-xs bg-rust"></span>
            <h3 className="text-xs font-semibold tracking-wider text-text-primary">
              Explicit Conflicting Memories State
            </h3>
          </div>
          <span className="text-[10px] text-rust px-2 py-0.5 rounded-xs bg-rust/20 font-mono">
            NEVER AUTO-RESOLVED
          </span>
        </div>

        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            className="p-6 rounded-xs bg-surface border-[1.5px] border-rust/50 space-y-6"
          >
            <div>
              <div className="text-[11px] text-text-secondary">Contradiction Topic</div>
              <h4 className="font-serif text-lg text-text-primary mt-0.5">
                {conflict.topic}
              </h4>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                {conflict.explanation}
              </p>
            </div>

            {/* Side-by-Side Contradictory Statements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Source A */}
              <div className="p-4 rounded-xs bg-surface-raised border-hairline space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs pb-2 border-b-hairline">
                    <span className="font-semibold text-text-primary">Source A (Mandate)</span>
                    <span className="text-sage text-[11px] font-mono">[ CONFIDENCE: {conflict.memoryA.confidence}% ]</span>
                  </div>

                  <blockquote className="recalled-quote text-sm text-text-primary pl-3 border-l-2 border-l-gold leading-relaxed">
                    "{conflict.memoryA.statement}"
                  </blockquote>
                </div>

                <div className="pt-3 border-t-hairline text-[11px] text-text-secondary space-y-1">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3 text-gold/80" />
                    <span className="text-text-primary">{conflict.memoryA.sourceTitle}</span>
                  </div>
                  <div>
                    Recorded by <strong className="text-text-primary">{conflict.memoryA.author}</strong> on {conflict.memoryA.date}
                  </div>
                </div>
              </div>

              {/* Source B */}
              <div className="p-4 rounded-xs bg-surface-raised border-hairline space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs pb-2 border-b-hairline">
                    <span className="font-semibold text-text-primary">Source B (Handover)</span>
                    <span className="text-sage text-[11px] font-mono">[ CONFIDENCE: {conflict.memoryB.confidence}% ]</span>
                  </div>

                  <blockquote className="recalled-quote text-sm text-text-primary pl-3 border-l-2 border-l-rust leading-relaxed">
                    "{conflict.memoryB.statement}"
                  </blockquote>
                </div>

                <div className="pt-3 border-t-hairline text-[11px] text-text-secondary space-y-1">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3 text-gold/80" />
                    <span className="text-text-primary">{conflict.memoryB.sourceTitle}</span>
                  </div>
                  <div>
                    Recorded by <strong className="text-text-primary">{conflict.memoryB.author}</strong> on {conflict.memoryB.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Principle Note */}
            <div className="p-3 bg-base rounded-xs border-hairline text-xs text-text-secondary flex items-center justify-between">
              <span>
                <strong>System Invariant:</strong> Ninaivagam AI preserves human contradictions until an explicit override memory is ingested.
              </span>
              <button
                onClick={() => onOpenReconstruct('mem-106')}
                className="text-gold hover:underline text-xs shrink-0 pl-4"
              >
                Reconstruct Fragment Graph
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
