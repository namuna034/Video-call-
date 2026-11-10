import React, { useState } from 'react';
import { UserProfile } from '../data/mockUsers';
import { MessageCircle, Hand, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface UserCardProps {
  user: UserProfile;
  onOpenChat: (user: UserProfile) => void;
  onViewProfile: (user: UserProfile) => void;
  onSendWave: (user: UserProfile) => void;
  hasWaved: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onOpenChat,
  onViewProfile,
  onSendWave,
  hasWaved,
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  const isActiveNow = user.activeStatus === 'Active now';

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
      {/* Top Section: Avatar & Essential Identity */}
      <div>
        <div className="flex items-start gap-3.5">
          {/* Avatar with click to profile */}
          <button
            onClick={() => onViewProfile(user)}
            className="relative shrink-0 rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-rose-500"
            title={`View ${user.name}'s profile`}
          >
            {imageLoaded ? (
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                onError={() => setImageLoaded(false)}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center text-slate-800 dark:text-slate-100 font-bold text-xl">
                {user.name.charAt(0)}
              </div>
            )}

            {/* Active status indicator badge */}
            <span
              className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                isActiveNow ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
              title={user.activeStatus}
            />
          </button>

          {/* User Name, Distance & Neighborhood */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => onViewProfile(user)}
                className="text-left font-bold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors truncate"
              >
                {user.name}, {user.age}
              </button>

              <span className="shrink-0 text-xs font-mono tabular-nums font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
                {user.distanceKm} km
              </span>
            </div>

            {/* Clean unboxed metadata with typographic separators */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="truncate max-w-[120px]">{user.neighborhood}</span>
              <span aria-hidden="true">·</span>
              <span className={isActiveNow ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
                {user.activeStatus}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-1 font-medium">
              {user.occupation}
            </p>
          </div>
        </div>

        {/* Short Headline / Bio */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3.5 line-clamp-2 leading-relaxed">
          {user.headline}
        </p>

        {/* Clean unboxed interests with typographic separators */}
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {user.interests.slice(0, 3).map((interest, idx) => (
            <React.Fragment key={interest}>
              <span className="text-slate-700 dark:text-slate-300">{interest}</span>
              {idx < 2 && <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>}
            </React.Fragment>
          ))}
          {user.interests.length > 3 && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-400 dark:text-slate-500 font-mono">+{user.interests.length - 3}</span>
            </>
          )}
        </div>

        {/* Hangout Spot kicker */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
          <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="truncate">Hangout: {user.hangoutSpot}</span>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onOpenChat(user)}
          className="flex-1 min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-500 rounded-xl transition-all shadow-xs active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>

        <button
          onClick={() => onViewProfile(user)}
          className="px-3 min-h-[38px] flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          Profile
        </button>

        <button
          onClick={() => onSendWave(user)}
          title={hasWaved ? 'Wave sent!' : 'Send wave to say hi'}
          disabled={hasWaved}
          className={`p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-all ${
            hasWaved
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 active:scale-95'
          }`}
        >
          {hasWaved ? <CheckCircle2 className="w-4 h-4" /> : <Hand className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
