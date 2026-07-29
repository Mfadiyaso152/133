import React from 'react';
import { DelimiterType, FormatOptions } from '../types';
import { Sliders, Scissors, ArrowUpDown, CopyCheck, Code, ListFilter, RotateCcw } from 'lucide-react';

interface FormatToolbarProps {
  lang: 'ar' | 'en';
  delimiter: DelimiterType;
  setDelimiter: (del: DelimiterType) => void;
  customDelimiter: string;
  setCustomDelimiter: (val: string) => void;
  options: FormatOptions;
  setOptions: React.Dispatch<React.SetStateAction<FormatOptions>>;
  onReset: () => void;
  itemCount: number;
  charCount: number;
}

export const FormatToolbar: React.FC<FormatToolbarProps> = ({
  lang,
  delimiter,
  setDelimiter,
  customDelimiter,
  setCustomDelimiter,
  options,
  setOptions,
  onReset,
  itemCount,
  charCount,
}) => {
  const isAr = lang === 'ar';

  const toggleOption = (key: keyof FormatOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-md space-y-3">
      {/* Top Row: Delimiter selector & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Delimiter Selection */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 ml-1">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            {isAr ? 'نوع الفاصل:' : 'Delimiter:'}
          </span>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setDelimiter('comma')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                delimiter === 'comma'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isAr ? 'فاصلة (,)' : 'Comma (,)'}
            </button>

            <button
              onClick={() => setDelimiter('newline')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                delimiter === 'newline'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isAr ? 'سطر جديد (↵)' : 'Newline (↵)'}
            </button>

            <button
              onClick={() => setDelimiter('space')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                delimiter === 'space'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isAr ? 'مسافة (␣)' : 'Space (␣)'}
            </button>

            <button
              onClick={() => setDelimiter('semicolon')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                delimiter === 'semicolon'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              ;
            </button>

            <button
              onClick={() => setDelimiter('custom')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                delimiter === 'custom'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isAr ? 'مخصص' : 'Custom'}
            </button>
          </div>

          {delimiter === 'custom' && (
            <input
              type="text"
              maxLength={3}
              value={customDelimiter}
              onChange={e => setCustomDelimiter(e.target.value)}
              placeholder={isAr ? 'الفاصل' : 'Char'}
              className="w-16 px-2 py-1 bg-white/10 border border-cyan-500/50 rounded-lg text-xs text-center text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
            />
          )}
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            {isAr ? `${itemCount} عنصر` : `${itemCount} Items`}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 font-mono">
            {isAr ? `${charCount} حرف` : `${charCount} Chars`}
          </span>
        </div>
      </div>

      {/* Quick Action Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Trim Spaces Toggle */}
          <button
            onClick={() => toggleOption('trimItems')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              options.trimItems
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>{isAr ? 'قص المسافات الزائدة' : 'Trim Spaces'}</span>
          </button>

          {/* Deduplicate Toggle */}
          <button
            onClick={() => toggleOption('removeDuplicates')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              options.removeDuplicates
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CopyCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'حذف التكرار' : 'Deduplicate'}</span>
          </button>

          {/* Sort Toggle */}
          <button
            onClick={() => toggleOption('sortItems')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              options.sortItems
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{isAr ? 'ترتيب تصاعدي' : 'Sort A-Z'}</span>
          </button>
        </div>

        {/* Output format switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[11px]">
            <button
              onClick={() => setOptions(prev => ({ ...prev, outputFormat: 'plain' }))}
              className={`px-2 py-0.5 rounded transition-all ${
                options.outputFormat === 'plain' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'
              }`}
            >
              {isAr ? 'عادي' : 'Plain'}
            </button>
            <button
              onClick={() => setOptions(prev => ({ ...prev, outputFormat: 'json' }))}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                options.outputFormat === 'json' ? 'bg-cyan-500/30 text-cyan-200 font-bold' : 'text-slate-400'
              }`}
            >
              <Code className="w-3 h-3" />
              JSON
            </button>
            <button
              onClick={() => setOptions(prev => ({ ...prev, outputFormat: 'sql' }))}
              className={`px-2 py-0.5 rounded transition-all ${
                options.outputFormat === 'sql' ? 'bg-purple-500/30 text-purple-200 font-bold' : 'text-slate-400'
              }`}
            >
              SQL ' '
            </button>
            <button
              onClick={() => setOptions(prev => ({ ...prev, outputFormat: 'bullet' }))}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                options.outputFormat === 'bullet' ? 'bg-emerald-500/30 text-emerald-200 font-bold' : 'text-slate-400'
              }`}
            >
              <ListFilter className="w-3 h-3" />
              • List
            </button>
          </div>

          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
            title={isAr ? 'إعادة الضبط' : 'Reset Format'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
