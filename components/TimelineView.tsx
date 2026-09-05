'use client';

import React, { useState, useEffect } from 'react';
import { Memory } from '@/lib/types';
import { 
  GitCommit, 
  Filter, 
  Calendar, 
  FileText, 
  User, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { MemoryDetailModal } from './MemoryDetailModal';

interface TimelineViewProps {
  onOpenReconstruction: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onOpenReconstruction }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetch('/api/memories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Sort chronologically ascending for timeline
          const sorted = [...data.memories].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setMemories(sorted);
        }
      });
  }, []);

  const filtered = filterType === 'all' 
    ? memories 
    : memories.filter((m) => m.type === filterType);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b-hairline gap-4">
        <div>
          <div className="text-xs text-gold flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            <span>External Memory Index 03</span>
          </div>
          <h2 className="font-serif text-3xl text-text-primary font-normal">
            Chronological Decision Spine
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Historical lineage of events, architectural commitments, and resulting actions.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-text-secondary" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-surface border-hairline px-3 py-1.5 rounded-xs text-xs text-text-primary focus:outline-none"
          >
            <option value="all">All Event Types</option>
            <option value="decision">Decisions Only</option>
            <option value="requirement">Requirements Only</option>
            <option value="discussion">Discussions Only</option>
            <option value="action">Actions Only</option>
            <option value="result">Results Only</option>
          </select>
        </div>
      </div>

      {/* Chronological Spine */}
      <div className="relative pl-8 border-l-2 border-border-hairline ml-4 space-y-8">
        {filtered.map((mem, index) => {
          const isDecision = mem.type === 'decision';
          const isRequirement = mem.type === 'requirement';
          const isGap = !mem.reason && isDecision;

          const dotColor = isGap
            ? 'border-rust bg-surface text-rust'
            : isDecision
            ? 'border-gold bg-gold/20 text-gold'
            : isRequirement
            ? 'border-sage bg-sage/20 text-sage'
            : 'border-text-secondary bg-surface text-text-secondary';

          return (
            <div key={mem.id} className="relative group">
              {/* Spine Node Marker */}
              <div
                className={`absolute -left-[41px] top-1.5 w-4 h-4 rounded-full border-2 ${dotColor} flex items-center justify-center transition-all group-hover:scale-125`}
              />

              {/* Memory Card on Timeline */}
              <div className="p-5 rounded-xs bg-surface border-hairline hover:border-gold/40 transition-all space-y-3">
                {/* Metas */}
                <div className="flex flex-wrap items-center justify-between text-xs gap-2 pb-2 border-b-hairline">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-gold/90">
                      {new Date(mem.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span
                      className={`capitalize px-2 py-0.5 rounded-xs text-[10px] font-medium ${
                        isDecision
                          ? 'bg-gold/15 text-gold border-[0.5px] border-gold/40'
                          : isRequirement
                          ? 'bg-sage/15 text-sage border-[0.5px] border-sage/40'
                          : 'bg-surface-raised text-text-secondary border-hairline'
                      }`}
                    >
                      {mem.type}
                    </span>
                    {isGap && (
                      <span className="text-[10px] text-rust px-1.5 py-0.5 rounded-xs bg-rust/20 font-mono">
                        GAP DETECTED
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-text-secondary">
                    {mem.people.join(', ')}
                  </div>
                </div>

                {/* Quoted Content */}
                <blockquote className="recalled-quote text-base text-text-primary leading-relaxed pl-3 border-l-2 border-l-gold/60">
                  "{mem.content}"
                </blockquote>

                {/* Reason or Gap statement */}
                {mem.reason ? (
                  <div className="text-xs text-text-secondary bg-surface-raised/50 p-2.5 rounded-xs border-hairline flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-sage shrink-0" />
                    <span><strong>Rationale:</strong> {mem.reason}</span>
                  </div>
                ) : isGap ? (
                  <div className="text-xs text-rust bg-rust/10 p-2.5 rounded-xs border-[0.5px] border-rust/40 flex items-center space-x-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rust shrink-0" />
                    <span><strong>Rationale Gap:</strong> Reason was omitted during session transition.</span>
                  </div>
                ) : null}

                {/* Card Actions */}
                <div className="flex items-center justify-between text-xs pt-2 border-t-hairline text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3 text-gold/70" />
                    <span className="truncate max-w-[280px]">{mem.source.title}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onOpenReconstruction(mem.id)}
                      className="text-gold hover:underline flex items-center space-x-1"
                    >
                      <span>Reconstruct</span>
                    </button>
                    <button
                      onClick={() => setSelectedMemory(mem)}
                      className="text-text-primary hover:text-gold flex items-center space-x-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MemoryDetailModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onSelectMemoryId={(id) => {
          const found = memories.find((m) => m.id === id);
          if (found) setSelectedMemory(found);
        }}
        onOpenReconstruction={onOpenReconstruction}
      />
    </div>
  );
};
