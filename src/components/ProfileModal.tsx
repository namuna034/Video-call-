import React, { useState } from 'react';
import { UserProfile } from '../data/mockUsers';
import {
  X,
  MessageCircle,
  Hand,
  MapPin,
  Briefcase,
  Languages,
  Coffee,
  Sparkles,
  Compass,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (user: UserProfile) => void;
  onSendWave: (user: UserProfile) => void;
  hasWaved: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onOpenChat,
  onSendWave,
  hasWaved,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen || !user) return null;

  const photos = user.gallery && user.gallery.length > 0 ? user.gallery : [user.avatar];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header with Close Button */}
        <div className="relative">
          {/* Photo Showcase Carousel */}
          <div className="relative w-full h-72 sm:h-80 bg-slate-900 overflow-hidden">
            <img
              src={photos[activePhotoIdx]}
              alt={`${user.name} photo ${activePhotoIdx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Measured Scrim for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 pointer-events-none" />

            {/* Carousel navigation controls if multiple photos */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-xs transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-xs transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close profile"
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-xs transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Distance badge top left */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-mono tabular-nums border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{user.distanceKm} km away</span>
            </div>

            {/* Bottom Overlay Title & Status */}
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {user.name}, {user.age}
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title={user.activeStatus} />
              </div>
              <p className="text-xs text-slate-200 mt-0.5 flex items-center gap-1.5">
                <span>{user.neighborhood}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-300">{user.activeStatus}</span>
              </p>
            </div>
          </div>

          {/* Photo Dots */}
          {photos.length > 1 && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIdx(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activePhotoIdx === i ? 'bg-white w-5' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Profile Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Headline & Occupation */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{user.occupation}</span>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
              "{user.headline}"
            </p>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              About
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {user.bio}
            </p>
          </div>

          {/* Looking For Callout */}
          <div className="p-4 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-900 dark:text-rose-300">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Up For Near You</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-1">
              {user.lookingFor}
            </p>
          </div>

          {/* Favorite Hangout Spot */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <Coffee className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Go-To Local Spot:
              </span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                {user.hangoutSpot}
              </p>
            </div>
          </div>

          {/* Interests (clean unboxed items) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Passions & Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Languages Spoken */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Languages className="w-4 h-4 text-slate-400" />
            <span>Spoken languages: {user.languages.join(', ')}</span>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenChat(user);
            }}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 rounded-xl transition-all shadow-sm active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message {user.name.split(' ')[0]}</span>
          </button>

          <button
            onClick={() => onSendWave(user)}
            disabled={hasWaved}
            className={`min-h-[44px] px-4 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium rounded-xl transition-all ${
              hasWaved
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40'
            }`}
          >
            {hasWaved ? <CheckCircle2 className="w-4 h-4" /> : <Hand className="w-4 h-4" />}
            <span>{hasWaved ? 'Waved!' : 'Send Wave 👋'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
