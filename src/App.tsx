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
  MapPin,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'feed' | 'radar' | 'map' | 'chats'>('feed');
  const [radiusKm, setRadiusKm] = useState<number>(5.0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyActiveNow, setOnlyActiveNow] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Profile Registration State
  const [hasRegistered, setHasRegistered] = useState<boolean>(() => {
    return localStorage.getItem('chaloji_user_registered') === 'true';
  });
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regOccupation, setRegOccupation] = useState('');
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

  // Chat conversation threads storage
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({
    'priya-1': [
      {
        id: 'msg-init-1',
        senderId: 'priya-1',
        text: 'Hey! Saw you are around. Welcome to Chalo Ji!',
        timestamp: '10:42 AM',
        status: 'read',
      },
    ],
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
      age: parseInt(regAge) || 22,
      location: regLocation,
      occupation: regOccupation || 'Local Explorer',
      bio: regBio || 'Hey there! I am using Chalo Ji to connect with nearby people.',
    };

    localStorage.setItem('chaloji_user_profile', JSON.stringify(newUserProfile));
    localStorage.setItem('chaloji_user_registered', 'true');
    setHasRegistered(true);
    showToast(`Welcome ${regName}! Your profile is ready.`);
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
      setUtrError('Kripya valid Secret Code ya UTR Ref No. enter karein!');
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

  const filteredProfiles = useMemo(() => {
    return INITIAL_PROFILES.filter((user) => {
      if (user.distanceKm > radiusKm) return false;
      if (onlyActiveNow && user.activeStatus !== 'Active now') return false;

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

  // FIRST-TIME INITIAL SIGN UP / PROFILE CREATION SCREEN
  if (!hasRegistered) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Join Chalo Ji</h1>
            <p className="text-xs text-slate-400">
              Create your profile to find & chat with nearby locals in real-time
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {regError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-400" /> Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mohit Sharma"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 21"
                  value={regAge}
                  onChange={(e) => setRegAge(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Occupation</label>
                <input
                  type="text"
                  placeholder="e.g. Designer / Student"
                  value={regOccupation}
                  onChange={(e) => setRegOccupation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Neighborhood / Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Indiranagar 100ft Rd, BLR"
                value={regLocation}
                onChange={(e) => setRegLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Short Bio / Interests</label>
              <textarea
                rows={2}
                placeholder="What do you love? (e.g. Coffee, Coding, Gaming...)"
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 pt-3"
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
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                )}
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
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by name, hobby, or neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            {filteredProfiles.length > 0 ? (
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
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  No nearby profiles in this radius
                </h3>
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

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure Proximity Mesh · Privacy Protected</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Radius: {radiusKm} km</span>
            <span aria-hidden="true">·</span>
            <span>Chalo Ji Discovery © 2026</span>
          </div>
        </div>
      </footer>

      {/* ₹29 PRIME SUBSCRIPTION / UTR & CODE VERIFICATION MODAL */}
      {showPrimeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setShowPrimeModal(false);
                setUtrError('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
              <Crown className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Unlock Unlimited Chat
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan QR & pay <span className="font-bold text-rose-500">₹29</span> to get instant access
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-950 p-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
              <div className="w-40 h-40 bg-white p-2 mx-auto rounded-xl shadow-inner flex flex-col items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=Namunana034@okaxis%26pn=ChaloJi%26am=29%26cu=INR`}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 font-medium">
                <QrCode className="w-3.5 h-3.5 text-rose-500" /> UPI ID: Namunana034@okaxis
              </p>
            </div>

            <div className="space-y-2.5 text-left">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Enter Secret Access Code / UTR
              </label>

              <input
                type="text"
                placeholder="Enter Code (e.g. CHALO29)"
                value={utrNumber}
                onChange={(e) => {
                  setUtrNumber(e.target.value);
                  setUtrError('');
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 tracking-wider font-mono"
              />

              {utrError && (
                <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {utrError}
                </p>
              )}

              <button
                onClick={handleVerifyUTR}
                disabled={isPaymentVerifying || !utrNumber.trim()}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                {isPaymentVerifying ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Verify & Unlock Chat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
          onOpenChat={handleOpenChat}
          onSendWave={handleSendWave}
          hasWaved={wavedUserIds.includes(activeProfileUser.id)}
        />
      )}

      {/* My Profile Setup & View Modal */}
      <MyProfileModal
        isOpen={isMyProfileOpen}
        onClose={() => setIsMyProfileOpen(false)}
        activeRadius={radiusKm}
        setRadius={setRadiusKm}
      />

      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        unreadCount={unreadCount}
      />

      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
