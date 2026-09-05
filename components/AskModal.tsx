'use client';

import React, { useState } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  GitCommit, 
  ShieldCheck, 
  AlertOctagon, 
  FileText, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { MemoryGap } from '@/lib/types';

interface AskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMemory: (memoryId: string) => void;
  onOpenReconstruct: (memoryId: string) => void;
  onTriggerGap: (gap: MemoryGap) => void;
}

export const AskModal: React.FC<AskModalProps> = ({
  isOpen,
  onClose,
  onSelectMemory,
  onOpenReconstruct,
  onTriggerGap,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const suggestedQuestions = [
    'Why did we choose JWT for authentication?',
    'What was the rationale for switching to Redis cluster?',
    'Which frontend framework was selected for the client portal?',
    'Who authored the REST stateless microservices requirement?',
  ];

  const handleSearch = async (questionText: string) => {
    if (!questionText.trim()) return;
    setQuery(questionText);
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-base/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-3xl bg-surface border-hairline rounded-xs shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[85vh]">
        {/* Top Search Input Bar */}
        <div className="p-4 border-b-hairline flex items-center space-x-3 bg-surface-raised">
          <Search className="w-4 h-4 text-gold shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Ask your memory..."
            autoFocus
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResult(null);
              }}
              className="text-text-secondary hover:text-text-primary p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleSearch(query)}
            disabled={isLoading || !query.trim()}
            className="px-3 py-1.5 rounded-xs bg-gold text-base text-xs font-medium hover:bg-[#d5b577] transition-colors disabled:opacity-40"
          >
            {isLoading ? 'Recalling...' : 'Inquire'}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Suggested Prompts if no query yet */}
          {!result && !isLoading && (
            <div className="space-y-3 py-4">
              <div className="text-[11px] text-text-secondary tracking-wide">
                Try asking past architectural decisions:
              </div>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(sq)}
                    className="w-full text-left p-3 rounded-xs bg-surface-raised/60 border-hairline text-xs text-text-primary/90 hover:border-gold/50 hover:bg-surface-raised transition-all flex items-center justify-between group"
                  >
                    <span>{sq}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-gold transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              <div className="text-xs text-text-secondary">
                Cross-referencing memory nodes, documents, and historical trails...
              </div>
            </div>
          )}

          {/* Results: Strict ANSWER + MEMORY TRAIL + EVIDENCE + CONFIDENCE Structure */}
          {result && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1. THE ANSWER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold tracking-wider text-gold flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3 text-gold" />
                    <span>Deduction & Answer</span>
                  </div>
                  {result.confidence && (
                    <span className="text-[10px] text-sage px-2 py-0.5 rounded-xs bg-sage/10 border-[0.5px] border-sage/40 font-medium">
                      [ CONFIDENCE: {result.confidence.score}% ]
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xs bg-surface-raised border-hairline">
                  <p className="text-sm md:text-[15px] leading-relaxed text-text-primary">
                    {result.answer}
                  </p>
                </div>
              </div>

              {/* Memory Gap Notification (if gap detected) */}
              {result.gap && result.gap.detected && (
                <div className="p-4 rounded-xs bg-rust/10 border-[1px] border-rust/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-rust text-xs font-semibold">
                      <AlertOctagon className="w-4 h-4" />
                      <span>MEMORY GAP DETECTED</span>
                    </div>
                    <span className="text-[10px] text-rust/80 font-mono">
                      Missing: {result.gap.missingProperty.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {result.gap.honestReport}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onTriggerGap(result.gap);
                    }}
                    className="px-3 py-1.5 rounded-xs bg-rust text-white text-xs font-medium hover:bg-rust/90 transition-colors flex items-center space-x-1.5"
                  >
                    <span>Run Recovery Search Checklist</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* 2. CLICKABLE MEMORY TRAIL */}
              {result.memoryTrail && result.memoryTrail.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold tracking-wider text-text-secondary">
                      Chronological Memory Trail ({result.memoryTrail.length} Nodes)
                    </div>
                    <span className="text-[10px] text-text-secondary">Click node to inspect</span>
                  </div>

                  <div className="relative pl-6 space-y-3 border-l border-hairline ml-2">
                    {result.memoryTrail.map((node: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onClose();
                          onSelectMemory(node.id);
                        }}
                        className="relative group cursor-pointer p-3 rounded-xs bg-surface-raised/40 hover:bg-surface-raised border-hairline hover:border-gold/40 transition-all"
                      >
                        {/* Timeline Spine Dot */}
                        <div className="absolute -left-[31px] top-4 w-2.5 h-2.5 rounded-full bg-surface border-2 border-gold group-hover:bg-gold transition-colors" />

                        <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1">
                          <span className="font-medium text-gold/90">{node.date}</span>
                          <span className="capitalize text-[10px] px-1.5 py-0.5 rounded-xs bg-base border-hairline">
                            {node.type}
                          </span>
                        </div>

                        <div className="text-xs font-medium text-text-primary group-hover:text-gold transition-colors">
                          {node.title}
                        </div>

                        <div className="text-[11px] text-text-secondary mt-1 flex items-center justify-between">
                          <span className="truncate max-w-[80%]">{node.source}</span>
                          <span className="text-sage text-[10px]">{node.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. EVIDENCE + PROVENANCE */}
              {result.evidence && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold tracking-wider text-sage flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                    <span>Evidence & Verified Excerpt</span>
                  </div>

                  <div className="p-4 rounded-xs bg-surface-raised/70 border-hairline space-y-3">
                    <blockquote className="text-xs italic text-text-primary/90 pl-3 border-l-2 border-l-sage leading-relaxed">
                      "{result.evidence.excerpt}"
                    </blockquote>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-text-secondary pt-2 border-t-hairline gap-2">
                      <div className="flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-text-secondary" />
                        <span className="text-text-primary">{result.evidence.sourceTitle}</span>
                        {result.evidence.section && (
                          <span className="text-text-secondary">({result.evidence.section})</span>
                        )}
                      </div>

                      <div>
                        Author: <span className="text-text-primary">{result.evidence.author}</span> · {result.evidence.date}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between border-t-hairline">
                <button
                  onClick={() => {
                    onClose();
                    onOpenReconstruct(result.primaryMemory?.id || 'mem-103');
                  }}
                  className="text-xs text-gold hover:underline flex items-center space-x-1.5"
                >
                  <GitCommit className="w-3.5 h-3.5" />
                  <span>Launch Visual Context Reconstruction</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-text-secondary transition-colors"
                >
                  Close Inquiry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
