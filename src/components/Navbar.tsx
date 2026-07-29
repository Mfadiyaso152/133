import React from 'react';
import { Copy, Volume2, VolumeX, Sparkles, Languages, History, Keyboard } from 'lucide-react';

interface NavbarProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  enterToCopy: boolean;
  setEnterToCopy: (val: boolean) => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  soundEnabled,
  setSoundEnabled,
  enterToCopy,
  setEnterToCopy,
  historyCount,
  onOpenHistory,
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-white/15 shadow-lg shadow-cyan-500/10 text-cyan-400 group">
            <Copy className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
              {isAr ? 'حافظة النصوص الفورية' : 'Instant Clipboard Box'}
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {isAr ? 'اكتب، اضغط Enter، وانسخ فوراً' : 'Write, hit Enter, copy instantly'}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Enter key mode indicator toggle */}
          <button
            onClick={() => setEnterToCopy(!enterToCopy)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              enterToCopy
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            title={
              isAr
                ? enterToCopy
                  ? 'الضغط على Enter ينفذ النسخ مباشرة'
                  : 'Enter ينشئ سطر جديد (Ctrl+Enter للنسخ)'
                : enterToCopy
                ? 'Enter triggers Copy directly'
                : 'Enter creates newline (Ctrl+Enter to copy)'
            }
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isAr
                ? enterToCopy
                  ? 'Enter = نسخ'
                  : 'Enter = سطر جديد'
                : enterToCopy
                ? 'Enter = Copy'
                : 'Enter = Newline'}
            </span>
            <span className="text-[10px] px-1 rounded bg-black/40 border border-white/10">
              {enterToCopy ? '↵' : 'Shift+↵'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
            }`}
            title={isAr ? (soundEnabled ? 'الصوت مفعل' : 'الصوت مكتوم') : soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* History drawer trigger */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5 text-xs"
            title={isAr ? 'سجل النسخ' : 'Copy History'}
          >
            <History className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline font-medium">{isAr ? 'السجل' : 'History'}</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-500 text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
