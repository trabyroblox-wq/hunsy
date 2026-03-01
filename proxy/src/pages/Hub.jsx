import React, { useState, useCallback, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe2, History, ChevronLeft, ChevronRight, Settings, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import UrlInput from '@/components/proxy/UrlInput';
import ProxyFrame from '@/components/proxy/ProxyFrame';
import HistoryPanel from '@/components/proxy/HistoryPanel';
import SettingsPanel from '@/components/proxy/SettingsPanel';

const BG_GRADIENTS = {
  default:  'from-zinc-900 to-black',
  midnight: 'from-slate-900 to-black',
  abyss:    'from-zinc-950 to-neutral-950',
  void:     'from-neutral-900 to-stone-950',
  ocean:    'from-blue-950 to-black',
  forest:   'from-emerald-950 to-black',
};

export default function Hub() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('history'); // 'history' | 'settings'
  const [frameKey, setFrameKey] = useState(0);
  const [settings, setSettings] = useState({
    background: 'default',
    customBgUrl: '',
    saveHistory: true,
  });

  const PHRASES = [
    'Web Proxy',
    'To Infinity and...',
    'Waffles.',
    'Made by Maker 🫡',
    "i made this in 5 hours AND U BETTER LIKE IT",
    "there is no password. ur welcome.",
    "only up for 1 month bc im mean <o/",
    "never say i didn't do anything for u",
    "COMPLY.",
    "remember. 🫵",
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseAnim, setPhraseAnim] = useState(false);

  const playClick = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  };

  const handlePhraseClick = () => {
    playClick();
    setPhraseAnim(true);
    setTimeout(() => {
      setPhraseIndex(i => (i + 1) % PHRASES.length);
      setPhraseAnim(false);
    }, 150);
  };

  const queryClient = useQueryClient();

  const { data: history = [] } = useQuery({
    queryKey: ['proxyHistory'],
    queryFn: () => base44.entities.ProxyHistory.list('-created_date', 50),
  });

  const addToHistory = useMutation({
    mutationFn: (url) => base44.entities.ProxyHistory.create({
      url,
      visited_at: new Date().toISOString(),
      title: new URL(url).hostname
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proxyHistory'] }),
  });

  const deleteFromHistory = useMutation({
    mutationFn: (id) => base44.entities.ProxyHistory.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proxyHistory'] }),
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      for (const item of history) {
        await base44.entities.ProxyHistory.delete(item.id);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proxyHistory'] }),
  });

  const handleNavigate = useCallback((url) => {
    setIsLoading(true);
    setCurrentUrl(url);
    if (settings.saveHistory !== false) {
      addToHistory.mutate(url);
    }
    setTimeout(() => setIsLoading(false), 1000);
  }, [addToHistory, settings.saveHistory]);

  const handleClose = () => setCurrentUrl('');
  const handleRefresh = () => setFrameKey(prev => prev + 1);

  // Background style
  const bgStyle = settings.customBgUrl
    ? { backgroundImage: `url(${settings.customBgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  const bgClass = settings.customBgUrl
    ? 'bg-black'
    : `bg-gradient-to-br ${BG_GRADIENTS[settings.background] || BG_GRADIENTS.default}`;

  return (
    <div className={`min-h-screen ${bgClass} text-white overflow-hidden`} style={bgStyle}>
      {/* Overlay for custom bg */}
      {settings.customBgUrl && (
        <div className="fixed inset-0 bg-black/60 pointer-events-none" />
      )}

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />
      {/* Glow blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative flex h-screen">
        {/* Sidebar */}
        <motion.div
          className="relative bg-zinc-900/70 backdrop-blur-xl border-r border-zinc-800/60 flex-shrink-0 overflow-hidden"
          animate={{ width: showSidebar ? 300 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {showSidebar && (
            <div className="w-[300px] h-full flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-zinc-800/60">
                <button
                  onClick={() => setSidebarTab('history')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-medium transition-all ${
                    sidebarTab === 'history'
                      ? 'text-white border-b-2 border-cyan-500 bg-zinc-800/30'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  History
                </button>
                <button
                  onClick={() => setSidebarTab('settings')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-medium transition-all ${
                    sidebarTab === 'settings'
                      ? 'text-white border-b-2 border-purple-500 bg-zinc-800/30'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {sidebarTab === 'history' ? (
                  <HistoryPanel
                    history={history}
                    onSelect={handleNavigate}
                    onDelete={(id) => deleteFromHistory.mutate(id)}
                    onClear={() => clearHistory.mutate()}
                  />
                ) : (
                  <SettingsPanel
                    settings={settings}
                    onSettingsChange={setSettings}
                    onClearHistory={() => clearHistory.mutate()}
                    historyCount={history.length}
                  />
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-1/2 -translate-y-1/2 z-10 h-10 w-5 rounded-l-none rounded-r-md bg-zinc-800/80 hover:bg-zinc-700/80 border border-l-0 border-zinc-700/50 text-zinc-400 hover:text-white transition-all p-0"
          style={{ left: showSidebar ? 300 : 0 }}
        >
          {showSidebar ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </Button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {!currentUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              {/* Logo */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-2xl opacity-20" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                      <Globe2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                        HUB
                      </h1>
                      <p
                        onClick={handlePhraseClick}
                        className="text-zinc-500 text-sm tracking-widest uppercase cursor-pointer select-none transition-all duration-150 hover:text-zinc-300 active:scale-95"
                        style={{
                          opacity: phraseAnim ? 0 : 1,
                          transform: phraseAnim ? 'translateY(4px)' : 'translateY(0)',
                          transition: 'opacity 0.15s, transform 0.15s',
                        }}
                        title="click me ;)"
                      >
                        {PHRASES[phraseIndex]}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* URL Input */}
              <UrlInput onNavigate={handleNavigate} isLoading={isLoading} />

              {/* Credits Link */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Link
                  to={createPageUrl('Credits')}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-cyan-400 transition-colors"
                >
                  <Star className="w-3 h-3" />
                  Credits
                </Link>
              </motion.div>

              {/* Features */}
              <motion.div
                className="mt-16 grid grid-cols-3 gap-8 max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-cyan-500/8 border border-cyan-500/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-cyan-500" />
                  </div>
                  <p className="text-sm text-zinc-500">Lightning Fast</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/8 border border-purple-500/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <p className="text-sm text-zinc-500">Secure Browsing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-pink-500/8 border border-pink-500/10 flex items-center justify-center">
                    <History className="w-6 h-6 text-pink-500" />
                  </div>
                  <p className="text-sm text-zinc-500">History Tracking</p>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 p-4">
              <ProxyFrame
                key={frameKey}
                url={currentUrl}
                onClose={handleClose}
                onRefresh={handleRefresh}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
