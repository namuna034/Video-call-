import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../data/mockUsers';
import {
  X,
  Send,
  Smile,
  Image as ImageIcon,
  CheckCheck,
  MapPin,
  Sparkles,
  Phone,
  Video,
  Info,
} from 'lucide-react';

interface ChatModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: (user: UserProfile) => void;
  chatHistory: Record<string, ChatMessage[]>;
  setChatHistory: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
}

const QUICK_EMOJIS = ['👋', '☕', '🏸', '📸', '✨', '🍕', '🚴‍♂️', '😊'];

export const ChatModal: React.FC<ChatModalProps> = ({
  user,
  isOpen,
  onClose,
  onViewProfile,
  chatHistory,
  setChatHistory,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [simulatedCallStatus, setSimulatedCallStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get or initialize conversation with default welcome icebreaker
  const messages = chatHistory[user.id] || [
    {
      id: `welcome-${user.id}`,
      senderId: user.id,
      text: `Hey! Saw you are nearby in ${user.neighborhood.split(',')[0]} too. Hope you're having a good day!`,
      timestamp: 'Just now',
      status: 'read',
    },
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    const updated = [...messages, newMsg];
    setChatHistory((prev) => ({
      ...prev,
      [user.id]: updated,
    }));
    setInputText('');
    setShowEmojiPicker(false);

    // Trigger simulated typing indicator and real-time reply
    setIsTyping(true);
    const replyDelay = 1400 + Math.random() * 1200;

    setTimeout(() => {
      setIsTyping(false);

      // Contextual reply generation
      let replyText = '';
      const lower = text.toLowerCase();

      if (lower.includes('coffee') || lower.includes('chai') || lower.includes('cafe')) {
        replyText = `Totally! I was actually heading to ${user.hangoutSpot} later today. The brews there are always spot on!`;
      } else if (lower.includes('wave') || lower.includes('hi') || lower.includes('hey') || lower.includes('hello')) {
        replyText = `Hey Kabir! Great to connect. Are you usually around ${user.neighborhood.split(',')[0]}?`;
      } else if (lower.includes('running') || lower.includes('badminton') || lower.includes('cycling') || lower.includes('game') || lower.includes('photo')) {
        replyText = `That sounds awesome! ${user.lookingFor}. We should definitely link up soon!`;
      } else {
        // Pick one from profile's tailored response pool
        const pool = user.defaultResponses;
        replyText = pool[Math.floor(Math.random() * pool.length)];
      }

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: user.id,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };

      setChatHistory((prev) => ({
        ...prev,
        [user.id]: [...(prev[user.id] || updated), replyMsg],
      }));
    }, replyDelay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const triggerCallSimulation = (type: 'voice' | 'video') => {
    setSimulatedCallStatus(`Connecting simulated ${type} call with ${user.name.split(' ')[0]}...`);
    setTimeout(() => {
      setSimulatedCallStatus(`${user.name.split(' ')[0]} is currently offline for calls. Left direct ping.`);
      setTimeout(() => setSimulatedCallStatus(null), 3000);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onViewProfile(user)}
              className="relative shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
              title="View full profile"
            >
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 ${
                  user.activeStatus === 'Active now' ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onViewProfile(user)}
                  className="font-bold text-sm text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors truncate"
                >
                  {user.name}
                </button>
                <span className="text-[11px] font-mono tabular-nums text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/50 px-1.5 rounded">
                  {user.distanceKm} km
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isTyping ? (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">typing...</span>
                ) : (
                  `${user.neighborhood} · ${user.activeStatus}`
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <button
              onClick={() => triggerCallSimulation('voice')}
              title="Voice call"
              className="p-2 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => triggerCallSimulation('video')}
              title="Video call"
              className="p-2 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewProfile(user)}
              title="Profile details"
              className="p-2 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close chat"
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Temporary Call Toast */}
        {simulatedCallStatus && (
          <div className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs px-4 py-2 border-b border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
            <span>{simulatedCallStatus}</span>
            <button onClick={() => setSimulatedCallStatus(null)} className="font-bold underline ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40">
          {/* Proximity Pill info */}
          <div className="flex justify-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/80 shadow-2xs">
              📍 Connected via local radar ({user.distanceKm} km away in {user.neighborhood.split(',')[0]})
            </span>
          </div>

          {/* Quick Icebreaker Trigger Banner */}
          {messages.length <= 1 && (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Suggested icebreaker:</span>
              </div>
              <p className="text-amber-900/80 dark:text-amber-200/80 italic">
                "{user.quickIcebreaker}"
              </p>
              <button
                onClick={() => handleSendMessage(user.quickIcebreaker)}
                className="mt-1 px-2.5 py-1 text-[11px] font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-300/80 rounded-lg transition-colors"
              >
                Send this question
              </button>
            </div>
          )}

          {/* Messages List */}
          {messages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[82%] px-4 py-2.5 text-xs sm:text-sm rounded-2xl leading-relaxed ${
                    isMe
                      ? 'bg-rose-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/70 dark:border-slate-700/70 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                <div className="flex items-center gap-1 px-1 text-[10px] text-slate-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-rose-500" />}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover"
              />
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Quick Bar (optional toggle) */}
        {showEmojiPicker && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setInputText((prev) => prev + emoji)}
                className="text-lg p-1 hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              aria-label="Add emoji"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleSendMessage('📷 [Shared a photo of cafe latte]')}
              aria-label="Attach photo"
              title="Share photo simulation"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${user.name.split(' ')[0]}...`}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-slate-400"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 transition-all shadow-xs active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
