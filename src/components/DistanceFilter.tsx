import React from 'react';
import { SlidersHorizontal, MapPin, Zap, Coffee, Palette, Activity } from 'lucide-react';

interface DistanceFilterProps {
  radiusKm: number;
  setRadiusKm: (radius: number) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeCount: number;
  totalNearby: number;
  onlyActiveNow: boolean;
  setOnlyActiveNow: (active: boolean) => void;
}

const PRESET_DISTANCES = [1, 3, 5, 10, 15, 25];

const CATEGORIES = [
  { id: 'all', label: 'All Vibes', icon: SlidersHorizontal },
  { id: 'coffee', label: 'Coffee & Cafes', icon: Coffee },
  { id: 'creative', label: 'Art & Photography', icon: Palette },
  { id: 'fitness', label: 'Running & Sports', icon: Activity },
  { id: 'tech', label: 'Tech & Founders', icon: Zap },
];

export const DistanceFilter: React.FC<DistanceFilterProps> = ({
  radiusKm,
  setRadiusKm,
  selectedCategory,
  setSelectedCategory,
  activeCount,
  totalNearby,
  onlyActiveNow,
  setOnlyActiveNow,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        {/* Left: Distance Slider & Presets */}
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              Search Radius
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              <strong className="font-mono tabular-nums text-sm text-slate-900 dark:text-white font-bold">
                {radiusKm.toFixed(1)} km
              </strong>{' '}
              ·{' '}
              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                {activeCount} {activeCount === 1 ? 'person' : 'people'}
              </span>{' '}
              found
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
              aria-label="Filter radius in kilometers"
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            />
          </div>

          {/* Quick preset selector buttons */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-1">Presets:</span>
            {PRESET_DISTANCES.map((dist) => (
              <button
                key={dist}
                onClick={() => setRadiusKm(dist)}
                className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded-md transition-all ${
                  radiusKm === dist
                    ? 'bg-rose-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {dist} km
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Status Toggle Switch */}
        <div className="flex items-center gap-3 md:pl-6 md:border-l border-slate-100 dark:border-slate-800 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyActiveNow}
              onChange={(e) => setOnlyActiveNow(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-400 dark:peer-focus:ring-rose-700 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-rose-600 relative"></div>
            <span>Active Now Only</span>
          </label>
        </div>
      </div>

      {/* Category / Interest Filters (Functional button tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pt-3.5 pb-0.5 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
