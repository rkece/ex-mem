'use client';

import React from 'react';
import { 
  Compass, 
  Layers, 
  GitCommit, 
  Cpu, 
  Sparkles, 
  FileText, 
  PlusCircle, 
  Search, 
  Settings, 
  Database,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenCapture: () => void;
  onOpenAsk: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenCapture,
  onOpenAsk,
  onOpenSettings,
}) => {
  const navItems = [
    { id: 'overview', number: '01', label: 'Overview', icon: Compass },
    { id: 'memories', number: '02', label: 'Memories', icon: Layers },
    { id: 'timeline', number: '03', label: 'Timeline', icon: GitCommit },
    { id: 'context', number: '04', label: 'Context', icon: Cpu },
    { id: 'insights', number: '05', label: 'Insights', icon: Sparkles },
    { id: 'sources', number: '06', label: 'Sources', icon: FileText },
  ];

  return (
    <aside className="w-64 min-w-[16rem] h-screen bg-surface border-r-hairline flex flex-col justify-between select-none fixed top-0 left-0 z-30">
      {/* Brand & Wordmark */}
      <div>
        <div className="p-6 border-b-hairline">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-xs bg-gold"></span>
            <h1 className="font-serif text-xl tracking-tight text-text-primary font-normal">
              Ninaivagam AI
            </h1>
          </div>
          <p className="text-[11px] text-text-secondary mt-1 font-sans">
            External Memory Intelligence
          </p>
          <div className="text-[10px] text-gold/80 italic font-serif mt-1">
            "Your memory, beyond search."
          </div>
        </div>

        {/* Action CTAs */}
        <div className="p-4 space-y-2 border-b-hairline">
          <button
            onClick={onOpenCapture}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xs bg-gold text-base font-medium text-xs hover:bg-[#d5b577] transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-base" />
            <span>Capture Memory</span>
          </button>

          <button
            onClick={onOpenAsk}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xs bg-surface-raised border-hairline text-text-primary text-xs hover:border-gold/50 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-text-secondary" />
            <span>Ask Ninaivagam</span>
          </button>
        </div>

        {/* Numbered Navigation (01 - 06) */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xs text-xs transition-all ${
                  isActive
                    ? 'bg-surface-raised text-gold border-l-2 border-l-gold font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-sans opacity-60">
                    {item.number}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                </div>
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-gold' : 'text-text-secondary/50'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Status & Settings */}
      <div className="p-4 border-t-hairline space-y-3 bg-surface">
        {/* Active Workspace / Project */}
        <div className="px-2 py-1.5 rounded-xs bg-surface-raised border-hairline">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-secondary">Workspace</span>
            <span className="text-sage flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-sage"></span> Active
            </span>
          </div>
          <div className="text-xs text-text-primary mt-0.5 truncate font-medium">
            Ex-Mem Platform
          </div>
        </div>

        {/* Database & Settings Bar */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-text-secondary">
          <div className="flex items-center space-x-1.5">
            <Database className="w-3 h-3 text-sage" />
            <span>Atlas Memory Store</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xs text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
            title="Database & Platform Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
