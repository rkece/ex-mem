'use client';

import React, { useState } from 'react';
import { CurrentContext, Memory } from '@/lib/types';
import { 
  Compass, 
  Sparkles, 
  ExternalLink, 
  EyeOff, 
  Clock, 
  FileText, 
  User, 
  Hash, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertTriangle
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
  const [isSwitching, setIsSwitching] = useState(false);

  // Preset task contexts for rapid testing
  const contextPresets = [
    {
      label: 'API Gateway: Auth Middleware',
      project: 'Ex-Mem Core',
      task: 'Implementing authentication middleware in API gateway',
      topic: 'Token validation and stateless session handling',
      detectedKeywords: ['auth', 'jwt', 'middleware', 'stateless', 'tokens', 'gateway', 'rest'],
      activeEntities: ['AuthMiddleware', 'JWTService', 'API Gateway'],
      activePeople: ['Alex Rivera', 'Sarah Chen', 'Marcus Vance'],
      activeFile: 'src/gateway/auth.middleware.ts',
    },
    {
      label: 'Frontend: Client Framework Standard',
      project: 'Ex-Mem Core',
      task: 'Selecting web UI application framework and hydration architecture',
      topic: 'React 19 vs Angular 18 framework consolidation',
      detectedKeywords: ['frontend', 'react', 'angular', 'framework', 'portal', 'components'],
      activeEntities: ['React 19', 'Angular 18', 'ClientPortal'],
      activePeople: ['Sarah Chen', 'David Kim'],
      activeFile: 'packages/portal/package.json',
    },
    {
      label: 'Infrastructure: Session Cache Migration',
      project: 'Ex-Mem Core',
      task: 'Investigating session storage backend and cluster topology',
      topic: 'Redis cluster cache deployment and state persistence',
      detectedKeywords: ['redis', 'session', 'cache', 'cluster', 'storage', 'latency'],
      activeEntities: ['Redis Cluster', 'Session Storage'],
      activePeople: ['Marcus Vance'],
      activeFile: 'infra/k8s/redis-cluster.yaml',
    },
  ];

  const handlePresetSelect = (preset: typeof contextPresets[0]) => {
    setIsSwitching(true);
    setDismissed(false);
    onContextChange(preset);
    setTimeout(() => setIsSwitching(false), 300);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Section: Greeting & Editorial Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b-hairline gap-4">
        <div>
          <div className="text-xs text-gold flex items-center gap-2 mb-1.5 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            <span>External Memory Layer 01</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary tracking-tight font-normal">
            Good morning. You are working in <span className="italic">{context.project}</span>.
          </h2>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl font-sans">
            Ninaivagam has matched your active terminal and editor focus. Relevant historical decisions are proactively surfaced without search queries.
          </p>
        </div>

        {/* Quick Question Trigger */}
        <button
          onClick={onOpenAsk}
          className="flex items-center space-x-2 px-4 py-2 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-gold/40 transition-colors shrink-0"
        >
          <span>Ask your memory</span>
          <span className="text-[10px] text-text-secondary px-1.5 py-0.5 rounded-xs bg-base border-hairline">⌘K</span>
        </button>
      </div>

      {/* Asymmetric Two-Column Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Context Panel (5 cols) */}
        <div className="lg:col-span-5 bg-surface border-hairline p-6 rounded-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b-hairline">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-xs bg-gold/70"></span>
              <h3 className="text-xs font-semibold tracking-wider text-text-primary">
                Current Working Context
              </h3>
            </div>
            <span className="text-[10px] text-sage px-2 py-0.5 rounded-xs bg-sage/10 border-[0.5px] border-sage/30">
              Live Monitor
            </span>
          </div>

          {/* Active Task & Topic */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] text-text-secondary mb-1">Active Task</div>
              <div className="text-sm font-medium text-text-primary bg-surface-raised p-3 rounded-xs border-hairline">
                {context.task}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-text-secondary mb-1">Detected Domain Topic</div>
              <div className="text-xs text-text-primary bg-surface-raised/50 p-2.5 rounded-xs border-hairline">
                {context.topic}
              </div>
            </div>

            {context.activeFile && (
              <div>
                <div className="text-[11px] text-text-secondary mb-1">Active Buffer / File</div>
                <div className="text-[11px] text-gold/90 bg-base p-2 rounded-xs border-hairline flex items-center justify-between">
                  <span>{context.activeFile}</span>
                  <span className="text-[9px] text-text-secondary">Synced</span>
                </div>
              </div>
            )}

            {/* Detected Keywords Chips */}
            <div>
              <div className="text-[11px] text-text-secondary mb-1.5 flex items-center justify-between">
                <span>Detected Context Tokens</span>
                <span className="text-[10px] text-text-secondary opacity-60">
                  {context.detectedKeywords.length} terms
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {context.detectedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-xs bg-surface-raised border-hairline text-text-secondary"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Contributors */}
            <div>
              <div className="text-[11px] text-text-secondary mb-1.5">Key Domain Participants</div>
              <div className="flex flex-wrap gap-2">
                {context.activePeople.map((person, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-1.5 text-[11px] text-text-primary bg-surface-raised px-2.5 py-1 rounded-xs border-hairline"
                  >
                    <User className="w-3 h-3 text-text-secondary" />
                    <span>{person}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Context Switcher (Tactile Interactive Control) */}
          <div className="pt-4 border-t-hairline">
            <div className="text-[11px] text-text-secondary mb-2 flex items-center justify-between">
              <span>Simulate Task Focus Switch</span>
              <RefreshCw className="w-3 h-3 text-text-secondary" />
            </div>
            <div className="space-y-1.5">
              {contextPresets.map((preset, idx) => {
                const isSelected = context.task === preset.task;
                return (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(preset)}
                    className={`w-full text-left p-2 rounded-xs text-[11px] transition-all border ${
                      isSelected
                        ? 'bg-gold/10 border-gold/40 text-gold font-medium'
                        : 'bg-surface-raised/40 border-hairline text-text-secondary hover:text-text-primary hover:border-text-secondary/40'
                    }`}
                  >
                    <div className="truncate">{preset.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Visually Distinct Proactively Recalled Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-xs bg-sage"></span>
              <h3 className="text-xs font-semibold tracking-wider text-text-primary">
                Proactively Recalled
              </h3>
            </div>
            <span className="text-[11px] text-text-secondary">
              Surfaced unprompted based on context
            </span>
          </div>

          {!dismissed && proactiveMemory ? (
            <div className="bg-surface border-[1.5px] border-gold/40 rounded-xs p-7 space-y-6 relative overflow-hidden transition-all duration-300">
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-sage to-gold opacity-80" />

              {/* Relevance & Confidence Scores */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b-hairline text-xs">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-xs bg-gold/15 text-gold border-[0.5px] border-gold/50 font-medium">
                    [ RELEVANCE: {proactiveMemory.relevanceScore || 96}% ]
                  </span>
                  <span className="px-2.5 py-1 rounded-xs bg-sage/15 text-sage border-[0.5px] border-sage/50 font-medium">
                    [ CONFIDENCE: {proactiveMemory.confidence}% ]
                  </span>
                  <span className="capitalize px-2 py-0.5 rounded-xs bg-surface-raised border-hairline text-text-secondary text-[11px]">
                    {proactiveMemory.type}
                  </span>
                </div>

                <div className="text-[11px] text-text-secondary flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(proactiveMemory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Surfacing Rationale Note */}
              {proactiveMemory.whySurfaced && (
                <div className="p-3 bg-surface-raised rounded-xs border-hairline text-xs text-text-secondary flex items-start space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-text-primary font-medium">Why surfaced: </span>
                    <span>{proactiveMemory.whySurfaced}</span>
                  </div>
                </div>
              )}

              {/* Recalled Memory Content (Fraunces serif quote) */}
              <div className="space-y-2">
                <div className="text-[11px] text-text-secondary">Core Recorded Memory</div>
                <blockquote className="recalled-quote text-lg md:text-xl text-text-primary leading-relaxed pl-4 border-l-2 border-l-gold/60">
                  "{proactiveMemory.content}"
                </blockquote>
              </div>

              {/* Rationale / Reason (Crucial for gap separation!) */}
              {proactiveMemory.reason ? (
                <div className="space-y-1 bg-surface-raised/60 p-3.5 rounded-xs border-hairline">
                  <div className="text-[11px] text-sage font-medium flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Documented Architectural Rationale</span>
                  </div>
                  <p className="text-xs text-text-primary/90 pl-5">
                    {proactiveMemory.reason}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 bg-rust/10 p-3.5 rounded-xs border-[0.5px] border-rust/40">
                  <div className="text-[11px] text-rust font-medium flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Rationale Unrecorded (Memory Gap)</span>
                  </div>
                  <p className="text-xs text-text-secondary pl-5">
                    This decision has no validated reasoning logged in documentation.
                  </p>
                </div>
              )}

              {/* Provenance & Author */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-text-secondary gap-2 border-t-hairline">
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-gold/80" />
                  <span className="text-text-primary">{proactiveMemory.source.title}</span>
                  {proactiveMemory.source.section && (
                    <span className="text-[11px] text-text-secondary">({proactiveMemory.source.section})</span>
                  )}
                </div>

                <div className="text-[11px]">
                  Recorded by <span className="text-text-primary">{proactiveMemory.people.join(', ')}</span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onExploreMemory(proactiveMemory)}
                    className="flex items-center space-x-2 px-3.5 py-2 rounded-xs bg-gold text-base text-xs font-medium hover:bg-[#d5b577] transition-colors"
                  >
                    <span>Explore Memory Trail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenReconstruction(proactiveMemory.id)}
                    className="flex items-center space-x-2 px-3.5 py-2 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-gold/40 transition-colors"
                  >
                    <span>Reconstruct Lineage</span>
                  </button>
                </div>

                <button
                  onClick={() => setDismissed(true)}
                  className="text-xs text-text-secondary hover:text-text-primary flex items-center space-x-1 px-2 py-1 transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          ) : (
            /* Dismissed or Empty State */
            <div className="bg-surface border-hairline rounded-xs p-8 text-center space-y-3">
              <p className="text-xs text-text-secondary">
                Proactive memory dismissed for this cycle. The intelligence engine will continue scanning your active file changes.
              </p>
              <button
                onClick={() => setDismissed(false)}
                className="text-xs text-gold hover:underline font-medium"
              >
                Recall latest memory for {context.project}
              </button>
            </div>
          )}

          {/* Lineage & Invariance Rules Card */}
          <div className="bg-surface border-hairline p-5 rounded-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-text-secondary pb-2 border-b-hairline">
              <span className="font-medium text-text-primary">Related Active Requirements</span>
              <span>1 constraint enforced</span>
            </div>
            <div className="text-xs text-text-secondary space-y-1">
              <div className="text-text-primary font-medium">
                May 13: Microservices Stateless Invariance Rule
              </div>
              <p className="text-[11px] leading-relaxed">
                "All services must be completely stateless. Gateway nodes cannot hold state in local memory or sticky sessions." (Sarah Chen, Architecture Blueprint v1.2)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
