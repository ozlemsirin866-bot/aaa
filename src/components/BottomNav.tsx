import React from 'react';
import { LayoutGrid, Dumbbell, UtensilsCrossed, BarChart3, Compass, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'daily' | 'workout' | 'nutrition' | 'analytics' | 'guide' | 'profile';
  onChangeTab: (tab: 'daily' | 'workout' | 'nutrition' | 'analytics' | 'guide' | 'profile') => void;
  isWorkoutActive?: boolean;
}

interface NavItem {
  id: 'daily' | 'workout' | 'nutrition' | 'analytics' | 'guide' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasBadge?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  isWorkoutActive = false,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'daily',
      label: 'Günlük',
      icon: LayoutGrid,
    },
    {
      id: 'workout',
      label: 'Antrenman',
      icon: Dumbbell,
      hasBadge: isWorkoutActive,
    },
    {
      id: 'nutrition',
      label: 'Beslenme',
      icon: UtensilsCrossed,
    },
    {
      id: 'analytics',
      label: 'Analiz',
      icon: BarChart3,
    },
    {
      id: 'guide',
      label: 'Rehber',
      icon: Compass,
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#121317]/95 backdrop-blur-lg border-t border-[#262936] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center h-16 px-0.5">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center h-full relative transition-colors active:scale-95 px-0.5 ${
                isActive ? 'text-[#FF5356]' : 'text-[#8E90A0] hover:text-[#E3E2E8]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF1E38] animate-pulse" />
                )}
              </div>
              <span className={`text-[9px] sm:text-[10px] mt-1 font-semibold tracking-wide truncate max-w-full ${isActive ? 'text-white' : 'text-[#8E90A0]'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-[2px] bg-[#FF1E38] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
