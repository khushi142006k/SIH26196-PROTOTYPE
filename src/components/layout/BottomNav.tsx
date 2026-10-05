/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Calendar,
  Camera,
  TrendingUp,
  Bot
} from 'lucide-react';

export function BottomNav() {
  const { activeTab, setActiveTab, firebaseUser, openAuthModal } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'workout_player', label: 'My Plan', icon: Calendar },
    { id: 'camera', label: 'Coach', icon: Camera, highlight: true },
    { id: 'journey', label: 'Journey', icon: TrendingUp },
    { id: 'assistant', label: 'Fitz AI', icon: Bot }
  ];

  const handleTabClick = (tabId: string) => {
    if (!firebaseUser) {
      openAuthModal('login');
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 dark:bg-[#111A2E]/95 backdrop-blur border-t border-[#E2E8F0] dark:border-[#26334F] pb-safe px-2 py-1">
      <div className="flex items-center justify-around">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          if (t.highlight) {
            return (
              <button
                key={t.id}
                onClick={() => handleTabClick(t.id)}
                className="flex flex-col items-center -mt-5 relative group focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-full brand-gradient flex items-center justify-center text-[#0F172A] shadow-lg shadow-[#2DD4BF]/30 group-active:scale-95 transition-transform ${
                  isActive ? 'ring-4 ring-[#CCFBF1] dark:ring-[#0F3D3A]' : ''
                }`}>
                  <Icon className="w-6 h-6 text-[#0F172A]" />
                </div>
                <span className="text-[10px] font-semibold text-[#0F172A] dark:text-[#E6EDF7] mt-0.5">
                  {t.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={t.id}
              onClick={() => handleTabClick(t.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#0F766E] dark:text-[#5EEAD4] font-bold'
                  : 'text-[#475569] dark:text-[#9FB0C8] hover:text-[#0F172A] dark:hover:text-[#E6EDF7]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
