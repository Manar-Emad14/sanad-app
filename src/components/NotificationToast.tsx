import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { InAppToast } from '../types'
import {
  MoonStar,
  Sparkles,
  Heart,
  Bell,
  X,
  Volume2,
  Pin,
  PinOff,
  Copy,
  Check,
  Pause,
} from 'lucide-react'

export const NotificationToast: React.FC = () => {
  const [toast, setToast] = useState<InAppToast | null>(null)
  const [visible, setVisible] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const TOTAL_DURATION_MS = 15000 // 15 seconds display duration
  const [remainingMs, setRemainingMs] = useState(TOTAL_DURATION_MS)

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<InAppToast>
      if (customEvent.detail) {
        setToast(customEvent.detail)
        setVisible(true)
        setIsPinned(false)
        setIsHovered(false)
        setRemainingMs(TOTAL_DURATION_MS)
      }
    }

    window.addEventListener('sanad:toast', handleToastEvent)
    return () => window.removeEventListener('sanad:toast', handleToastEvent)
  }, [])

  // Auto-dismiss ticker: decrements every 100ms when not hovered and not pinned
  useEffect(() => {
    if (!visible || !toast || isPinned || isHovered) return

    const tick = 100
    const interval = setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= tick) {
          setVisible(false)
          return 0
        }
        return prev - tick
      })
    }, tick)

    return () => clearInterval(interval)
  }, [visible, toast, isPinned, isHovered])

  if (!visible || !toast) return null

  const handleCopy = () => {
    if (toast) {
      navigator.clipboard.writeText(`${toast.title}\n${toast.body}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setVisible(false)
    setIsPinned(false)
  }

  const typeConfig = {
    prayer: {
      bg: 'bg-emerald-950/95 text-white border-emerald-500/40 shadow-emerald-500/25',
      icon: MoonStar,
      iconColor: 'text-emerald-300',
      tagAr: 'نداء الصلاة',
      tagEn: 'Prayer Call',
      tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      progressBarBg: 'bg-emerald-400',
    },
    tip: {
      bg: 'bg-indigo-950/95 text-white border-indigo-500/40 shadow-indigo-500/25',
      icon: Sparkles,
      iconColor: 'text-indigo-300',
      tagAr: 'إشراقة المبرمج',
      tagEn: 'Developer Insight',
      tagBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      progressBarBg: 'bg-indigo-400',
    },
    dhikr: {
      bg: 'bg-teal-950/95 text-white border-teal-500/40 shadow-teal-500/25',
      icon: Heart,
      iconColor: 'text-rose-300',
      tagAr: 'ورد وسكينة',
      tagEn: 'Mindful Dhikr',
      tagBg: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      progressBarBg: 'bg-teal-400',
    },
    system: {
      bg: 'bg-slate-900/95 text-white border-slate-700/60 shadow-slate-900/30',
      icon: Bell,
      iconColor: 'text-emerald-400',
      tagAr: 'تنبيه النظام',
      tagEn: 'Notification',
      tagBg: 'bg-white/10 text-slate-300 border-white/20',
      progressBarBg: 'bg-slate-400',
    },
    salawat: {
      bg: 'bg-gradient-to-r from-emerald-950/95 via-teal-950/95 to-slate-950/95 text-white border-emerald-500/40 shadow-emerald-500/25',
      icon: Sparkles,
      iconColor: 'text-emerald-300',
      tagAr: 'الصلاة على النبي ﷺ',
      tagEn: 'Salawat Alert',
      tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      progressBarBg: 'bg-emerald-400',
    },
    waqar: {
      bg: 'bg-gradient-to-r from-purple-950/95 via-fuchsia-950/95 to-slate-950/95 text-white border-fuchsia-500/40 shadow-fuchsia-500/25',
      icon: null as React.ElementType | null,
      iconColor: 'text-fuchsia-300',
      tagAr: 'وَقار • ستر وعزة',
      tagEn: 'Waqar • Modesty & Honor',
      tagBg: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30',
      progressBarBg: 'bg-fuchsia-400',
    },
    challenge: {
      bg: 'bg-gradient-to-r from-amber-950/95 via-orange-950/95 to-slate-950/95 text-white border-amber-500/40 shadow-amber-500/25',
      icon: Sparkles,
      iconColor: 'text-amber-300',
      tagAr: 'تحدي اليوم البرمجي',
      tagEn: 'Coding Challenge',
      tagBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      progressBarBg: 'bg-amber-400',
    },
    evening_adhkar: {
      bg: 'bg-gradient-to-r from-teal-950/95 via-emerald-950/95 to-slate-950/95 text-white border-teal-500/40 shadow-teal-500/25',
      icon: Heart,
      iconColor: 'text-emerald-300',
      tagAr: 'أذكار المساء وحفظ الرحمن',
      tagEn: 'Evening Adhkar',
      tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      progressBarBg: 'bg-emerald-400',
    },
    pre_adhan: {
      bg: 'bg-gradient-to-r from-amber-950/95 via-yellow-950/95 to-slate-950/95 text-white border-amber-500/40 shadow-amber-500/25',
      icon: MoonStar,
      iconColor: 'text-amber-300',
      tagAr: 'اقتراب الأذان (5 دقائق)',
      tagEn: 'Pre-Adhan (5 min)',
      tagBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      progressBarBg: 'bg-amber-400',
    },
    peace: {
      bg: 'bg-gradient-to-r from-amber-950/95 via-orange-950/95 to-slate-950/95 text-white border-amber-500/40 shadow-amber-500/25',
      icon: Sparkles,
      iconColor: 'text-amber-300',
      tagAr: 'سكينة وبُشرى',
      tagEn: 'Peace & Solace',
      tagBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      progressBarBg: 'bg-amber-400',
    },
  }[toast.type || 'system'] || {
    bg: 'bg-slate-900/95 text-white border-slate-700/60 shadow-slate-900/30',
    icon: Bell,
    iconColor: 'text-emerald-400',
    tagAr: 'تنبيه',
    tagEn: 'Alert',
    tagBg: 'bg-white/10 text-slate-300 border-white/20',
    progressBarBg: 'bg-slate-400',
  }

  const Icon = typeConfig.icon
  const remainingSeconds = Math.ceil(remainingMs / 1000)
  const progressPercent = (remainingMs / TOTAL_DURATION_MS) * 100

  return createPortal(
    <div className="fixed top-20 sm:top-24 inset-x-0 mx-auto z-[9990] w-[94%] max-w-lg px-2 sm:px-4 pointer-events-none animate-fade-in">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`pointer-events-auto rounded-3xl p-4 sm:p-5 border backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300 ${typeConfig.bg}`}
      >
        {/* Top/Header Info & Action Controls */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {Icon && (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${typeConfig.iconColor} animate-pulse`} />
              </div>
            )}

            <div className="min-w-0 space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${typeConfig.tagBg}`}
                >
                  {typeConfig.tagAr}
                </span>

                <span className="text-[10px] text-slate-300 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span>سند المُبرمج</span>
                </span>

                {/* Status Badges: Hover Paused or Pinned */}
                {isPinned ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-[10px] font-bold animate-pulse">
                    <Pin className="w-2.5 h-2.5" />
                    <span>مثبّت على الشاشة</span>
                  </span>
                ) : isHovered ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/25 border border-sky-400/50 text-sky-300 text-[10px] font-bold">
                    <Pause className="w-2.5 h-2.5" />
                    <span>المؤقت متوقف مؤقتاً</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({remainingSeconds} ثوانٍ)
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-snug">
                {toast.title}
              </h4>

              <p className="text-xs sm:text-[13px] text-slate-200/90 leading-relaxed font-normal">
                {toast.body}
              </p>
            </div>
          </div>

          {/* Right Controls: Copy, Pin, and Explicit Close */}
          <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
            {/* Copy Content */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title={copied ? 'تم النسخ!' : 'نسخ النص'}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Pin / Keep Button */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                isPinned
                  ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/40 ring-1 ring-emerald-300'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={isPinned ? 'إلغاء تثبيت الإشعار' : 'تثبيت الإشعار (إبقاء على الشاشة)'}
            >
              {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPinned ? 'إلغاء' : 'تثبيت'}</span>
            </button>

            {/* Explicit Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="إغلاق الإشعار فوراً"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Countdown Bar at the bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              isPinned
                ? 'w-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : isHovered
                ? 'bg-sky-400'
                : typeConfig.progressBarBg
            }`}
            style={{
              width: isPinned ? '100%' : `${Math.max(0, Math.min(100, progressPercent))}%`,
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
