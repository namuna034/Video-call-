/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_PROFILES, UserProfile, ChatMessage } from './data/mockUsers';
import { TopNavigation } from './components/TopNavigation';
import { DistanceFilter } from './components/DistanceFilter';
import { UserCard } from './components/UserCard';
import { RadarView } from './components/RadarView';
import { MapView } from './components/MapView';
import { ChatModal } from './components/ChatModal';
import { ProfileModal } from './components/ProfileModal';
import { MyProfileModal } from './components/MyProfileModal';
import { BottomNav } from './components/BottomNav';
import { MessagesListView } from './components/MessagesListView';
import {
  Compass,
  LayoutGrid,
  Map as MapIcon,
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'feed' | 'radar' | 'map' | 'chats'>('feed');
  const [radiusKm, setRadiusKm] = useState<number>(5.0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyActiveNow, setOnlyActiveNow] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Selection States
  const [activeChatUser, setActiveChatUser] = useState<UserProfile | null>(null);
  const [activeProfileUser, setActiveProfileUser] = useState<UserProfile | null>(null);
  const [isMyProfileOpen, setIsMyProfileOpen] = useState<boolean>(false);

  // Waved users tracking
  const [wavedUserIds, setWavedUserIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('chaloji_theme') === 'dark' ||
        (!('chaloji_theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // Synced Dark Mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chaloji_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chaloji_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Chat conversation threads storage
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({
    'priya-1': [
      {
        id: 'msg-init-1',
        senderId: 'priya-1',
        text: 'Hey Kabir! Saw you are also around Indiranagar 100ft Rd. Have you tried the new pour-over at Nerlu?',
        timestamp: '10:42 AM',
        status: 'read',
      },
    ],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendWave = (user: UserProfile) => {
    if (!wavedUserIds.includes(user.id)) {
      setWavedUserIds((prev) => [...prev, user.id]);
      showToast(`Waved to ${user.name.split(' ')[0]} 👋`);

      // Initialize a friendly greeting in chat thread if empty
      if (!chatHistory[user.id]) {
        setChatHistory((prev) => ({
          ...prev,
          [user.id]: [
            {
              id: `wave-${Date.now()}`,
              senderId: 'me',
              text: `👋 Sent you a wave from ${radiusKm}km away!`,
              timestamp: 'Just now',
              status: 'sent',
            },
          ],
        }));
      }
    }
  };

  // Filter profiles based on radius, active status, category, and text search
  const filteredProfiles = useMemo(() => {
    return INITIAL_PROFILES.filter((user) => {
      // Distance filter
      if (user.distanceKm > radiusKm) return false;

      // Active now filter
      if (onlyActiveNow && user.activeStatus !== 'Active now') return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const textToSearch = (
          user.interests.join(' ') +
          ' ' +
          user.occupation +
          ' ' +
          user.bio +
          ' ' +
          user.hangoutSpot
        ).toLowerCase();

        if (selectedCategory === 'coffee') {
          if (!textToSearch.includes('coffee') && !textToSearch.includes('cafe') && !textToSearch.includes('tea') && !textToSearch.includes('brew')) {
            return false;
          }
        } else if (selectedCategory === 'creative') {
          if (!textToSearch.includes('photo') && !textToSearch.includes('art') && !textToSearch.includes('design') && !textToSearch.includes('pottery') && !textToSearch.includes('film')) {
            return false;
          }
        } else if (selectedCategory === 'fitness') {
          if (!textToSearch.includes('run') && !textToSearch.includes('cycling') && !textToSearch.includes('badminton') && !textToSearch.includes('sports') && !textToSearch.includes('hike')) {
            return false;
          }
        } else if (selectedCategory === 'tech') {
          if (!textToSearch.includes('tech') && !textToSearch.includes('founder') && !textToSearch.includes('engineer') && !textToSearch.includes('systems') && !textToSearch.includes('robotics') && !textToSearch.includes('pm')) {
            return false;
          }
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = user.name.toLowerCase().includes(q);
        const matchBio = user.bio.toLowerCase().includes(q);
        const matchHood = user.neighborhood.toLowerCase().includes(q);
        const matchInterest = user.interests.some((i) => i.toLowerCase().includes(q));
        if (!matchName && !matchBio && !matchHood && !matchInterest) return false;
      }

      return true;
    });
  }, [radiusKm, onlyActiveNow, selectedCategory, searchQuery]);

  const unreadCount = Object.keys(chatHistory).length > 0 ? 1 : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar adheres to Top Bar Contract */}
      <TopNavigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        unreadCount={unreadCount}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenMyProfile={() => setIsMyProfileOpen(true)}
        activeRadius={radiusKm}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-6">
        {/* Banner / View Switcher Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Local Discovery
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find and chat with neighbors, creators, and fellow locals in real time.
            </p>
          </div>

          {/* Interactive View Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setCurrentTab('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'feed'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards Grid</span>
            </button>

            <button
              onClick={() => setCurrentTab('radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'radar'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-rose-500" />
              <span>Radar Scanner</span>
            </button>

            <button
              onClick={() => setCurrentTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'map'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Area Map</span>
            </button>

            <button
              onClick={() => setCurrentTab('chats')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'chats'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chats</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Global Filter Bar (Distance Radius slider, Presets, Categories) */}
        {currentTab !== 'chats' && (
          <DistanceFilter
            radiusKm={radiusKm}
            setRadiusKm={setRadiusKm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            activeCount={filteredProfiles.length}
            totalNearby={INITIAL_PROFILES.length}
            onlyActiveNow={onlyActiveNow}
            setOnlyActiveNow={setOnlyActiveNow}
          />
        )}

        {/* View Content Renderer */}
        {currentTab === 'feed' && (
          <div className="space-y-4">
            {/* Search Input bar */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by name, hobby (e.g. coffee, running, design), or neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline shrink-0"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Profile Cards Grid */}
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProfiles.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onOpenChat={(u) => setActiveChatUser(u)}
                    onViewProfile={(u) => setActiveProfileUser(u)}
                    onSendWave={handleSendWave}
                    hasWaved={wavedUserIds.includes(user.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  No nearby profiles in this radius
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Try expanding your search distance slider above (e.g. 10 km or 15 km) or turning off the "Active Now Only" filter.
                </p>
                <button
                  onClick={() => {
                    setRadiusKm(15);
                    setOnlyActiveNow(false);
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs"
                >
                  Expand to 15 km Radius
                </button>
              </div>
            )}
          </div>
        )}

        {currentTab === 'radar' && (
          <RadarView
            users={filteredProfiles}
            radiusKm={radiusKm}
            onOpenChat={(u) => setActiveChatUser(u)}
            onViewProfile={(u) => setActiveProfileUser(u)}
            onSendWave={handleSendWave}
            wavedUserIds={wavedUserIds}
          />
        )}

        {currentTab === 'map' && (
          <MapView
            users={filteredProfiles}
            radiusKm={radiusKm}
            onOpenChat={(u) => setActiveChatUser(u)}
            onViewProfile={(u) => setActiveProfileUser(u)}
            onSendWave={handleSendWave}
            wavedUserIds={wavedUserIds}
          />
        )}

        {currentTab === 'chats' && (
          <MessagesListView
            users={INITIAL_PROFILES}
            chatHistory={chatHistory}
            onOpenChat={(u) => setActiveChatUser(u)}
            onViewProfile={(u) => setActiveProfileUser(u)}
          />
        )}
      </main>

      {/* Safety & Community Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted local proximity protocol · Exact GPS coordinates never shared publicly</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Indiranagar Local Mesh</span>
            <span aria-hidden="true">·</span>
            <span>Radius: {radiusKm} km</span>
            <span aria-hidden="true">·</span>
            <span>Chalo Ji Discovery © 2026</span>
          </div>
        </div>
      </footer>

      {/* Interactive Direct Message Window Modal */}
      {activeChatUser && (
        <ChatModal
          user={activeChatUser}
          isOpen={Boolean(activeChatUser)}
          onClose={() => setActiveChatUser(null)}
          onViewProfile={(u) => {
            setActiveChatUser(null);
            setActiveProfileUser(u);
          }}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
        />
      )}

      {/* Detailed User Profile View Modal */}
      {activeProfileUser && (
        <ProfileModal
          user={activeProfileUser}
          isOpen={Boolean(activeProfileUser)}
          onClose={() => setActiveProfileUser(null)}
          onOpenChat={(u) => {
            setActiveProfileUser(null);
            setActiveChatUser(u);
          }}
          onSendWave={handleSendWave}
          hasWaved={wavedUserIds.includes(activeProfileUser.id)}
        />
      )}

      {/* My Profile / Location broadcast modal */}
      <MyProfileModal
        isOpen={isMyProfileOpen}
        onClose={() => setIsMyProfileOpen(false)}
        activeRadius={radiusKm}
        setRadius={setRadiusKm}
      />

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        unreadCount={unreadCount}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
