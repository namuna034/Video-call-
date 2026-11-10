import React, { useState, useMemo } from 'react';
import { UserProfile } from '../data/mockUsers';
import { MessageCircle, User, Compass, Zap, Hand, Pause, Play, Eye } from 'lucide-react';

interface RadarViewProps {
  users: UserProfile[];
  radiusKm: number;
  onOpenChat: (user: UserProfile) => void;
  onViewProfile: (user: UserProfile) => void;
  onSendWave: (user: UserProfile) => void;
  wavedUserIds: string[];
}

export const RadarView: React.FC<RadarViewProps> = ({
  users,
  radiusKm,
  onOpenChat,
  onViewProfile,
  onSendWave,
  wavedUserIds,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(users[0] || null);
  const [isSweeping, setIsSweeping] = useState<boolean>(true);

  // Filter users inside current radius
  const nearbyUsers = useMemo(() => {
    return users.filter((u) => u.distanceKm <= radiusKm);
  }, [users, radiusKm]);

  // Compute ring labels based on current radius
  const rings = [
    { ratio: 0.25, label: `${(radiusKm * 0.25).toFixed(1)} km` },
    { ratio: 0.5, label: `${(radiusKm * 0.5).toFixed(1)} km` },
    { ratio: 0.75, label: `${(radiusKm * 0.75).toFixed(1)} km` },
    { ratio: 1.0, label: `${radiusKm.toFixed(1)} km` },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
      {/* Radar Main HUD Screen */}
      <div className="flex-1 bg-slate-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-800 flex flex-col items-center justify-between relative overflow-hidden min-h-[520px]">
        {/* Subtle grid background texture */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(244, 63, 94, 0.15) 0, transparent 70%), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          }}
        />

        {/* Radar Controls Header */}
        <div className="w-full flex items-center justify-between z-10 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold tracking-wide text-rose-400">
              RADAR ACTIVE
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono tabular-nums">
              {nearbyUsers.length} targets within {radiusKm} km
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSweeping(!isSweeping)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-800 transition-colors"
            >
              {isSweeping ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isSweeping ? 'Pause Sweep' : 'Resume Sweep'}</span>
            </button>
          </div>
        </div>

        {/* Circular Radar Visual Container */}
        <div className="relative my-6 w-full max-w-[420px] aspect-square flex items-center justify-center">
          {/* Outer Border with Compass Cardinals */}
          <div className="absolute inset-0 rounded-full border border-rose-500/30 flex items-center justify-center">
            {/* Cardinal points */}
            <span className="absolute top-1 text-[10px] font-mono font-bold text-slate-400">N</span>
            <span className="absolute bottom-1 text-[10px] font-mono font-bold text-slate-400">S</span>
            <span className="absolute left-1.5 text-[10px] font-mono font-bold text-slate-400">W</span>
            <span className="absolute right-1.5 text-[10px] font-mono font-bold text-slate-400">E</span>
          </div>

          {/* Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-slate-800/80" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-full w-px bg-slate-800/80" />
          </div>

          {/* Concentric Distance Rings */}
          {rings.map((ring, idx) => (
            <div
              key={idx}
              className="absolute rounded-full border border-slate-700/60 pointer-events-none flex items-start justify-center"
              style={{
                width: `${ring.ratio * 100}%`,
                height: `${ring.ratio * 100}%`,
              }}
            >
              <span className="text-[9px] font-mono text-slate-500 -mt-2 bg-slate-950 px-1">
                {ring.label}
              </span>
            </div>
          ))}

          {/* Rotating Scanning Beam */}
          {isSweeping && (
            <div className="absolute inset-0 pointer-events-none animate-radar-sweep flex items-center justify-center">
              <div
                className="w-1/2 h-1/2 origin-bottom-right"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(244, 63, 94, 0.28) 50deg, rgba(244, 63, 94, 0.6) 60deg, transparent 61deg)',
                  borderTopRightRadius: '100%',
                }}
              />
            </div>
          )}

          {/* Center Point: "You" (Kabir) */}
          <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-rose-600 border-2 border-white shadow-lg" />
              <div className="absolute w-8 h-8 rounded-full border border-rose-500/50 animate-ping" />
            </div>
            <span className="mt-1 text-[10px] font-bold text-rose-300 bg-slate-900/90 px-1.5 py-0.5 rounded">
              You
            </span>
          </div>

          {/* User Blips on the Radar */}
          {nearbyUsers.map((user) => {
            // Polar to Cartesian conversion (radar radius is max 46% of container)
            const rad = ((user.angleDeg - 90) * Math.PI) / 180;
            const distanceRatio = Math.max(0.12, Math.min(0.95, user.distanceKm / radiusKm));
            // In percent from center:
            const percentX = 50 + Math.cos(rad) * (distanceRatio * 44);
            const percentY = 50 + Math.sin(rad) * (distanceRatio * 44);
            const isSelected = selectedUser?.id === user.id;

            return (
              <div
                key={user.id}
                className="absolute z-30 transition-transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${percentX}%`,
                  top: `${percentY}%`,
                }}
              >
                <button
                  onClick={() => setSelectedUser(user)}
                  onMouseEnter={() => setSelectedUser(user)}
                  aria-label={`Select ${user.name}`}
                  className={`group relative rounded-full p-0.5 focus:outline-none transition-all ${
                    isSelected
                      ? 'scale-125 ring-4 ring-rose-500 ring-offset-2 ring-offset-slate-950 z-40'
                      : 'hover:scale-115'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md bg-slate-800"
                  />
                  {/* Distance label pill on blip */}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono tabular-nums font-semibold bg-slate-900/95 text-slate-200 px-1 rounded border border-slate-700 whitespace-nowrap">
                    {user.distanceKm}k
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer radar metrics */}
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 z-10">
          <span>Target Mode: Dynamic Polar Grid</span>
          <span>Center: Indiranagar, Bengaluru</span>
        </div>
      </div>

      {/* Selected Target Preview & Action Sidebar */}
      <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
        {selectedUser ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Target Lock
              </span>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded">
                {selectedUser.distanceKm} km away
              </span>
            </div>

            {/* Profile Avatar & Primary info */}
            <div className="flex items-center gap-3.5">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {selectedUser.name}, {selectedUser.age}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {selectedUser.neighborhood}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  {selectedUser.activeStatus}
                </p>
              </div>
            </div>

            {/* Role & Bio */}
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {selectedUser.occupation}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-3">
                {selectedUser.bio}
              </p>
            </div>

            {/* Looking for */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Currently up for:
              </span>
              <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                {selectedUser.lookingFor}
              </p>
            </div>

            {/* Interests unboxed */}
            <div className="space-y-1 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">Interests:</span>
              <div className="flex flex-wrap gap-1.5 text-slate-700 dark:text-slate-300">
                {selectedUser.interests.map((interest, i) => (
                  <span key={interest} className="inline-flex items-center">
                    {interest}
                    {i < selectedUser.interests.length - 1 && (
                      <span className="ml-1.5 text-slate-300 dark:text-slate-700">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
            <Compass className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">No user selected</p>
            <p className="text-xs text-slate-500 mt-1">Tap any radar blip to inspect profile</p>
          </div>
        )}

        {/* Action Buttons */}
        {selectedUser && (
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onOpenChat(selectedUser)}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct Message {selectedUser.name.split(' ')[0]}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => onViewProfile(selectedUser)}
                className="flex-1 min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full Profile</span>
              </button>

              <button
                onClick={() => onSendWave(selectedUser)}
                disabled={wavedUserIds.includes(selectedUser.id)}
                className={`flex-1 min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                  wavedUserIds.includes(selectedUser.id)
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>{wavedUserIds.includes(selectedUser.id) ? 'Waved!' : 'Wave 👋'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
