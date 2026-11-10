import React from 'react';
import { Compass, LayoutGrid, Map, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'feed' | 'radar' | 'map' | 'chats';
  setCurrentTab: (tab: 'feed' | 'radar' | 'map' | 'chats') => void;
  unreadCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  unreadCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        <button
          onClick={() => setCurrentTab('feed')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'feed'
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Nearby</span>
        </button>

        <button
          onClick={() => setCurrentTab('radar')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'radar'
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Radar</span>
        </button>

        <button
          onClick={() => setCurrentTab('map')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'map'
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Map</span>
        </button>

        <button
          onClick={() => setCurrentTab('chats')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'chats'
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] text-[9px] font-bold text-white bg-rose-600 rounded-full flex items-center justify-center px-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">Messages</span>
        </button>
      </div>
    </div>
  );
};
