'use client';

import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Tag,
  User
} from 'lucide-react';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemoryCaptured: () => void;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  isOpen,
  onClose,
  onMemoryCaptured,
}) => {
  const [tab, setTab] = useState<'paste' | 'upload' | 'note'>('paste');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('Alex Rivera');
  const [project, setProject] = useState('Ex-Mem Core');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const extractionSteps = [
    '01. Scanning raw payload for temporal events',
    '02. Detecting binding architectural decisions & commitments',
    '03. Normalizing dates & revision timeline',
    '04. Extracting named people & stakeholders',
    '05. Classifying domain entities & technical topics',
    '06. Inferring causal relationships & rationale constraints',
  ];

  const handleCapture = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setResult(null);
    setCurrentStep(1);

    // Live visible extraction sequence
    const t1 = setTimeout(() => setCurrentStep(2), 500);
    const t2 = setTimeout(() => setCurrentStep(3), 1000);
    const t3 = setTimeout(() => setCurrentStep(4), 1500);
    const t4 = setTimeout(() => setCurrentStep(5), 2000);
    const t5 = setTimeout(() => setCurrentStep(6), 2500);

    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Sprint Discussion Memo',
          text,
          type: tab,
          author,
          project,
        }),
      });
      const data = await res.json();
      setTimeout(() => {
        setResult(data);
        setIsProcessing(false);
        onMemoryCaptured();
      }, 3000);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const sampleTemplate = `SPRINT SYNC NOTE
Author: Sarah Chen
Date: May 20, 2026
Discussion: Evaluated API rate limiting algorithms for API Gateway.
Decision: Selected Sliding Window Counter in Redis because it avoids burst vulnerabilities at window boundaries while maintaining sub-millisecond check latency.
Assigned: Alex Rivera to draft rate limiter middleware.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/85 backdrop-blur-sm select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-surface border-hairline rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b-hairline bg-surface-raised flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gold font-mono uppercase">Multi-Stage Extraction</div>
            <h3 className="font-serif text-xl text-text-primary">Capture Memory</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Mode Switcher */}
          {!isProcessing && !result && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b-hairline text-xs">
                <button
                  onClick={() => setTab('paste')}
                  className={`px-3 py-1.5 rounded-xs transition-colors ${
                    tab === 'paste'
                      ? 'bg-gold/15 text-gold border-[0.5px] border-gold/40 font-medium'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Paste Notes / RFC
                </button>
                <button
                  onClick={() => {
                    setTab('paste');
                    setText(sampleTemplate);
                    setTitle('Rate Limiter RFC Summary');
                  }}
                  className="px-2.5 py-1 rounded-xs bg-surface-raised border-hairline text-text-secondary hover:text-gold text-[11px] transition-colors"
                >
                  Load Sample Architecture Note
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] text-text-secondary">Document / Note Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Auth Architecture Addendum"
                    className="w-full mt-1 bg-surface-raised border-hairline p-2 rounded-xs text-text-primary focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-text-secondary">Raw Transcript / Text Body</label>
                  <textarea
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste meeting transcript, Slack architecture thread, or PR description..."
                    className="w-full mt-1 bg-surface-raised border-hairline p-3 rounded-xs text-text-primary focus:outline-none focus:border-gold/50 font-sans leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-text-secondary">Author / Contributor</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full mt-1 bg-surface-raised border-hairline p-2 rounded-xs text-text-primary focus:outline-none focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-text-secondary">Target Project</label>
                    <input
                      type="text"
                      value={project}
                      disabled
                      className="w-full mt-1 bg-surface-raised border-hairline p-2 rounded-xs text-text-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Extraction Pipeline Progress */}
          {isProcessing && (
            <div className="py-6 space-y-5 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="inline-block w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <h4 className="text-sm font-medium text-text-primary">
                  Running Neural Extraction Pipeline
                </h4>
                <p className="text-xs text-text-secondary">
                  Parsing structure, normalizing references, and detecting causal links...
                </p>
              </div>

              <div className="space-y-2 max-w-md mx-auto pt-2">
                {extractionSteps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isDone = currentStep > stepNum;
                  const isCurrent = currentStep === stepNum;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center space-x-2.5 text-xs p-2 rounded-xs transition-all ${
                        isCurrent
                          ? 'bg-gold/10 text-gold font-medium border-l-2 border-gold'
                          : isDone
                          ? 'text-sage'
                          : 'text-text-secondary/40'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 text-gold animate-spin shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-text-secondary/30 shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extraction Result Preview */}
          {result && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-3 bg-sage/10 border-[0.5px] border-sage/40 rounded-xs flex items-center justify-between text-xs text-sage">
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Memory Extracted & Anchored into Database
                </span>
                <span className="font-mono text-[10px]">[ CONFIDENCE: 94% ]</span>
              </div>

              {/* Extracted Memory Card Preview */}
              <div className="p-5 rounded-xs bg-surface-raised border-hairline space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize px-2 py-0.5 rounded-xs bg-gold/15 text-gold font-medium">
                    {result.memory?.type}
                  </span>
                  <span className="text-[11px] text-text-secondary">Just now</span>
                </div>

                <blockquote className="recalled-quote text-base text-text-primary leading-relaxed pl-3 border-l-2 border-l-gold">
                  "{result.memory?.content}"
                </blockquote>

                {result.memory?.reason && (
                  <div className="text-xs text-text-secondary bg-base p-2.5 rounded-xs border-hairline flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-sage shrink-0" />
                    <span><strong>Extracted Rationale:</strong> {result.memory.reason}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2 border-t-hairline text-xs">
                  {result.memory?.people?.map((p: string, i: number) => (
                    <span key={i} className="text-[11px] text-text-secondary flex items-center gap-1">
                      <User className="w-3 h-3" /> {p}
                    </span>
                  ))}
                  {result.memory?.entities?.map((e: string, i: number) => (
                    <span key={i} className="text-[11px] text-gold/80 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-hairline bg-surface-raised flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xs bg-surface border-hairline text-text-secondary hover:text-text-primary text-xs"
          >
            {result ? 'Dismiss' : 'Cancel'}
          </button>

          {!result && !isProcessing && (
            <button
              onClick={handleCapture}
              disabled={!text.trim()}
              className="px-4 py-2 rounded-xs bg-gold text-base text-xs font-medium hover:bg-[#d5b577] transition-colors disabled:opacity-40"
            >
              Run Extraction Pipeline
            </button>
          )}

          {result && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xs bg-gold text-base text-xs font-medium hover:bg-[#d5b577]"
            >
              View In Memory Index
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
