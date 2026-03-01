import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Clock, Trash2, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import moment from 'moment';

export default function HistoryPanel({ history, onSelect, onDelete, onClear }) {
  if (!history || history.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
          <History className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-500 text-sm">No browsing history yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-white">Recent</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10"
        >
          Clear all
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group relative flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-all duration-200"
                onClick={() => onSelect(item.url)}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    {item.title || new URL(item.url).hostname}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{moment(item.visited_at || item.created_date).fromNow()}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
