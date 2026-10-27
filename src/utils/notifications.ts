import type { InAppToast, NotificationSettings, AdhanAudioOption, UserGender } from '../types'
import { playSalawatReminder } from './audio'
import { getWaqarMessages } from '../constants/waqar'
import type { PrayerTimes } from 'adhan'

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported'

export interface ScheduledTip {
  id: string
  targetHour: number // 24-hour format
  titleAr: string
  titleEn: string
  bodyAr: string
  bodyEn: string
}

export const DAILY_TIPS: ScheduledTip[] = [
  {
    id: 'tip-10am',
    targetHour: 10,
    titleAr: 'سند المُبرمج • صباح البركة والتركيز العميق',
    titleEn: 'Sanad Dev • Morning Deep Work',
    bodyAr: 'ابدأ جلسة البرمجة اليوم بـ «بسم الله الرحمن الرحيم»، ورتّب أولوياتك الهندسية بإتقان وهدوء.',
    bodyEn: 'Start your coding sprint with "Bismillah", organizing architectural priorities with calm focus.',
  },
  {
    id: 'tip-1pm',
    targetHour: 13,
    titleAr: 'سند المُبرمج • صحة عينيك وقاعدة 20-20-20',
    titleEn: 'Sanad Dev • Midday Ergonomics & Eye Rest',
    bodyAr: 'أرِح عينيك الآن: انظر لشيء يبعد 20 قدماً لمدة 20 ثانية، واشرب كوب ماء واعتدل في جلستك.',
    bodyEn: 'Rest your eyes now: look 20 feet away for 20 seconds (20-20-20 rule), hydrate, and stretch your spine.',
  },
  {
    id: 'tip-4pm',
    targetHour: 16,
    titleAr: 'سند المُبرمج • إتقان الصنعة ونقاء الكود',
    titleEn: 'Sanad Dev • Excellence in Software Craft',
    bodyAr: '«إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ» • احرص على كود نظيف وتوثيق دقيق.',
    bodyEn: '"Verily, Allah loves that you excel in your craft." • Strive for clean code, solid tests, and clear documentation.',
  },
  {
    id: 'tip-7pm',
    targetHour: 19,
    titleAr: 'سند المُبرمج • السكينة وحسن التوكل عند تتبع الأخطاء',
    titleEn: 'Sanad Dev • Patient Debugging Mindset',
    bodyAr: 'إذا واجهتك علة برمجية (Bug) مستعصية، فاهدأ واستعن بالله وتوكل عليه؛ فكل خطأ هو مفتاح لخبرة أعمق.',
    bodyEn: 'When encountering an elusive bug, remain calm and seek Allah’s aid; every bug deepens your mastery.',
  },
  {
    id: 'tip-10pm',
    targetHour: 22,
    titleAr: 'سند المُبرمج • ختام اليوم والمحاسبة الهادئة',
    titleEn: 'Sanad Dev • Night Reflection & Review',
    bodyAr: 'احمد الله على ما يسّر لك اليوم من إنجاز وكود، وراجع نيتك، واستعد لنوم هانئ وقيام لصلاة الفجر.',
    bodyEn: 'Thank Allah for today’s achievements, review your day, and prepare for peaceful sleep and Fajr prayer.',
  },
]

export const PERIODIC_DHIKR_LIST = [
  {
    titleAr: 'سند المُبرمج • الصلاة على النبي ﷺ',
    titleEn: 'Sanad Dev • Salawat on the Prophet ﷺ',
    bodyAr: '«اللهم صلِّ وسلِّم وبارك على نبينا محمد» • اشرب كوب ماء وجدد نشاطك الذهني.',
    bodyEn: 'Invoke peace upon Prophet Muhammad ﷺ, drink a glass of water, and refresh your mind.',
  },
  {
    titleAr: 'سند المُبرمج • تسبيح واستغفار',
    titleEn: 'Sanad Dev • Tasbih & Renewal',
    bodyAr: '«سبحان الله وبحمده، سبحان الله العظيم» • استراحة دقيقة لإراحة عينيك عن الشاشة.',
    bodyEn: '"Subhanallahi wa bihamdihi" • A mindful minute to rest your eyes from the monitor.',
  },
  {
    titleAr: 'سند المُبرمج • تجديد النية الصالحة',
    titleEn: 'Sanad Dev • Renewing Sincere Intention',
    bodyAr: '«أستغفر الله العظيم وأتوب إليه» • جدد نيتك في نفع أمتك والناس بما تبنيه وتبرمجه.',
    bodyEn: '"Astaghfirullah wa atoobu ilayh" • Sincerity in intentions turns engineering into righteous work.',
  },
  {
    titleAr: 'سند المُبرمج • كنز من كنوز الجنة',
    titleEn: 'Sanad Dev • Trust & Reliance',
    bodyAr: '«لا حول ولا قوة إلا بالله العلي العظيم» • استعن بالله في كل سطر كود تكتبه.',
    bodyEn: '"La hawla wa la quwwata illa billah" • Seek strength from Allah in every algorithm you build.',
  },
]

export const PRAYER_NOTIFICATIONS = {
  fajr: {
    titleAr: 'أذان الفجر • الله أكبر',
    titleEn: 'Fajr Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان الفجر بتوقيت القاهرة | الصلاة خير من النوم، أقبل على ربك بنشاط ونور.',
    bodyEn: 'Now is Fajr prayer time in Cairo | Prayer is better than sleep. Rise and greet your Lord.',
  },
  dhuhr: {
    titleAr: 'أذان الظهر • الله أكبر',
    titleEn: 'Dhuhr Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان الظهر بتوقيت القاهرة | توقف عن الكود، أسبغ الوضوء وأرح بدنك بالصلاة.',
    bodyEn: 'Now is Dhuhr prayer time in Cairo | Step away from code, perform ablution, and find peace in prayer.',
  },
  asr: {
    titleAr: 'أذان العصر • الله أكبر',
    titleEn: 'Asr Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان العصر بتوقيت القاهرة | حافظوا على الصلوات والصلاة الوسطى.',
    bodyEn: 'Now is Asr prayer time in Cairo | Strictly guard your prayers, especially the middle prayer.',
  },
  maghrib: {
    titleAr: 'أذان المغرب • الله أكبر',
    titleEn: 'Maghrib Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان المغرب بتوقيت القاهرة | تقبل الله طاعاتكم وصالح أعمالكم.',
    bodyEn: 'Now is Maghrib prayer time in Cairo | May Allah accept your work, worship, and sincere deeds.',
  },
  isha: {
    titleAr: 'أذان العشاء • الله أكبر',
    titleEn: 'Isha Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان العشاء بتوقيت القاهرة | اختم يومك بالصلاة والسكينة.',
    bodyEn: 'Now is Isha prayer time in Cairo | Conclude your active day with serene prayer and devotion.',
  },
}

import {
  isNativePlatform,
  isNotificationSupported,
  checkUnifiedNotificationPermission,
  requestUnifiedNotificationPermission,
  dispatchUnifiedNotification,
  scheduleNativePrayers,
  scheduleBackgroundTestNotification,
  syncServiceWorkerReminders,
  queryServiceWorkerStatus,
  triggerImmediateSalawatSw,
  triggerImmediateWaqarSw,
  triggerImmediatePeaceSw,
  DEFAULT_SW_LIVE_STATUS,
  type SwLiveStatus,
} from './notificationBridge'

export {
  isNativePlatform,
  scheduleNativePrayers,
  checkUnifiedNotificationPermission,
  requestUnifiedNotificationPermission,
  dispatchUnifiedNotification,
  scheduleBackgroundTestNotification,
  syncServiceWorkerReminders,
  queryServiceWorkerStatus,
  triggerImmediateSalawatSw,
  triggerImmediateWaqarSw,
  triggerImmediatePeaceSw,
  DEFAULT_SW_LIVE_STATUS,
  type SwLiveStatus,
}

// Check if Notification API is supported
export function checkNotificationSupport(): boolean {
  return isNotificationSupported()
}

// Get current permission status
export function getNotificationPermission(): NotificationPermissionStatus {
  if (isNativePlatform) {
    return 'granted'
  }
  if (!checkNotificationSupport()) return 'unsupported'
  try {
    return (Notification.permission as NotificationPermissionStatus) || 'default'
  } catch {
    return 'unsupported'
  }
}

// Request permission from the user
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  const status = await requestUnifiedNotificationPermission()
  return status as NotificationPermissionStatus
}

// Dispatch combined native APK/browser notification and in-app toast
export function dispatchNotification({
  title,
  body,
  type = 'system',
  sound = true,
  adhanAudioOption,
  onToast,
}: {
  title: string
  body: string
  type?: InAppToast['type']
  sound?: boolean
  adhanAudioOption?: AdhanAudioOption
  onToast?: (toast: InAppToast) => void
}) {
  // Dispatch via unified bridge (handles Native Capacitor Android notifications, Browser Web notifications, and Toasts)
  dispatchUnifiedNotification({
    title,
    body,
    type,
    sound,
    adhanAudioOption,
    onToast,
  })

  return {
    id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title,
    body,
    type,
    timestamp: Date.now(),
  }
}

// Helper to format date string key YYYY-MM-DD
function getTodayDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

// Check and trigger prayer time notifications
export function checkPrayerNotifications(
  prayerTimes: PrayerTimes,
  settings: NotificationSettings,
  lang: 'ar' | 'en',
  onToast?: (toast: InAppToast) => void
) {
  if (!settings.prayerAlerts) return

  const now = new Date()
  const todayKey = getTodayDateKey(now)
  const isAr = lang === 'ar'

  const prayerChecks = [
    { key: 'fajr', time: prayerTimes.fajr, data: PRAYER_NOTIFICATIONS.fajr },
    { key: 'dhuhr', time: prayerTimes.dhuhr, data: PRAYER_NOTIFICATIONS.dhuhr },
    { key: 'asr', time: prayerTimes.asr, data: PRAYER_NOTIFICATIONS.asr },
    { key: 'maghrib', time: prayerTimes.maghrib, data: PRAYER_NOTIFICATIONS.maghrib },
    { key: 'isha', time: prayerTimes.isha, data: PRAYER_NOTIFICATIONS.isha },
  ]

  for (const prayer of prayerChecks) {
    if (!prayer.time) continue

    const diffMinutes = Math.floor((now.getTime() - prayer.time.getTime()) / 60000)
    // Trigger if within a 15-minute window after adhan
    if (diffMinutes >= 0 && diffMinutes <= 15) {
      const storageKey = `sanad_notified_prayer_${todayKey}_${prayer.key}`
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, 'true')
        dispatchNotification({
          title: isAr ? prayer.data.titleAr : prayer.data.titleEn,
          body: isAr ? prayer.data.bodyAr : prayer.data.bodyEn,
          type: 'prayer',
          sound: settings.soundEnabled,
          adhanAudioOption: settings.adhanAudioOption,
          onToast,
        })
      }
    }
  }
}

// Check and trigger 5 daily tech & spiritual tips
export function checkDailyTips(
  settings: NotificationSettings,
  lang: 'ar' | 'en',
  onToast?: (toast: InAppToast) => void
) {
  if (!settings.dailyTips) return

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const todayKey = getTodayDateKey(now)
  const isAr = lang === 'ar'

  for (const tip of DAILY_TIPS) {
    // Trigger if hour matches and within first 5 minutes
    if (currentHour === tip.targetHour && currentMinute <= 5) {
      const storageKey = `sanad_notified_tip_${todayKey}_${tip.id}`
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, 'true')
        dispatchNotification({
          title: isAr ? tip.titleAr : tip.titleEn,
          body: isAr ? tip.bodyAr : tip.bodyEn,
          type: 'tip',
          sound: settings.soundEnabled,
          onToast,
        })
      }
    }
  }
}

// Check and trigger periodic Dhikr / Salawat reminder
export function checkPeriodicDhikr(
  settings: NotificationSettings,
  lang: 'ar' | 'en',
  onToast?: (toast: InAppToast) => void
) {
  if (!settings.periodicDhikr) return

  const now = Date.now()
  const intervalMs = (settings.dhikrIntervalMinutes || 60) * 60 * 1000
  const lastDhikrStr = localStorage.getItem('sanad_last_dhikr_time')

  if (!lastDhikrStr) {
    // First time setup - set baseline to now so it doesn't fire immediately upon page load
    localStorage.setItem('sanad_last_dhikr_time', now.toString())
    return
  }

  const lastTime = parseInt(lastDhikrStr, 10)
  if (now - lastTime >= intervalMs) {
    localStorage.setItem('sanad_last_dhikr_time', now.toString())

    // Pick rotating dhikr
    const currentIndex = parseInt(localStorage.getItem('sanad_dhikr_idx') || '0', 10)
    const nextIndex = (currentIndex + 1) % PERIODIC_DHIKR_LIST.length
    localStorage.setItem('sanad_dhikr_idx', nextIndex.toString())

    const item = PERIODIC_DHIKR_LIST[currentIndex]
    const isAr = lang === 'ar'

    dispatchNotification({
      title: isAr ? item.titleAr : item.titleEn,
      body: isAr ? item.bodyAr : item.bodyEn,
      type: 'dhikr',
      sound: settings.soundEnabled,
      onToast,
    })
  }
}

// Check and trigger periodic Salawat audio reminder with smooth background ducking
export function checkPeriodicSalawatAudio(
  settings: NotificationSettings,
  lang: 'ar' | 'en',
  onToast?: (toast: InAppToast) => void
) {
  if (!settings.salawatAudioEnabled) return

  const now = Date.now()
  const intervalMinutes = settings.salawatIntervalMinutes || 30
  const intervalMs = intervalMinutes * 60 * 1000
  const lastSalawatStr = localStorage.getItem('sanad_last_salawat_audio_time')

  if (!lastSalawatStr) {
    // First time setup - set baseline to now so it doesn't fire immediately upon page load
    localStorage.setItem('sanad_last_salawat_audio_time', now.toString())
    return
  }

  const lastTime = parseInt(lastSalawatStr, 10)
  if (now - lastTime >= intervalMs) {
    localStorage.setItem('sanad_last_salawat_audio_time', now.toString())

    // 1. Play audio reminder with volume ducking
    playSalawatReminder()

    // 2. Dispatch via unified notification bridge
    const isAr = lang === 'ar'
    dispatchNotification({
      title: isAr ? 'صلِّ على النبي ﷺ' : 'Salawat on the Prophet ﷺ',
      body: isAr
        ? '«اللهم صلِّ وسلِّم وبارك على نبينا محمد وعلى آله وصحبه أجمعين»'
        : 'O Allah, bestow peace and blessings upon our Prophet Muhammad and his family and companions.',
      type: 'salawat',
      sound: false,
      onToast,
    })
  }
}

// Check and trigger periodic "وَقار" modesty & ethics reminders
export function checkPeriodicWaqar(
  settings: NotificationSettings,
  lang: 'ar' | 'en',
  onToast?: (toast: InAppToast) => void,
  userGender?: UserGender,
  userName?: string
) {
  if (!settings.waqarMessagesEnabled) return

  const now = Date.now()
  const intervalMs = (Number(settings.waqarIntervalMinutes) || 10) * 60 * 1000
  const lastWaqarStr = localStorage.getItem('sanad_last_waqar_time')

  if (!lastWaqarStr) {
    // First time setup - set baseline to now so it starts on schedule
    localStorage.setItem('sanad_last_waqar_time', now.toString())
    return
  }

  const lastTime = parseInt(lastWaqarStr, 10)
  if (now - lastTime >= intervalMs) {
    localStorage.setItem('sanad_last_waqar_time', now.toString())

    const list = getWaqarMessages(userGender || settings.userGender || 'female')
    const currentIndex = parseInt(localStorage.getItem('sanad_waqar_idx') || '0', 10)
    const nextIndex = (currentIndex + 1) % list.length
    localStorage.setItem('sanad_waqar_idx', nextIndex.toString())

    const item = list[currentIndex % list.length]
    const isAr = lang === 'ar'
    let body = isAr ? item.bodyAr : item.bodyEn
    if (userName && userName.trim()) {
      body = `يا ${userName.trim()}، ${body}`
    }

    dispatchNotification({
      title: isAr ? item.titleAr : item.titleEn,
      body,
      type: 'waqar',
      sound: settings.soundEnabled !== false && settings.waqarSoundEnabled !== false,
      onToast,
    })
  }
}

// Manually trigger a Waqar notification toast and audio chime
export function triggerWaqarNotification(
  settings: NotificationSettings,
  lang: 'ar' | 'en',
  onToast?: (toast: InAppToast) => void,
  userGender?: UserGender,
  userName?: string
) {
  const list = getWaqarMessages(userGender || settings.userGender || 'female')
  const currentIndex = parseInt(localStorage.getItem('sanad_waqar_idx') || '0', 10)
  const item = list[currentIndex % list.length]
  const isAr = lang === 'ar'
  let body = isAr ? item.bodyAr : item.bodyEn
  if (userName && userName.trim()) {
    body = `يا ${userName.trim()}، ${body}`
  }

  dispatchNotification({
    title: isAr ? item.titleAr : item.titleEn,
    body,
    type: 'waqar',
    sound: settings.soundEnabled !== false && settings.waqarSoundEnabled !== false,
    onToast,
  })
}

