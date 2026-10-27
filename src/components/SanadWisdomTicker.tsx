import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../context/AppContext'
import { SANAD_WISDOM_BANK, type WisdomItem } from '../constants/wisdom'
import {
  Code2,
  Sparkles,
  Sunrise,
  BookOpen,
  Quote,
  X,
  RotateCw,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react'

export const SanadWisdomTicker: React.FC = () => {
  const { lang, userProfile } = useApp()
  const isAr = lang === 'ar'

  const [currentWisdom, setCurrentWisdom] = useState<WisdomItem | null>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  const lastIndexRef = useRef<number>(-1)

  // Pick a fresh wisdom item rotating categories (on user demand)
  const pickNextWisdom = useCallback(() => {
    let nextIdx = Math.floor(Math.random() * SANAD_WISDOM_BANK.length)
    if (nextIdx === lastIndexRef.current && SANAD_WISDOM_BANK.length > 1) {
      nextIdx = (nextIdx + 1) % SANAD_WISDOM_BANK.length
    }
    lastIndexRef.current = nextIdx
    const selected = SANAD_WISDOM_BANK[nextIdx]
    setCurrentWisdom(selected)
    setIsVisible(true)
    setCopied(false)
  }, [])

  const closeTicker = () => {
    setIsVisible(false)
    setCopied(false)
  }

  const handleCopy = () => {
    if (!currentWisdom) return
    const text = `${currentWisdom.titleAr}\n\n${currentWisdom.bodyAr}\n\nالمصدر: ${currentWisdom.referenceAr}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Listen ONLY to manual trigger events (e.g. from "إشراقة سند" button or user action)
  useEffect(() => {
    const handleManualTrigger = () => {
      pickNextWisdom()
    }
    window.addEventListener('sanad:trigger-wisdom', handleManualTrigger)

    return () => {
      window.removeEventListener('sanad:trigger-wisdom', handleManualTrigger)
    }
  }, [pickNextWisdom])

  // 2. Prevent background scrolling and handle Escape key when modal is open
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTicker()
    }
    window.addEventListener('keydown', handleKeyDown)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isVisible])

  if (!isVisible || !currentWisdom) return null

  // Category Configuration
  const categoryConfig = {
    code: {
      badgeTitleAr: 'نصيحة برمجية',
      badgeTitleEn: 'Code Tip',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      icon: Code2,
      iconColor: 'text-emerald-400',
      containerBorder: 'border-emerald-500/40 shadow-emerald-950/50',
      glowBg: 'bg-emerald-500/20',
      gradient: 'from-emerald-900/60 via-slate-900 to-slate-950',
    },
    hadith: {
      badgeTitleAr: 'حديث نبوي شريف',
      badgeTitleEn: 'Prophetic Hadith',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      icon: BookOpen,
      iconColor: 'text-emerald-400',
      containerBorder: 'border-emerald-500/40 shadow-emerald-950/50',
      glowBg: 'bg-emerald-500/20',
      gradient: 'from-emerald-950/50 via-slate-900 to-slate-950',
    },
    wisdom: {
      badgeTitleAr: 'حكمة وموعظة',
      badgeTitleEn: 'Timeless Wisdom',
      badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      icon: Quote,
      iconColor: 'text-teal-400',
      containerBorder: 'border-teal-500/40 shadow-teal-950/50',
      glowBg: 'bg-teal-500/20',
      gradient: 'from-teal-950/50 via-slate-900 to-slate-950',
    },
    waqar: {
      badgeTitleAr: 'وَقار وعفاف',
      badgeTitleEn: 'Waqar & Modesty',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      icon: ShieldCheck,
      iconColor: 'text-purple-400',
      containerBorder: 'border-purple-500/40 shadow-purple-950/50',
      glowBg: 'bg-purple-500/20',
      gradient: 'from-purple-950/50 via-slate-900 to-slate-950',
    },
    motivation: {
      badgeTitleAr: 'همة وتحفيز',
      badgeTitleEn: 'Motivation',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      icon: Sparkles,
      iconColor: 'text-indigo-400',
      containerBorder: 'border-indigo-500/40 shadow-indigo-950/50',
      glowBg: 'bg-indigo-500/20',
      gradient: 'from-indigo-950/50 via-slate-900 to-slate-950',
    },
  }[currentWisdom.category] || {
    badgeTitleAr: 'إشراقة سند',
    badgeTitleEn: 'Sanad Wisdom',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: Sunrise,
    iconColor: 'text-emerald-400',
    containerBorder: 'border-emerald-500/40 shadow-emerald-950/50',
    glowBg: 'bg-emerald-500/20',
    gradient: 'from-emerald-900/60 via-slate-900 to-slate-950',
  }

  const CategoryIcon = categoryConfig.icon

  // Render directly in document.body via React Portal to escape any overflow/stacking issues
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeTicker()
      }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-[9999] animate-fade-in"
    >
      <div
        className={`w-full max-w-sm sm:max-w-md mx-auto bg-gradient-to-b ${categoryConfig.gradient} border ${categoryConfig.containerBorder} rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl relative text-white overflow-hidden flex flex-col`}
      >
        {/* Subtle Ambient Glow */}
        <div
          className={`absolute -top-16 -start-16 w-36 h-36 rounded-full ${categoryConfig.glowBg} blur-3xl pointer-events-none`}
        />

        {/* Modal Top Header */}
        <div className="relative flex items-center justify-between pb-3.5 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
              <CategoryIcon className={`w-4 h-4 ${categoryConfig.iconColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white flex items-center gap-1">
                  <Sunrise className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'إشراقة سند' : 'Sanad Wisdom'}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryConfig.badgeBg}`}
                >
                  {isAr ? categoryConfig.badgeTitleAr : categoryConfig.badgeTitleEn}
                </span>
              </div>
            </div>
          </div>

          {/* Close button (X) */}
          <button
            type="button"
            onClick={closeTicker}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h4 className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug">
          {isAr ? currentWisdom.titleAr : currentWisdom.titleEn}
        </h4>

        {userProfile.name && userProfile.name.trim() && (
          <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isAr
                ? `يا ${userProfile.name.trim()}، تدبّر هذه الإشراقة:`
                : `For you, ${userProfile.name.trim()}:`}
            </span>
          </div>
        )}

        {/* Main Body Quotation */}
        <div className="my-3 p-4 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-xs text-xs sm:text-sm text-slate-100 font-sans leading-relaxed">
          {isAr ? currentWisdom.bodyAr : currentWisdom.bodyEn}
        </div>

        {isAr && currentWisdom.bodyEn && (
          <p className="text-[11px] text-slate-400 italic line-clamp-3 mb-2">
            {currentWisdom.bodyEn}
          </p>
        )}

        {/* Reference & Hashtag */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
          <span className="font-medium text-slate-300 truncate max-w-[220px]">
            {isAr ? currentWisdom.referenceAr : currentWisdom.referenceEn}
          </span>
          <span className="font-mono text-[11px] text-emerald-400 font-semibold flex-shrink-0">
            #{currentWisdom.tag}
          </span>
        </div>

        {/* Footer Actions: Next Wisdom, Copy, Done */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={pickNextWisdom}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title={isAr ? 'عرض إشراقة أخرى' : 'Next Wisdom'}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إشراقة جديدة' : 'New Wisdom'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              title={isAr ? 'نسخ النص' : 'Copy'}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">{isAr ? 'تم النسخ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نسخ' : 'Copy'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={closeTicker}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              {isAr ? 'تم' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
