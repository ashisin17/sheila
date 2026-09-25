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

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    {
      id: 'home',
      label: t.home,
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'calendar',
      label: t.calendar,
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'providers',
      label: t.providers,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'you',
      label: t.you,
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full pb-2 pt-1 px-4">
      <nav className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-purple-100/80 px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-[#F3EDF7] text-slate-900 border border-purple-200/90 shadow-xs scale-102 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className={`${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
