'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  GitCommit, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Clock, 
  User, 
  Sparkles,
  Layers,
  Zap
} from 'lucide-react';
import { ReconstructionGraph } from '@/lib/types';

interface ReconstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoryId: string;
}

export const ReconstructionModal: React.FC<ReconstructionModalProps> = ({
  isOpen,
  onClose,
  memoryId,
}) => {
  const [graph, setGraph] = useState<ReconstructionGraph | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      fetch(`/api/reconstruct?memoryId=${memoryId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.graph) {
            setGraph(data.graph);
            // Sequential animation
            setTimeout(() => setActiveStep(1), 300);
            setTimeout(() => setActiveStep(2), 700);
            setTimeout(() => setActiveStep(3), 1100);
            setTimeout(() => setActiveStep(4), 1500);
            setTimeout(() => setActiveStep(5), 1900);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isOpen, memoryId]);

  if (!isOpen || !graph) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 reconstruction-glass-backdrop select-none animate-fadeIn">
      <div className="w-full max-w-4xl bg-surface border-[1.5px] border-gold/40 rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-6 border-b-hairline bg-surface-raised flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xs bg-gold/15 text-gold border-[0.5px] border-gold/40">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-gold font-mono tracking-wide">
                [ SPECIAL RECONSTRUCTION STATE ]
              </div>
              <h3 className="font-serif text-xl text-text-primary font-normal">
                {graph.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-8 overflow-y-auto">
          <div className="text-xs text-text-secondary max-w-2xl">
            {graph.summary} Disparate fragments across RFC specs, sync logs, and team blueprints are correlated into a single causal lineage.
          </div>

          {/* Sequential Node-and-Connector Flow: What -> When -> Why -> Who -> How it connects */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch relative">
            {graph.nodes.map((node, index) => {
              const isVisible = activeStep >= node.order;
              const isCurrent = activeStep === node.order;

              // Color accents per category
              const categoryColor =
                node.category === 'what'
                  ? 'border-gold/60 text-gold'
                  : node.category === 'when'
                  ? 'border-text-secondary/60 text-text-primary'
                  : node.category === 'why'
                  ? node.confidence === 0
                    ? 'border-rust text-rust'
                    : 'border-sage/80 text-sage'
                  : node.category === 'who'
                  ? 'border-text-secondary/60 text-text-primary'
                  : 'border-gold text-gold';

              return (
                <div
                  key={node.id}
                  className={`flex flex-col justify-between p-4 rounded-xs bg-surface-raised/70 border-hairline transition-all duration-500 relative ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-3'
                  } ${isCurrent ? 'ring-1 ring-gold/50' : ''}`}
                >
                  {/* Category Pill */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b-hairline mb-3">
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${categoryColor}`}>
                        {node.label}
                      </span>
                      <span className="text-[10px] text-text-secondary opacity-60">
                        0{node.order}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-text-primary leading-relaxed">
                      {node.detail}
                    </p>
                  </div>

                  {/* Provenance Document Badge */}
                  <div className="mt-4 pt-2 border-t-hairline text-[10px] text-text-secondary space-y-1">
                    {node.sourceDoc && (
                      <div className="truncate flex items-center space-x-1">
                        <FileText className="w-3 h-3 text-gold/80 shrink-0" />
                        <span className="truncate">{node.sourceDoc}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[10px]">
                      <span>Confidence</span>
                      <span className={node.confidence === 0 ? 'text-rust' : 'text-sage'}>
                        {node.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Connecting Arrow between cards (on desktop) */}
                  {index < graph.nodes.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-5 h-5 rounded-full bg-base border border-gold/40 flex items-center justify-center text-gold text-[10px]">
                        →
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reconstructed Synthesis Summary Box */}
          <div className="p-5 rounded-xs bg-surface-raised border-hairline space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-text-primary">
              <Zap className="w-3.5 h-3.5 text-gold" />
              <span>Synthesized Provenance Conclusion</span>
            </div>

            <p className="recalled-quote text-sm text-text-primary leading-relaxed pl-4 border-l-2 border-l-gold">
              "The architectural mandate for stateless REST microservices (May 13, Sarah Chen) directly required RS256 JWT tokens (May 15, Marcus Vance). This unblocked Alex Rivera's gateway middleware (May 16) and met the 50k RPS load benchmark (May 17)."
            </p>

            <div className="flex items-center justify-between text-[11px] text-text-secondary pt-2 border-t-hairline">
              <span>Separation: Deduction vs Primary Evidence verified</span>
              <span className="text-sage flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" />
                Valid Causal Graph
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-hairline bg-surface-raised flex items-center justify-between">
          <span className="text-[11px] text-text-secondary">
            Context Lineage Engine 2.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xs bg-gold text-base text-xs font-medium hover:bg-[#d5b577] transition-colors"
          >
            Close Reconstruction
          </button>
        </div>
      </div>
    </div>
  );
};
