import React, { useState, useMemo } from 'react';
import { UserProfile } from '../data/mockUsers';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, MessageCircle, Eye, Hand, Layers } from 'lucide-react';

interface MapViewProps {
  users: UserProfile[];
  radiusKm: number;
  onOpenChat: (user: UserProfile) => void;
  onViewProfile: (user: UserProfile) => void;
  onSendWave: (user: UserProfile) => void;
  wavedUserIds: string[];
}

export const MapView: React.FC<MapViewProps> = ({
  users,
  radiusKm,
  onOpenChat,
  onViewProfile,
  onSendWave,
  wavedUserIds,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(users[0] || null);

  const nearbyUsers = useMemo(() => {
    return users.filter((u) => u.distanceKm <= radiusKm);
  }, [users, radiusKm]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.8, +(z + 0.2).toFixed(1)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.7, +(z - 0.2).toFixed(1)));
  const handleReset = () => setZoomLevel(1);

  return (
    <div className="relative w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md min-h-[560px] flex flex-col">
      {/* Map Top Bar Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2 shadow-xs">
          <Navigation className="w-3.5 h-3.5 text-rose-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-100">Bengaluru East Area Map</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {nearbyUsers.length} active pins
          </span>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="pointer-events-auto flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset view"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulated Map Canvas Container */}
      <div className="relative w-full h-[560px] overflow-hidden bg-[#0f172a] select-none flex items-center justify-center">
        {/* Scalable Map Surface */}
        <div
          className="relative w-[850px] h-[650px] transition-transform duration-200 origin-center shrink-0"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* SVG Map Layout: Roads, Parks, Water, Metro line */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="roadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Base grid */}
            <rect width="100%" height="100%" fill="#090d16" />
            <rect width="100%" height="100%" fill="url(#roadGrid)" />

            {/* Water body: Ulsoor Lake */}
            <path
              d="M 120 180 Q 200 140 220 220 T 160 300 Q 110 260 120 180 Z"
              fill="#083344"
              stroke="#0e7490"
              strokeWidth="2"
              opacity="0.85"
            />
            <text x="145" y="240" fill="#38bdf8" fontSize="11" fontFamily="monospace" opacity="0.6">
              Ulsoor Lake
            </text>

            {/* Green Parks */}
            <rect x="290" y="380" width="130" height="90" rx="16" fill="#064e3b" opacity="0.75" />
            <text x="310" y="430" fill="#34d399" fontSize="10" fontFamily="sans-serif" opacity="0.7">
              Defence Colony Park
            </text>

            <rect x="520" y="160" width="160" height="80" rx="20" fill="#064e3b" opacity="0.6" />
            <text x="545" y="205" fill="#34d399" fontSize="10" fontFamily="sans-serif" opacity="0.7">
              HAL Enclave Greens
            </text>

            {/* Major Arterial Roads */}
            {/* 100ft Road */}
            <line x1="100" y1="460" x2="720" y2="280" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
            <line x1="100" y1="460" x2="720" y2="280" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,6" opacity="0.6" />
            <text x="390" y="360" fill="#94a3b8" fontSize="10" transform="rotate(-16 390 360)">
              100 Feet Road
            </text>

            {/* 12th Main Road */}
            <line x1="420" y1="80" x2="420" y2="580" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <text x="430" y="160" fill="#94a3b8" fontSize="10" transform="rotate(90 430 160)">
              12th Main Indiranagar
            </text>

            {/* Old Airport Road */}
            <line x1="80" y1="520" x2="780" y2="520" stroke="#334155" strokeWidth="9" />
            <text x="590" y="512" fill="#94a3b8" fontSize="10">
              Old Airport Rd
            </text>

            {/* Purple Metro Line */}
            <path
              d="M 60 360 L 320 330 L 540 310 L 780 290"
              fill="none"
              stroke="#a855f7"
              strokeWidth="4"
              opacity="0.85"
            />
            {/* Metro Stations */}
            <circle cx="320" cy="330" r="5" fill="#ffffff" stroke="#a855f7" strokeWidth="3" />
            <text x="300" y="318" fill="#e9d5ff" fontSize="9">
              CMH Rd Metro
            </text>

            <circle cx="540" cy="310" r="5" fill="#ffffff" stroke="#a855f7" strokeWidth="3" />
            <text x="520" y="298" fill="#e9d5ff" fontSize="9">
              Indiranagar Metro
            </text>

            {/* Search Radius Circle centered around You */}
            <circle
              cx="420"
              cy="340"
              r={Math.min(320, radiusKm * 28)}
              fill="rgba(244, 63, 94, 0.05)"
              stroke="rgba(244, 63, 94, 0.5)"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
          </svg>

          {/* Center User ("You" - Kabir) */}
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: '420px', top: '340px' }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-rose-600 border-2 border-white shadow-xl" />
              <div className="absolute w-12 h-12 rounded-full border-2 border-rose-500/40 animate-ping" />
            </div>
            <div className="mt-1 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md border border-slate-700 whitespace-nowrap">
              You (Indiranagar)
            </div>
          </div>

          {/* User Pins */}
          {nearbyUsers.map((user) => {
            // Coordinate mapping (based on percentage in mapCoords)
            const posX = (user.mapCoords.x / 100) * 850;
            const posY = (user.mapCoords.y / 100) * 650;
            const isSelected = selectedUser?.id === user.id;

            return (
              <div
                key={user.id}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-transform"
                style={{ left: `${posX}px`, top: `${posY}px` }}
              >
                <button
                  onClick={() => setSelectedUser(user)}
                  aria-label={`View ${user.name}`}
                  className={`group relative flex flex-col items-center focus:outline-none transition-all ${
                    isSelected ? 'scale-115 z-40' : 'hover:scale-110'
                  }`}
                >
                  {/* Pin avatar */}
                  <div
                    className={`relative rounded-2xl p-0.5 shadow-lg transition-all ${
                      isSelected
                        ? 'ring-4 ring-rose-500 bg-rose-500'
                        : 'bg-white hover:ring-2 hover:ring-rose-400'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover bg-slate-800"
                    />
                    <span
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${
                        user.activeStatus === 'Active now' ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  {/* Pin tag label */}
                  <div className="mt-1 flex items-center gap-1 bg-slate-900/95 text-white px-2 py-0.5 rounded-lg border border-slate-700 text-[10px] font-medium shadow-md whitespace-nowrap">
                    <span>{user.name.split(' ')[0]}</span>
                    <span className="text-rose-400 font-mono font-bold">{user.distanceKm}k</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected User Floating Mini Card at Bottom */}
        {selectedUser && (
          <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {selectedUser.name}, {selectedUser.age}
                    </h4>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      {selectedUser.distanceKm} km
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {selectedUser.neighborhood} · {selectedUser.activeStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onOpenChat(selectedUser)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all"
                >
                  Chat
                </button>
                <button
                  onClick={() => onViewProfile(selectedUser)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
