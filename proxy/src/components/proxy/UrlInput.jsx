import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UrlInput({ onNavigate, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    onNavigate(processedUrl);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />
        <div className="relative flex items-center gap-3 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/60 rounded-xl p-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-slate-600/30">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <Input
            type="text"
            placeholder="Enter URL to browse..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-500 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="mr-2">Browse</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
