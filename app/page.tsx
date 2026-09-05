'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { HeaderFlowBanner } from '@/components/HeaderFlowBanner';
import { OverviewView } from '@/components/OverviewView';
import { MemoriesView } from '@/components/MemoriesView';
import { TimelineView } from '@/components/TimelineView';
import { ContextView } from '@/components/ContextView';
import { InsightsView } from '@/components/InsightsView';
import { SourcesView } from '@/components/SourcesView';
import { AskModal } from '@/components/AskModal';
import { CaptureModal } from '@/components/CaptureModal';
import { GapDetectionModal } from '@/components/GapDetectionModal';
import { ReconstructionModal } from '@/components/ReconstructionModal';
import { SettingsModal } from '@/components/SettingsModal';
import { CurrentContext, Memory, MemoryGap } from '@/lib/types';
import { INITIAL_CONTEXT } from '@/lib/seed-data';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [context, setContext] = useState<CurrentContext>(INITIAL_CONTEXT);
  const [proactiveMemory, setProactiveMemory] = useState<Memory | null>(null);

  // Modals state
  const [isAskOpen, setIsAskOpen] = useState<boolean>(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeGap, setActiveGap] = useState<MemoryGap | null>(null);
  const [reconstructMemoryId, setReconstructMemoryId] = useState<string | null>(null);

  // Fetch current context and proactive memory
  const fetchProactive = async (ctx?: Partial<CurrentContext>) => {
    try {
      let res;
      if (ctx) {
        res = await fetch('/api/proactive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...context, ...ctx }),
        });
      } else {
        res = await fetch('/api/proactive');
      }
      const data = await res.json();
      if (data.success) {
        if (data.context) setContext(data.context);
        setProactiveMemory(data.topRecall);
      }
    } catch (err) {
      console.error('Proactive fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProactive();

    // ⌘K / Ctrl+K keyboard shortcut to open Ask Ninaivagam
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAskOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleContextChange = async (newContext: Partial<CurrentContext>) => {
    setContext((prev) => ({ ...prev, ...newContext }));
    await fetchProactive(newContext);
  };

  const getActivePipelineStep = (): number => {
    switch (currentTab) {
      case 'overview':
        return 3; // Proactively Surface
      case 'memories':
        return 4; // Check Completeness
      case 'timeline':
        return 2; // Understand Intent
      case 'context':
        return 1; // Current Context
      case 'insights':
        return 5; // Detect Gap / Conflict
      case 'sources':
        return 6; // Reconstruct Missing / Sources
      default:
        return 3;
    }
  };

  return (
    <div className="flex min-h-screen bg-base text-text-primary">
      {/* Fixed Left Navigation Rail */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenCapture={() => setIsCaptureOpen(true)}
        onOpenAsk={() => setIsAskOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area (offset by sidebar width: 16rem / 64) */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen bg-base overflow-x-hidden">
        {/* Top Intelligence Flow Banner */}
        <HeaderFlowBanner activeStep={getActivePipelineStep()} />

        {/* Dynamic View Display */}
        <main className="flex-1 pb-16">
          {currentTab === 'overview' && (
            <OverviewView
              context={context}
              proactiveMemory={proactiveMemory}
              onContextChange={handleContextChange}
              onExploreMemory={(mem) => {
                setCurrentTab('memories');
              }}
              onOpenReconstruction={(id) => setReconstructMemoryId(id)}
              onOpenAsk={() => setIsAskOpen(true)}
            />
          )}

          {currentTab === 'memories' && (
            <MemoriesView
              onOpenReconstruction={(id) => setReconstructMemoryId(id)}
            />
          )}

          {currentTab === 'timeline' && (
            <TimelineView
              onOpenReconstruction={(id) => setReconstructMemoryId(id)}
            />
          )}

          {currentTab === 'context' && (
            <ContextView
              context={context}
              onUpdateContext={handleContextChange}
              onOpenReconstruct={(id) => setReconstructMemoryId(id)}
            />
          )}

          {currentTab === 'insights' && (
            <InsightsView
              onOpenReconstruct={(id) => setReconstructMemoryId(id)}
              onOpenAsk={() => setIsAskOpen(true)}
            />
          )}

          {currentTab === 'sources' && (
            <SourcesView
              onOpenCapture={() => setIsCaptureOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals & Overlays */}
      <AskModal
        isOpen={isAskOpen}
        onClose={() => setIsAskOpen(false)}
        onSelectMemory={(id) => {
          setIsAskOpen(false);
          setCurrentTab('memories');
        }}
        onOpenReconstruct={(id) => {
          setIsAskOpen(false);
          setReconstructMemoryId(id);
        }}
        onTriggerGap={(gap) => {
          setActiveGap(gap);
        }}
      />

      <CaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onMemoryCaptured={() => {
          fetchProactive();
        }}
      />

      <GapDetectionModal
        isOpen={Boolean(activeGap)}
        onClose={() => setActiveGap(null)}
        gap={activeGap}
      />

      {reconstructMemoryId && (
        <ReconstructionModal
          isOpen={Boolean(reconstructMemoryId)}
          onClose={() => setReconstructMemoryId(null)}
          memoryId={reconstructMemoryId}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataReset={() => {
          fetchProactive();
        }}
      />
    </div>
  );
}
