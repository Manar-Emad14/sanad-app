import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import {
  Bell,
  BellRing,
  Sunrise,
  Timer,
  CheckCircle2,
  AlertTriangle,
  X,
  Volume2,
  Sparkles,
  Heart,
  MoonStar,
  Send,
  Play,
  Square,
  Music,
  ShieldCheck,
  Sliders,
  History,
  Trash2,
  RefreshCw,
  Inbox,
  Sun,
  User,
  Shield,
} from 'lucide-react'
import {
  getNotificationPermission,
  requestNotificationPermission,
  dispatchNotification,
  scheduleBackgroundTestNotification,
  queryServiceWorkerStatus,
  triggerImmediateSalawatSw,
  triggerImmediateWaqarSw,
  triggerImmediatePeaceSw,
  DEFAULT_SW_LIVE_STATUS,
  type SwLiveStatus,
  type NotificationPermissionStatus,
} from '../utils/notifications'
import { getWaqarMessages } from '../constants/waqar'
import { PEACE_MOTIVATION_MESSAGES } from '../constants/peaceMotivation'
import {
  playAdhanAudio,
  stopAdhanAudio,
  isAdhanAudioPlaying,
  playSalawatReminder,
  isSalawatPlaying,
  playNotificationSound,
  stopAllAudio,
  ADHAN_OPTIONS_LIST,
  unlockGlobalAudio,
} from '../utils/audio'
import {
  startPrayerKeepAlive,
  stopPrayerKeepAlive,
  isPrayerGuardActive,
} from '../utils/wakeLock'
import type { AdhanAudioOption } from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const NotificationSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    lang,
    notificationSettings,
    setNotificationSettings,
    recentNotifications,
    clearRecentNotifications,
    userProfile,
    updateUserProfile,
  } = useApp()
  const isAr = lang === 'ar'

  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'recent'>('settings')
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>(() =>
    getNotificationPermission()
  )
  const [testSent, setTestSent] = useState(false)
  const [isPlayingAudioTest, setIsPlayingAudioTest] = useState(() => isAdhanAudioPlaying())
  const [isPlayingSalawatTest, setIsPlayingSalawatTest] = useState(() => isSalawatPlaying())
  const [isTesting5s, setIsTesting5s] = useState(false)
  const [countdown5s, setCountdown5s] = useState(5)
  const timer5sRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Background SW status & direct trigger
  const [swStatus, setSwStatus] = useState<SwLiveStatus>(DEFAULT_SW_LIVE_STATUS)
  const [isTriggeringSalawat, setIsTriggeringSalawat] = useState(false)
  const [isTriggeringWaqar, setIsTriggeringWaqar] = useState(false)
  const [isTriggeringPeace, setIsTriggeringPeace] = useState(false)
  const [guardActive, setGuardActive] = useState(() => isPrayerGuardActive())

  const fetchSwStatus = async () => {
    try {
      const s = await queryServiceWorkerStatus()
      if (s) {
        setSwStatus(s)
      }
    } catch {}
  }

  useEffect(() => {
    const handleStart = () => setIsPlayingAudioTest(true)
    const handleStop = () => setIsPlayingAudioTest(false)
    const handleSalawatStart = () => setIsPlayingSalawatTest(true)
    const handleSalawatStop = () => setIsPlayingSalawatTest(false)

    window.addEventListener('sanad:adhan-playing', handleStart)
    window.addEventListener('sanad:adhan-stopped', handleStop)
    window.addEventListener('sanad:salawat-playing', handleSalawatStart)
    window.addEventListener('sanad:salawat-stopped', handleSalawatStop)
    return () => {
      window.removeEventListener('sanad:adhan-playing', handleStart)
      window.removeEventListener('sanad:adhan-stopped', handleStop)
      window.removeEventListener('sanad:salawat-playing', handleSalawatStart)
      window.removeEventListener('sanad:salawat-stopped', handleSalawatStop)
      if (timer5sRef.current) {
        clearInterval(timer5sRef.current)
        timer5sRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    fetchSwStatus()
    const intv = setInterval(fetchSwStatus, 15000)
    return () => clearInterval(intv)
  }, [isOpen])

  const handleClose = () => {
    if (timer5sRef.current) {
      clearInterval(timer5sRef.current)
      timer5sRef.current = null
    }
    setIsTesting5s(false)
    setCountdown5s(5)
    stopAllAudio()
    onClose()
  }

  const handleToggleAudioPreview = () => {
    if (isPlayingAudioTest) {
      stopAdhanAudio()
      setIsPlayingAudioTest(false)
    } else {
      playAdhanAudio(notificationSettings.adhanAudioOption, 85)
      setIsPlayingAudioTest(true)
    }
  }

  const handleToggleSalawatPreview = () => {
    if (isPlayingSalawatTest) {
      stopAllAudio()
      setIsPlayingSalawatTest(false)
    } else {
      playSalawatReminder(90)
      setIsPlayingSalawatTest(true)
    }
  }

  const handleTestWaqar = () => {
    // Immediately play gentle chime audio
    playNotificationSound('waqar', 85)

    const list = getWaqarMessages(userProfile.gender || 'female')
    const randomMsg = list[Math.floor(Math.random() * list.length)]
    let body = isAr ? randomMsg.bodyAr : randomMsg.bodyEn
    if (userProfile.name && userProfile.name.trim()) {
      body = `يا ${userProfile.name.trim()}، ${body}`
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sanad:toast', {
          detail: {
            id: `waqar-test-${Date.now()}`,
            title: isAr ? randomMsg.titleAr : randomMsg.titleEn,
            body,
            type: 'waqar',
            timestamp: Date.now(),
          },
        })
      )
    }
  }

  const handleTriggerDirectSalawat = async () => {
    setIsTriggeringSalawat(true)
    try {
      await triggerImmediateSalawatSw()
      setTimeout(fetchSwStatus, 1000)
    } catch {} finally {
      setIsTriggeringSalawat(false)
    }
  }

  const handleTriggerDirectWaqar = async () => {
    setIsTriggeringWaqar(true)
    try {
      await triggerImmediateWaqarSw()
      setTimeout(fetchSwStatus, 1000)
    } catch {} finally {
      setIsTriggeringWaqar(false)
    }
  }

  const handleTriggerDirectPeace = async () => {
    setIsTriggeringPeace(true)
    try {
      await triggerImmediatePeaceSw()
      setTimeout(fetchSwStatus, 1000)
    } catch {} finally {
      setIsTriggeringPeace(false)
    }
  }

  const handleTestPeace = () => {
    unlockGlobalAudio()
    const rand = PEACE_MOTIVATION_MESSAGES[Math.floor(Math.random() * PEACE_MOTIVATION_MESSAGES.length)]
    let body = isAr ? rand.bodyAr : rand.bodyEn
    if (userProfile.name && userProfile.name.trim()) {
      body = `يا ${userProfile.name.trim()}، ${body}`
    }

    dispatchNotification({
      title: isAr ? rand.titleAr : rand.titleEn,
      body,
      type: 'peace',
      sound: notificationSettings.soundEnabled !== false,
      onToast: (toast) => {
        window.dispatchEvent(new CustomEvent('sanad:toast', { detail: toast }))
      },
    })
  }

  const handleRequestPermission = async () => {
    const status = await requestNotificationPermission()
    setPermissionStatus(status)
  }

  const handleTestNotification = async () => {
    if (permissionStatus !== 'granted') {
      const status = await requestNotificationPermission()
      setPermissionStatus(status)
    }

    dispatchNotification({
      title: isAr
        ? 'سند المُبرمج • إشعار تجريبي ناجح'
        : 'Sanad Dev • Test Notification Successful',
      body: isAr
        ? 'تم تشغيل نظام الإشعارات والصوت بنجاح! ستصلك تنبيهات الصلاة والنصائح في أوقاتها.'
        : 'Notification and audio systems verified! You will receive prayer alerts and daily tips on schedule.',
      type: 'prayer',
      sound: notificationSettings.soundEnabled,
      adhanAudioOption: notificationSettings.adhanAudioOption,
    })
    setTestSent(true)
    setTimeout(() => setTestSent(false), 3000)
  }

  const handleTest5sNotification = async () => {
    if (isTesting5s) return
    setIsTesting5s(true)
    setCountdown5s(5)

    if (timer5sRef.current) {
      clearInterval(timer5sRef.current)
      timer5sRef.current = null
    }

    try {
      const scheduled = await scheduleBackgroundTestNotification({
        delayMs: 5000,
        title: isAr ? 'سند المُبرمج • اختبار الإشعار والتطبيق مغلق' : 'Sanad Dev • Background Test Notification',
        body: isAr
          ? 'وصلك هذا الإشعار بنجاح عبر Service Worker والتطبيق مغلق تماماً!'
          : 'Received successfully via Service Worker while the app was closed!',
        type: 'prayer',
      })

      if (!scheduled) {
        setIsTesting5s(false)
        return
      }

      timer5sRef.current = setInterval(() => {
        setCountdown5s((prev) => {
          if (prev <= 1) {
            if (timer5sRef.current) {
              clearInterval(timer5sRef.current)
              timer5sRef.current = null
            }
            setIsTesting5s(false)
            return 5
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      console.warn('[NotificationModal] Test 5s error:', err)
      setIsTesting5s(false)
    }
  }

  const toggleSetting = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    })
  }

  const setAudioOption = (option: AdhanAudioOption) => {
    setNotificationSettings({
      ...notificationSettings,
      adhanAudioOption: option,
    })
    if (isPlayingAudioTest) {
      playAdhanAudio(option, 85)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-[92%] max-w-md max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="p-3.5 sm:p-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 flex-shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight truncate">
                {isAr ? 'إعدادات الإشعارات والتنبيهات' : 'Notification & Alerts Hub'}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {isAr
                  ? 'تخصيص مواعيد الأذان، النصائح اليومية، وأذكار الصلاة على النبي'
                  : 'Configure prayer times, daily tips, and periodic dhikr'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex-shrink-0"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher - Fixed Subheader */}
        <div className="px-3 sm:px-4 pt-2 pb-2 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('settings')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'settings'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAr ? 'الإعدادات والتخصيص' : 'Settings'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('recent')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer relative ${
              activeSubTab === 'recent'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isAr ? 'سجل الإشعارات والإشراقات' : 'Recent Archive'}</span>
            {recentNotifications.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {recentNotifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {activeSubTab === 'recent' ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isAr ? 'آخر الإشعارات المحفوظة' : 'Recent Received Alerts'}</span>
                </span>

                {recentNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearRecentNotifications}
                    className="text-[11px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold flex items-center gap-1 cursor-pointer transition"
                    title={isAr ? 'مسح سجل الإشعارات' : 'Clear notification history'}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{isAr ? 'مسح السجل' : 'Clear'}</span>
                  </button>
                )}
              </div>

              {recentNotifications.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'لا توجد إشعارات سابقة حتى الآن' : 'No recent notifications yet'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {isAr
                      ? 'ستظهر هنا أحدث الإشعارات والإشراقات التي ظهرت لك لتتمكن من مراجعتها في أي وقت'
                      : 'Recent notifications and insights will be archived here for your review'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentNotifications.map((n) => {
                    const date = new Date(n.timestamp)
                    const timeFormatted = date.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    const isPrayer = n.type === 'prayer'
                    const isPreAdhan = n.type === 'pre_adhan'
                    const isTip = n.type === 'tip'
                    const isSalawat = n.type === 'salawat'
                    const isWaqar = n.type === 'waqar'
                    const isPeace = n.type === 'peace'
                    const isDhikr = n.type === 'dhikr'

                    const badgeBg = isPrayer
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                      : isPreAdhan
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25'
                      : isTip
                      ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25'
                      : isSalawat
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                      : isWaqar
                      ? 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/25'
                      : isPeace
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25'
                      : isDhikr
                      ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/25'
                      : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/25'

                    const badgeLabel = isPrayer
                      ? (isAr ? 'نداء الصلاة' : 'Prayer')
                      : isPreAdhan
                      ? (isAr ? 'اقتراب الأذان' : 'Pre-Adhan')
                      : isTip
                      ? (isAr ? 'إشراقة المبرمج' : 'Dev Tip')
                      : isSalawat
                      ? (isAr ? 'الصلاة على النبي ﷺ' : 'Salawat')
                      : isWaqar
                      ? (isAr ? 'وَقار' : 'Waqar')
                      : isPeace
                      ? (isAr ? 'سكينة وبُشرى' : 'Peace')
                      : isDhikr
                      ? (isAr ? 'ورد وسكينة' : 'Dhikr')
                      : (isAr ? 'تنبيه' : 'Alert')

                    return (
                      <div
                        key={n.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 transition-all hover:border-emerald-500/40"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                            {badgeLabel}
                          </span>

                          <span className="text-[10px] text-slate-400 font-mono">
                            {timeFormatted}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                          {n.title}
                        </h4>

                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {n.body}
                        </p>

                        <div className="pt-1.5 flex items-center justify-end gap-2 border-t border-slate-200/50 dark:border-slate-700/40">
                          <button
                            type="button"
                            onClick={() => {
                              window.dispatchEvent(
                                new CustomEvent('sanad:toast', {
                                  detail: {
                                    ...n,
                                    id: `replay-${Date.now()}`,
                                    timestamp: Date.now(),
                                  },
                                })
                              )
                            }}
                            className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>{isAr ? 'إعادة عرض على الشاشة' : 'Replay on screen'}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Permission Status Card */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  {permissionStatus === 'granted' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {isAr ? 'إذن إشعارات المتصفح (Browser Push)' : 'Browser Push Notifications'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {permissionStatus === 'granted'
                        ? isAr
                          ? 'الإشعارات مفعلة ومصرح بها في المتصفح'
                          : 'Permission granted and active'
                        : permissionStatus === 'denied'
                        ? isAr
                          ? 'الإذن مرفوض (يرجى السماح به من إعدادات المتصفح)'
                          : 'Permission blocked in browser settings'
                        : isAr
                        ? 'الإذن بانتظار الموافقة'
                        : 'Permission not yet requested'}
                    </span>
                  </div>
                </div>

                {permissionStatus !== 'granted' && (
                  <button
                    onClick={handleRequestPermission}
                    type="button"
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer flex-shrink-0"
                  >
                    <Bell className="w-3 h-3" />
                    <span>{isAr ? 'طلب الإذن' : 'Enable'}</span>
                  </button>
                )}
              </div>

              {/* User Profile & Personalization Card */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {isAr ? 'الملف الشخصي وتخصيص الرسائل' : 'Personalization & Profile'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-emerald-300/70 block">
                        {isAr ? 'تخصيص الاسم ومسار تنبيهات وقار' : 'Customize name and Waqar reminders'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-emerald-200 block">
                    {isAr ? 'الاسم أو الكنية المفضلة (يُدمج تلقائياً في التنبيهات):' : 'Preferred Name (included in alerts):'}
                  </label>
                  <input
                    type="text"
                    value={userProfile.name || ''}
                    onChange={(e) => updateUserProfile({ name: e.target.value })}
                    placeholder={isAr ? 'مثال: عبد الرحمن أو فاطمة' : 'e.g., Omar or Sarah'}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-700/50 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    maxLength={40}
                  />
                </div>

                {/* Gender Selector for Waqar */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-emerald-200 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span>{isAr ? 'نوع رسائل «وَقار»:' : 'Waqar Theme:'}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateUserProfile({ gender: 'female' })}
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        userProfile.gender === 'female'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500/50'
                      }`}
                    >
                      <Heart className="w-3 h-3 text-rose-300" />
                      <span>{isAr ? 'أخت (الحجاب والعفة)' : 'Sister (Modesty)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateUserProfile({ gender: 'male' })}
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        userProfile.gender === 'male'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500/50'
                      }`}
                    >
                      <Shield className="w-3 h-3 text-teal-300" />
                      <span>{isAr ? 'أخ (غض البصر والمروءة)' : 'Brother (Chivalry)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Switch 1: Prayer Alerts */}
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50 space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <MoonStar className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {isAr ? 'تنبيهات الصلوات الخمس (القاهرة)' : 'Cairo 5 Daily Prayer Alerts'}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {isAr
                          ? 'أذان فلكي دقيق عند دخول وقت كل صلاة مع رنين هادئ'
                          : 'Astronomical adhan trigger at each prayer'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.prayerAlerts}
                    onChange={() => toggleSetting('prayerAlerts')}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer flex-shrink-0"
                  />
                </div>

                {/* Pre-Adhan 5-Minute Reminder */}
                {notificationSettings.prayerAlerts && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                        {isAr ? 'تنبيه اقتراب الصلاة (قبل الأذان بـ 5 دقائق)' : 'Pre-Adhan Alert (5 Minutes Before)'}
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        {isAr ? '«اقتربت صلاة... متبقي 5 دقائق» للاستعداد والوضوء' : 'Early reminder to prepare and make ablution'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.preAdhanAlerts !== false}
                      onChange={() => toggleSetting('preAdhanAlerts')}
                      className="w-3.5 h-3.5 accent-emerald-600 rounded cursor-pointer flex-shrink-0"
                    />
                  </div>
                )}

                {/* Adhan Guard (Anti-Sleep WakeLock & Audio Priming) */}
                {notificationSettings.prayerAlerts && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                        {isAr ? 'حارس الأذان (إبقاء الهاتف نشطاً لسماع الأذان)' : 'Adhan Guard (Keep Device Awake)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        unlockGlobalAudio()
                        if (guardActive) {
                          stopPrayerKeepAlive()
                          setGuardActive(false)
                        } else {
                          startPrayerKeepAlive()
                          setGuardActive(true)
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        guardActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {guardActive ? (isAr ? 'مفعل (نشط)' : 'Active') : (isAr ? 'تفعيل الحارس' : 'Enable Guard')}
                    </button>
                  </div>
                )}
              </div>

              {/* Switch 2: Sanad Ishraqa & Daily Tips */}
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Sunrise className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {isAr ? 'إشراقة سَنَد والنصائح البرمجية الدورية' : 'Sanad Ishraqa & Daily Insights'}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {isAr
                        ? 'تنبيهات خلفية دورية عبر Service Worker للكود النظيف والهمة'
                        : 'Background Service Worker tips on clean code and deep work'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.dailyTips}
                  onChange={() => toggleSetting('dailyTips')}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer flex-shrink-0"
                />
              </div>

              {/* Switch 3: Periodic Dhikr & Salawat */}
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50 space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {isAr ? 'أذكار الصلاة على النبي والترطيب' : 'Periodic Dhikr & Salawat'}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {isAr
                          ? 'تذكير دوري بالصلاة على النبي وشرب الماء وإراحة العين'
                          : 'Gentle periodic reminders for Salawat, hydration, and rest'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.periodicDhikr}
                    onChange={() => toggleSetting('periodicDhikr')}
                    className="w-4 h-4 accent-teal-600 rounded cursor-pointer flex-shrink-0"
                  />
                </div>

                {/* Dhikr Interval selector */}
                {notificationSettings.periodicDhikr && (
                  <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      {isAr ? 'التكرار:' : 'Interval:'}
                    </span>
                    <div className="flex items-center gap-1">
                      {[60, 120, 180].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() =>
                            setNotificationSettings({
                              ...notificationSettings,
                              dhikrIntervalMinutes: mins,
                            })
                          }
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] cursor-pointer transition ${
                            notificationSettings.dhikrIntervalMinutes === mins
                              ? 'bg-teal-600 text-white'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {mins === 60 ? (isAr ? 'ساعة' : '1h') : mins === 120 ? (isAr ? 'ساعتان' : '2h') : (isAr ? '3 ساعات' : '3h')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Switch 3.5: Periodic Salawat Audio Reminder with Ducking */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-emerald-950/40 border border-emerald-500/30 dark:border-emerald-600/30 space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {isAr ? 'التذكير الصوتي الدوري «صلّ على النبي ﷺ»' : 'Periodic Salawat Audio Reminder'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {isAr
                          ? 'مقطع هادئ يخفض صوت الإذاعة/المطر تلقائياً ثم يستعيده بسلاسة'
                          : 'Gentle voice clip with background audio ducking'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.salawatAudioEnabled}
                    onChange={() => toggleSetting('salawatAudioEnabled')}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer flex-shrink-0"
                  />
                </div>

                {/* Interval Selector & Audio Test */}
                {notificationSettings.salawatAudioEnabled && (
                  <>
                    <div className="pt-1.5 border-t border-emerald-500/20 dark:border-emerald-800/40 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                          {isAr ? 'التكرار:' : 'Every:'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[15, 30, 60].map((mins) => (
                            <button
                              key={mins}
                              type="button"
                              onClick={() =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  salawatIntervalMinutes: mins,
                                })
                              }
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] cursor-pointer transition ${
                                notificationSettings.salawatIntervalMinutes === mins
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {mins === 15 ? (isAr ? '15 دقيقة' : '15m') : mins === 30 ? (isAr ? '30 دقيقة' : '30m') : (isAr ? 'ساعة' : '1h')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Test Salawat Button */}
                      <button
                        type="button"
                        onClick={handleToggleSalawatPreview}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                          isPlayingSalawatTest
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        }`}
                      >
                        {isPlayingSalawatTest ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>{isAr ? 'إيقاف' : 'Stop'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>{isAr ? 'تجربة الصوت' : 'Test Audio'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Service Worker Background Live Status Strip */}
                    <div className="pt-1.5 border-t border-emerald-500/20 dark:border-emerald-800/40 flex items-center justify-between gap-2 flex-wrap text-[10px]">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                        <span>{isAr ? 'مؤقت الخلفية: نشط (يفحص كل دقيقة بالـ SW)' : 'SW Background Timer: Active (ticks every 1m)'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {swStatus?.nextSalawatInMs !== undefined
                            ? (swStatus.nextSalawatInMs <= 60000
                                ? (isAr ? 'مستحق الآن' : 'Due now')
                                : `${isAr ? 'القادم بعد' : 'Next in'} ${Math.ceil(swStatus.nextSalawatInMs / 60000)} ${isAr ? 'دقيقة' : 'min'}`)
                            : (isAr ? 'IndexedDB محفوظ' : 'IndexedDB synced')}
                        </span>

                        <button
                          type="button"
                          onClick={handleTriggerDirectSalawat}
                          disabled={isTriggeringSalawat}
                          className="px-2 py-0.5 rounded-md bg-emerald-700/20 hover:bg-emerald-700/30 text-emerald-800 dark:text-emerald-200 font-bold transition flex items-center gap-1 cursor-pointer"
                          title={isAr ? 'إرسال إشعار الصلاة على النبي فوراً عبر Service Worker للتأكد' : 'Trigger Salawat notification via SW now'}
                        >
                          <BellRing className={`w-3 h-3 ${isTriggeringSalawat ? 'animate-bounce' : ''}`} />
                          <span>{isTriggeringSalawat ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال فوري بالـ SW' : 'Send via SW')}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Switch 3.7: Waqar Modesty & Hijab Reminders */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 dark:from-purple-950/40 dark:via-fuchsia-950/40 dark:to-pink-950/40 border border-purple-500/30 dark:border-purple-600/30 space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {userProfile.gender === 'male'
                          ? (isAr ? 'رسائل وَقار (غض البصر، المروءة، وأمانة العمل)' : 'Waqar Messages (Chivalry & Integrity)')
                          : (isAr ? 'رسائل وَقار (تذكير بالزي الشرعي والستر للمهندسة)' : 'Waqar Messages (Modesty & Hijab Reminders)')}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {userProfile.gender === 'male'
                          ? (isAr ? 'تنبيهات دورية كل 10 دقائق لغض البصر والشهامة وأمانة الكود' : 'Periodic reminders every 10 min for chivalry, lower gaze & code integrity')
                          : (isAr ? 'تنبيهات دورية كل 10 دقائق لتعزيز الستر الشرعي والاعتزاز بالحجاب' : 'Periodic reminders every 10 min encouraging modesty')}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.waqarMessagesEnabled}
                    onChange={() => toggleSetting('waqarMessagesEnabled')}
                    className="w-4 h-4 accent-fuchsia-600 rounded cursor-pointer flex-shrink-0"
                  />
                </div>

                {/* Test Waqar Toast Button & Sound Option */}
                {notificationSettings.waqarMessagesEnabled && (
                  <>
                    <div className="pt-2 border-t border-purple-500/20 dark:border-purple-800/40 flex items-center justify-between gap-2 flex-wrap text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={notificationSettings.waqarSoundEnabled !== false}
                          onChange={() => toggleSetting('waqarSoundEnabled')}
                          className="w-3.5 h-3.5 accent-fuchsia-600 rounded cursor-pointer"
                        />
                        <span>{isAr ? 'نغمة صوتية هادئة عند التنبيه' : 'Gentle Chime Sound'}</span>
                      </label>

                      <button
                        type="button"
                        onClick={handleTestWaqar}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition flex items-center gap-1 cursor-pointer shadow-xs flex-shrink-0 active:scale-95"
                        title={isAr ? 'تجربة إشعار ورنة وقار الآن' : 'Test Waqar Alert & Sound'}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isAr ? 'تجربة رسالة ونغمة وَقار' : 'Test Alert & Chime'}</span>
                      </button>
                    </div>

                    {/* Service Worker Background Live Status Strip for Waqar */}
                    <div className="pt-1.5 border-t border-purple-500/20 dark:border-purple-800/40 flex items-center justify-between gap-2 flex-wrap text-[10px]">
                      <div className="flex items-center gap-1.5 text-fuchsia-800 dark:text-fuchsia-300 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-ping inline-block" />
                        <span>{isAr ? 'مؤقت الخلفية: دوري كل 10 دقائق (SW)' : 'SW Background Timer: Every 10 min'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {swStatus?.nextWaqarInMs !== undefined
                            ? (swStatus.nextWaqarInMs <= 60000
                                ? (isAr ? 'مستحق الآن' : 'Due now')
                                : `${isAr ? 'القادم بعد' : 'Next in'} ${Math.ceil(swStatus.nextWaqarInMs / 60000)} ${isAr ? 'دقيقة' : 'min'}`)
                            : (isAr ? 'IndexedDB محفوظ' : 'IndexedDB synced')}
                        </span>

                        <button
                          type="button"
                          onClick={handleTriggerDirectWaqar}
                          disabled={isTriggeringWaqar}
                          className="px-2 py-0.5 rounded-md bg-fuchsia-700/20 hover:bg-fuchsia-700/30 text-fuchsia-800 dark:text-fuchsia-200 font-bold transition flex items-center gap-1 cursor-pointer"
                          title={isAr ? 'إرسال إشعار وقار فوراً عبر Service Worker للتأكد' : 'Trigger Waqar notification via SW now'}
                        >
                          <BellRing className={`w-3 h-3 ${isTriggeringWaqar ? 'animate-bounce' : ''}`} />
                          <span>{isTriggeringWaqar ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال فوري بالـ SW' : 'Send via SW')}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Switch 3.8: Peace & Motivation Reminders (Maktabati & Katkooti inspired) */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-amber-950/40 border border-amber-500/30 dark:border-amber-600/30 space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {isAr
                          ? 'رسائل السكينة والبُشرى (مكتبتي وكتكوتي)'
                          : 'Peace & Serenity Messages'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {isAr
                          ? '42 رسالة طمأنينة ويقين وجبر خواطر موزعة على مدار اليوم'
                          : '42 uplifting spiritual and peace reminders'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.peaceRemindersEnabled !== false}
                    onChange={() => toggleSetting('peaceRemindersEnabled')}
                    className="w-4 h-4 accent-amber-600 rounded cursor-pointer flex-shrink-0"
                  />
                </div>

                {notificationSettings.peaceRemindersEnabled !== false && (
                  <div className="pt-2 border-t border-amber-500/20 dark:border-amber-800/40 flex items-center justify-between gap-2 flex-wrap text-xs">
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                      <span>{isAr ? '3 مواعيد يومياً (صباحاً، ظهراً، وليلاً)' : '3 daily slots (Morning, Afternoon, Night)'}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleTestPeace}
                        className="px-2 py-0.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] transition flex items-center gap-1 cursor-pointer shadow-xs"
                        title={isAr ? 'معاينة رسالة سكينة' : 'Preview Peace message'}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isAr ? 'معاينة رسالة' : 'Preview'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerDirectPeace}
                        disabled={isTriggeringPeace}
                        className="px-2 py-0.5 rounded-md bg-amber-700/20 hover:bg-amber-700/30 text-amber-800 dark:text-amber-200 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                        title={isAr ? 'إرسال إشعار السكينة فوراً عبر Service Worker' : 'Trigger Peace notification via SW now'}
                      >
                        <BellRing className={`w-3 h-3 ${isTriggeringPeace ? 'animate-bounce' : ''}`} />
                        <span>{isTriggeringPeace ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال بالـ SW' : 'Send via SW')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Switch 4: Audio Alerts & Sound Selection */}
              <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50 space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {isAr ? 'نغمات وتنبيهات الصوت' : 'Audio & Adhan Alerts'}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {isAr
                          ? 'تشغيل صوت الأذان أو الرنين التوافقي عند دخول الصلاة'
                          : 'Play real adhan or serene chime on prayer alerts'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.soundEnabled}
                    onChange={() => toggleSetting('soundEnabled')}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer flex-shrink-0"
                  />
                </div>

                {/* Audio Mode Selector & Test Button */}
                {notificationSettings.soundEnabled && (
                  <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Music className="w-3 h-3 text-emerald-500" />
                        <span>{isAr ? 'صوت الأذان المفضل:' : 'Preferred Adhan Sound:'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={handleToggleAudioPreview}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs ${
                          isPlayingAudioTest
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs'
                        }`}
                      >
                        {isPlayingAudioTest ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>{isAr ? 'إيقاف' : 'Stop'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>{isAr ? 'تجربة الصوت' : 'Test Audio'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* All Authentic Muezzin Options with Direct Preview */}
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {ADHAN_OPTIONS_LIST.map((opt) => {
                        const isSelected = notificationSettings.adhanAudioOption === opt.id
                        const isPlayingThis = isPlayingAudioTest && isSelected

                        return (
                          <div
                            key={opt.id}
                            className={`p-2 rounded-xl transition border flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/30'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setAudioOption(opt.id)}
                              className="flex-1 text-start min-w-0 cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-xs font-bold truncate ${
                                    isSelected
                                      ? 'text-emerald-700 dark:text-emerald-300'
                                      : 'text-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  {isAr ? opt.labelAr : opt.labelEn}
                                </span>
                                {opt.badge && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-md font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono">
                                    {opt.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                                {isAr ? opt.subAr : opt.subEn}
                              </span>
                            </button>

                            {/* Preview button for this specific sound */}
                            <button
                              type="button"
                              onClick={() => {
                                if (isPlayingThis) {
                                  stopAdhanAudio()
                                  setIsPlayingAudioTest(false)
                                } else {
                                  setAudioOption(opt.id)
                                  playAdhanAudio(opt.id, 85)
                                  setIsPlayingAudioTest(true)
                                }
                              }}
                              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition flex-shrink-0 cursor-pointer ${
                                isPlayingThis
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700'
                              }`}
                              title={isPlayingThis ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'استماع وتجربة' : 'Preview')}
                            >
                              {isPlayingThis ? (
                                <Square className="w-3 h-3 fill-current" />
                              ) : (
                                <Play className="w-3 h-3 fill-current" />
                              )}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          {activeSubTab === 'settings' ? (
            <>
              <button
                type="button"
                onClick={handleTestNotification}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testSent ? (isAr ? 'تم!' : 'Sent!') : (isAr ? 'فوري' : 'Instant')}</span>
              </button>

              <button
                type="button"
                onClick={handleTest5sNotification}
                disabled={isTesting5s}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                  isTesting5s
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 cursor-wait'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isTesting5s ? (
                  <>
                    <Timer className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    <span>{isAr ? `أغلق التطبيق (${countdown5s}ث)...` : `Close app (${countdown5s}s)...`}</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إشعار بعد 5 ث (أغلق التطبيق)' : '5s Test (Close App)'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </>
          ) : (
            <>
              {recentNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearRecentNotifications}
                  className="py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مسح السجل' : 'Clear Archive'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2 px-4 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center cursor-pointer shadow-xs"
              >
                {isAr ? 'تم' : 'Done'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
