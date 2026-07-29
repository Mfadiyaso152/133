import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy } from 'lucide-react';

export default function App() {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea height as content grows ("يتوسع لما تكتب كثير")
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const nextHeight = Math.max(260, textarea.scrollHeight);
    textarea.style.height = `${nextHeight}px`;
  }, [text]);

  // Execute copy to clipboard
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Play soft audio ping if supported
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch {
        // audio optional
      }

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Listen for Enter key press to trigger copy
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-4 sm:p-8 font-['Cairo',sans-serif] relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Glossy ambient backdrops */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-gradient-to-tr from-cyan-600/10 via-purple-600/10 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Shiny Glowing Central Box */}
      <div className="w-full max-w-3xl mx-auto relative group">
        {/* Outer Glow Halo when active or copied */}
        <div
          className={`absolute -inset-1 rounded-[32px] bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 opacity-20 blur-xl transition-all duration-500 pointer-events-none ${
            copied
              ? 'opacity-80 scale-[1.02] blur-2xl'
              : isFocused
              ? 'opacity-50 scale-[1.01]'
              : 'group-hover:opacity-35'
          }`}
        />

        {/* Shiny Glass Container */}
        <div
          className={`relative w-full rounded-[28px] p-6 sm:p-8 transition-all duration-300 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border shadow-2xl ${
            copied
              ? 'border-emerald-400/80 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
              : isFocused
              ? 'border-cyan-400/60 shadow-[0_0_40px_rgba(6,182,212,0.25)]'
              : 'border-white/15 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9)]'
          }`}
        >
          {/* Glossy reflective top sheen line */}
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {/* Textarea: Large, auto-expanding */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="اكتب هنا (كلام أو أرقام مع فواصل)... ثم اضغط Enter للنسخ"
            dir="auto"
            autoFocus
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-600 font-mono text-lg sm:text-xl leading-relaxed focus:outline-none resize-none transition-all duration-150 p-1 overflow-hidden min-h-[260px]"
            style={{ minHeight: '260px' }}
          />

          {/* Copying Indicator Toast */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-emerald-500 text-black font-bold text-sm shadow-xl shadow-emerald-500/40 flex items-center gap-2 pointer-events-none"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>تم الحفظ بالحافظة! 📋</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner subtle hint icon */}
          {!copied && text && (
            <div className="absolute bottom-4 left-6 text-xs text-slate-500 font-mono flex items-center gap-1.5 opacity-60 pointer-events-none">
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enter للنسخ</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
