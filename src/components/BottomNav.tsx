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
    <nav className="w-full bg-[#ECE6F0] border-t border-slate-200/60 px-4 py-2 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center transition-all group cursor-pointer"
          >
            <div
              className={`flex items-center justify-center transition-all duration-150 ${
                isActive
                  ? 'border border-purple-300/90 rounded-full px-5 py-1 bg-white/70 shadow-2xs'
                  : 'px-3 py-1'
              }`}
            >
              <IconComponent
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#231A2F] stroke-[2.2]' : 'text-slate-500 hover:text-slate-800 stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight ${
                isActive ? 'font-bold text-[#231A2F]' : 'font-medium text-slate-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
