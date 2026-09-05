'use client';

import React, { useState } from 'react';
import { 
  X, 
  Database, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  if (!isOpen) return null;

  const handleReset = async () => {
    setIsResetting(true);
    setResetMessage('');
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetMessage('Dataset reset to default state successfully.');
        onDataReset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/85 backdrop-blur-sm select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-surface border-hairline rounded-xs shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b-hairline bg-surface-raised flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-gold" />
            <h3 className="font-serif text-lg text-text-primary">System & Database Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-text-secondary">
          {/* Database Layer Info */}
          <div className="p-4 rounded-xs bg-surface-raised border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-primary">MongoDB Atlas Storage Layer</span>
              <span className="text-sage px-2 py-0.5 rounded-xs bg-sage/15 border-[0.5px] border-sage/40">
                Atlas Ready
              </span>
            </div>
            <p className="leading-relaxed">
              Ninaivagam AI reads <code className="text-gold font-mono">MONGODB_URI</code> from environment variables. When running locally or during quick evaluation, it automatically falls back to an ultra-fast in-memory reactive repository.
            </p>
            <div className="text-[11px] text-text-primary/80 pt-1">
              • Atlas Collection: <span className="font-mono text-gold">ninaivagam.memories</span>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="space-y-3">
            <div className="font-semibold text-text-primary">Reset Demo Intelligence Data</div>
            <p className="leading-relaxed">
              Restore the initial project dataset, containing the May 10–16 auth decisions, the May 18 Redis rationale gap, and the React vs Angular conflict.
            </p>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center space-x-2 px-3 py-2 rounded-xs bg-surface-raised border-hairline text-text-primary hover:border-gold/50 transition-colors disabled:opacity-40"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-gold' : 'text-text-secondary'}`} />
              <span>{isResetting ? 'Restoring default dataset...' : 'Reset To Initial Dataset'}</span>
            </button>

            {resetMessage && (
              <div className="text-sage text-[11px] flex items-center space-x-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{resetMessage}</span>
              </div>
            )}
          </div>

          {/* Epistemic Principles */}
          <div className="p-3 bg-base rounded-xs border-hairline space-y-1.5">
            <div className="font-medium text-text-primary flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sage" />
              <span>Ninaivagam AI Core</span>
            </div>
            <div className="text-[11px] text-text-secondary">
              Strict separation of ANSWER, EVIDENCE, and CONFIDENCE. Rationale gaps are detected honestly; unresolved human conflicts are preserved without synthetic auto-resolution.
            </div>
          </div>
        </div>

        <div className="p-4 border-t-hairline bg-surface-raised flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xs bg-gold text-base text-xs font-medium hover:bg-[#d5b577] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
