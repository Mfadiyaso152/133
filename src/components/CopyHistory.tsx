import React from 'react';
import { ClipboardItem } from '../types';
import { Copy, Trash2, X, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CopyHistoryProps {
  lang: 'ar' | 'en';
  isOpen: boolean;
  onClose: () => void;
  history: ClipboardItem[];
  onSelect: (item: ClipboardItem) => void;
  onClear: () => void;
  onDeleteOne: (id: string) => void;
}

export const CopyHistory: React.FC<CopyHistoryProps> = ({
  lang,
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
  onDeleteOne,
}) => {
  const isAr = lang === 'ar';
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyAgain = (item: ClipboardItem) => {
    onSelect(item);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer / Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed inset-x-4 top-16 bottom-6 sm:inset-x-auto sm:right-6 sm:w-[450px] sm:top-20 sm:bottom-10 z-50 glass-card rounded-3xl p-5 border border-white/15 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white">
                  {isAr ? 'سجل النسخ السابق' : 'Clipboard History'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-300">
                  {history.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={onClear}
                    className="p-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all flex items-center gap-1"
                    title={isAr ? 'مسح السجل' : 'Clear All'}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{isAr ? 'مسح الكل' : 'Clear'}</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Copy className="w-10 h-10 opacity-30 text-cyan-400" />
                  <p className="text-sm">
                    {isAr ? 'لا يوجد عناصر منسوخة بعد' : 'No items copied yet'}
                  </p>
                  <p className="text-xs text-slate-600">
                    {isAr
                      ? 'اكتب كلام أو أرقام واضغط Enter للحفظ بالنسخ'
                      : 'Type words or numbers and press Enter to copy'}
                  </p>
                </div>
              ) : (
                history.map(item => (
                  <div
                    key={item.id}
                    className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 rounded-2xl p-3.5 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-mono text-slate-200 line-clamp-3 break-all whitespace-pre-wrap dir-auto">
                        {item.text}
                      </p>
                      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyAgain(item)}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition-all ${
                            copiedId === item.id
                              ? 'bg-emerald-500 text-black border-emerald-400'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500 hover:text-black'
                          }`}
                          title={isAr ? 'إعادة النسخ' : 'Copy Again'}
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onDeleteOne(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-white/5">
                      <span className="font-mono text-cyan-400/80">
                        {isAr ? `${item.itemCount} عنصر` : `${item.itemCount} items`}
                      </span>
                      <span>
                        {new Date(item.timestamp).toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
