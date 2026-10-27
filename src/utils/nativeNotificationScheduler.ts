import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import type { LocalNotificationSchema, Channel } from '@capacitor/local-notifications'
import type { NotificationSettings, PrayerOffsets, UserProfile } from '../types'
import { getCairoPrayerTimes } from './prayer'

/**
 * Android Notification Channels configuration
 */
export const NATIVE_CHANNELS: Record<string, Channel> = {
  PRAYERS: {
    id: 'sanad_prayers',
    name: 'مواقيت الصلاة والأذان (Prayer Times)',
    description: 'تنبيهات مواقيت الصلوات الخمس وسماع صوت الأذان',
    importance: 5, // High / Heads-up
    visibility: 1, // Public on lockscreen
    vibration: true,
    sound: 'cairo_adhan.mp3',
  },
  PRE_ADHAN: {
    id: 'sanad_pre_adhan',
    name: 'تنبيهات قبل الصلاة بـ 5 دقائق (Pre-Prayer Alerts)',
    description: 'تنبيه مسبق قبل حلول موعد الصلاة بـ 5 دقائق للوضوء والاستعداد',
    importance: 4,
    visibility: 1,
    vibration: true,
    sound: 'takbeerat.mp3',
  },
  SALAWAT: {
    id: 'sanad_salawat',
    name: 'الصلاة على النبي ﷺ (Salawat)',
    description: 'تنبيهات دورية للصلاة والسلام على الحبيب المصطفى ﷺ',
    importance: 4,
    visibility: 1,
    vibration: true,
    sound: 'salawat.mp3',
  },
  WAQAR: {
    id: 'sanad_waqar',
    name: 'رسائل وَقار وعفة (Waqar Reminders)',
    description: 'رسائل روحانية تعزز العفة وغض البصر وحياء المبرمج والمبرمجة',
    importance: 4,
    visibility: 1,
    vibration: true,
    sound: 'waqar_chime.wav',
  },
  DHIKR: {
    id: 'sanad_dhikr',
    name: 'أذكار وسكينة سند (Sukoon & Dhikr)',
    description: 'أذكار واستغفار واستراحة روحانية للمطورين',
    importance: 3,
    visibility: 1,
    vibration: true,
  },
  GENERAL: {
    id: 'sanad_general',
    name: 'تنبيهات سند العامة (General)',
    description: 'تنبيهات النظام والتحديات البرمجية',
    importance: 3,
    visibility: 1,
  },
}

let channelsInitialized = false

/**
 * Initialize Android notification channels
 */
export async function initNativeChannels(): Promise<void> {
  if (!Capacitor.isNativePlatform() || channelsInitialized) return

  try {
    for (const channel of Object.values(NATIVE_CHANNELS)) {
      await LocalNotifications.createChannel(channel)
    }
    channelsInitialized = true
  } catch (err) {
    console.warn('[NativeNotificationScheduler] Error creating channels:', err)
  }
}

/**
 * On app startup, request notification permissions if running natively
 */
export async function requestNativePermissionsOnStartup(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false

  try {
    await initNativeChannels()
    const check = await LocalNotifications.checkPermissions()
    if (check.display !== 'granted') {
      const res = await LocalNotifications.requestPermissions()
      return res.display === 'granted'
    }
    return true
  } catch (err) {
    console.warn('[NativeNotificationScheduler] Error requesting permissions on startup:', err)
    return false
  }
}

// ================= ROTATING SPIRITUAL CONTENT POOLS =================

const SALAWAT_POOL_AR = [
  'اللهم صلِّ وسلِّم وبارك على نبينا وحبيبنا محمد وعلى آله وصحبه أجمعين.',
  'إن الصلاة على النبي ﷺ تفرج الهموم وتكفي ما أهمك من أمر الدنيا والآخرة.',
  'صلوا على من بكى شوقاً لرؤيتنا.. اللهم صلِّ وسلم على سيدنا محمد.',
  '«مَن صلى عليَّ صلاةً صلى الله عليه بها عشراً» • طِب قلباً ولساناً بالصلاة عليه.',
]

const WAQAR_SISTER_POOL_AR = [
  'حجابك وعفتك وحياؤك تاج فخرك وأمانتك في كل ميدان وفي عالم البرمجة.',
  'اجعلي كودك وسعيك شاهداً لكِ بالخير والعفة، والله يبارك في سعي المهندسة النقية.',
  'حياؤكِ في تخاطبكِ وعملكِ سر هيبتك ووقارك، حفظكِ الله وزادكِ رفعة ونوراً.',
  'العفة ليست مظهراً فحسب، بل منهج تفكير وعمل متقن.. دمتِ فخراً لأمتك.',
]

const WAQAR_BROTHER_POOL_AR = [
  'غض البصر أمانة ونقاء للبصيرة، ورزق الله وبركة الفهم تُستجلب بالتقوى والورع.',
  'احفظ الله يحفظك، واجعل عملك البرمجي وسعيك خالصاً لوجه الله تعالى ومروءة للمسلم.',
  'المروءة والشهامة وأمانة السعي شيمة المسلم الحق في كل كود وفكرة وعلاقة.',
  '«وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجاً وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ».',
]

const SUKOON_POOL_AR = [
  'خذ نفساً عميقاً، وأرح عينيك من الشاشة دقيقة.. «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ».',
  'البرمجة حل للمشكلات، والذكر حل لضيق الصدور.. سبحان الله وبحمده سبحان الله العظيم.',
  'استعن بالله ولا تعجز إن استعصى عليك كود أو منطق، وتوكل على الفتاح العليم.',
  '«وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ وَسَبِّحْ بِحَمْدِهِ» • أراحتك الطمأنينة.',
]

const DHIKR_POOL_AR = [
  'أستغفر الله العظيم وأتوب إليه • استغفار يفتح الأقفال ويجلب الأرزاق.',
  'لا حول ولا قوة إلا بالله العلي العظيم • كنز من كنوز الجنة ودواء للهموم.',
  'سبحان الله وبحمده، عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته.',
  'يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.',
  'لا إله إلا أنت سبحانك إني كنت من الظالمين • دعوة ذي النون ما دعا بها مكروب إلا فرج الله عنه.',
]

const SALAWAT_POOL_EN = [
  'O Allah, send peace and blessings upon our beloved Prophet Muhammad and his family.',
  'Sending blessings upon the Prophet ﷺ brings tranquility and wipes away worries.',
]

const WAQAR_POOL_EN = [
  'Modesty, pure intentions, and professional integrity bring divine blessing to your code.',
  'Guard your heart, lower your gaze, and seek excellence for the sake of Allah.',
]

const SUKOON_POOL_EN = [
  'Take a deep breath and rest your eyes: "Verily, in the remembrance of Allah do hearts find rest."',
  'Seek Allah\'s guidance and never despair when solving complex problems.',
]

const DHIKR_POOL_EN = [
  'Astaghfirullah wa atoobu ilayh (I seek forgiveness from Allah and repent to Him).',
  'La hawla wa la quwwata illa billah (There is no power nor strength except with Allah).',
]

/**
 * Schedules all native local notifications:
 * 1. Exact prayer times (Adhan) with sound & wake lock
 * 2. 5-minute pre-prayer alerts with sound
 * 3. 10-minute recurring dhikr and rotating spiritual messages (Waqar, Sukoon, Salawat, Dhikr)
 * 4. Hourly & daily recurring native alarms as continuous fallback
 */
export async function scheduleAllNativeNotifications({
  settings,
  prayerOffsets,
  userProfile,
  lang = 'ar',
}: {
  settings: NotificationSettings
  prayerOffsets?: PrayerOffsets
  userProfile?: UserProfile
  lang?: 'ar' | 'en'
}): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  try {
    await initNativeChannels()

    // 1. Cancel previous pending notifications to avoid duplicate triggers
    try {
      if (typeof (LocalNotifications as any).cancelAll === 'function') {
        await LocalNotifications.cancelAll()
      } else {
        const pending = await LocalNotifications.getPending()
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel({
            notifications: pending.notifications.map((n) => ({ id: n.id })),
          })
        }
      }
    } catch (cancelErr) {
      console.warn('[NativeNotificationScheduler] Cancel error:', cancelErr)
    }

    const notifications: LocalNotificationSchema[] = []
    const now = Date.now()
    const isAr = lang === 'ar'
    const userName = userProfile?.name?.trim() || ''
    const userPrefix = userName ? (isAr ? `يا ${userName}، ` : `Dear ${userName}, `) : ''
    const userGender = userProfile?.gender || 'male'

    // ================= 2. PRAYER TIMES & 5-MIN PRE-PRAYER ALERTS =================
    if (settings.prayerAlerts !== false) {
      const prayerKeys = [
        { key: 'fajr', ar: 'الفجر', en: 'Fajr', index: 1 },
        { key: 'dhuhr', ar: 'الظهر', en: 'Dhuhr', index: 2 },
        { key: 'asr', ar: 'العصر', en: 'Asr', index: 3 },
        { key: 'maghrib', ar: 'المغرب', en: 'Maghrib', index: 4 },
        { key: 'isha', ar: 'العشاء', en: 'Isha', index: 5 },
      ] as const

      // Schedule for today and the next 4 days (5 days total)
      const baseDate = new Date()
      for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const targetDay = new Date(baseDate)
        targetDay.setDate(targetDay.getDate() + dayOffset)
        const timesData = getCairoPrayerTimes(targetDay, prayerOffsets).prayerTimes

        for (const p of prayerKeys) {
          const prayerTime: Date | undefined = (timesData as any)[p.key]
          if (!prayerTime) continue

          const prayerTimestamp = prayerTime.getTime()
          const preAdhanTimestamp = prayerTimestamp - 5 * 60 * 1000

          const prayerName = isAr ? p.ar : p.en

          // 2.A: 5-minute Pre-Prayer Alert
          if (settings.preAdhanAlerts !== false && preAdhanTimestamp > now + 1000) {
            const preAdhanId = 10000 + dayOffset * 10 + p.index
            notifications.push({
              id: preAdhanId,
              title: isAr
                ? `اقتربت صلاة ${prayerName} • متبقي 5 دقائق`
                : `Upcoming ${prayerName} • 5 mins left`,
              body: isAr
                ? `${userPrefix}متبقي 5 دقائق على موعد أذان ${prayerName}. تهيأ للوضوء والصلاة وأرح قلبك.`
                : `${userPrefix}5 minutes left until ${prayerName} prayer. Prepare for wudu and prayer.`,
              channelId: NATIVE_CHANNELS.PRE_ADHAN.id,
              sound: settings.soundEnabled ? 'takbeerat.mp3' : undefined,
              smallIcon: 'ic_stat_name',
              iconColor: '#10b981',
              schedule: {
                at: new Date(preAdhanTimestamp),
                allowWhileIdle: true,
              },
              isExactNotification: true,
              extra: {
                type: 'pre_adhan',
                prayer: p.key,
              },
            })
          }

          // 2.B: Exact Prayer Time (Adhan)
          if (prayerTimestamp > now + 1000) {
            const prayerId = 20000 + dayOffset * 10 + p.index
            notifications.push({
              id: prayerId,
              title: isAr
                ? `أذان ${prayerName} • الله أكبر`
                : `${prayerName} Adhan • Allahu Akbar`,
              body: isAr
                ? `${userPrefix}حان الآن موعد أذان ${prayerName} بتوقيت القاهرة. حَيَّ على الصلاة، حَيَّ على الفلاح.`
                : `${userPrefix}Now is the time for ${prayerName} prayer in Cairo. Come to prayer.`,
              channelId: NATIVE_CHANNELS.PRAYERS.id,
              sound: settings.soundEnabled ? 'cairo_adhan.mp3' : undefined,
              smallIcon: 'ic_stat_name',
              iconColor: '#10b981',
              schedule: {
                at: new Date(prayerTimestamp),
                allowWhileIdle: true,
              },
              isExactNotification: true,
              extra: {
                type: 'prayer',
                prayer: p.key,
              },
            })
          }
        }
      }
    }

    // ================= 3. 10-MINUTE RECURRING ROTATING SPIRITUAL MESSAGES =================
    // Generate a rotating schedule of exact notifications every 10 minutes for the upcoming 24 hours
    // (Slots from now+10m up to 24 hours = 144 slots)
    // Ensures notifications fire on exact timestamps with Doze-mode bypass (allowWhileIdle: true)
    const salawatPool = isAr ? SALAWAT_POOL_AR : SALAWAT_POOL_EN
    const waqarPool = isAr
      ? userGender === 'female'
        ? WAQAR_SISTER_POOL_AR
        : WAQAR_BROTHER_POOL_AR
      : WAQAR_POOL_EN
    const sukoonPool = isAr ? SUKOON_POOL_AR : SUKOON_POOL_EN
    const dhikrPool = isAr ? DHIKR_POOL_AR : DHIKR_POOL_EN

    const stepMinutes = 10
    const totalSlots = 72 // 12 hours of rotating 10-minute triggers (72 notifications)

    for (let slot = 1; slot <= totalSlots; slot++) {
      const slotTime = new Date(now + slot * stepMinutes * 60 * 1000)
      const slotId = 30000 + slot
      const categoryType = slot % 4

      let title = ''
      let body = ''
      let channelId = NATIVE_CHANNELS.DHIKR.id
      let sound: string | undefined = undefined
      let extraType = 'dhikr'

      switch (categoryType) {
        case 0: {
          // Salawat
          if (settings.periodicDhikr === false && !settings.salawatAudioEnabled) continue
          const text = salawatPool[slot % salawatPool.length]
          title = isAr ? 'صلّ على النبي ﷺ • زاد المبرمج' : 'Blessings on the Prophet ﷺ'
          body = text
          channelId = NATIVE_CHANNELS.SALAWAT.id
          sound = settings.salawatAudioEnabled !== false ? 'salawat.mp3' : undefined
          extraType = 'salawat'
          break
        }
        case 1: {
          // Waqar
          if (settings.waqarMessagesEnabled === false) continue
          const text = waqarPool[slot % waqarPool.length]
          title = isAr ? 'رسالة وَقار • طمأنينة وسكينة' : 'Waqar & Modesty'
          body = `${userPrefix}${text}`
          channelId = NATIVE_CHANNELS.WAQAR.id
          sound = settings.waqarSoundEnabled !== false ? 'waqar_chime.wav' : undefined
          extraType = 'waqar'
          break
        }
        case 2: {
          // Sukoon / Motivation
          const text = sukoonPool[slot % sukoonPool.length]
          title = isAr ? 'إشراقة سكينة • استعن بالله' : 'Sanad Sukoon'
          body = `${userPrefix}${text}`
          channelId = NATIVE_CHANNELS.DHIKR.id
          extraType = 'peace'
          break
        }
        case 3:
        default: {
          // Dhikr & Istighfar
          const text = dhikrPool[slot % dhikrPool.length]
          title = isAr ? 'تذكرة روحانية • ألا بذكر الله تطمئن القلوب' : 'Spiritual Dhikr'
          body = text
          channelId = NATIVE_CHANNELS.DHIKR.id
          extraType = 'dhikr'
          break
        }
      }

      notifications.push({
        id: slotId,
        title,
        body,
        channelId,
        sound: settings.soundEnabled ? sound : undefined,
        smallIcon: 'ic_stat_name',
        iconColor: '#10b981',
        schedule: {
          at: slotTime,
          allowWhileIdle: true,
        },
        isExactNotification: true,
        extra: { type: extraType },
      })
    }

    // ================= 4. NATIVE RECURRING FALLBACK TRIGGERS =================
    // Permanent recurring native triggers that continue indefinitely
    // 4.A: Hourly Dhikr
    notifications.push({
      id: 9001,
      title: isAr ? 'صلّ على النبي ﷺ • ذكر الساعة' : 'Hourly Dhikr & Salawat',
      body: isAr
        ? '«اللهم صلِّ وسلِّم وبارك على نبينا محمد» • استراحة دقيقة لذكر الله.'
        : 'Take a moment to send peace upon the Prophet and remember Allah.',
      channelId: NATIVE_CHANNELS.SALAWAT.id,
      sound: settings.soundEnabled ? 'salawat.mp3' : undefined,
      smallIcon: 'ic_stat_name',
      iconColor: '#10b981',
      schedule: {
        every: 'hour',
        allowWhileIdle: true,
      },
      extra: { type: 'salawat_recurring' },
    })

    // 4.B: Morning Adhkar (Daily at 06:30)
    notifications.push({
      id: 9002,
      title: isAr ? 'أذكار الصباح • بداية مباركة' : 'Morning Adhkar',
      body: isAr
        ? `${userPrefix}«أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ» • افتح سند وابدأ يومك بالبركة.`
        : `${userPrefix}Begin your day with morning remembrance and divine peace.`,
      channelId: NATIVE_CHANNELS.DHIKR.id,
      smallIcon: 'ic_stat_name',
      iconColor: '#10b981',
      schedule: {
        on: { hour: 6, minute: 30 },
        allowWhileIdle: true,
      },
      extra: { type: 'morning_adhkar' },
    })

    // 4.C: Evening Adhkar (Daily at 17:30)
    notifications.push({
      id: 9003,
      title: isAr ? 'أذكار المساء • حفظ وسكينة' : 'Evening Adhkar',
      body: isAr
        ? `${userPrefix}«أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ» • حصّن نفسك بحفظ الله وأذكار المساء.`
        : `${userPrefix}Guard yourself with evening remembrance and tranquility.`,
      channelId: NATIVE_CHANNELS.DHIKR.id,
      smallIcon: 'ic_stat_name',
      iconColor: '#10b981',
      schedule: {
        on: { hour: 17, minute: 30 },
        allowWhileIdle: true,
      },
      extra: { type: 'evening_adhkar' },
    })

    // Schedule all notifications in batch
    if (notifications.length > 0) {
      await LocalNotifications.schedule({
        notifications,
      })
      console.log(
        `[NativeNotificationScheduler] Successfully scheduled ${notifications.length} native alarms & notifications.`
      )
    }
  } catch (err) {
    console.warn('[NativeNotificationScheduler] Error scheduling all native notifications:', err)
  }
}
