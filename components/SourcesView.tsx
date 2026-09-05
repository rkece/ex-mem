'use client';

import React, { useState, useEffect } from 'react';
import { SourceDocument } from '@/lib/types';
import { 
  FileText, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Search, 
  ExternalLink,
  Plus
} from 'lucide-react';

interface SourcesViewProps {
  onOpenCapture: () => void;
}

export const SourcesView: React.FC<SourcesViewProps> = ({ onOpenCapture }) => {
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [selectedSource, setSelectedSource] = useState<SourceDocument | null>(null);

  useEffect(() => {
    fetch('/api/sources')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSources(data.sources);
        }
      });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b-hairline gap-4">
        <div>
          <div className="text-xs text-gold flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            <span>External Memory Index 06</span>
          </div>
          <h2 className="font-serif text-3xl text-text-primary font-normal">
            Primary Document Sources
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            The canonical source documents, RFC drafts, and engineering transcripts anchoring your memory layer.
          </p>
        </div>

        <button
          onClick={onOpenCapture}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xs bg-gold text-base text-xs font-medium hover:bg-[#d5b577] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Source Document</span>
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {sources.map((src) => (
          <div
            key={src.id}
            onClick={() => setSelectedSource(src)}
            className="p-6 rounded-xs bg-surface border-hairline hover:border-gold/50 cursor-pointer transition-all space-y-5 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span className="capitalize text-[10px] px-2 py-0.5 rounded-xs bg-surface-raised border-hairline font-mono text-gold">
                  {src.type.toUpperCase()}
                </span>
                <span className="text-[11px] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                  <span className="text-sage">Processed</span>
                </span>
              </div>

              <h3 className="font-serif text-lg text-text-primary group-hover:text-gold transition-colors">
                {src.name}
              </h3>

              <div className="text-xs text-text-secondary">
                Author: <span className="text-text-primary">{src.author}</span> · {src.date}
              </div>
            </div>

            {/* Memories Extracted Breakdown Badges */}
            <div className="pt-3 border-t-hairline space-y-2">
              <div className="text-[11px] text-text-secondary">Extracted Memory Breakdown</div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-xs bg-surface-raised border-hairline text-gold font-medium">
                  {src.memoriesExtracted.decisions} Decisions
                </span>
                <span className="px-2 py-1 rounded-xs bg-surface-raised border-hairline text-sage font-medium">
                  {src.memoriesExtracted.requirements} Requirements
                </span>
                <span className="px-2 py-1 rounded-xs bg-surface-raised border-hairline text-text-primary">
                  {src.memoriesExtracted.events} Events
                </span>
                <span className="px-2 py-1 rounded-xs bg-surface-raised border-hairline text-text-secondary">
                  {src.memoriesExtracted.entities} Entities
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Raw Excerpt Inspector Drawer/Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/85 backdrop-blur-sm select-none animate-fadeIn">
          <div className="w-full max-w-2xl bg-surface border-hairline rounded-xs shadow-2xl p-6 space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b-hairline">
              <div>
                <span className="text-[10px] text-gold font-mono uppercase">{selectedSource.type}</span>
                <h3 className="font-serif text-xl text-text-primary">{selectedSource.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="text-text-secondary hover:text-text-primary p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto">
              <div className="text-[11px] text-text-secondary">Primary Source Transcript / Body</div>
              <pre className="p-4 bg-surface-raised rounded-xs border-hairline text-xs font-mono text-text-primary whitespace-pre-wrap leading-relaxed">
                {selectedSource.rawContent}
              </pre>
            </div>

            <div className="pt-3 border-t-hairline flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                Author: {selectedSource.author}
              </span>
              <button
                onClick={() => setSelectedSource(null)}
                className="px-4 py-2 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-gold/40"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
