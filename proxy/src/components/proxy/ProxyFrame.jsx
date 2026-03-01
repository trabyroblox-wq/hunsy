import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, X, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProxyFrame({ url, onClose, onRefresh }) {
  if (!url) return null;

  return (
    <motion.div 
      className="w-full h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Browser Chrome */}
      <div className="flex items-center gap-3 p-3 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800/60 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors" onClick={onClose} />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        
        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700/30">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-500 to-purple-500" />
          <span className="text-sm text-slate-400 truncate flex-1">{url}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open(url, '_blank')}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Frame Content */}
      <div className="flex-1 bg-white rounded-b-xl overflow-hidden">
        <iframe
          src={url}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="Proxy Frame"
        />
      </div>
    </motion.div>
  );
}
