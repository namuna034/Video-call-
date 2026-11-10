import React from 'react';
import { Compass, Moon, Sun, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';

interface TopNavigationProps {
  currentTab: 'feed' | 'radar' | 'map' | 'chats';
  setCurrentTab: (tab: 'feed' | 'radar' | 'map' | 'chats') => void;
  unreadCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenMyProfile: () => void;
  activeRadius: number;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentTab,
  setCurrentTab,
  unreadCount,
  isDarkMode,
  toggleDarkMode,
  onOpenMyProfile,
  activeRadius,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('feed')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Chalo Ji
              </span>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span className="truncate max-w-[110px]">Indiranagar, BLR</span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setCurrentTab('feed')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'feed'
                ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-600 dark:border-rose-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Nearby Feed
          </button>

          <button
            onClick={() => setCurrentTab('radar')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'radar'
                ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-600 dark:border-rose-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Radar Scanner
          </button>

          <button
            onClick={() => setCurrentTab('map')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'map'
                ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-600 dark:border-rose-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            City Area Map
          </button>

          <button
            onClick={() => setCurrentTab('chats')}
            className={`relative whitespace-nowrap pb-1 transition-colors ${
              currentTab === 'chats'
                ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-600 dark:border-rose-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Messages
            {unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenMyProfile}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Broadcasting ({activeRadius} km)</span>
          </button>

          <button
            onClick={() => setCurrentTab('radar')}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
          >
            Scan Nearby
          </button>
        </div>
      </div>
    </header>
  );
};
