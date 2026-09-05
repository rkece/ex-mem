'use client';

import React from 'react';
import { Memory } from '@/lib/types';
import { 
  X, 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  GitCommit, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface MemoryDetailModalProps {
  memory: Memory | null;
  onClose: () => void;
  onSelectMemoryId: (id: string) => void;
  onOpenReconstruction: (id: string) => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  onClose,
  onSelectMemoryId,
  onOpenReconstruction,
}) => {
  if (!memory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/85 backdrop-blur-sm select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-surface border-hairline rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b-hairline bg-surface-raised flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="capitalize px-2.5 py-1 rounded-xs bg-gold/15 text-gold border-[0.5px] border-gold/40 text-xs font-medium">
              {memory.type}
            </span>
            <span className="text-xs text-text-secondary">
              ID: <span className="font-mono text-text-primary">{memory.id}</span>
            </span>
            <span className="text-xs text-sage border-[0.5px] border-sage/40 bg-sage/10 px-2 py-0.5 rounded-xs">
              {memory.confidence}% confidence
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Main Statement */}
          <div className="space-y-2">
            <div className="text-[11px] text-text-secondary">Recorded Content</div>
            <p className="recalled-quote text-base md:text-lg text-text-primary leading-relaxed pl-3 border-l-2 border-l-gold">
              "{memory.content}"
            </p>
          </div>

          {/* Reason / Rationale */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-text-secondary">Architectural Rationale</div>
            {memory.reason ? (
              <div className="p-3.5 bg-surface-raised rounded-xs border-hairline text-xs text-text-primary/90 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                <span>{memory.reason}</span>
              </div>
            ) : (
              <div className="p-3.5 bg-rust/10 border-[0.5px] border-rust/40 rounded-xs text-xs text-rust flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                <span>No reason logged in recorded documentation (Memory Gap detected).</span>
              </div>
            )}
          </div>

          {/* People & Entities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-surface-raised/50 rounded-xs border-hairline space-y-1.5">
              <div className="text-[11px] text-text-secondary flex items-center space-x-1">
                <User className="w-3 h-3 text-text-secondary" />
                <span>Key People</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {memory.people.map((person, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded-xs bg-base border-hairline text-text-primary"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-surface-raised/50 rounded-xs border-hairline space-y-1.5">
              <div className="text-[11px] text-text-secondary flex items-center space-x-1">
                <Tag className="w-3 h-3 text-text-secondary" />
                <span>Entities & Technologies</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {memory.entities.map((entity, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded-xs bg-base border-hairline text-gold/90"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Source Document Excerpt */}
          <div className="p-4 bg-surface-raised rounded-xs border-hairline space-y-2">
            <div className="flex items-center justify-between text-xs text-text-secondary pb-1 border-b-hairline">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-gold" />
                <span className="text-text-primary font-medium">{memory.source.title}</span>
              </div>
              <span>{memory.source.timestamp}</span>
            </div>

            {memory.source.excerpt && (
              <blockquote className="text-xs italic text-text-secondary pl-3 border-l-2 border-l-border-hairline">
                "{memory.source.excerpt}"
              </blockquote>
            )}

            <div className="text-[11px] text-text-secondary">
              Author: <span className="text-text-primary">{memory.source.author}</span>
            </div>
          </div>

          {/* Connected Memories */}
          {memory.relatedMemories && memory.relatedMemories.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] text-text-secondary flex items-center space-x-1">
                <Layers className="w-3 h-3 text-text-secondary" />
                <span>Connected Memory Nodes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {memory.relatedMemories.map((relId) => (
                  <button
                    key={relId}
                    onClick={() => onSelectMemoryId(relId)}
                    className="px-2.5 py-1 rounded-xs bg-surface-raised border-hairline text-xs text-gold hover:border-gold/50 transition-colors flex items-center space-x-1"
                  >
                    <span>Node {relId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-hairline bg-surface-raised flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenReconstruction(memory.id);
            }}
            className="text-xs text-gold hover:underline flex items-center space-x-1.5"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Reconstruct Lineage</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-text-secondary transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
