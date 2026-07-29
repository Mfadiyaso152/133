import React, { useRef, useEffect, useState } from 'react';
import { DelimiterType, FormatOptions, ClipboardItem } from '../types';
import { processAndFormatText } from '../utils/formatter';
import { playCopySound, playClearSound } from '../utils/audio';
import { FormatToolbar } from './FormatToolbar';
import { SAMPLES } from '../data/presets';
import { Copy, Check, Trash2, Clipboard, Sparkles, CornerDownLeft, Zap, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClipboardBoxProps {
  lang: 'ar' | 'en';
  soundEnabled: boolean;
  enterToCopy: boolean;
  onCopiedItem: (item: ClipboardItem) => void;
}

export const ClipboardBox: React.FC<ClipboardBoxProps> = ({
  lang,
  soundEnabled,
  enterToCopy,
  onCopiedItem,
}) => {
  const isAr = lang === 'ar';
  const [inputText, setInputText] = useState<string>('');
  const [delimiter, setDelimiter] = useState<DelimiterType>('comma');
  const [customDelimiter, setCustomDelimiter] = useState<string>(',');
  const [options, setOptions] = useState<FormatOptions>({
    trimItems: true,
    removeDuplicates: false,
    sortItems: false,
    outputFormat: 'plain',
  });

  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [copiedDetails, setCopiedDetails] = useState<{ count: number; textSnippet: string } | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height as user writes a lot ("يتوسع لما تكتب كثير")
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to compute natural scrollHeight
    textarea.style.height = 'auto';
    const newHeight = Math.max(220, textarea.scrollHeight);
    textarea.style.height = `${newHeight}px`;
  }, [inputText]);

  // Process text according to selected delimiter and format options
  const { formattedText, items, count } = processAndFormatText(
    inputText,
    delimiter,
    options,
    customDelimiter
  );

  // Core Copy Handler
  const handleCopy = async () => {
    const textToCopy = formattedText || inputText;

    if (!textToCopy.trim()) return;

    try {
      await navigator.clipboard.writeText(textToCopy);

      // Play sound
      if (soundEnabled) {
        playCopySound();
      }

      // Show copied toast & glow effect
      setCopiedDetails({
        count: count || 1,
        textSnippet: textToCopy.length > 30 ? textToCopy.substring(0, 30) + '...' : textToCopy,
      });
      setCopiedSuccess(true);

      // Save to history
      const newItem: ClipboardItem = {
        id: Date.now().toString(),
        text: textToCopy,
        itemCount: count || 1,
        timestamp: Date.now(),
        delimiter,
      };
      onCopiedItem(newItem);

      // Hide toast after 2.5s
      setTimeout(() => {
        setCopiedSuccess(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Keyboard Enter Listener
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (enterToCopy) {
      // Enter without Shift -> Copy
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleCopy();
      }
    } else {
      // Ctrl+Enter or Cmd+Enter -> Copy
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleCopy();
      }
    }
  };

  // Paste from system clipboard
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
      }
    } catch (err) {
      console.error('Could not read clipboard:', err);
    }
  };

  // Clear Text
  const handleClear = () => {
    setInputText('');
    if (soundEnabled) playClearSound();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Reset Format Toolbar
  const handleResetToolbar = () => {
    setDelimiter('comma');
    setCustomDelimiter(',');
    setOptions({
      trimItems: true,
      removeDuplicates: false,
      sortItems: false,
      outputFormat: 'plain',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Central Large Glossy Box Container */}
      <div
        className={`relative glass-card rounded-3xl p-4 sm:p-6 transition-all duration-300 ${
          copiedSuccess ? 'glass-card-glow border-emerald-400/60' : isFocused ? 'border-cyan-500/50 ring-1 ring-cyan-500/30' : 'hover:border-white/20'
        }`}
      >
        {/* Subtle glowing backlight behind box */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-60 pointer-events-none -z-10" />

        {/* Box Top Actions Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="text-slate-400 font-semibold mr-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              {isAr ? 'صندوق النصوص والأرقام' : 'Input Box'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Paste Button */}
            <button
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-medium"
              title={isAr ? 'لصق من الحافظة' : 'Paste from clipboard'}
            >
              <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'لصق' : 'Paste'}</span>
            </button>

            {/* Clear Button */}
            {inputText && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all text-xs font-medium"
                title={isAr ? 'مسح النص' : 'Clear text'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'مسح' : 'Clear'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Auto-expanding Textarea ("مربع بالوسط حجمه كبير و يتوسع لما تكتب كثير") */}
        <div className="relative w-full min-h-[220px]">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              isAr
                ? 'اكتب كلام أو أرقام هنا مع فواصل (مثال: 10, 20, 30 أو أحمد, سارة, خالد)\nثم اضغط Enter للنسخ الفوري إلى الحافظة...'
                : 'Type text or numbers separated by commas here (e.g. 10, 20, 30 or apple, banana, orange)\nThen press Enter to copy directly to clipboard...'
            }
            dir="auto"
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500/80 font-mono text-base sm:text-lg leading-relaxed focus:outline-none resize-none transition-all duration-150 p-2 overflow-hidden"
            style={{ minHeight: '220px' }}
          />

          {/* Enter key shortcut helper badge */}
          <div className="absolute bottom-2 left-2 pointer-events-none opacity-60 text-[11px] text-slate-400 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-lg border border-white/5">
            <CornerDownLeft className="w-3 h-3 text-cyan-400" />
            <span>
              {enterToCopy
                ? isAr
                  ? 'اضغط Enter للنسخ'
                  : 'Press Enter to Copy'
                : isAr
                ? 'اضغط Ctrl+Enter للنسخ'
                : 'Press Ctrl+Enter to Copy'}
            </span>
          </div>
        </div>

        {/* Format Toolbar Settings */}
        <div className="mt-4">
          <FormatToolbar
            lang={lang}
            delimiter={delimiter}
            setDelimiter={setDelimiter}
            customDelimiter={customDelimiter}
            setCustomDelimiter={setCustomDelimiter}
            options={options}
            setOptions={setOptions}
            onReset={handleResetToolbar}
            itemCount={count}
            charCount={inputText.length}
          />
        </div>

        {/* Primary Action Button: Large Glossy Copy Button */}
        <div className="mt-5">
          <button
            onClick={handleCopy}
            disabled={!inputText.trim()}
            className={`w-full relative group overflow-hidden py-4 px-6 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 border shadow-xl ${
              copiedSuccess
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-black border-emerald-300 shadow-emerald-500/30'
                : !inputText.trim()
                ? 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white border-white/20 shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {/* Glossy sheen overlay effect */}
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {copiedSuccess ? (
              <>
                <Check className="w-6 h-6 stroke-[3] animate-bounce" />
                <span>{isAr ? 'تم النسخ إلى الحافظة بنجاح! 📋' : 'Copied to Clipboard! 📋'}</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{isAr ? 'نسخ إلى الحافظة (Enter ↵)' : 'Copy to Clipboard (Enter ↵)'}</span>
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              </>
            )}
          </button>
        </div>

        {/* Floating Success Toast Feedback */}
        <AnimatePresence>
          {copiedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.9 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-2xl bg-emerald-500 text-black font-bold text-xs sm:text-sm border border-emerald-300 shadow-2xl shadow-emerald-500/50 flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>
                {isAr
                  ? `تم نسخ (${copiedDetails?.count}) عنصر للحافظة!`
                  : `Copied (${copiedDetails?.count}) items to clipboard!`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Sample Presets Row */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 px-1">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>{isAr ? 'نماذج جاهزة للتجربة السريعة:' : 'Quick Sample Presets:'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                if (soundEnabled) playCopySound();
              }}
              className="group p-3 rounded-2xl bg-black/40 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 transition-all text-right text-xs space-y-1 backdrop-blur-md"
            >
              <div className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                <span>{isAr ? sample.titleAr : sample.titleEn}</span>
                <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  + {isAr ? 'تجربة' : 'Use'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate font-mono dir-auto">
                {sample.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
