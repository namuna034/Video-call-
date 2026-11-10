import React, { useState } from 'react';
import { X, MapPin, Radio, Check, Sparkles } from 'lucide-react';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRadius: number;
  setRadius: (r: number) => void;
}

const NEIGHBORHOOD_OPTIONS = [
  'Indiranagar 100ft Rd, Bangalore',
  'Koramangala 4th Block, Bangalore',
  'HSR Layout Sector 1, Bangalore',
  'Church Street, Bangalore',
  'Bandra West, Mumbai',
  'Hauz Khas Village, Delhi',
];

export const MyProfileModal: React.FC<MyProfileModalProps> = ({
  isOpen,
  onClose,
  activeRadius,
  setRadius,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(NEIGHBORHOOD_OPTIONS[0]);
  const [currentVibe, setCurrentVibe] = useState('Open for coffee & startup ideas ☕');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              My Discovery Broadcast
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Identity card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
              K
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Kabir</h4>
              <p className="text-slate-500 dark:text-slate-400">Broadcasting live in {selectedLocation.split(',')[0]}</p>
            </div>
          </div>

          {/* Change Location Area */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Simulated Neighborhood
            </label>
            <div className="space-y-1.5">
              {NEIGHBORHOOD_OPTIONS.slice(0, 4).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                    selectedLocation === loc
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{loc}</span>
                  </span>
                  {selectedLocation === loc && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Status Message */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Vibe / Status
            </label>
            <input
              type="text"
              value={currentVibe}
              onChange={(e) => setCurrentVibe(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
            />
          </div>

          {/* Radius Broadcast */}
          <div>
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Visible Within Radius</span>
              <span className="font-mono tabular-nums text-rose-600">{activeRadius} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={activeRadius}
              onChange={(e) => setRadius(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Broadcasting!</span>
              </>
            ) : (
              <span>Update Status</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
