import React from 'react';
import { Globe, Sparkles, Smartphone, LayoutGrid } from 'lucide-react';
import { Language } from '../types';

export type ConditionPreset = 'celiac' | 'lupus' | 'undiagnosed';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode: 'simulator' | 'showcase';
  onViewModeChange: (mode: 'simulator' | 'showcase') => void;
  streakCount?: number;
  activeDemoView?: 'onboarding' | 'main';
  onDemoViewChange?: (view: 'onboarding' | 'main') => void;
  selectedPreset?: ConditionPreset;
  onSelectPreset?: (preset: ConditionPreset) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F3EDF7]/95 backdrop-blur-md border-b border-purple-200/60 shadow-xs">
      {/* Clean Main App Header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#B6A1DA] flex items-center justify-center text-slate-900 shadow-xs font-black text-base">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">Sheila</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAE06D] text-slate-900 shadow-2xs">
                AI Health Advocate
              </span>
            </div>
          </div>
        </div>

        {/* Controls: Language & View Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-white/80 p-0.5 rounded-full border border-purple-200/60 shadow-xs text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-purple-700 ml-2 mr-1" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-full transition text-[11px] font-bold ${
                language === 'en'
                  ? 'bg-[#B6A1DA] text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('es')}
              className={`px-2.5 py-1 rounded-full transition text-[11px] font-bold ${
                language === 'es'
                  ? 'bg-[#B6A1DA] text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => onLanguageChange('zh')}
              className={`px-2.5 py-1 rounded-full transition text-[11px] font-bold ${
                language === 'zh'
                  ? 'bg-[#B6A1DA] text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ZH
            </button>
          </div>

          {/* Simulator vs 4-Screen Layout */}
          <div className="hidden sm:flex items-center bg-white/80 p-0.5 rounded-full border border-purple-200/60 shadow-xs text-xs font-semibold">
            <button
              onClick={() => onViewModeChange('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                viewMode === 'simulator'
                  ? 'bg-[#B6A1DA] text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Interactive Mobile Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
            <button
              onClick={() => onViewModeChange('showcase')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                viewMode === 'showcase'
                  ? 'bg-[#B6A1DA] text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="4-Screen Side-by-Side Mockup"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>4-Screen Mockup</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
