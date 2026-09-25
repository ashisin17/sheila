import React from 'react';
import { Globe, Sparkles, Smartphone, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode: 'simulator' | 'showcase' | 'provider-matching';
  onViewModeChange: (mode: 'simulator' | 'showcase' | 'provider-matching') => void;
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  viewMode,
  onViewModeChange,
  streakCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F3EDF7]/95 backdrop-blur-md border-b border-purple-200/50 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#B6A1DA] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">AuraHealth</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#EAE06D] text-slate-900">
                AI Advocate
              </span>
            </div>
          </div>
        </div>

        {/* Global Language Toggle & View Mode Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Phone vs 4-Screen Showcase */}
          <div className="hidden sm:flex items-center bg-white/80 p-0.5 rounded-full border border-purple-200/60 shadow-xs text-xs font-semibold">
            <button
              onClick={() => onViewModeChange('simulator')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition ${
                viewMode === 'simulator'
                  ? 'bg-[#B6A1DA] text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Interactive Mobile Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => onViewModeChange('showcase')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition ${
                viewMode === 'showcase'
                  ? 'bg-[#B6A1DA] text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="4-Screen Side-by-Side Mockup"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>4-Screen</span>
            </button>
            <button
              onClick={() => onViewModeChange('provider-matching')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition ${
                viewMode === 'provider-matching'
                  ? 'bg-[#B6A1DA] text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full Mobile Provider Matching Engine from PR #1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match Engine (PR #1)</span>
            </button>
          </div>

          {/* Global Language Pill Toggle */}
          <div className="flex items-center bg-white rounded-full border border-purple-200/70 p-0.5 shadow-xs text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-purple-700 ml-1.5 mr-0.5" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full transition ${
                language === 'en'
                  ? 'bg-[#EAE06D] text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('es')}
              className={`px-2 py-0.5 rounded-full transition ${
                language === 'es'
                  ? 'bg-[#EAE06D] text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => onLanguageChange('zh')}
              className={`px-2 py-0.5 rounded-full transition ${
                language === 'zh'
                  ? 'bg-[#EAE06D] text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              中文
            </button>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1 bg-[#E8DFF2] px-2 py-1 rounded-full text-xs font-bold text-purple-900 border border-purple-300/40">
            <span>🔥</span>
            <span>{streakCount}d</span>
          </div>
        </div>
      </div>
    </header>
  );
};
