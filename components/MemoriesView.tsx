'use client';

import React, { useState, useEffect } from 'react';
import { Memory, MemoryType } from '@/lib/types';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileText, 
  AlertTriangle, 
  ShieldCheck,
  ChevronRight,
  GitCommit
} from 'lucide-react';
import { MemoryDetailModal } from './MemoryDetailModal';

interface MemoriesViewProps {
  onOpenReconstruction: (id: string) => void;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({ onOpenReconstruction }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const url = new URL('/api/memories', window.location.origin);
      if (selectedType !== 'all') url.searchParams.set('type', selectedType);
      if (searchQuery) url.searchParams.set('search', searchQuery);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setMemories(data.memories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [selectedType, searchQuery]);

  const types: { id: string; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'decision', label: 'Decisions' },
    { id: 'discussion', label: 'Discussions' },
    { id: 'requirement', label: 'Requirements' },
    { id: 'action', label: 'Actions' },
    { id: 'result', label: 'Results' },
    { id: 'event', label: 'Events' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b-hairline gap-4">
        <div>
          <div className="text-xs text-gold flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            <span>External Memory Index 02</span>
          </div>
          <h2 className="font-serif text-3xl text-text-primary font-normal">
            Memories Repository
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Structured records with immutable causality, provenance, and rationale tracking.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 bg-surface border-hairline px-3 py-1.5 rounded-xs w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-text-secondary" />
          <input
            type="text"
            placeholder="Filter memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-text-primary placeholder:text-text-secondary/60 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2 border-b-hairline">
        {types.map((t) => {
          const isSelected = selectedType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-xs text-xs whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-gold/15 text-gold border-[0.5px] border-gold/50 font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Memories Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-text-secondary">
          Loading memory index...
        </div>
      ) : memories.length === 0 ? (
        <div className="py-16 text-center text-xs text-text-secondary">
          No memories found matching current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {memories.map((mem) => {
            const hasGap = !mem.reason && mem.type === 'decision';
            const isConflicted = mem.status === 'conflicted';

            return (
              <div
                key={mem.id}
                onClick={() => setSelectedMemory(mem)}
                className="p-5 rounded-xs bg-surface border-hairline hover:border-gold/50 cursor-pointer transition-all flex flex-col justify-between space-y-4 group hover:bg-surface-raised/40 relative"
              >
                {/* Top Metas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`capitalize px-2 py-0.5 rounded-xs text-[10px] font-medium ${
                          mem.type === 'decision'
                            ? 'bg-gold/15 text-gold border-[0.5px] border-gold/40'
                            : mem.type === 'requirement'
                            ? 'bg-sage/15 text-sage border-[0.5px] border-sage/40'
                            : 'bg-surface-raised text-text-secondary border-hairline'
                        }`}
                      >
                        {mem.type}
                      </span>
                      {hasGap && (
                        <span className="px-1.5 py-0.5 rounded-xs bg-rust/20 text-rust text-[9px] font-mono">
                          GAP: NO REASON
                        </span>
                      )}
                      {isConflicted && (
                        <span className="px-1.5 py-0.5 rounded-xs bg-rust/20 text-rust text-[9px] font-mono">
                          CONFLICT
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-text-secondary">
                      {new Date(mem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Quoted Content */}
                  <blockquote className="recalled-quote text-sm text-text-primary group-hover:text-gold transition-colors leading-relaxed line-clamp-3">
                    "{mem.content}"
                  </blockquote>
                </div>

                {/* Reason / Source Details */}
                <div className="space-y-2 pt-2 border-t-hairline text-xs">
                  {mem.reason ? (
                    <div className="text-[11px] text-text-secondary line-clamp-1 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-sage shrink-0" />
                      <span className="truncate">{mem.reason}</span>
                    </div>
                  ) : hasGap ? (
                    <div className="text-[11px] text-rust line-clamp-1 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-rust shrink-0" />
                      <span>Missing recorded rationale</span>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between text-[11px] text-text-secondary">
                    <span className="truncate max-w-[70%]">{mem.source.title}</span>
                    <span className="text-sage text-[10px]">{mem.confidence}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Memory Detail Modal */}
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
