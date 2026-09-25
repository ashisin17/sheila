import React from 'react';
import { Home, Calendar, Users, User } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/initialData';

export type TabType = 'home' | 'calendar' | 'providers' | 'you';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const t = TRANSLATIONS[language].tabs;

  const tabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    {
      id: 'home',
      label: t.home,
      icon: Home,
    },
    {
      id: 'calendar',
      label: t.calendar,
      icon: Calendar,
    },
    {
      id: 'providers',
      label: t.providers,
      icon: Users,
    },
    {
      id: 'you',
      label: t.you,
      icon: User,
    },
  ];

  return (
    <nav className="w-full bg-[#ECE6F0] border-t border-slate-200/60 px-4 py-2.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center transition-all cursor-pointer min-w-[64px]"
          >
            {isActive ? (
              <div className="border border-purple-300/80 rounded-2xl px-4 py-1.5 bg-white shadow-2xs flex flex-col items-center justify-center">
                <IconComponent className="w-5 h-5 text-[#231A2F] stroke-[2.2]" />
                <span className="text-[11px] font-bold text-[#231A2F] mt-0.5 tracking-tight">
                  {tab.label}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-1.5 px-2">
                <IconComponent className="w-5 h-5 text-slate-500 hover:text-slate-800 stroke-[1.8] transition-colors" />
                <span className="text-[11px] font-medium text-slate-500 mt-0.5 tracking-tight">
                  {tab.label}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );
};
