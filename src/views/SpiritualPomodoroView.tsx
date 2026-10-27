import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useApp } from '../context/AppContext'
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Heart,
  CheckCircle2,
  BookOpen,
  Volume2,
  Flame,
  Target,
  RefreshCw,
} from 'lucide-react'
import { playSereneChime } from '../utils/audio'

type PomodoroMode = 'focus' | 'short_break' | 'long_break'

interface SpiritualReminder {
  id: string
  titleAr: string
  titleEn: string
  quoteAr: string
  quoteEn: string
  actionAr: string
  actionEn: string
}

export const SpiritualPomodoroView: React.FC = () => {
  const { lang, setIsSpiritualToolsModalOpen } = useApp()
  const isAr = lang === 'ar'

  // Default durations in seconds
  const DURATIONS: Record<PomodoroMode, number> = {
    focus: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  }

  const [mode, setMode] = useState<PomodoroMode>('focus')
  const [timeLeft, setTimeLeft] = useState<number>(DURATIONS.focus)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  
  // Custom intention / task
  const [intention, setIntention] = useState<string>(() => {
    return localStorage.getItem('sanad_active_intention') || ''
  })
  const [isEditingIntention, setIsEditingIntention] = useState<boolean>(false)

  // Completed sessions tracking
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const saved = localStorage.getItem('sanad_pomodoro_completed_today')
    return saved ? parseInt(saved, 10) : 4
  })

  // Sound chime toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)

  // Curated Spiritual Reminders for Breaks
  const SPIRITUAL_REMINDERS: SpiritualReminder[] = useMemo(
    () => [
      {
        id: 'istighfar',
        titleAr: 'الاستغفار ومفتاح المسائل المستعصية',
        titleEn: 'Seeking Forgiveness for Blockers',
        quoteAr: '«فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا»',
        quoteEn: '"Ask forgiveness of your Lord; indeed, He is ever a Perpetual Forgiver."',
        actionAr: 'استغفر الله 33 مرة بنية تيسير الأمر وشرح الصدر لحل مشاكل الكود.',
        actionEn: 'Recite Astaghfirullah 33 times with intention of clarity and resolution.',
      },
      {
        id: 'salawat',
        titleAr: 'الصلاة على النبي ﷺ لذهاب الهم',
        titleEn: 'Invoking Salawat for Peace of Mind',
        quoteAr: '«إِذًا تُكْفَى هَمَّكَ، وَيُغْفَرُ لَكَ ذَنْبُكَ»',
        quoteEn: '"Then your worries will be relieved, and your sins forgiven."',
        actionAr: 'صلِّ على الحبيب المصطفى 10 مرات مستحضراً رحمته وهديه في الإتقان.',
        actionEn: 'Send peace and blessings upon the Prophet 10 times reflecting on craftsmanship.',
      },
      {
        id: 'shukr',
        titleAr: 'شكر نعمة الفهم والتعلم',
        titleEn: 'Gratitude for Intellect & Ability',
        quoteAr: '«وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ»',
        quoteEn: '"If you are grateful, I will surely increase you in favor."',
        actionAr: 'قل: الحمد لله الذي بنعمته تتم الصالحات، حامداً على نعمة العقل والبرمجة.',
        actionEn: 'Say Alhamdulillah, grateful for the blessings of intellect and learning.',
      },
      {
        id: 'ergonomic',
        titleAr: 'إراحة الجسد وحفظ الأمانة',
        titleEn: 'Body Reset & Physical Amanah',
        quoteAr: '«إِنَّ لِجَسَدِكَ عَلَيْكَ حَقًّا»',
        quoteEn: '"Indeed, your body has a right over you."',
        actionAr: 'انظر إلى الأفق، خذ 3 أنفاس عميقة، واشرب كوب ماء مع تمديد الظهر والرقبة.',
        actionEn: 'Gaze at the horizon, take 3 deep breaths, hydrate, and stretch your spine.',
      },
      {
        id: 'tawakkul',
        titleAr: 'التوكل والاستعانة بالله',
        titleEn: 'Relying Sincerly on Allah',
        quoteAr: '«وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ»',
        quoteEn: '"And my success is not but through Allah. Upon Him I have relied."',
        actionAr: 'ادعُ: «اللهم لا سهل إلا ما جعلته سهلاً، وأنت تجعل الحزن إذا شئت سهلاً».',
        actionEn: 'Supplicate: O Allah, nothing is easy except what You make easy.',
      },
    ],
    []
  )

  const [activeReminderIdx, setActiveReminderIdx] = useState<number>(0)
  const currentReminder = SPIRITUAL_REMINDERS[activeReminderIdx]

  // Intentions Presets
  const INTENTION_PRESETS = [
    {
      ar: 'إتقان كتابة الكود وابتغاء مرضاة الله ونفع المسلمين',
      en: 'Code craftsmanship for the pleasure of Allah and benefiting humanity',
    },
    {
      ar: 'حل مشكلة الـ Bug بالتوكل على الله والاستعانة به',
      en: 'Debugging complex problem with sincere reliance upon Allah',
    },
    {
      ar: 'تعلم مهارة وخوارزمية جديدة بنية استثمار الوقت',
      en: 'Mastering a new technology with intention of purposeful time stewardship',
    },
    {
      ar: 'إصلاح وتوثيق الكود تسهيلاً وتيسيراً على زملائي المطورين',
      en: 'Refactoring and clean documentation to ease the workflow of my team',
    },
  ]

  // Persist completed sessions & intention
  useEffect(() => {
    localStorage.setItem('sanad_pomodoro_completed_today', completedSessions.toString())
  }, [completedSessions])

  useEffect(() => {
    localStorage.setItem('sanad_active_intention', intention)
  }, [intention])

  // Live browser tab title update
  const defaultTitleRef = useRef<string>(document.title || 'سند المُبرمج | Sanad Dev')

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`

  useEffect(() => {
    if (isRunning) {
      const modeLabel =
        mode === 'focus'
          ? isAr
            ? 'جلسة كود'
            : 'Focus'
          : isAr
          ? 'استراحة روحية'
          : 'Spiritual Break'
      document.title = `(${timeString}) ${modeLabel} - سند المُبرمج`
    } else {
      document.title = defaultTitleRef.current
    }

    return () => {
      document.title = defaultTitleRef.current
    }
  }, [isRunning, timeString, mode, isAr])

  // Countdown timer logic & transition handling
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      // Audio chime on session transition
      if (soundEnabled) {
        playSereneChime()
      }

      // Handle transitions
      if (mode === 'focus') {
        const nextCompleted = completedSessions + 1
        setCompletedSessions(nextCompleted)
        
        // Randomize devotional reminder for the break
        setActiveReminderIdx(Math.floor(Math.random() * SPIRITUAL_REMINDERS.length))

        // Every 4 focus sessions, offer long break
        if (nextCompleted % 4 === 0) {
          setMode('long_break')
          setTimeLeft(DURATIONS.long_break)
        } else {
          setMode('short_break')
          setTimeLeft(DURATIONS.short_break)
        }
      } else {
        // Break completed, back to focus
        setMode('focus')
        setTimeLeft(DURATIONS.focus)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, mode, completedSessions, soundEnabled, SPIRITUAL_REMINDERS.length, DURATIONS])

  // Timer controls
  const toggleTimer = () => setIsRunning((prev) => !prev)

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(DURATIONS[mode])
  }

  const switchMode = (newMode: PomodoroMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(DURATIONS[newMode])
  }

  const skipSession = () => {
    setIsRunning(false)
    if (soundEnabled) {
      playSereneChime()
    }
    if (mode === 'focus') {
      setActiveReminderIdx(Math.floor(Math.random() * SPIRITUAL_REMINDERS.length))
      setMode('short_break')
      setTimeLeft(DURATIONS.short_break)
    } else {
      setMode('focus')
      setTimeLeft(DURATIONS.focus)
    }
  }

  // Calculate circular progress
  const totalDuration = DURATIONS[mode]
  const progressRatio = Math.min(1, Math.max(0, (totalDuration - timeLeft) / totalDuration))
  
  // SVG circular properties
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progressRatio)

  const modeThemeColor =
    mode === 'focus'
      ? 'text-emerald-600 dark:text-emerald-400 stroke-emerald-500'
      : mode === 'short_break'
      ? 'text-teal-600 dark:text-teal-400 stroke-teal-500'
      : 'text-indigo-600 dark:text-indigo-400 stroke-indigo-500'

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <Timer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'تقنية بومودورو معطرة بالذكر' : 'Spiritual Focus Pomodoro'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isAr ? 'بومودورو إيماني للمبرمج' : 'Mindful Coding Sprint & Dhikr Breaks'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            {isAr
              ? 'نظم وقتك بين جلسات تركيز برمجية عميقة وفواصل ذكر وتدبر؛ لتبلغ الإتقان الهندسي بقلب حاضر ونية خالصة.'
              : 'Structure your work into deep coding sprints with rejuvenating spiritual breaks for intentional craftsmanship.'}
          </p>
        </div>

        {/* Quick completed counter badge */}
        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center min-w-[130px]">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold block flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isAr ? 'جلسات اليوم' : 'Today’s Sprints'}</span>
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-300 font-mono">
              {completedSessions}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Task & Intention Setting Card (النية قبل العمل) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {isAr ? 'عقد النية والمهمة البرمجية' : 'Developer Intention & Task Focus'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAr ? '«إنما الأعمال بالنيات» • استحضر نيتك الصالحة قبل بدء الكود' : 'Set your purposeful intention before writing code'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingIntention((prev) => !prev)}
            type="button"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {isEditingIntention
              ? isAr
                ? 'إخفاء المقترحات'
                : 'Hide Presets'
              : isAr
              ? 'تغيير أو اختيار نية مقترحة'
              : 'Choose Intent Preset'}
          </button>
        </div>

        {/* Active Intention Display or Input */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب نيتك أو مهمتك هنا (مثال: كتابة خوارزمية البحث بنية إتقان العمل ونفع الناس)...'
                  : 'Write your coding intention here (e.g. implementing search with craftsmanship)...'
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Quick Intention Presets */}
          {isEditingIntention && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-fade-in">
              {INTENTION_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIntention(isAr ? preset.ar : preset.en)
                    setIsEditingIntention(false)
                  }}
                  className="p-2.5 rounded-xl text-start text-xs font-medium border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition flex items-center justify-between"
                >
                  <span>{isAr ? preset.ar : preset.en}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ms-1 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Circular Timer Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:10 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 mb-8 max-w-full overflow-x-auto no-scrollbar">
          <button
            onClick={() => switchMode('focus')}
            type="button"
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              mode === 'focus'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'جلسة برمجة (25 د)' : 'Focus Code (25m)'}
          </button>

          <button
            onClick={() => switchMode('short_break')}
            type="button"
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              mode === 'short_break'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'استراحة ذكر قصيرة (5 د)' : 'Short Dhikr Break (5m)'}
          </button>

          <button
            onClick={() => switchMode('long_break')}
            type="button"
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              mode === 'long_break'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'استراحة تدبر وإطالة (15 د)' : 'Long Spiritual Pause (15m)'}
          </button>
        </div>

        {/* Circular SVG Timer */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
            {/* Background Track Circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800 fill-none"
              strokeWidth="12"
            />
            {/* Dynamic Progress Circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className={`fill-none ${modeThemeColor} transition-all duration-700`}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Digital Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {mode === 'focus'
                ? isAr
                  ? 'جلسة كتابة الكود'
                  : 'Coding Sprint'
                : mode === 'short_break'
                ? isAr
                  ? 'استراحة ذكر قصيرة'
                  : 'Short Dhikr Break'
                : isAr
                ? 'استراحة تدبر وإطالة'
                : 'Long Spiritual Pause'}
            </span>

            {/* Countdown Digits */}
            <div className="font-mono text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
              {timeString}
            </div>

            {/* Active intention pill inside ring */}
            {intention && (
              <div className="max-w-[190px] truncate text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 px-2.5 py-0.5 rounded-full mt-1">
                {intention}
              </div>
            )}

            {/* Session Indicator Dots */}
            <div className="flex items-center gap-1.5 pt-2">
              {[0, 1, 2, 3].map((dot) => {
                const isDotCompleted = dot < (completedSessions % 4 || (completedSessions > 0 ? 4 : 0))
                return (
                  <span
                    key={dot}
                    className={`w-2 h-2 rounded-full transition-all ${
                      isDotCompleted
                        ? 'bg-emerald-500 scale-110 shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Controls: Play/Pause, Reset, Skip */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={resetTimer}
            type="button"
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={isAr ? 'إعادة ضبط المؤقت' : 'Reset Timer'}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            type="button"
            className={`px-10 py-4 rounded-2xl text-white font-black text-base shadow-lg transition flex items-center gap-2.5 ${
              mode === 'focus'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                : mode === 'short_break'
                ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-600/25'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            <span>
              {isRunning
                ? isAr
                  ? 'إيقاف مؤقت'
                  : 'Pause'
                : isAr
                ? 'بدء الجلسة'
                : 'Start Sprint'}
            </span>
          </button>

          <button
            onClick={skipSession}
            type="button"
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={isAr ? 'تخطي إلى الجلسة التالية' : 'Skip to Next'}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Chime Notification Switch */}
        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            <Volume2 className={`w-3.5 h-3.5 ${soundEnabled ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span>
              {soundEnabled
                ? isAr
                  ? 'جرس التنبيه الإيماني مفعّل'
                  : 'Chime on Transition Enabled'
                : isAr
                ? 'الجرس صامت'
                : 'Chime Muted'}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Devotional Inspiration during Breaks Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                {isAr ? 'زاد المبرمج أثناء فترات الاستراحة' : 'Mindful Reflection for Coding Breaks'}
              </span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isAr ? currentReminder.titleAr : currentReminder.titleEn}
              </h3>
            </div>
          </div>

          <button
            onClick={() =>
              setActiveReminderIdx((prev) => (prev + 1) % SPIRITUAL_REMINDERS.length)
            }
            type="button"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition"
            title={isAr ? 'تغيير الذكر / الفائدة' : 'New Reminder'}
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isAr ? 'تذكير آخر' : 'Next Insight'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-emerald-200/50 dark:border-slate-700/60 space-y-2">
          <p className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-200 leading-relaxed font-serif">
            {isAr ? currentReminder.quoteAr : currentReminder.quoteEn}
          </p>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 flex-shrink-0" />
            <span>{isAr ? currentReminder.actionAr : currentReminder.actionEn}</span>
          </p>
        </div>

        {/* Quick Launch: Digital Tasbih & Dev Du'aa */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'تريد ذكراً مخصصاً أو أدعية لتيسير الكود؟' : 'Need custom dhikr or dev problem-solving du\'aa?'}
          </span>
          <button
            type="button"
            onClick={() => setIsSpiritualToolsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{isAr ? 'فتح مسبحة المبرمج وأدعية الكود' : 'Open Digital Tasbih & Du\'aa'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
