'use client';

import React, { useState } from 'react';
import { CurrentContext, Memory } from '@/lib/types';
import { 
  Cpu, 
  Terminal, 
  FileCode, 
  UserCheck, 
  Tag, 
  RefreshCw, 
  Check, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface ContextViewProps {
  context: CurrentContext;
  onUpdateContext: (update: Partial<CurrentContext>) => void;
  onOpenReconstruct: (memoryId: string) => void;
}

export const ContextView: React.FC<ContextViewProps> = ({
  context,
  onUpdateContext,
  onOpenReconstruct,
}) => {
  const [taskInput, setTaskInput] = useState(context.task);
  const [topicInput, setTopicInput] = useState(context.topic);
  const [keywordsInput, setKeywordsInput] = useState(context.detectedKeywords.join(', '));
  const [isSaved, setIsSaved] = useState(false);

  const handleManualSave = () => {
    const kws = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    onUpdateContext({
      task: taskInput,
      topic: topicInput,
      detectedKeywords: kws,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const contextScenarios = [
    {
      name: 'Authentication Architecture (Active)',
      project: 'Ex-Mem Core',
      task: 'Implementing authentication middleware in API gateway',
      topic: 'Token validation and stateless session handling',
      keywords: ['auth', 'jwt', 'middleware', 'stateless', 'tokens', 'gateway', 'rest'],
      entities: ['AuthMiddleware', 'JWTService', 'API Gateway'],
      people: ['Alex Rivera', 'Sarah Chen', 'Marcus Vance'],
      activeFile: 'src/gateway/auth.middleware.ts',
    },
    {
      name: 'Frontend Framework Modernization',
      project: 'Ex-Mem Core',
      task: 'Evaluating client-side UI frameworks and SSR hydration',
      topic: 'React 19 vs Angular 18 framework consolidation',
      keywords: ['frontend', 'react', 'angular', 'framework', 'portal', 'components'],
      entities: ['React 19', 'Angular 18', 'ClientPortal'],
      people: ['Sarah Chen', 'David Kim'],
      activeFile: 'packages/portal/src/App.tsx',
    },
    {
      name: 'Redis Cache & Session Investigation',
      project: 'Ex-Mem Core',
      task: 'Benchmarking session storage backend cluster',
      topic: 'Redis cluster cache deployment and state persistence',
      keywords: ['redis', 'session', 'cache', 'cluster', 'storage', 'latency'],
      entities: ['Redis Cluster', 'Session Storage'],
      people: ['Marcus Vance'],
      activeFile: 'infra/k8s/redis-cluster.yaml',
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b-hairline gap-4">
        <div>
          <div className="text-xs text-gold flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            <span>External Memory Index 04</span>
          </div>
          <h2 className="font-serif text-3xl text-text-primary font-normal">
            Active Context Engine
          </h2>
          <p className="text-xs text-text-secondary mt-1 max-w-xl">
            Ninaivagam's proactive layer continuously models your environment. As tasks evolve, memory relevance vectors shift dynamically.
          </p>
        </div>

        <div className="text-xs text-sage flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-sage/10 border-[0.5px] border-sage/40">
          <Cpu className="w-3.5 h-3.5 text-sage" />
          <span>Context Loop: Active</span>
        </div>
      </div>

      {/* Scenario Presets */}
      <div className="space-y-3">
        <div className="text-xs font-semibold tracking-wider text-text-primary">
          Quick Task Switcher (Live Proactive Test)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contextScenarios.map((scen, idx) => {
            const isActive = context.task === scen.task;
            return (
              <div
                key={idx}
                onClick={() => {
                  setTaskInput(scen.task);
                  setTopicInput(scen.topic);
                  setKeywordsInput(scen.keywords.join(', '));
                  onUpdateContext({
                    project: scen.project,
                    task: scen.task,
                    topic: scen.topic,
                    detectedKeywords: scen.keywords,
                    activeEntities: scen.entities,
                    activePeople: scen.people,
                    activeFile: scen.activeFile,
                  });
                }}
                className={`p-4 rounded-xs border cursor-pointer transition-all space-y-2 ${
                  isActive
                    ? 'bg-surface-raised border-gold text-text-primary ring-1 ring-gold/40'
                    : 'bg-surface border-hairline hover:border-gold/40 text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-primary">{scen.name}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-gold" />}
                </div>
                <p className="text-[11px] line-clamp-2 text-text-secondary">
                  {scen.task}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Context Editor Form */}
      <div className="bg-surface border-hairline p-6 rounded-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b-hairline">
          <span className="text-xs font-semibold tracking-wider text-text-primary">
            Workspace Environmental Signals
          </span>
          <span className="text-[11px] text-text-secondary">
            Last evaluated: {new Date(context.lastUpdated).toLocaleTimeString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] text-text-secondary">Primary Project</label>
            <input
              type="text"
              value={context.project}
              disabled
              className="w-full bg-surface-raised border-hairline p-2.5 rounded-xs text-xs text-text-primary opacity-80"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-text-secondary">Active File Buffer</label>
            <div className="flex items-center space-x-2 bg-surface-raised border-hairline p-2.5 rounded-xs text-xs text-gold font-mono">
              <FileCode className="w-3.5 h-3.5" />
              <span>{context.activeFile || 'None'}</span>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] text-text-secondary">Active Engineering Task</label>
            <textarea
              rows={2}
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="w-full bg-surface-raised border-hairline p-2.5 rounded-xs text-xs text-text-primary focus:outline-none focus:border-gold/50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] text-text-secondary">Detected Keywords (Comma-separated)</label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              className="w-full bg-surface-raised border-hairline p-2.5 rounded-xs text-xs text-text-primary focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t-hairline">
          <span className="text-[11px] text-sage">
            {isSaved ? 'Context updated & memories re-indexed' : 'Type to modify context signals'}
          </span>
          <button
            onClick={handleManualSave}
            className="px-4 py-2 rounded-xs bg-gold text-base text-xs font-medium hover:bg-[#d5b577] transition-colors"
          >
            Update Context Vector
          </button>
        </div>
      </div>
    </div>
  );
};
