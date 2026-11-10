import React from 'react';
import { UserProfile, ChatMessage } from '../data/mockUsers';
import { MessageSquare, ArrowRight, Sparkles, MapPin } from 'lucide-react';

interface MessagesListViewProps {
  users: UserProfile[];
  chatHistory: Record<string, ChatMessage[]>;
  onOpenChat: (user: UserProfile) => void;
  onViewProfile: (user: UserProfile) => void;
}

export const MessagesListView: React.FC<MessagesListViewProps> = ({
  users,
  chatHistory,
  onOpenChat,
  onViewProfile,
}) => {
  // Profiles with existing messages
  const activeChatUserIds = Object.keys(chatHistory);

  const activeChatProfiles = users.filter((u) => activeChatUserIds.includes(u.id));
  const suggestedProfiles = users.filter((u) => !activeChatUserIds.includes(u.id)).slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Direct Messages
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time chat with people currently in your neighborhood
          </p>
        </div>
      </div>

      {/* Active Conversations List */}
      {activeChatProfiles.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-xs overflow-hidden">
          {activeChatProfiles.map((user) => {
            const thread = chatHistory[user.id] || [];
            const lastMsg = thread[thread.length - 1];

            return (
              <div
                key={user.id}
                onClick={() => onOpenChat(user)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                        user.activeStatus === 'Active now' ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-rose-600 dark:text-rose-400 font-medium">
                        {user.distanceKm} km
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5 font-normal">
                      {lastMsg ? (
                        <span>
                          {lastMsg.senderId === 'me' ? 'You: ' : ''}
                          {lastMsg.text}
                        </span>
                      ) : (
                        `Connected from ${user.neighborhood}`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {lastMsg ? lastMsg.timestamp : 'Active'}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium hover:underline flex items-center gap-1 text-[11px]">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            No active conversations yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Start a conversation with nearby people on the radar feed or click any profile below to send a quick wave.
          </p>
        </div>
      )}

      {/* Recommended People Nearby to Say Hi */}
      {suggestedProfiles.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Nearby People Waiting to Connect</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestedProfiles.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="min-w-0 text-xs">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {user.name}, {user.age}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 truncate">
                      {user.distanceKm} km · {user.neighborhood.split(',')[0]}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenChat(user)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 dark:hover:bg-rose-700 rounded-lg shrink-0 transition-colors"
                >
                  Say Hi
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
