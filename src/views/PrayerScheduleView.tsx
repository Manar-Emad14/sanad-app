import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import {
  Compass,
  MoonStar,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Navigation,
  CheckCircle2,
  MapPin,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  Play,
  Clock,
  Bell,
  Square,
  Music,
  ChevronDown,
} from 'lucide-react'
import { Prayer } from 'adhan'
import { formatTime } from '../utils/prayer'
import { playAdhanAudio, stopAdhanAudio, isAdhanAudioPlaying, ADHAN_OPTIONS_LIST } from '../utils/audio'
import { requestNotificationPermission } from '../utils/notifications'
import type { AdhanAudioOption } from '../types'

export const PrayerScheduleView: React.FC = () => {
  const {
    lang,
    cairoPrayerData,
    prayerStatus,
    prayerMode,
    togglePrayerMode,
    notificationSettings,
    setNotificationSettings,
    setIsNotificationModalOpen,
  } = useApp()

  const isAr = lang === 'ar'
  const { prayerTimes, sunnahTimes, qiblaAngle } = cairoPrayerData

  // Sound notifications state
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sanad_adhan_audio') !== 'false'
  })
  const [isPlayingTestSound, setIsPlayingTestSound] = useState<boolean>(false)

  // Full-screen contemplative mode state
  const [isFullScreenContemplation, setIsFullScreenContemplation] = useState<boolean>(false)

  useEffect(() => {
    const onStart = () => setIsPlayingTestSound(true)
    const onStop = () => setIsPlayingTestSound(false)

    window.addEventListener('sanad:adhan-playing', onStart)
    window.addEventListener('sanad:adhan-stopped', onStop)
    return () => {
      window.removeEventListener('sanad:adhan-playing', onStart)
      window.removeEventListener('sanad:adhan-stopped', onStop)
    }
  }, [])

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => {
      const next = !prev
      localStorage.setItem('sanad_adhan_audio', String(next))
      return next
    })
  }

  const handleTestSound = () => {
    if (isPlayingTestSound || isAdhanAudioPlaying()) {
      stopAdhanAudio()
      setIsPlayingTestSound(false)
    } else {
      setIsPlayingTestSound(true)
      playAdhanAudio(notificationSettings.adhanAudioOption, 85)
    }
  }

  const prayers = [
    {
      id: Prayer.Fajr,
      nameAr: 'الفجر',
      nameEn: 'Fajr',
      time: prayerTimes.fajr,
      icon: MoonStar,
      color: 'from-blue-600 to-indigo-600',
      descAr: 'طلوع الفجر الصادق (زاوية 19.5°)',
      descEn: 'True Dawn (19.5° angle)',
    },
    {
      id: Prayer.Sunrise,
      nameAr: 'الشروق',
      nameEn: 'Sunrise',
      time: prayerTimes.sunrise,
      icon: Sunrise,
      color: 'from-orange-500 to-rose-500',
      descAr: 'شروق قرص الشمس ونهاية وقت الفجر',
      descEn: 'Solar disk emergence & end of Fajr',
    },
    {
      id: Prayer.Dhuhr,
      nameAr: 'الظهر',
      nameEn: 'Dhuhr',
      time: prayerTimes.dhuhr,
      icon: Sun,
      color: 'from-sky-500 to-teal-500',
      descAr: 'زوال الشمس عن كبد السماء',
      descEn: 'Solar Zenith',
    },
    {
      id: Prayer.Asr,
      nameAr: 'العصر',
      nameEn: 'Asr',
      time: prayerTimes.asr,
      icon: Sun,
      color: 'from-teal-600 to-emerald-700',
      descAr: 'ظل الشيء مثله (المذهب الشافعي)',
      descEn: 'Shadow equals height',
    },
    {
      id: Prayer.Maghrib,
      nameAr: 'المغرب',
      nameEn: 'Maghrib',
      time: prayerTimes.maghrib,
      icon: Sunset,
      color: 'from-rose-500 to-red-600',
      descAr: 'غروب كامل قرص الشمس ودخول وقت الإفطار',
      descEn: 'Sunset completion',
    },
    {
      id: Prayer.Isha,
      nameAr: 'العشاء',
      nameEn: 'Isha',
      time: prayerTimes.isha,
      icon: Moon,
      color: 'from-indigo-600 to-slate-800',
      descAr: 'مغيب الشفق الأحمر (زاوية 17.5°)',
      descEn: 'Twilight disappearance (17.5°)',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header & Location Settings Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? 'جمهورية مصر العربية • القاهرة (30.04° N, 31.23° E)' : 'Egypt • Cairo (30.04° N, 31.23° E)'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>{isAr ? 'الهيئة المصرية العامة للمساحة' : 'Egyptian Survey Authority'}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isAr ? 'جدول مواقيت الصلاة في القاهرة' : 'Cairo Daily Prayer Timetable'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            {isAr
              ? 'مواقيت دقيقة محسوبة فلكياً وفق زوايا هيئة المساحة المصرية (الفجر: 19.5°، العشاء: 17.5°). يتكيف الجدول تلقائياً مع توقيت دخول الصلوات.'
              : 'Astronomically calculated prayer times matching official Egyptian General Authority of Survey standards.'}
          </p>
        </div>

        {/* Audio, Push Notifications & Prayer Mode Actions */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Push Notification Toggle */}
            <button
              onClick={async () => {
                if (!notificationSettings.prayerAlerts) {
                  const perm = await requestNotificationPermission()
                  if (perm === 'granted') {
                    setNotificationSettings({
                      ...notificationSettings,
                      prayerAlerts: true,
                    })
                  } else {
                    setIsNotificationModalOpen(true)
                  }
                } else {
                  setNotificationSettings({
                    ...notificationSettings,
                    prayerAlerts: false,
                  })
                }
              }}
              type="button"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                notificationSettings.prayerAlerts
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
              title={isAr ? 'تفعيل إشعارات الأذان المباشرة' : 'Toggle Prayer Push Notifications'}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>
                {notificationSettings.prayerAlerts
                  ? isAr
                    ? 'إشعارات الأذان مفعّلة'
                    : 'Prayer Alerts On'
                  : isAr
                  ? 'تفعيل إشعارات الأذان'
                  : 'Enable Prayer Alerts'}
              </span>
            </button>

            {/* Notification Hub Modal Opener */}
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              type="button"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title={isAr ? 'مركز إعدادات الإشعارات' : 'Notification Hub'}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">{isAr ? 'الإشعارات' : 'Alerts'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Adhan Audio Notification Switch */}
            <button
              onClick={toggleAudio}
              type="button"
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isAudioEnabled
                  ? 'bg-slate-900 text-white dark:bg-slate-750'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              title={isAr ? 'تفعيل / تعطيل صوت التنبيه' : 'Toggle Audio Alerts'}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span>{isAudioEnabled ? (isAr ? 'الصوت مفعّل' : 'Audio On') : (isAr ? 'صامت' : 'Muted')}</span>
            </button>

            {isAudioEnabled && (
              <button
                onClick={handleTestSound}
                type="button"
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isPlayingTestSound
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                }`}
                title={isAr ? 'تجربة تشغيل صوت الأذان المختار' : 'Test Selected Adhan Audio'}
              >
                {isPlayingTestSound ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>{isAr ? 'إيقاف الصوت' : 'Stop Audio'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isAr ? 'تجربة تشغيل الصوت' : 'Test Audio'}</span>
                  </>
                )}
              </button>
            )}

            {/* Prayer Mode Trigger */}
            <button
              onClick={togglePrayerMode}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border shadow-xs cursor-pointer ${
                prayerMode
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/25 ring-2 ring-emerald-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <MoonStar className={`w-4 h-4 ${prayerMode ? 'animate-pulse text-white' : 'text-emerald-600'}`} />
              <span>
                {prayerMode
                  ? isAr
                    ? 'وضع الصلاة نشط'
                    : 'Prayer Active'
                  : isAr
                  ? 'وضع الصلاة'
                  : 'Prayer Mode'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Muezzin / Adhan Voice Selection Card */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {isAr ? 'صوت الأذان المفضل للمواقيت' : 'Preferred Adhan Sound'}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold font-mono flex-shrink-0">
                  {isAr ? 'مخزن أوفلاين' : 'Offline Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'أذان الشيخ محمد رفعت، الحرم المكي، المسجد النبوي، أو المسجد الأقصى'
                  : 'Sheikh Refaat (Cairo TV), Makkah, Madinah, or Al-Aqsa'}
              </p>
            </div>
          </div>
        </div>

        {/* Full-width Dropdown Selector */}
        <div className="w-full space-y-3">
          <div className="relative w-full">
            <select
              value={notificationSettings.adhanAudioOption}
              onChange={(e) => {
                const val = e.target.value as AdhanAudioOption
                setNotificationSettings({ ...notificationSettings, adhanAudioOption: val })
                localStorage.setItem('sanad_adhan_audio_option', val)
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold px-4 py-3 pe-10 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 appearance-none transition-colors"
              aria-label={isAr ? 'اختيار صوت المؤذن' : 'Select Muezzin'}
            >
              {ADHAN_OPTIONS_LIST.map((opt) => (
                <option key={opt.id} value={opt.id} className="py-1">
                  {isAr ? `${opt.labelAr} - ${opt.subAr}` : `${opt.labelEn} - ${opt.subEn}`}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-4 text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Action Row Below Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isAr
                ? 'يعمل الأذان بصوت المؤذن المختار تلقائياً عند حلول موعد الصلاة'
                : 'Plays selected Adhan audio automatically at prayer times'}
            </span>

            <button
              type="button"
              onClick={handleTestSound}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs flex-shrink-0 ${
                isPlayingTestSound
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-600/25'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
              }`}
              title={isPlayingTestSound ? (isAr ? 'إيقاف الصوت' : 'Stop') : (isAr ? 'معاينة الصوت المختار' : 'Preview')}
            >
              {isPlayingTestSound ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{isAr ? 'إيقاف الأذان' : 'Stop Adhan'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isAr ? 'استماع ومعاينة' : 'Preview'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Full-Screen / Banner Contemplation State when Prayer Mode is Active */}
      {prayerMode && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-500/40 shadow-xl animate-fade-in">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <MoonStar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'خلوة مع الله • توقف عن الكود' : 'Communion with Allah • Step Away from Code'}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {isAr ? '«حان الآن وقت اللقاء مع الله»' : '"Now is the Time to Meet with Allah"'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {isAr
                  ? 'قم وأسبغ الوضوء وأقبل على صلاتك بقلب حاضر خاشع. دع مشاكل الكود والخوارزميات جانباً؛ فالأرزاق والحلول بيد من تقف بين يديه سبحانه.'
                  : 'Step away from screen, perform mindful ablution, and stand in prayer with presence. The best debugger of minds is sincere prostration.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullScreenContemplation(true)}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                <span>{isAr ? 'شاشة السكينة الكاملة' : 'Full Immersion'}</span>
              </button>

              <button
                onClick={togglePrayerMode}
                type="button"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition shadow-md shadow-emerald-500/20"
              >
                {isAr ? 'إنهاء الخلوة' : 'Resume Work'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. Full-Screen Contemplation Modal Overlay */}
      {isFullScreenContemplation && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <button
            onClick={() => setIsFullScreenContemplation(false)}
            type="button"
            className="absolute top-6 end-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-2 text-xs font-bold"
          >
            <Minimize2 className="w-4 h-4" />
            <span>{isAr ? 'تصغير' : 'Minimize'}</span>
          </button>

          <div className="max-w-xl space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/30">
              <MoonStar className="w-10 h-10 animate-pulse text-emerald-300" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {isAr ? 'خلوة المبرمج' : 'Mindful Prayer Meditation'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {isAr ? 'حان الآن وقت اللقاء مع الله' : 'Now is the Time to Meet with Allah'}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isAr
                  ? '«وجُعِلتْ قُرّةُ عيني في الصلاة» • خفف عن عينيك وعقلك، واترك البرمجة لدقائق تسبح فيها بحمد ربك.'
                  : '"My utmost delight has been placed in prayer." • Relieve your eyes and soul in sincere prayer.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-4">
              <div>
                <span className="text-xs text-slate-400 block">{isAr ? 'الصلاة القادمة' : 'Next Prayer'}</span>
                <span className="text-xl font-bold text-white">
                  {isAr ? prayerStatus.nextPrayerName.ar : prayerStatus.nextPrayerName.en}
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-xs text-slate-400 block">{isAr ? 'المتبقي' : 'Countdown'}</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {prayerStatus.countdown}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsFullScreenContemplation(false)}
              type="button"
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/20"
            >
              {isAr ? 'العودة للتطبيق' : 'Back to Dashboard'}
            </button>
          </div>
        </div>
      )}

      {/* 4. Daily Prayer Timetable Grid (with dynamic pulse on current and upcoming) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'مواقيت الصلوات الخمس والشروق' : 'Five Daily Prayers & Sunrise'}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'توقيت محلي: جمهورية مصر العربية' : 'Local Cairo Egyptian Standard Time'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {prayers.map((prayer) => {
            const isCurrent = prayerStatus.currentPrayer === prayer.id
            const isNext = prayerStatus.nextPrayer === prayer.id
            const Icon = prayer.icon

            return (
              <div
                key={prayer.id}
                className={`relative rounded-3xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/25'
                    : isNext
                    ? 'bg-gradient-to-br from-teal-50/50 to-white dark:from-teal-950/30 dark:to-slate-900 border-teal-500 shadow-xs ring-1 ring-teal-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                {/* Current Active Prayer Badge with Pulse */}
                {isCurrent && (
                  <div className="absolute top-4 end-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'وقت الصلاة الحالي' : 'Active Prayer'}</span>
                  </div>
                )}

                {/* Upcoming Next Prayer Badge */}
                {isNext && !isCurrent && (
                  <div className="absolute top-4 end-4 flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    <span>{isAr ? 'الصلاة القادمة' : 'Upcoming'}</span>
                  </div>
                )}

                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${prayer.color} flex items-center justify-center text-white mb-4 shadow-sm`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">
                    {isAr ? prayer.nameAr : prayer.nameEn}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isAr ? prayer.descAr : prayer.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {isAr ? 'الأذان' : 'Adhan Time'}
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {formatTime(prayer.time, isAr ? 'ar' : 'en')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Cairo Qibla Direction & Sunnah Night Times Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Qibla Visual Compass Card for Cairo */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {isAr ? 'مؤشر اتجاه القبلة من القاهرة' : 'Cairo Qibla Bearing Indicator'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? 'زاوية السمت الدقيقة من الشمال الحقيقي' : 'True North Azimuth Bearing Angle'}
                  </p>
                </div>
              </div>

              <div className="text-sm font-mono font-black px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {qiblaAngle}° ESE
              </div>
            </div>

            {/* Visual Compass Graphic */}
            <div className="py-6 flex items-center justify-center">
              <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 shadow-inner">
                {/* Cardinal Points */}
                <span className="absolute top-2 text-xs font-bold text-slate-400">N (شمال)</span>
                <span className="absolute bottom-2 text-xs font-bold text-slate-400">S (جنوب)</span>
                <span className="absolute end-2 text-xs font-bold text-slate-400">E (شرق)</span>
                <span className="absolute start-2 text-xs font-bold text-slate-400">W (غرب)</span>

                {/* Rotating Compass Needle pointer with Kaaba symbol */}
                <div
                  className="w-1.5 h-32 bg-gradient-to-t from-slate-400 to-emerald-500 rounded-full transition-transform duration-700 relative flex flex-col justify-between items-center"
                  style={{ transform: `rotate(${qiblaAngle}deg)` }}
                >
                  <Navigation className="w-5 h-5 text-emerald-600 fill-emerald-600 -mt-2.5 drop-shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white ring-2 ring-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
            {isAr
              ? `زاوية القبلة من القاهرة تبلغ ${qiblaAngle} درجة باتجاه الجنوب الشرقي نحو المسجد الحرام بمكة المكرمة (مسافة ~1,290 كم).`
              : `Cairo Qibla orientation points ${qiblaAngle}° towards the Holy Kaaba in Makkah (~1,290 km distance).`}
          </div>
        </div>

        {/* Sunnah & Nocturnal Prayer Hours */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <MoonStar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isAr ? 'أوقات قيام الليل والسُّنن النبوية' : 'Sunnah Night & Tahajjud Intervals'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'محسوبة من الغروب حتى طلوع الفجر' : 'Calculated between Sunset and True Dawn'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {isAr ? 'منتصف الليل الشرعي' : 'Middle of the Night'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? 'انتهاء وقت العشاء الاختياري وبدء وقت التهجد' : 'End of Isha preferred time'}
                  </div>
                </div>
                <div className="font-mono font-black text-base text-indigo-600 dark:text-indigo-400">
                  {formatTime(sunnahTimes.middleOfTheNight, isAr ? 'ar' : 'en')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {isAr ? 'الثلث الأخير من الليل' : 'Last Third of the Night'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? 'أعظم أوقات الاستجابة والدعاء وقضاء الحوائج' : 'Optimal hour for Du’a & forgiveness'}
                  </div>
                </div>
                <div className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                  {formatTime(sunnahTimes.lastThirdOfTheNight, isAr ? 'ar' : 'en')}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{isAr ? 'المرجعية الفقهية:' : 'Jurisprudence Basis:'}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'دار الإفتاء المصرية وهيئة المساحة' : 'Dar Al-Ifta & Survey Authority of Egypt'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
