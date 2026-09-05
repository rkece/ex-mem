'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  X, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Search, 
  FileText, 
  ShieldAlert,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { MemoryGap } from '@/lib/types';

interface GapDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  gap: MemoryGap | null;
}

export const GapDetectionModal: React.FC<GapDetectionModalProps> = ({
  isOpen,
  onClose,
  gap,
}) => {
  const [runningStepIndex, setRunningStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setRunningStepIndex(0);
      setIsCompleted(false);

      const timer1 = setTimeout(() => setRunningStepIndex(1), 700);
      const timer2 = setTimeout(() => setRunningStepIndex(2), 1400);
      const timer3 = setTimeout(() => setRunningStepIndex(3), 2100);
      const timer4 = setTimeout(() => {
        setRunningStepIndex(4);
        setIsCompleted(true);
      }, 2800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [isOpen]);

  if (!isOpen || !gap) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/90 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-surface border-[1.5px] border-rust/50 rounded-xs shadow-2xl overflow-hidden animate-fadeIn flex flex-col">
        {/* Header: Rust Alert */}
        <div className="p-5 border-b border-rust/30 bg-rust/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xs bg-rust text-white">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-text-primary">
                MEMORY GAP DETECTED
              </h3>
              <p className="text-[11px] text-rust/90">
                Retrieved decision is missing required rationale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text-primary rounded-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Target Query & Entity */}
          <div className="p-3.5 bg-surface-raised rounded-xs border-hairline space-y-2">
            <div className="text-[11px] text-text-secondary">Target Entity & Action</div>
            <div className="text-sm font-medium text-text-primary">
              {gap.targetEntity}
            </div>
            <div className="text-xs text-text-secondary flex items-center space-x-2 pt-1 border-t-hairline">
              <HelpCircle className="w-3.5 h-3.5 text-rust shrink-0" />
              <span>
                Missing Attribute: <strong className="text-rust uppercase">{gap.missingProperty}</strong>
              </span>
            </div>
          </div>

          {/* Active Recovery Search Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-text-secondary pb-1 border-b-hairline">
              <span className="font-semibold tracking-wide text-text-primary">
                Recovery Search Checklist (Multi-Source Scan)
              </span>
              <span className="text-[10px] text-text-secondary">
                {isCompleted ? 'Scan Finished' : 'Searching across sources...'}
              </span>
            </div>

            <div className="space-y-2.5">
              {gap.recoveryChecklist.map((item, idx) => {
                const isStepRunning = runningStepIndex === idx;
                const isStepDone = runningStepIndex > idx;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xs border transition-all ${
                      isStepRunning
                        ? 'bg-surface-raised border-gold/40'
                        : isStepDone
                        ? item.status === 'found'
                          ? 'bg-sage/10 border-sage/40'
                          : 'bg-surface-raised/40 border-hairline'
                        : 'opacity-40 border-hairline bg-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs">
                        {isStepRunning ? (
                          <Loader2 className="w-3.5 h-3.5 text-gold animate-spin shrink-0" />
                        ) : isStepDone ? (
                          item.status === 'found' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-sage shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rust shrink-0" />
                          )
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-text-secondary/40 shrink-0" />
                        )}
                        <span className="text-text-primary font-medium">{item.step}</span>
                      </div>

                      {isStepDone && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-xs font-mono uppercase ${
                            item.status === 'found'
                              ? 'bg-sage/20 text-sage'
                              : 'bg-rust/20 text-rust'
                          }`}
                        >
                          {item.status === 'found' ? 'Partial Excerpt' : 'No Rationale'}
                        </span>
                      )}
                    </div>

                    {isStepDone && item.detail && (
                      <p className="text-[11px] text-text-secondary mt-1.5 pl-5 leading-relaxed">
                        {item.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Honest Resolution Outcome */}
          {isCompleted && (
            <div className="p-4 rounded-xs bg-base border-hairline space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-xs font-semibold text-text-primary">
                <ShieldAlert className="w-4 h-4 text-rust" />
                <span>Honest Intelligence Report</span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed pl-6 border-l-2 border-l-rust">
                {gap.honestReport}
              </p>

              <div className="text-[11px] text-text-secondary/80 pl-6 space-y-1">
                <div>• Zero artificial confabulation: Ninaivagam AI will never invent architectural reasons.</div>
                <div>• Action recommended: Flag to Marcus Vance or raise an architectural review ticket.</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-hairline bg-surface-raised flex items-center justify-between">
          <div className="text-[11px] text-text-secondary">
            Anti-Hallucination Guardrail Active
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-gold/40 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
