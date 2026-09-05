'use client';

import React, { useState } from 'react';
import { CurrentContext, Memory } from '@/lib/types';
import { 
  Sparkles, 
  EyeOff, 
  Clock, 
  FileText, 
  User, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface OverviewViewProps {
  context: CurrentContext;
  proactiveMemory: Memory | null;
  onContextChange: (newContext: Partial<CurrentContext>) => void;
  onExploreMemory: (memory: Memory) => void;
  onOpenReconstruction: (memoryId: string) => void;
  onOpenAsk: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  context,
  proactiveMemory,
  onContextChange,
  onExploreMemory,
  onOpenReconstruction,
  onOpenAsk,
}) => {
  const [dismissed, setDismissed] = useState(false);

  const contextPresets = [
    {
      label: 'API Gateway: Auth Middleware',
      project: 'Ex-Mem Core',
      task: 'Implementing authentication middleware in API gateway',
      topic: 'Token validation and stateless session handling',
      detectedKeywords: ['auth', 'jwt', 'middleware', 'stateless', 'gateway'],
      activeEntities: ['AuthMiddleware', 'JWTService', 'API Gateway'],
      activePeople: ['Alex Rivera', 'Sarah Chen', 'Marcus Vance'],
      activeFile: 'src/gateway/auth.middleware.ts',
    },
    {
      label: 'Frontend: Client Framework Standard',
      project: 'Ex-Mem Core',
      task: 'Selecting web UI application framework and hydration architecture',
      topic: 'React 19 vs Angular 18 framework consolidation',
      detectedKeywords: ['frontend', 'react', 'angular', 'portal'],
      activeEntities: ['React 19', 'Angular 18', 'ClientPortal'],
      activePeople: ['Sarah Chen', 'David Kim'],
      activeFile: 'packages/portal/package.json',
    },
    {
      label: 'Infrastructure: Session Cache Migration',
      project: 'Ex-Mem Core',
      task: 'Investigating session storage backend and cluster topology',
      topic: 'Redis cluster cache deployment and state persistence',
      detectedKeywords: ['redis', 'session', 'cache', 'storage'],
      activeEntities: ['Redis Cluster', 'Session Storage'],
      activePeople: ['Marcus Vance'],
      activeFile: 'infra/k8s/redis-cluster.yaml',
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Section: Header & Editorial Statement */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b-hairline gap-4">
        <div>
          <div className="text-xs text-gold flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold pulse-dot"></span>
            <span className="tracking-wide">Proactive Intelligence Layer</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary tracking-tight font-normal">
            Good morning. You are working in <span className="italic text-gold">{context.project}</span>.
          </h2>
          <p className="text-xs text-text-secondary mt-1 font-sans">
            Relevant historical decisions are automatically surfaced without search prompts.
          </p>
        </div>

        <button
          onClick={onOpenAsk}
          className="flex items-center space-x-2 px-4 py-2 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-gold/40 card-hover-glow transition-all shrink-0"
        >
          <span>Ask your memory</span>
          <span className="text-[10px] text-text-secondary px-1.5 py-0.5 rounded-xs bg-base border-hairline">⌘K</span>
        </button>
      </div>

      {/* Two-Column Simplified Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Active Focus (4 cols) */}
        <div className="lg:col-span-4 bg-surface border-hairline p-5 rounded-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b-hairline">
            <h3 className="text-xs font-semibold tracking-wider text-text-primary">
              Active Focus
            </h3>
            <span className="text-[10px] text-sage px-2 py-0.5 rounded-xs bg-sage/10 border-[0.5px] border-sage/30 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-sage pulse-dot"></span>
              Live
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Active Task</div>
              <div className="text-xs font-medium text-text-primary bg-surface-raised p-3 rounded-xs border-hairline">
                {context.task}
              </div>
            </div>

            {context.activeFile && (
              <div>
                <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Active File</div>
                <div className="text-[11px] text-gold bg-base p-2 rounded-xs border-hairline font-mono truncate">
                  {context.activeFile}
                </div>
              </div>
            )}

            <div>
              <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Context Tokens</div>
              <div className="flex flex-wrap gap-1">
                {context.detectedKeywords.slice(0, 5).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-xs bg-surface-raised border-hairline text-text-secondary"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Context Switcher */}
          <div className="pt-3 border-t-hairline space-y-2">
            <div className="text-[10px] text-text-secondary uppercase tracking-wider flex items-center justify-between">
              <span>Switch Task Focus</span>
              <RefreshCw className="w-3 h-3 text-text-secondary" />
            </div>
            <div className="space-y-1">
              {contextPresets.map((preset, idx) => {
                const isSelected = context.task === preset.task;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setDismissed(false);
                      onContextChange(preset);
                    }}
                    className={`w-full text-left p-2 rounded-xs text-[11px] transition-all border ${
                      isSelected
                        ? 'bg-gold/10 border-gold text-gold font-medium'
                        : 'bg-surface-raised/40 border-hairline text-text-secondary hover:text-text-primary hover:border-gold/30'
                    }`}
                  >
                    <div className="truncate">{preset.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Proactively Recalled (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              Proactively Recalled
            </h3>
            <span className="text-[11px] text-text-secondary">
              Surfaced without search query
            </span>
          </div>

          {!dismissed && proactiveMemory ? (
            <div className="bg-surface border-[1.5px] border-gold/40 rounded-xs p-7 space-y-5 relative card-hover-glow subtle-glow">
              {/* Relevance & Confidence Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-hairline text-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-xs bg-gold/15 text-gold border-[0.5px] border-gold/50 font-medium text-[11px]">
                    {proactiveMemory.relevanceScore || 96}% Relevance
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-sage/15 text-sage border-[0.5px] border-sage/50 font-medium text-[11px]">
                    {proactiveMemory.confidence}% Confidence
                  </span>
                  <span className="capitalize px-2 py-0.5 rounded-xs bg-surface-raised border-hairline text-text-secondary text-[10px]">
                    {proactiveMemory.type}
                  </span>
                </div>

                <div className="text-[11px] text-text-secondary flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(proactiveMemory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Recalled Memory Content (Fraunces editorial quote) */}
              <blockquote className="recalled-quote text-xl text-text-primary leading-relaxed pl-4 border-l-2 border-l-gold">
                "{proactiveMemory.content}"
              </blockquote>

              {/* Rationale Section */}
              {proactiveMemory.reason ? (
                <div className="bg-surface-raised/60 p-3 rounded-xs border-hairline text-xs text-text-primary/90 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sage font-medium">Documented Rationale: </span>
                    <span>{proactiveMemory.reason}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-rust/10 p-3 rounded-xs border-[0.5px] border-rust/40 text-xs text-rust flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                  <span>Rationale unrecorded (Memory gap detected)</span>
                </div>
              )}

              {/* Provenance Document Footer */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-text-secondary gap-2 border-t-hairline">
                <div className="flex items-center space-x-1.5 truncate">
                  <FileText className="w-3.5 h-3.5 text-gold/80 shrink-0" />
                  <span className="text-text-primary truncate">{proactiveMemory.source.title}</span>
                </div>
                <div className="text-[11px]">
                  By {proactiveMemory.people.join(', ')}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onExploreMemory(proactiveMemory)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-gold text-base text-xs font-medium hover:bg-[#d5b577] transition-all"
                  >
                    <span>Explore Lineage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenReconstruction(proactiveMemory.id)}
                    className="px-3 py-1.5 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-gold/40 transition-colors"
                  >
                    Reconstruct Graph
                  </button>
                </div>

                <button
                  onClick={() => setDismissed(true)}
                  className="text-xs text-text-secondary hover:text-text-primary flex items-center space-x-1 px-2 py-1"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface border-hairline rounded-xs p-8 text-center space-y-2">
              <p className="text-xs text-text-secondary">
                Proactive card dismissed for this session.
              </p>
              <button
                onClick={() => setDismissed(false)}
                className="text-xs text-gold hover:underline font-medium"
              >
                Restore proactive memory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
