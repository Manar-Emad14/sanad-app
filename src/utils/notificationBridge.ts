import type { InAppToast, NotificationSettings, AdhanAudioOption, PrayerOffsets, UserProfile } from '../types'
import { playSereneChime, playAdhanAudio, playNotificationSound } from './audio'
import { getCairoPrayerTimes } from './prayer'

export type UnifiedPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported'

export interface NativeChannelConfig {
  id: string
  name: string
  description?: string
  importance?: number
  visibility?: number
  vibration?: boolean
  sound?: string
}

/**
 * Safe Native check that NEVER throws and requires no module evaluation of Capacitor
 */
export const checkIsNative = (): boolean => {
  try {
    return (
      typeof window !== 'undefined' &&
      Boolean((window as any).Capacitor?.isNativePlatform?.())
    )
  } catch {
    return false
  }
}

/**
 * Safe synchronous flag for components that need a quick check
 */
export const isNativePlatform = checkIsNative()

/**
 * Standard Android Channels configuration
 */
export const NOTIFICATION_CHANNELS: Record<string, NativeChannelConfig> = {
  PRAYERS: {
    id: 'sanad_prayers',
    name: 'مواقيت الصلاة والأذان (Prayer Times)',
    description: 'تنبيهات مواقيت الصلوات الخمس وسماع الأذان على شاشة القفل',
    importance: 5,
    visibility: 1,
    vibration: true,
  },
  SALAWAT: {
    id: 'sanad_salawat',
    name: 'الصلاة على النبي ﷺ (Salawat)',
    description: 'تنبيهات دورية للصلاة على الحبيب المصطفى ﷺ',
    importance: 4,
    visibility: 1,
    vibration: true,
  },
  WAQAR: {
    id: 'sanad_waqar',
    name: 'رسائل وَقار (Waqar Reminders)',
    description: 'تنبيهات دورية حول الستر وعفة وحياء المبرمجة المسلمة',
    importance: 4,
    visibility: 1,
    vibration: true,
  },
  GENERAL: {
    id: 'sanad_general',
    name: 'تنبيهات سند العامة (General)',
    description: 'أذكار ونصائح برمجية وإرشادات صحية دورية',
    importance: 3,
    visibility: 1,
  },
}

let channelsInitialized = false

/**
 * Lazy, guarded loader for Capacitor LocalNotifications plugin
 * Returns null immediately if running in web/browser to avoid crashes.
 */
async function getLocalNotificationsPlugin() {
  if (!checkIsNative()) return null
  try {
    const mod = await import('@capacitor/local-notifications')
    return mod.LocalNotifications || null
  } catch (err) {
    console.warn('[NotificationBridge] Failed to load @capacitor/local-notifications:', err)
    return null
  }
}

/**
 * Initialize Android notification channels safely
 */
export async function initNativeNotificationChannels(): Promise<void> {
  if (!checkIsNative() || channelsInitialized) return
  try {
    const plugin = await getLocalNotificationsPlugin()
    if (!plugin) return

    for (const channel of Object.values(NOTIFICATION_CHANNELS)) {
      await plugin.createChannel(channel as any)
    }
    channelsInitialized = true
  } catch (error) {
    console.warn('[NotificationBridge] Channel init non-blocking error:', error)
  }
}

/**
 * Check if notifications are supported on the current platform
 */
export function isNotificationSupported(): boolean {
  if (checkIsNative()) return true
  try {
    return typeof window !== 'undefined' && 'Notification' in window
  } catch {
    return false
  }
}

/**
 * Check current notification permission status across Web and Native
 */
export async function checkUnifiedNotificationPermission(): Promise<UnifiedPermissionStatus> {
  if (checkIsNative()) {
    try {
      const plugin = await getLocalNotificationsPlugin()
      if (plugin) {
        const res = await plugin.checkPermissions()
        if (res.display === 'granted') return 'granted'
        if (res.display === 'denied') return 'denied'
        return 'default'
      }
    } catch {
      return 'default'
    }
  }

  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission as UnifiedPermissionStatus
    }
  } catch {}

  return 'unsupported'
}

/**
 * Request notification permissions across Web and Native
 */
export async function requestUnifiedNotificationPermission(): Promise<UnifiedPermissionStatus> {
  if (checkIsNative()) {
    try {
      const plugin = await getLocalNotificationsPlugin()
      if (plugin) {
        const res = await plugin.requestPermissions()
        if (res.display === 'granted') {
          await initNativeNotificationChannels()
          return 'granted'
        }
        return 'denied'
      }
    } catch (e) {
      console.warn('[NotificationBridge] Native permission request error:', e)
      return 'denied'
    }
  }

  // Web Browser fallback
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission()
      if (res === 'granted' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          console.log('[Sanad PWA] SW ready for system notifications with scope:', reg.scope)
        }).catch(() => {})
      }
      return res as UnifiedPermissionStatus
    }
  } catch (e) {
    console.warn('[NotificationBridge] Browser permission error:', e)
    return 'denied'
  }

  return 'unsupported'
}

/**
 * Map toast notification type to Android channel ID
 */
function getChannelIdForType(type?: InAppToast['type']): string {
  switch (type) {
    case 'prayer':
      return NOTIFICATION_CHANNELS.PRAYERS.id
    case 'salawat':
      return NOTIFICATION_CHANNELS.SALAWAT.id
    case 'waqar':
      return NOTIFICATION_CHANNELS.WAQAR.id
    default:
      return NOTIFICATION_CHANNELS.GENERAL.id
  }
}

/**
 * Dispatch notification through the unified bridge:
 * - Native (Android/Capacitor): Uses @capacitor/local-notifications with wake locks and channels
 * - Web/Browser: Uses standard Notification API (if granted)
 * - In-App: Dispatches in-app Toast event for real-time visual feedback
 */
export async function dispatchUnifiedNotification({
  title,
  body,
  type = 'system',
  sound = true,
  adhanAudioOption,
  onToast,
  scheduleAt,
}: {
  title: string
  body: string
  type?: InAppToast['type']
  sound?: boolean
  adhanAudioOption?: AdhanAudioOption
  onToast?: (toast: InAppToast) => void
  scheduleAt?: Date
}): Promise<InAppToast> {
  // 1. Play audio in active app
  try {
    if (sound && !scheduleAt) {
      if (type === 'prayer') {
        playAdhanAudio(adhanAudioOption || 'short_takbeerat', 85)
      } else if (type === 'waqar') {
        playNotificationSound('waqar', 85)
      } else if (type !== 'salawat') {
        playSereneChime()
      }
    }
  } catch (err) {
    console.warn('[NotificationBridge] Audio error:', err)
  }

  // 2. Dispatch via Native Capacitor Local Notifications (Android / APK)
  if (checkIsNative()) {
    try {
      await initNativeNotificationChannels()
      const plugin = await getLocalNotificationsPlugin()
      if (plugin) {
        const notificationId = Math.floor(Math.random() * 2147483647)
        const channelId = getChannelIdForType(type)

        await plugin.schedule({
          notifications: [
            {
              id: notificationId,
              title,
              body,
              channelId,
              smallIcon: 'ic_stat_name',
              iconColor: '#10b981',
              schedule: scheduleAt
                ? { at: scheduleAt, allowWhileIdle: true }
                : { at: new Date(Date.now() + 100), allowWhileIdle: true },
            },
          ],
        })
      }
    } catch (e) {
      console.warn('[NotificationBridge] Native schedule failed:', e)
    }
  } else {
    // 3. Web / Browser: Service Worker showNotification with fallback
    if (!scheduleAt && typeof window !== 'undefined') {
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          let shownViaSw = false

          if ('serviceWorker' in navigator) {
            try {
              const reg = await navigator.serviceWorker.ready
              if (reg && typeof reg.showNotification === 'function') {
                const getCategoryTag = (t: string) => {
                  if (t === 'prayer') return `sanad-prayer-${Date.now()}`
                  if (t === 'salawat') return 'sanad-salawat'
                  if (t === 'dhikr') return 'sanad-dhikr'
                  if (t === 'tip') return 'sanad-ishraqa'
                  if (t === 'waqar') return 'sanad-waqar'
                  if (t === 'evening_adhkar') return 'sanad-evening-adhkar'
                  if (t === 'challenge') return 'sanad-challenge'
                  return 'sanad-system'
                }
                const tag = getCategoryTag(type)
                const appOrigin =
                  typeof window !== 'undefined' && window.location?.origin
                    ? window.location.origin
                    : ''
                const appIconUrl = (appOrigin ? appOrigin : '') + '/icon-192.png'
                const isPrayer = type === 'prayer'
                const options: any = {
                  body,
                  icon: appIconUrl,
                  vibrate: [200, 100, 200],
                  tag,
                  renotify: true,
                  requireInteraction: isPrayer,
                  data: { url: appOrigin || '/', type },
                }
                await reg.showNotification(title, options)
                shownViaSw = true
              }
            } catch (swErr) {
              console.warn('[NotificationBridge] SW showNotification error, falling back:', swErr)
            }
          }

          if (!shownViaSw) {
            const getCategoryTag = (t: string) => {
              if (t === 'prayer') return `sanad-prayer-${Date.now()}`
              if (t === 'salawat') return 'sanad-salawat'
              if (t === 'dhikr') return 'sanad-dhikr'
              if (t === 'tip') return 'sanad-ishraqa'
              if (t === 'waqar') return 'sanad-waqar'
              if (t === 'evening_adhkar') return 'sanad-evening-adhkar'
              if (t === 'challenge') return 'sanad-challenge'
              return 'sanad-system'
            }
            const tag = getCategoryTag(type)
            const appOrigin =
              typeof window !== 'undefined' && window.location?.origin
                ? window.location.origin
                : ''
            const appIconUrl = (appOrigin ? appOrigin : '') + '/icon-192.png'
            const fallbackOptions: any = {
              body,
              icon: appIconUrl,
              vibrate: [200, 100, 200],
              requireInteraction: type === 'prayer',
              tag,
              renotify: true,
              data: { url: appOrigin || '/', type },
            }
            new Notification(title, fallbackOptions)
          }
        }
      } catch (e) {
        console.warn('[NotificationBridge] Browser notification failed:', e)
      }
    }
  }

  // 4. In-App Toast
  const toast: InAppToast = {
    id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title,
    body,
    type,
    timestamp: Date.now(),
  }

  if (onToast) {
    try {
      onToast(toast)
    } catch (e) {
      console.warn('[NotificationBridge] onToast callback error:', e)
    }
  }

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('sanad:toast', { detail: toast }))
    } catch (e) {
      console.warn('[NotificationBridge] Window dispatch toast error:', e)
    }
  }

  return toast
}

/**
 * Schedule future prayer notifications on Android so they trigger on lockscreen
 * even if the app process is closed or battery saver is active.
 */
export async function scheduleNativePrayers(
  prayerTimes: {
    fajr?: Date
    dhuhr?: Date
    asr?: Date
    maghrib?: Date
    isha?: Date
  },
  settings: NotificationSettings,
  lang: 'ar' | 'en'
): Promise<void> {
  if (!checkIsNative() || !settings.prayerAlerts) return

  try {
    await initNativeNotificationChannels()
    const plugin = await getLocalNotificationsPlugin()
    if (!plugin) return

    const now = new Date()
    const isAr = lang === 'ar'

    const prayerList = [
      {
        id: 101,
        time: prayerTimes.fajr,
        title: isAr ? 'أذان الفجر • الله أكبر' : 'Fajr Adhan • Allahu Akbar',
        body: isAr
          ? 'حان الآن موعد أذان الفجر بتوقيت القاهرة | الصلاة خير من النوم.'
          : 'Now is Fajr prayer time in Cairo | Prayer is better than sleep.',
      },
      {
        id: 102,
        time: prayerTimes.dhuhr,
        title: isAr ? 'أذان الظهر • الله أكبر' : 'Dhuhr Adhan • Allahu Akbar',
        body: isAr
          ? 'حان الآن موعد أذان الظهر بتوقيت القاهرة | توقف عن الكود وأرح بدنك بالصلاة.'
          : 'Now is Dhuhr prayer time in Cairo | Pause your code and find peace in prayer.',
      },
      {
        id: 103,
        time: prayerTimes.asr,
        title: isAr ? 'أذان العصر • الله أكبر' : 'Asr Adhan • Allahu Akbar',
        body: isAr
          ? 'حان الآن موعد أذان العصر بتوقيت القاهرة | حافظوا على الصلوات والصلاة الوسطى.'
          : 'Now is Asr prayer time in Cairo | Strictly guard your prayers.',
      },
      {
        id: 104,
        time: prayerTimes.maghrib,
        title: isAr ? 'أذان المغرب • الله أكبر' : 'Maghrib Adhan • Allahu Akbar',
        body: isAr
          ? 'حان الآن موعد أذان المغرب بتوقيت القاهرة | تقبل الله طاعاتكم وصالح أعمالكم.'
          : 'Now is Maghrib prayer time in Cairo | May Allah accept your good deeds.',
      },
      {
        id: 105,
        time: prayerTimes.isha,
        title: isAr ? 'أذان العشاء • الله أكبر' : 'Isha Adhan • Allahu Akbar',
        body: isAr
          ? 'حان الآن موعد أذان العشاء بتوقيت القاهرة | اختم يومك بالصلاة والسكينة.'
          : 'Now is Isha prayer time in Cairo | Conclude your day with serene prayer.',
      },
    ]

    const upcoming = prayerList.filter((p) => p.time && p.time.getTime() > now.getTime())

    if (upcoming.length > 0) {
      await plugin.schedule({
        notifications: upcoming.map((p) => ({
          id: p.id,
          title: p.title,
          body: p.body,
          channelId: NOTIFICATION_CHANNELS.PRAYERS.id,
          smallIcon: 'ic_stat_name',
          iconColor: '#10b981',
          schedule: { at: p.time!, allowWhileIdle: true },
        })),
      })
    }
  } catch (err) {
    console.warn('[NotificationBridge] Failed to schedule native prayers:', err)
  }
}

/**
 * Schedules a background test notification after delayMs (e.g. 5000ms).
 * Keeps the Service Worker alive via event.waitUntil or native alarm,
 * guaranteeing arrival even if the user minimizes or closes the app.
 */
export async function scheduleBackgroundTestNotification({
  delayMs = 5000,
  title,
  body,
  type = 'prayer',
}: {
  delayMs?: number
  title?: string
  body?: string
  type?: InAppToast['type']
} = {}): Promise<boolean> {
  const currentPerm = await checkUnifiedNotificationPermission()
  if (currentPerm !== 'granted') {
    const requested = await requestUnifiedNotificationPermission()
    if (requested !== 'granted') {
      return false
    }
  }

  const finalTitle = title || 'سند المُبرمج • اختبار الإشعار والتطبيق مغلق'
  const finalBody =
    body || 'نجح الاختبار! الإشعار وصلك في شريط النظام والتطبيق مغلق تماماً.'

  // 1. Native Capacitor Android
  if (checkIsNative()) {
    try {
      const plugin = await getLocalNotificationsPlugin()
      if (plugin) {
        await plugin.schedule({
          notifications: [
            {
              id: 99999,
              title: finalTitle,
              body: finalBody,
              channelId: NOTIFICATION_CHANNELS.GENERAL.id,
              smallIcon: 'ic_stat_name',
              iconColor: '#10b981',
              schedule: { at: new Date(Date.now() + delayMs), allowWhileIdle: true },
            },
          ],
        })
      }
    } catch (e) {
      console.warn('[NotificationBridge] Native test schedule error:', e)
    }
  }

  // 2. Web Service Worker (PWA)
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready
      const target = navigator.serviceWorker.controller || reg.active
      if (target) {
        target.postMessage({
          type: 'SCHEDULE_TEST_NOTIFICATION',
          delayMs,
          title: finalTitle,
          body: finalBody,
          notificationType: type,
        })
      }
    } catch (err) {
      console.warn('[NotificationBridge] SW test schedule error:', err)
    }
  }

  return true
}

// ================= SHARED INDEXEDDB STORAGE (PERSISTENT & SURVIVES PAGE CLOSE) =================
const IDB_NAME = 'sanad_sw_db_v2'
const IDB_STORE = 'sw_state_store'
const IDB_KEY = 'sw_state'

export function openSwIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'))
    }
    try {
      const req = indexedDB.open(IDB_NAME, 2)
      req.onupgradeneeded = (e: any) => {
        try {
          const db = e.target.result
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE)
          }
        } catch (upgradeErr) {
          console.warn('[NotificationBridge] IDB upgrade error:', upgradeErr)
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error || new Error('Failed to open IDB'))
    } catch (err) {
      reject(err)
    }
  })
}

export async function saveSwStateToIndexedDB(statePartial: Record<string, any>): Promise<boolean> {
  try {
    const db = await openSwIndexedDb()
    if (!db || !db.objectStoreNames || !db.objectStoreNames.contains(IDB_STORE)) {
      return false
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite')
        const store = tx.objectStore(IDB_STORE)
        const getReq = store.get(IDB_KEY)
        getReq.onsuccess = () => {
          try {
            const existing = getReq.result || {}
            const merged = { ...existing, ...statePartial }
            const putReq = store.put(merged, IDB_KEY)
            putReq.onsuccess = () => resolve(true)
            putReq.onerror = () => resolve(false)
          } catch {
            resolve(false)
          }
        }
        getReq.onerror = () => resolve(false)
        tx.onerror = () => resolve(false)
      } catch (txErr) {
        console.warn('[NotificationBridge] IDB save transaction error:', txErr)
        resolve(false)
      }
    })
  } catch (err) {
    console.warn('[NotificationBridge] Error saving to IDB:', err)
    return false
  }
}

export async function readSwStateFromIndexedDB(): Promise<any> {
  try {
    const db = await openSwIndexedDb()
    if (!db || !db.objectStoreNames || !db.objectStoreNames.contains(IDB_STORE)) {
      return null
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly')
        const store = tx.objectStore(IDB_STORE)
        const req = store.get(IDB_KEY)
        req.onsuccess = () => resolve(req.result || null)
        req.onerror = () => resolve(null)
        tx.onerror = () => resolve(null)
      } catch {
        resolve(null)
      }
    })
  } catch {
    return null
  }
}

export interface SwLiveStatus {
  isAlive: boolean
  version: string
  timerRunning: boolean
  lastHeartbeat: number
  currentTime: number
  salawatIntervalMinutes: number
  salawatAudioEnabled: boolean
  lastSalawatTime: number
  nextSalawatInMs: number
  waqarIntervalMinutes?: number
  waqarMessagesEnabled?: boolean
  lastWaqarTime?: number
  nextWaqarInMs?: number
  scheduledSalawatTimes?: number[]
  scheduledWaqarTimes?: number[]
  indexedDbActive: boolean
  cacheName: string
  settings?: NotificationSettings
}

export const DEFAULT_SW_LIVE_STATUS: SwLiveStatus = {
  isAlive: false,
  version: 'sanad-dev-shell-v14',
  timerRunning: false,
  lastHeartbeat: 0,
  currentTime: Date.now(),
  salawatIntervalMinutes: 15,
  salawatAudioEnabled: true,
  lastSalawatTime: 0,
  nextSalawatInMs: 15 * 60 * 1000,
  waqarIntervalMinutes: 10,
  waqarMessagesEnabled: true,
  lastWaqarTime: 0,
  nextWaqarInMs: 10 * 60 * 1000,
  scheduledSalawatTimes: [],
  scheduledWaqarTimes: [],
  indexedDbActive: false,
  cacheName: 'sanad-dev-shell-v14',
}

/**
 * Diagnostic query to check whether the background Service Worker and its timer are active.
 * Safe and non-blocking: races navigator.serviceWorker.ready with a 1.2s timeout, never throws,
 * and always returns a valid SwLiveStatus object.
 */
export async function queryServiceWorkerStatus(): Promise<SwLiveStatus> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return DEFAULT_SW_LIVE_STATUS
  }

  try {
    // Race navigator.serviceWorker.ready with a 1200ms timeout
    const readyPromise = navigator.serviceWorker.ready
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
    const reg = await Promise.race([readyPromise, timeoutPromise])

    const target = navigator.serviceWorker.controller || reg?.active
    if (!target) {
      return DEFAULT_SW_LIVE_STATUS
    }

    return await new Promise<SwLiveStatus>((resolve) => {
      const channel = new MessageChannel()
      const timer = setTimeout(() => {
        resolve(DEFAULT_SW_LIVE_STATUS)
      }, 1500)

      channel.port1.onmessage = (event) => {
        clearTimeout(timer)
        if (event.data?.type === 'SW_STATUS_RESPONSE' && event.data.payload) {
          resolve({
            ...DEFAULT_SW_LIVE_STATUS,
            ...event.data.payload,
            isAlive: true,
          })
        } else {
          resolve(DEFAULT_SW_LIVE_STATUS)
        }
      }

      try {
        target.postMessage({ type: 'GET_SW_STATUS' }, [channel.port2])
      } catch {
        clearTimeout(timer)
        resolve(DEFAULT_SW_LIVE_STATUS)
      }
    })
  } catch (err) {
    console.warn('[NotificationBridge] queryServiceWorkerStatus error:', err)
    return DEFAULT_SW_LIVE_STATUS
  }
}

/**
 * Directly triggers an immediate Salawat notification through the Service Worker
 */
export async function triggerImmediateSalawatSw(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false
  try {
    const reg = await navigator.serviceWorker.ready
    const target = navigator.serviceWorker.controller || reg.active
    if (!target) return false

    target.postMessage({ type: 'TRIGGER_SALAWAT_NOW' })
    return true
  } catch (err) {
    console.warn('[NotificationBridge] triggerImmediateSalawatSw error:', err)
    return false
  }
}

/**
 * Directly triggers an immediate Waqar reminder through the Service Worker
 */
export async function triggerImmediateWaqarSw(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false
  try {
    const reg = await navigator.serviceWorker.ready
    const target = navigator.serviceWorker.controller || reg.active
    if (!target) return false

    target.postMessage({ type: 'TRIGGER_WAQAR_NOW' })
    return true
  } catch (err) {
    console.warn('[NotificationBridge] triggerImmediateWaqarSw error:', err)
    return false
  }
}

/**
 * Directly triggers an immediate Peace & Motivation reminder through the Service Worker
 */
export async function triggerImmediatePeaceSw(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false
  try {
    const reg = await navigator.serviceWorker.ready
    const target = navigator.serviceWorker.controller || reg.active
    if (!target) return false

    target.postMessage({ type: 'TRIGGER_PEACE_NOW' })
    return true
  } catch (err) {
    console.warn('[NotificationBridge] triggerImmediatePeaceSw error:', err)
    return false
  }
}

/**
 * Register modern Periodic Background Sync API for Chrome Android / Chromium
 * Registers 'sanad-periodic-check' with a 10-minute minimum interval.
 */
export async function registerPeriodicBackgroundSync(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false
  try {
    const reg = await navigator.serviceWorker.ready
    if (reg && 'periodicSync' in reg) {
      const periodicSync = (reg as any).periodicSync
      try {
        const tags = await periodicSync.getTags()
        if (!tags.includes('sanad-periodic-check')) {
          await periodicSync.register('sanad-periodic-check', {
            minInterval: 10 * 60 * 1000,
          })
          console.log('[Sanad SW] Registered periodicSync: sanad-periodic-check (10 mins)')
        }
        if (!tags.includes('sanad-reminders')) {
          await periodicSync.register('sanad-reminders', {
            minInterval: 10 * 60 * 1000,
          })
        }
        return true
      } catch (permErr) {
        console.log('[Sanad SW] Periodic sync registration note:', permErr)
      }
    }
  } catch (err) {
    console.warn('[NotificationBridge] registerPeriodicBackgroundSync error:', err)
  }
  return false
}

/**
 * Syncs app notification settings and today's prayer times with the background Service Worker (public/sw.js)
 * Automatically writes to IndexedDB first, ensuring persistence across browser closures.
 */
export async function syncServiceWorkerReminders(
  settings: NotificationSettings,
  prayerTimes?: any,
  lang: 'ar' | 'en' = 'ar',
  prayerOffsets?: PrayerOffsets,
  userProfile?: UserProfile
): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const serializedPrayers: Record<string, number> = {}
    if (prayerTimes) {
      for (const key of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']) {
        if (prayerTimes[key] && typeof prayerTimes[key].getTime === 'function') {
          serializedPrayers[key] = prayerTimes[key].getTime()
        }
      }
    }

    // Generate 60 days of Cairo prayer times for 100% offline accuracy
    const prayerCalendar: Record<string, Record<string, number>> = {}
    const baseDate = new Date()
    for (let i = 0; i < 60; i++) {
      const d = new Date(baseDate)
      d.setDate(d.getDate() + i)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const dateKey = `${y}-${m}-${day}`
      const times = getCairoPrayerTimes(d, prayerOffsets).prayerTimes
      prayerCalendar[dateKey] = {
        fajr: times.fajr.getTime(),
        sunrise: times.sunrise.getTime(),
        dhuhr: times.dhuhr.getTime(),
        asr: times.asr.getTime(),
        maghrib: times.maghrib.getTime(),
        isha: times.isha.getTime(),
      }
    }

    // Pre-calculate target absolute timestamps for the next 24 hours
    const now = Date.now()
    const salawatMins = Number(settings.salawatIntervalMinutes) || 15
    const waqarMins = Number(settings.waqarIntervalMinutes) || 10
    const scheduledSalawatTimes: number[] = []
    const scheduledWaqarTimes: number[] = []

    for (let i = 1; i <= 24; i++) {
      scheduledSalawatTimes.push(now + i * salawatMins * 60 * 1000)
      scheduledWaqarTimes.push(now + i * waqarMins * 60 * 1000)
    }

    // 1. Immediately persist to shared IndexedDB so background worker has state even if terminated
    await saveSwStateToIndexedDB({
      settings,
      prayerTimes: serializedPrayers,
      prayerCalendar,
      scheduledSalawatTimes,
      scheduledWaqarTimes,
      lang,
      userProfile,
    })

    // 2. Transmit via postMessage to active Service Worker controller
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready
        const target = navigator.serviceWorker.controller || reg?.active
        if (target) {
          target.postMessage({
            type: 'SYNC_CONFIG',
            payload: {
              settings,
              prayerTimes: serializedPrayers,
              prayerCalendar,
              scheduledSalawatTimes,
              scheduledWaqarTimes,
              lang,
              userProfile,
            },
          })
        }

        // 3. Register Periodic Background Sync with standard 10-minute check
        await registerPeriodicBackgroundSync()
      } catch (err) {
        console.warn('[NotificationBridge] Error syncing reminders with SW:', err)
      }
    }
  } catch (outerErr) {
    console.warn('[NotificationBridge] syncServiceWorkerReminders outer error:', outerErr)
  }
}

// Ensure page unload/hide does NOT stop the SW timer and sends keepalive
if (typeof window !== 'undefined') {
  const sendKeepAlive = () => {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'KEEP_ALIVE' })
      }
      registerPeriodicBackgroundSync().catch(() => {})
    } catch {}
  }

  window.addEventListener('pagehide', sendKeepAlive)
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendKeepAlive()
    }
  })

  // Proactively register periodic background sync on boot
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
      registerPeriodicBackgroundSync().catch(() => {})
    }).catch(() => {})
  }
}
