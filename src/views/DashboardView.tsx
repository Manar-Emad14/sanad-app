import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  Sparkles,
  Sunrise,
  Clock,
  Timer,
  Flame,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Calendar,
  Droplets,
  Eye,
  Activity,
  Heart,
  ChevronRight,
  ChevronLeft,
  X,
  Code2,
  ShieldCheck,
  Shield,
  Moon,
  Copy,
  Check,
  Bell,
  BellOff,
  Volume2,
} from 'lucide-react'
import { formatTime, getFormattedDates } from '../utils/prayer'
import { WAQAR_MESSAGES, type WaqarMessage } from '../constants/waqar'
import { playNotificationSound } from '../utils/audio'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Heart,
  Eye,
  Sparkles,
  Droplets,
  BookOpen,
  Activity,
  Clock,
}

export const DashboardView: React.FC = () => {
  const {
    lang,
    prayerStatus,
    cairoPrayerData,
    handleTabSelect,
    currentTime,
    reminders,
    setIsSpiritualToolsModalOpen,
    notificationSettings,
    setNotificationSettings,
  } = useApp()

  const isAr = lang === 'ar'
  const Arrow = isAr ? ArrowLeft : ArrowRight

  const { prayerTimes } = cairoPrayerData
  const { gregorian, hijri } = getFormattedDates(currentTime, lang)

  const [activeReminderIdx, setActiveReminderIdx] = useState<number>(0)
  const [isReminderDismissed, setIsReminderDismissed] = useState<boolean>(false)

  const currentReminders = reminders.length > 0 ? reminders : []
  const safeIdx = currentReminders.length > 0 ? activeReminderIdx % currentReminders.length : 0
  const activeReminder = currentReminders[safeIdx]
  const ReminderIcon = (activeReminder && ICON_MAP[activeReminder.iconName]) || Sparkles

  const nextReminder = () => {
    if (currentReminders.length > 0) {
      setActiveReminderIdx((prev) => (prev + 1) % currentReminders.length)
    }
  }

  const prevReminder = () => {
    if (currentReminders.length > 0) {
      setActiveReminderIdx((prev) => (prev - 1 + currentReminders.length) % currentReminders.length)
    }
  }

  // Dedicated Waqar Card: Current cycle / daily message chosen for this session
  const [currentWaqar] = useState<WaqarMessage>(() => {
    try {
      const savedIdx = localStorage.getItem('sanad_waqar_idx')
      if (savedIdx !== null) {
        const parsed = parseInt(savedIdx, 10)
        if (!isNaN(parsed) && WAQAR_MESSAGES[parsed % WAQAR_MESSAGES.length]) {
          return WAQAR_MESSAGES[parsed % WAQAR_MESSAGES.length]
        }
      }
    } catch {}

    // Deterministic day-of-year rotation fallback
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    const index = Math.abs(dayOfYear) % WAQAR_MESSAGES.length
    return WAQAR_MESSAGES[index]
  })

  const [copiedWaqar, setCopiedWaqar] = useState<boolean>(false)

  const handleCopyWaqar = () => {
    const text = `${currentWaqar.titleAr}\n${currentWaqar.bodyAr}`
    navigator.clipboard.writeText(text).then(() => {
      setCopiedWaqar(true)
      setTimeout(() => setCopiedWaqar(false), 2000)
    })
  }

  const handleTestWaqarAlert = () => {
    // Immediately play gentle chime audio
    playNotificationSound('waqar', 85)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sanad:toast', {
          detail: {
            id: `waqar-test-${Date.now()}`,
            title: isAr ? currentWaqar.titleAr : currentWaqar.titleEn,
            body: isAr ? currentWaqar.bodyAr : currentWaqar.bodyEn,
            type: 'waqar',
            timestamp: Date.now(),
          },
        })
      )
    }
  }

  const toggleWaqarNotification = () => {
    setNotificationSettings({
      ...notificationSettings,
      waqarMessagesEnabled: !notificationSettings.waqarMessagesEnabled,
    })
  }

  // Quick Daily Deeds Progress calculation
  const deedsCountTotal = 6
  const deedsCountDone = 4
  const deedsPercentage = Math.round((deedsCountDone / deedsCountTotal) * 100)

  // Devotional Quotes Rotator
  const quotes = [
    {
      ar: '«إن الله يحب إذا عمل أحدكم عملاً أن يتقنه» • نقاء الكود وحسن التوثيق عبادة بالنية الصالحة.',
      en: '"Allah loves when one of you does a deed that he excels at it." • Clean code and documentation are worship with sincere intentions.',
    },
    {
      ar: '«أحب الأعمال إلى الله أدومها وإن قل» • التزامك بوردك اليومي كالتزامك بالمساهمات اليومية في Git.',
      en: '"The most beloved of deeds to Allah are the most consistent, even if small." • Consistency in worship mirrors consistency in Git commits.',
    },
    {
      ar: '«ما نقص مال من صدقة» • زكاة العلم نشره، ومساعدة المطورين ونفع المسلمين بالبرمجيات.',
      en: '"Charity does not decrease wealth." • The charity of knowledge is sharing it and building software that benefits people.',
    },
  ]
  const [quoteIdx] = useState<number>(0)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Welcome Banner with Gregorian & Hijri Dates */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-500/20">
        <div className="absolute top-0 end-0 -mt-16 -me-16 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-4xl">
          {/* Dual Date Badge (Gregorian & Hijri) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-xs">
              <Calendar size={14} className="inline ml-1 text-emerald-400" />
              <span>{gregorian}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 backdrop-blur-xs">
              <Moon size={14} className="inline ml-1 text-emerald-400" />
              <span>{hijri}</span>
            </div>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('sanad:trigger-wisdom'))}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-500/30 hover:text-white transition-all cursor-pointer backdrop-blur-xs shadow-xs active:scale-95 touch-manipulation"
              title={isAr ? 'عرض إشراقة وحكمة برمجية الآن' : 'Trigger Wisdom & Dev Ticker'}
            >
              <Sunrise size={15} className="inline ml-1.5 text-emerald-400" />
              <span>{isAr ? 'إشراقة سند' : 'Sanad Wisdom'}</span>
            </button>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {isAr ? (
                <>
                  أهلاً بك في <span className="text-emerald-400">سَنَد المُبرمِج</span>
                </>
              ) : (
                <>
                  Welcome to <span className="text-emerald-400">Sanad Dev</span>
                </>
              )}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {isAr
                ? 'بيئة العمل الذكية التي تجمع بين أرقى معايير هندسة البرمجيات والسكينة الروحية لحفظ وقت المبرمج وصلواته.'
                : 'Your intentional workspace blending engineering excellence with spiritual peace to safeguard your focus and prayers.'}
            </p>
          </div>

          {/* Quick Devotional Quote */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium text-emerald-100/90 leading-relaxed">
              {isAr ? quotes[quoteIdx].ar : quotes[quoteIdx].en}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Bi-hourly Developer Reminder Banner (Non-intrusive) */}
      {!isReminderDismissed && activeReminder && (
        <section className="bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-md relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5 sm:mt-0">
                <ReminderIcon className="w-5 h-5 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    {isAr ? activeReminder.categoryAr : activeReminder.categoryEn}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {isAr ? 'تنبيه دوري للمبرمج' : 'Bi-Hourly Cue'}
                  </span>
                </div>

                <div className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  {isAr ? activeReminder.textAr : activeReminder.textEn}
                </div>

                <p className="text-xs text-slate-300 mt-0.5">
                  {isAr ? activeReminder.subtextAr : activeReminder.subtextEn}
                </p>
              </div>
            </div>

            {/* Navigation and close controls */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={prevReminder}
                type="button"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title={isAr ? 'التنبيه السابق' : 'Previous Reminder'}
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <span className="text-xs font-mono font-bold text-slate-300 px-1">
                {safeIdx + 1}/{currentReminders.length}
              </span>

              <button
                onClick={nextReminder}
                type="button"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title={isAr ? 'التنبيه التالي' : 'Next Reminder'}
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsReminderDismissed(true)}
                type="button"
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition ms-1"
                title={isAr ? 'إخفاء التنبيه' : 'Dismiss'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. Quick Action Cards (4 Cards Grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Next Prayer Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isAr ? 'الصلاة القادمة (القاهرة)' : 'Next Cairo Prayer'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {isAr ? prayerStatus.nextPrayerName.ar : prayerStatus.nextPrayerName.en}
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {prayerStatus.countdown}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {isAr ? 'متبقي حتى الأذان' : 'until Adhan'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              {isAr ? 'موعد الأذان:' : 'Adhan time:'}{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {prayerStatus.nextTime ? formatTime(prayerStatus.nextTime, isAr ? 'ar' : 'en') : '—'}
              </strong>
            </span>
            <button
              onClick={() => handleTabSelect('prayer-schedule')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <span>{isAr ? 'الجدول' : 'View'}</span>
              <Arrow className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Active Focus Status (Quick Launch Pomodoro) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isAr ? 'جلسات التركيز البرمجي' : 'Spiritual Focus Sprints'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl font-black text-slate-900 dark:text-white">
              25 / 5 {isAr ? 'دقيقة' : 'Min'}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAr
                ? 'سبرنت كود مركز يعقبه استراحة ذكر واستغفار'
                : 'Deep coding sprint followed by mindful Dhikr pause'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleTabSelect('pomodoro')}
              type="button"
              className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm shadow-teal-600/20"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{isAr ? 'بدء جلسة التركيز الآن' : 'Launch Sprint'}</span>
              <Arrow className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Daily Coding Challenge Preview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isAr ? 'تحدي اليوم البرمجي' : 'Daily Code Challenge'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
            </div>

            <div className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
              {isAr ? 'خوارزمية حساب زكاة المال' : 'Zakat Calculation Algorithm'}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Easy
              </span>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +150 XP
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleTabSelect('challenges')}
              type="button"
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>{isAr ? 'حل التحدي البرمجي' : 'Solve Snippet'}</span>
              <Arrow className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Daily Deeds Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isAr ? 'إنجازات وأوراد اليوم' : 'Daily Deeds Habit'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between mb-1.5">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {deedsPercentage}%
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {deedsCountDone} / {deedsCountTotal} {isAr ? 'مهام' : 'deeds'}
              </span>
            </div>

            {/* Compact Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${deedsPercentage}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Flame className="w-3 h-3 text-emerald-400" />
              <span>{isAr ? 'سلسلة 14 يوماً' : '14-Day Streak'}</span>
            </span>
            <button
              onClick={() => handleTabSelect('achievements')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              <span>{isAr ? 'السجل' : 'Matrix'}</span>
              <Arrow className="w-3 h-3" />
            </button>
          </div>
        </div>

      </section>

      {/* 3. Dedicated Waqar Card for Muslimah Developers */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/90 via-slate-900/95 to-emerald-950/90 text-white p-6 sm:p-8 border border-purple-500/30 shadow-xl transition-all duration-300">
        <div className="absolute -top-24 -end-24 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Bar: Title & Direct Notification Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-950/40 border border-purple-400/30">
                <ShieldCheck className="w-6 h-6 text-purple-100" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center">
                    <Shield size={16} className="inline ml-1.5 text-purple-400" />
                    <span>{isAr ? 'وَقار | للمبرمجة المسلمة' : 'Waqar • The Muslimah Dev'}</span>
                  </h3>
                  <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/25 text-purple-200 border border-purple-400/30">
                    {isAr ? currentWaqar.themeTagAr : currentWaqar.themeTagEn}
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 mt-0.5">
                  {isAr
                    ? 'رسائل الستر والعفاف • حياء المبرمجة المسلمة ووقار الزيّ الشرعي في بيئة العمل التقنية'
                    : 'Modesty & Poise • Uplifting reminders on Islamic hijab and dignity in tech'}
                </p>
              </div>
            </div>

            {/* Direct Notification Toggle Switch */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-purple-950/50 border border-purple-400/25 backdrop-blur-sm">
              <button
                type="button"
                onClick={toggleWaqarNotification}
                className="flex items-center gap-2 cursor-pointer group"
                title={
                  isAr
                    ? notificationSettings.waqarMessagesEnabled
                      ? 'انقر لكتم تنبيهات وقار الدورية'
                      : 'انقر لتفعيل تنبيهات وقار الدورية كل 10 دقائق'
                    : 'Toggle periodic Waqar reminders'
                }
              >
                {notificationSettings.waqarMessagesEnabled ? (
                  <>
                    <Bell className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                    <span className="text-xs font-bold text-emerald-300">
                      {isAr ? 'التنبيهات مفعلة' : 'Alerts ON'}
                    </span>
                    <div className="w-8 h-4.5 bg-emerald-600 rounded-full p-0.5 flex items-center justify-end transition-all">
                      <div className="w-3.5 h-3.5 bg-white rounded-full shadow-xs" />
                    </div>
                  </>
                ) : (
                  <>
                    <BellOff className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-medium text-slate-400">
                      {isAr ? 'التنبيهات مكتومة' : 'Alerts Muted'}
                    </span>
                    <div className="w-8 h-4.5 bg-slate-700 rounded-full p-0.5 flex items-center justify-start transition-all">
                      <div className="w-3.5 h-3.5 bg-slate-300 rounded-full shadow-xs" />
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Card Content: Current Cycle Reflection */}
          <div className="relative p-5 sm:p-6 rounded-2xl bg-white/5 border border-purple-400/20 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-extrabold text-purple-300">
                {isAr ? currentWaqar.titleAr : currentWaqar.titleEn}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-900/50 text-purple-200 border border-purple-700/40">
                {isAr ? 'رسالة الدورة الحالية' : 'Current Reflection'}
              </span>
            </div>

            <blockquote className="text-sm sm:text-base lg:text-lg font-medium text-slate-100 leading-relaxed font-sans">
              {isAr ? currentWaqar.bodyAr : currentWaqar.bodyEn}
            </blockquote>

            {isAr && (
              <p className="text-xs text-purple-300/70 italic pt-2 border-t border-purple-500/15">
                {currentWaqar.bodyEn}
              </p>
            )}
          </div>

          {/* Controls Footer: Note & ONLY Copy Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-xs text-purple-200/70 flex items-center gap-1.5 text-center sm:text-start">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
              <span>
                {isAr
                  ? 'تصلك الرسائل تباعاً عبر الإشعارات الدورية كل 10 دقائق وتُحفظ في سجل التنبيهات'
                  : 'Reflections arrive periodically via notifications and are saved to your notification center'}
              </span>
            </span>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleTestWaqarAlert}
                className="px-3.5 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/30 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title={isAr ? 'تجربة إشعار ورنة وقار فوراً' : 'Test Waqar Alert & Chime'}
              >
                <Volume2 className="w-3.5 h-3.5 text-purple-300" />
                <span>{isAr ? 'تجربة النغمة' : 'Test Chime'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyWaqar}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title={isAr ? 'نسخ الرسالة الحالية' : 'Copy Message'}
              >
                {copiedWaqar ? (
                  <>
                    <Check size={14} className="inline ml-1 text-emerald-400" />
                    <span className="text-emerald-300">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="inline ml-1" />
                    <span>{isAr ? 'نسخ الرسالة الحالية' : 'Copy Message'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dev Spiritual Quick Banner */}
      <section className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-teal-900/60 via-emerald-950/60 to-slate-900 border border-teal-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5 text-center sm:text-start">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 flex-shrink-0">
            <Heart className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-white">
              {isAr ? 'مسبحة المبرمج الرقمية وأدعية حل المشكلات' : 'Digital Coding Tasbih & Dev Problem-Solving Du\'aa'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr
                ? 'استحضر البركة في وقتك، وجدد نيتك، وتوكل على الله عند حل الـ Bugs المعقدة'
                : 'Bring barakah into your sprint, renew intentions, and seek ease when unblocking complex code'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSpiritualToolsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 shadow-md shadow-teal-500/20 flex-shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAr ? 'فتح المسبحة والأدعية' : 'Open Spiritual Suite'}</span>
        </button>
      </section>

      {/* 4. Cairo 5 Prayers Live Timetable Strip */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? 'مواقيت الصلاة اليوم في القاهرة' : 'Today’s Cairo Prayer Schedule'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'محسوبة وفق معايير الهيئة المصرية العامة للمساحة'
                : 'Computed according to Egyptian General Authority of Survey'}
            </p>
          </div>

          <button
            onClick={() => handleTabSelect('prayer-schedule')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>{isAr ? 'عرض جدول الصلاة والقبلة بالكامل' : 'Full Schedule & Qibla'}</span>
            <Arrow className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'fajr', nameAr: 'الفجر', nameEn: 'Fajr', time: prayerTimes.fajr },
            { id: 'sunrise', nameAr: 'الشروق', nameEn: 'Sunrise', time: prayerTimes.sunrise },
            { id: 'dhuhr', nameAr: 'الظهر', nameEn: 'Dhuhr', time: prayerTimes.dhuhr },
            { id: 'asr', nameAr: 'العصر', nameEn: 'Asr', time: prayerTimes.asr },
            { id: 'maghrib', nameAr: 'المغرب', nameEn: 'Maghrib', time: prayerTimes.maghrib },
            { id: 'isha', nameAr: 'العشاء', nameEn: 'Isha', time: prayerTimes.isha },
          ].map((item) => {
            const isCurrent = prayerStatus.currentPrayer === item.id
            const isNext = prayerStatus.nextPrayer === item.id

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                    : isNext
                    ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-400'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? item.nameAr : item.nameEn}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>

                <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {formatTime(item.time, isAr ? 'ar' : 'en')}
                </div>

                {isNext && (
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block mt-0.5">
                    {isAr ? 'القادمة' : 'Next'}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
