import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Image, Trash2, History, Palette, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PRESET_BACKGROUNDS = [
  { label: 'Default', value: 'default', bg: 'from-zinc-900 to-black' },
  { label: 'Midnight', value: 'midnight', bg: 'from-slate-900 to-black' },
  { label: 'Abyss', value: 'abyss', bg: 'from-zinc-950 to-neutral-950' },
  { label: 'Void', value: 'void', bg: 'from-neutral-900 to-stone-950' },
  { label: 'Ocean', value: 'ocean', bg: 'from-blue-950 to-black' },
  { label: 'Forest', value: 'forest', bg: 'from-emerald-950 to-black' },
];

export default function SettingsPanel({ settings, onSettingsChange, onClearHistory, historyCount }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b border-zinc-800/50">
        <Settings className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-white">Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Background Presets */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Background Theme</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_BACKGROUNDS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onSettingsChange({ ...settings, background: preset.value, customBgUrl: '' })}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 h-14 bg-gradient-to-br ${preset.bg} ${
                  settings.background === preset.value
                    ? 'border-cyan-500 shadow-lg shadow-cyan-500/20'
                    : 'border-zinc-700/50 hover:border-zinc-500'
                }`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white/70 font-medium">
                  {preset.label}
                </span>
                {settings.background === preset.value && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Background Image */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Custom Background URL</span>
          </div>
          <Input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={settings.customBgUrl || ''}
            onChange={(e) => onSettingsChange({ ...settings, customBgUrl: e.target.value, background: e.target.value ? 'custom' : settings.background })}
            className="bg-zinc-900/50 border-zinc-700/50 text-white placeholder:text-zinc-600 text-sm focus-visible:ring-cyan-500/50"
          />
          {settings.customBgUrl && (
            <div
              className="mt-2 h-20 rounded-lg border border-zinc-700/50 bg-cover bg-center"
              style={{ backgroundImage: `url(${settings.customBgUrl})` }}
            />
          )}
        </div>

        {/* History Settings */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">History</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
              <div>
                <Label className="text-sm text-white">Save Browsing History</Label>
                <p className="text-xs text-zinc-500 mt-0.5">Track visited sites</p>
              </div>
              <Switch
                checked={settings.saveHistory !== false}
                onCheckedChange={(val) => onSettingsChange({ ...settings, saveHistory: val })}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <button
              onClick={onClearHistory}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
            >
              <div className="text-left">
                <p className="text-sm text-white group-hover:text-red-400 transition-colors">Clear All History</p>
                <p className="text-xs text-zinc-500">{historyCount} {historyCount === 1 ? 'entry' : 'entries'} saved</p>
              </div>
              <Trash2 className="w-4 h-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
