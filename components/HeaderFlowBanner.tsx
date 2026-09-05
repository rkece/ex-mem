'use client';

import React from 'react';
import { ChevronRight, ShieldCheck, Zap } from 'lucide-react';

interface HeaderFlowBannerProps {
  activeStep?: number;
}

export const HeaderFlowBanner: React.FC<HeaderFlowBannerProps> = ({ activeStep = 3 }) => {
  const steps = [
    { label: 'Current Context', id: 1 },
    { label: 'Understand Intent', id: 2 },
    { label: 'Proactively Surface', id: 3 },
    { label: 'Check Completeness', id: 4 },
    { label: 'Detect Gap', id: 5 },
    { label: 'Reconstruct Missing', id: 6 },
    { label: 'Answer + Evidence', id: 7 },
  ];

  return (
    <div className="w-full bg-surface border-b-hairline px-6 py-2.5 flex items-center justify-between text-[11px] select-none">
      <div className="flex items-center space-x-2 text-text-secondary">
        <span className="flex items-center gap-1.5 text-gold font-medium">
          <Zap className="w-3 h-3 text-gold" />
          <span className="tracking-wide">Intelligence Pipeline</span>
        </span>
        <span className="text-border-hairline">/</span>
      </div>

      {/* Pipeline Flow Stages */}
      <div className="hidden lg:flex items-center space-x-1.5 overflow-x-auto py-0.5">
        {steps.map((step, idx) => {
          const isCurrent = step.id === activeStep;
          const isPast = step.id < activeStep;
          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-center space-x-1 px-2 py-0.5 rounded-xs transition-colors ${
                  isCurrent
                    ? 'bg-gold/10 text-gold border-[0.5px] border-gold/40 font-medium'
                    : isPast
                    ? 'text-text-primary/70'
                    : 'text-text-secondary/40'
                }`}
              >
                <span className="text-[9px] opacity-70">0{step.id}</span>
                <span>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="w-3 h-3 text-border-hairline shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center space-x-2 text-[10px] text-sage">
        <ShieldCheck className="w-3 h-3" />
        <span className="font-sans">Evidence Verified Engine</span>
      </div>
    </div>
  );
};
