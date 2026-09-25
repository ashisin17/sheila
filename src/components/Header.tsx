import React from 'react';
import { Globe, Sparkles, Smartphone, LayoutGrid, CheckCircle2, UserCheck, Stethoscope, AlertCircle } from 'lucide-react';
import { Language } from '../types';

export type ConditionPreset = 'celiac' | 'lupus' | 'undiagnosed';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode: 'simulator' | 'showcase';
  onViewModeChange: (mode: 'simulator' | 'showcase') => void;
  streakCount: number;
  activeDemoView: 'onboarding' | 'main';
  onDemoViewChange: (view: 'onboarding' | 'main') => void;
  selectedPreset: ConditionPreset;
  onSelectPreset: (preset: ConditionPreset) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  viewMode,
  onViewModeChange,
  streakCount,
  activeDemoView,
  onDemoViewChange,
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F3EDF7]/95 backdrop-blur-md border-b border-purple-200/60 shadow-xs">
      {/* Sleek Hackathon Presentation Top Bar */}
      <div className="bg-slate-900 text-white px-3 py-1.5 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Hackathon Judge View Switcher */}
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-[10px] uppercase tracking-wider text-[#EAE06D] font-black mr-1 hidden sm:inline">
              ⚡ Live Demo:
            </span>
            <div className="bg-slate-800 p-0.5 rounded-full flex items-center border border-slate-700">
              <button
                onClick={() => onDemoViewChange('onboarding')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition flex items-center gap-1.5 ${
                  activeDemoView === 'onboarding'
                    ? 'bg-[#EAE06D] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Onboarding &amp; Sheila Sign-Up</span>
              </button>
              <button
                onClick={() => onDemoViewChange('main')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition flex items-center gap-1.5 ${
                  activeDemoView === 'main'
                    ? 'bg-[#B6A1DA] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>Main 4-Tab App (Maya, 28)</span>
              </button>
            </div>
          </div>

          {/* Center: Condition Preset Switcher */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-semibold mr-1 hidden md:inline">
              Condition Preset:
            </span>
            <div className="flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-xl border border-slate-700 text-[10px] font-bold">
              <button
                onClick={() => onSelectPreset('celiac')}
                className={`px-2 py-0.5 rounded-lg transition ${
                  selectedPreset === 'celiac'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Celiac Disease (Neurological & Gut)"
              >
                Celiac (Neuro &amp; Gut)
              </button>
              <button
                onClick={() => onSelectPreset('lupus')}
                className={`px-2 py-0.5 rounded-lg transition ${
                  selectedPreset === 'lupus'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Lupus / Eczema Skin Flares"
              >
                Lupus / Eczema
              </button>
              <button
                onClick={() => onSelectPreset('undiagnosed')}
                className={`px-2 py-0.5 rounded-lg transition ${
                  selectedPreset === 'undiagnosed'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Undiagnosed (8+ Doctors Dismissed)"
              >
                Undiagnosed (8+ Doctors)
              </button>
            </div>
          </div>

          {/* Right: Language Toggle & View Mode */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-full border border-slate-700 p-0.5 text-[10px] font-bold">
              <Globe className="w-3 h-3 text-[#EAE06D] ml-1.5 mr-0.5" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-full transition ${
                  language === 'en'
                    ? 'bg-[#EAE06D] text-slate-950 font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('es')}
                className={`px-2 py-0.5 rounded-full transition ${
                  language === 'es'
                    ? 'bg-[#EAE06D] text-slate-950 font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Español
              </button>
              <button
                onClick={() => onLanguageChange('zh')}
                className={`px-2 py-0.5 rounded-full transition ${
                  language === 'zh'
                    ? 'bg-[#EAE06D] text-slate-950 font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main App Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#B6A1DA] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">AuraHealth</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAE06D] text-slate-900 shadow-2xs">
                With Sheila AI
              </span>
            </div>
          </div>
        </div>

        {/* Simulator vs 4-Screen Layout */}
        <div className="flex items-center gap-2">
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
              <span>Mobile Phone</span>
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
              <span>4-Screen Mockup</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
