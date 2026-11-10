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
  Crown,
  X,
  QrCode,
  Check,
  KeyRound,
  AlertCircle,
  UserCircle,
  Sparkles,
  ArrowRight,
  User,
  MapPin
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'feed' | 'radar' | 'map' | 'chats'>('feed');
  const [radiusKm, setRadiusKm] = useState<number>(5.0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyActiveNow, setOnlyActiveNow] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // First-time Registration State
  const [hasRegistered, setHasRegistered] = useState<boolean>(() => {
    return localStorage.getItem('chaloji_user_registered') === 'true';
  });
  const [regName, setRegName] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regError, setRegError] = useState('');

  // Prime Subscription States
  const [isPrimeUser, setIsPrimeUser] = useState<boolean>(false);
  const [showPrimeModal, setShowPrimeModal] = useState<boolean>(false);
  const [isPaymentVerifying, setIsPaymentVerifying] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [utrError, setUtrError] = useState<string>('');

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

  // MULTIPLE WELCOME MESSAGES FEATURE ON FIRST LOGIN
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const savedChats = localStorage.getItem('chaloji_initial_chats');
      if (savedChats) return JSON.parse(savedChats);
    } catch (e) {}

    const initialChats = {
      'priya-1': [
        {
          id: 'msg-init-1',
          senderId: 'priya-1',
          text: 'Hey! Welcome to Chalo Ji! Saw you are around ✨',
          timestamp: 'Just now',
          status: 'delivered' as const,
        },
      ],
      'ananya-4': [
        {
          id: 'msg-init-2',
          senderId: 'ananya-4',
          text: 'Hi there! Welcome to the neighborhood. Are you into photography or cafe hopping?',
          timestamp: '2m ago',
          status: 'delivered' as const,
        },
      ],
      'zoya-5': [
        {
          id: 'msg-init-3',
          senderId: 'zoya-5',
          text: 'Hello! Let me know if you ever want to check out local spots around 🏺',
          timestamp: '5m ago',
          status: 'delivered' as const,
        },
      ],
    };

    localStorage.setItem('chaloji_initial_chats', JSON.stringify(initialChats));
    return initialChats;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regLocation.trim()) {
      setRegError('Kripya apna Name aur Address/Location zaroor bharein!');
      return;
    }

    const newUserProfile = {
      name: regName,
      location: regLocation,
      bio: regBio || 'Exploring local community connections.',
    };

    localStorage.setItem('chaloji_user_profile', JSON.stringify(newUserProfile));
    localStorage.setItem('chaloji_user_registered', 'true');
    setHasRegistered(true);
    showToast(`Welcome ${regName}! Profile created.`);
  };

  const handleOpenChat = (user: UserProfile) => {
    if (!isPrimeUser) {
      setShowPrimeModal(true);
    } else {
      setActiveChatUser(user);
    }
  };

  const handleVerifyUTR = () => {
    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length < 5) {
      setUtrError('Kripya valid Secret Code ya UTR enter karein!');
      return;
    }

    setUtrError('');
    setIsPaymentVerifying(true);

    setTimeout(() => {
      setIsPaymentVerifying(false);
      setIsPrimeUser(true);
      setShowPrimeModal(false);
      setUtrNumber('');
      showToast('🎉 Premium Chat Access Activated!');
    }, 1200);
  };

  const handleSendWave = (user: UserProfile) => {
    if (!wavedUserIds.includes(user.id)) {
      setWavedUserIds((prev) => [...prev, user.id]);
      showToast(`Waved to ${user.name.split(' ')[0]} 👋`);
    }
  };

  const filteredProfiles = useMemo(() => {
    return INITIAL_PROFILES.filter((user) => {
      if (user.distanceKm > radiusKm) return false;
      if (onlyActiveNow && user.activeStatus !== 'Active now') return false;
      return true;
    });
  }, [radiusKm, onlyActiveNow, selectedCategory, searchQuery]);

  const unreadCount = Object.keys(chatHistory).length > 0 ? 3 : 0;

  // FIRST-TIME SIGN UP SCREEN
  if (!hasRegistered) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Join Chalo Ji</h1>
            <p className="text-xs text-slate-400">Create your profile to find & chat with nearby locals</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {regError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                {regError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mohit"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Address / Neighborhood *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jhunjhunu, Rajasthan"
                value={regLocation}
                onChange={(e) => setRegLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Bio / Vibe</label>
              <textarea
                rows={2}
                placeholder="What do you love?"
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <span>Create Profile & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <TopNavigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        unreadCount={unreadCount}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenMyProfile={() => setIsMyProfileOpen(true)}
        activeRadius={radiusKm}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Local Discovery
              </h1>
              {isPrimeUser && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-amber-500" /> PRO
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find and connect with neighbors, creators, and fellow locals instantly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMyProfileOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-all shadow-xs"
            >
              <UserCircle className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl shrink-0">
              <button
                onClick={() => setCurrentTab('feed')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentTab === 'feed'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
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
                <span>Radar</span>
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
              </button>
            </div>
          </div>
        </div>

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

        {currentTab === 'feed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfiles.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onOpenChat={handleOpenChat}
                onViewProfile={(u) => setActiveProfileUser(u)}
                onSendWave={handleSendWave}
                hasWaved={wavedUserIds.includes(user.id)}
              />
            ))}
          </div>
        )}

        {currentTab === 'radar' && (
          <RadarView
            users={filteredProfiles}
            radiusKm={radiusKm}
            onOpenChat={handleOpenChat}
            onViewProfile={(u) => setActiveProfileUser(u)}
            onSendWave={handleSendWave}
            wavedUserIds={wavedUserIds}
          />
        )}

        {currentTab === 'map' && (
          <MapView
            users={filteredProfiles}
            radiusKm={radiusKm}
            onOpenChat={handleOpenChat}
            onViewProfile={(u) => setActiveProfileUser(u)}
            onSendWave={handleSendWave}
            wavedUserIds={wavedUserIds}
          />
        )}

        {currentTab === 'chats' && (
          <MessagesListView
            users={INITIAL_PROFILES}
            chatHistory={chatHistory}
            onOpenChat={handleOpenChat}
            onViewProfile={(u) => setActiveProfileUser(u)}
          />
        )}
      </main>

      {/* MY PROFILE MODAL */}
      <MyProfileModal
        isOpen={isMyProfileOpen}
        onClose={() => setIsMyProfileOpen(false)}
        activeRadius={radiusKm}
        setRadius={setRadiusKm}
      />

      {/* PRIME SUBSCRIPTION MODAL */}
      {showPrimeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowPrimeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <Crown className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Unlock Unlimited Chat</h2>
            
            <div className="bg-slate-100 dark:bg-slate-950 p-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
              <div className="w-36 h-36 bg-white p-2 mx-auto rounded-xl flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=Namunana034@okaxis%26pn=ChaloJi%26am=29%26cu=INR`}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">UPI: Namunana034@okaxis (₹29)</p>
            </div>

            <div className="space-y-2.5 text-left">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Enter Secret Access Code (`CHALO29`) or UTR
              </label>
              <input
                type="text"
                placeholder="e.g. CHALO29"
                value={utrNumber}
                onChange={(e) => {
                  setUtrNumber(e.target.value);
                  setUtrError('');
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono"
              />

              {utrError && <p className="text-[11px] text-rose-500">{utrError}</p>}

              <button
                onClick={handleVerifyUTR}
                disabled={isPaymentVerifying || !utrNumber.trim()}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                {isPaymentVerifying ? 'Verifying...' : <><Check className="w-4 h-4" /> Verify & Unlock</>}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {activeProfileUser && (
        <ProfileModal
          user={activeProfileUser}
          isOpen={Boolean(activeProfileUser)}
          onClose={() => setActiveProfileUser(null)}
          onOpenChat={handleOpenChat}
          onSendWave={handleSendWave}
          hasWaved={wavedUserIds.includes(activeProfileUser.id)}
        />
      )}

      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} unreadCount={unreadCount} />

      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
