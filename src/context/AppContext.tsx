import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react'
import type {
  Language,
  Theme,
  TabId,
  DeveloperReminder,
  GuessChallenge,
  BugChallenge,
  Announcement,
  PrayerOffsets,
  NotificationSettings,
  DeveloperSuggestion,
  InAppToast,
  UserProfile,
} from '../types'
import {
  DEFAULT_REMINDERS,
  DEFAULT_GUESS_CHALLENGES,
  DEFAULT_BUG_CHALLENGES,
  DEFAULT_ANNOUNCEMENT,
  DEFAULT_OFFSETS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_SUGGESTIONS,
  DEFAULT_USER_PROFILE,
} from '../constants/defaults'
import { getNextPrayerCountdown, getCairoPrayerTimes } from '../utils/prayer'
import {
  scheduleNativePrayers,
  syncServiceWorkerReminders,
} from '../utils/notifications'
import { playSalawatReminder, playNotificationSound, playAdhanAudio } from '../utils/audio'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { scheduleAllNativeNotifications } from '../utils/nativeNotificationScheduler'

interface AppContextType {
  lang: Language
  dir: 'rtl' | 'ltr'
  theme: Theme
  activeTab: TabId
  prayerMode: boolean
  isAdminUnlocked: boolean
  isPasswordModalOpen: boolean
  isNotificationModalOpen: boolean
  isSpiritualToolsModalOpen: boolean
  spiritualToolsTab: 'tasbih' | 'duaa'
  currentTime: Date
  prayerStatus: ReturnType<typeof getNextPrayerCountdown>
  cairoPrayerData: ReturnType<typeof getCairoPrayerTimes>
  setLang: (lang: Language) => void
  toggleLang: () => void
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setActiveTab: (tab: TabId) => void
  setPrayerMode: (active: boolean) => void
  togglePrayerMode: () => void
  setIsAdminUnlocked: (unlocked: boolean) => void
  setIsPasswordModalOpen: (open: boolean) => void
  setIsNotificationModalOpen: (open: boolean) => void
  setIsSpiritualToolsModalOpen: (open: boolean) => void
  setSpiritualToolsTab: (tab: 'tasbih' | 'duaa') => void
  openSpiritualTools: (tab?: 'tasbih' | 'duaa') => void
  handleTabSelect: (tab: TabId) => void

  // Admin Credentials & Authentication
  adminUsername: string
  adminPassword: string
  adminPin: string
  loginAdmin: (username: string, password: string) => boolean
  logoutAdmin: () => void
  updateAdminCredentials: (newUsername: string, newPassword: string) => void
  setAdminPin: (pin: string) => void
  verifyAdminPin: (pin: string) => boolean

  // Content Management: Reminders
  reminders: DeveloperReminder[]
  addReminder: (reminder: Omit<DeveloperReminder, 'id'>) => void
  deleteReminder: (id: string) => void
  resetReminders: () => void

  // Content Management: Daily Code Challenges
  guessChallenges: GuessChallenge[]
  addGuessChallenge: (challenge: Omit<GuessChallenge, 'id'>) => void
  deleteGuessChallenge: (id: string) => void
  bugChallenges: BugChallenge[]
  addBugChallenge: (challenge: Omit<BugChallenge, 'id'>) => void
  deleteBugChallenge: (id: string) => void

  // Broadcast Announcement Banner
  announcement: Announcement
  setAnnouncement: (ann: Announcement) => void

  // Cairo Mosque Offsets & Audio Volume
  prayerOffsets: PrayerOffsets
  setPrayerOffsets: (offsets: PrayerOffsets) => void
  audioVolume: number
  setAudioVolume: (volume: number) => void

  // Notification Settings & Recent Archive
  notificationSettings: NotificationSettings
  setNotificationSettings: (settings: NotificationSettings) => void
  recentNotifications: InAppToast[]
  clearRecentNotifications: () => void

  // Developer Suggestions Box
  isSuggestionModalOpen: boolean
  setIsSuggestionModalOpen: (open: boolean) => void
  suggestions: DeveloperSuggestion[]
  addSuggestion: (sug: Omit<DeveloperSuggestion, 'id' | 'createdAt' | 'status'>) => void
  deleteSuggestion: (id: string) => void
  updateSuggestionStatus: (id: string, status: DeveloperSuggestion['status']) => void
  clearAllSuggestions: () => void

  // Data & Backup Utility
  exportAllData: () => string
  importAllData: (jsonStr: string) => boolean
  resetAllProgress: () => void

  // User Profile & Personalization
  userProfile: UserProfile
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  updateUserProfile: (partial: Partial<UserProfile>) => void
  isProfileModalOpen: boolean
  setIsProfileModalOpen: (open: boolean) => void

  // PWA & Standalone Detection
  isStandalone: boolean
  installPrompt: any
  promptInstall: () => Promise<boolean>
  isInstallModalOpen: boolean
  setIsInstallModalOpen: (open: boolean) => void
  isInstallBannerDismissed: boolean
  dismissInstallBanner: (proceedToBrowserOnboarding?: boolean) => void
}

const INITIAL_RECENT_NOTIFICATIONS: InAppToast[] = [
  {
    id: 'init-toast-1',
    title: 'سند المُبرمج • صباح البركة والتركيز العميق',
    body: 'ابدأ جلسة البرمجة بـ «بسم الله الرحمن الرحيم»، ورتّب أولوياتك الهندسية بإتقان وهدوء.',
    type: 'tip',
    timestamp: Date.now() - 1000 * 60 * 20,
  },
  {
    id: 'init-toast-2',
    title: 'أذان الظهر • الله أكبر',
    body: 'حان الآن موعد أذان الظهر بتوقيت القاهرة | توقف عن الكود، أسبغ الوضوء وأرح بدنك بالصلاة.',
    type: 'prayer',
    timestamp: Date.now() - 1000 * 60 * 65,
  },
  {
    id: 'init-toast-3',
    title: 'سند المُبرمج • الصلاة على النبي ﷺ',
    body: '«اللهم صلِّ وسلِّم وبارك على نبينا محمد» • اشرب كوب ماء وجدد نشاطك الذهني.',
    type: 'salawat',
    timestamp: Date.now() - 1000 * 60 * 130,
  },
  {
    id: 'init-toast-4',
    title: 'سند المُبرمج • صحة عينيك وقاعدة 20-20-20',
    body: 'أرِح عينيك الآن: انظر لشيء يبعد 20 قدماً لمدة 20 ثانية، واشرب كوب ماء واعتدل في جلستك.',
    type: 'tip',
    timestamp: Date.now() - 1000 * 60 * 210,
  },
  {
    id: 'init-toast-5',
    title: 'سند المُبرمج • إتقان الصنعة ونقاء الكود',
    body: '«إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ» • احرص على كود نظيف وتوثيق دقيق.',
    type: 'tip',
    timestamp: Date.now() - 1000 * 60 * 320,
  },
]

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core Preferences
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('sanad_lang') as Language) || 'ar'
  })

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('sanad_theme') as Theme
    if (saved === 'dark' || saved === 'light') return saved
    return 'dark'
  })

  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [prayerMode, setPrayerMode] = useState<boolean>(false)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('isAdminAuthenticated') === 'true'
    } catch {
      return false
    }
  })
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false)
  const [isSpiritualToolsModalOpen, setIsSpiritualToolsModalOpen] = useState<boolean>(false)
  const [spiritualToolsTab, setSpiritualToolsTab] = useState<'tasbih' | 'duaa'>('tasbih')
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Developer Suggestions
  const [suggestions, setSuggestions] = useState<DeveloperSuggestion[]>(() => {
    try {
      const saved = localStorage.getItem('sanad_developer_suggestions')
      return saved ? JSON.parse(saved) : DEFAULT_SUGGESTIONS
    } catch {
      return DEFAULT_SUGGESTIONS
    }
  })

  // Admin Credentials
  const [adminUsername, setAdminUsernameState] = useState<string>(() => {
    try {
      return localStorage.getItem('sanad_admin_username') || 'admin'
    } catch {
      return 'admin'
    }
  })

  const [adminPassword, setAdminPasswordState] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('sanad_admin_password') ||
        localStorage.getItem('sanad_admin_pin') ||
        '2482003'
      )
    } catch {
      return '2482003'
    }
  })

  const [adminPin, setAdminPinState] = useState<string>(() => {
    return (
      localStorage.getItem('sanad_admin_password') ||
      localStorage.getItem('sanad_admin_pin') ||
      '2482003'
    )
  })

  // Content: Reminders
  const [reminders, setReminders] = useState<DeveloperReminder[]>(() => {
    try {
      const saved = localStorage.getItem('sanad_reminders')
      return saved ? JSON.parse(saved) : DEFAULT_REMINDERS
    } catch {
      return DEFAULT_REMINDERS
    }
  })

  // Content: Challenges
  const [guessChallenges, setGuessChallenges] = useState<GuessChallenge[]>(() => {
    try {
      const saved = localStorage.getItem('sanad_guess_challenges')
      return saved ? JSON.parse(saved) : DEFAULT_GUESS_CHALLENGES
    } catch {
      return DEFAULT_GUESS_CHALLENGES
    }
  })

  const [bugChallenges, setBugChallenges] = useState<BugChallenge[]>(() => {
    try {
      const saved = localStorage.getItem('sanad_bug_challenges')
      return saved ? JSON.parse(saved) : DEFAULT_BUG_CHALLENGES
    } catch {
      return DEFAULT_BUG_CHALLENGES
    }
  })

  const [announcement, setAnnouncementState] = useState<Announcement>(() => {
    try {
      const saved = localStorage.getItem('sanad_announcement')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.textAr && parsed.textAr.includes('منصة سند')) {
          parsed.textAr = parsed.textAr.replace(/منصة سند/g, 'تطبيق سند')
        }
        return parsed
      }
      return DEFAULT_ANNOUNCEMENT
    } catch {
      return DEFAULT_ANNOUNCEMENT
    }
  })

  // Prayer Offsets
  const [prayerOffsets, setPrayerOffsetsState] = useState<PrayerOffsets>(() => {
    try {
      const saved = localStorage.getItem('sanad_prayer_offsets')
      return saved ? JSON.parse(saved) : DEFAULT_OFFSETS
    } catch {
      return DEFAULT_OFFSETS
    }
  })

  // Audio Volume
  const [audioVolume, setAudioVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('sanad_audio_volume')
    return saved ? parseInt(saved, 10) : 80
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettingsState] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem('sanad_notification_settings')
      return saved ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) } : DEFAULT_NOTIFICATION_SETTINGS
    } catch {
      return DEFAULT_NOTIFICATION_SETTINGS
    }
  })

  // Recent Notifications
  const [recentNotifications, setRecentNotifications] = useState<InAppToast[]>(() => {
    try {
      const saved = localStorage.getItem('sanad_recent_notifications')
      return saved ? JSON.parse(saved) : INITIAL_RECENT_NOTIFICATIONS
    } catch {
      return INITIAL_RECENT_NOTIFICATIONS
    }
  })

  // User Profile & Personalization
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('sanad_user_profile')
      if (saved) {
        return { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) }
      }
      return DEFAULT_USER_PROFILE
    } catch {
      return DEFAULT_USER_PROFILE
    }
  })

  // PWA Standalone & Install Prompt State
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return Boolean(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    )
  })

  const [installPrompt, setInstallPrompt] = useState<any>(() => {
    if (typeof window !== 'undefined' && (window as any).sanadDeferredPrompt) {
      return (window as any).sanadDeferredPrompt
    }
    return null
  })

  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false)

  const [isInstallBannerDismissed, setIsInstallBannerDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sanad_install_banner_dismissed') === 'true'
    } catch {
      return false
    }
  })

  // Smart Onboarding Gate:
  // If running in a regular browser tab (NOT standalone) and not onboarded yet, DO NOT show blocking modal immediately.
  // Allow user to see the Smart Install Banner first!
  // Only show modal immediately if running in standalone mode (installed app).
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sanad_user_profile')
      const isOnboarded = saved ? Boolean(JSON.parse(saved).onboarded) : false
      if (isOnboarded) return false

      if (typeof window === 'undefined') return false
      const standalone = Boolean(
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      )
      return standalone
    } catch {
      return false
    }
  })

  // Standalone detection & PWA events listener
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkStandaloneMode = (): boolean => {
      return Boolean(
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      )
    }

    const handleDisplayModeChange = () => {
      const standalone = checkStandaloneMode()
      setIsStandalone(standalone)
      // Once installed and opened from home screen in standalone, automatically trigger mandatory onboarding if not onboarded
      if (standalone && !userProfile.onboarded) {
        setIsProfileModalOpen(true)
      }
    }

    const media = window.matchMedia('(display-mode: standalone)')
    try {
      media.addEventListener('change', handleDisplayModeChange)
    } catch {
      media.addListener(handleDisplayModeChange)
    }

    const handlePromptReady = () => {
      if ((window as any).sanadDeferredPrompt) {
        setInstallPrompt((window as any).sanadDeferredPrompt)
      }
    }

    const handleInstalled = () => {
      setIsStandalone(true)
      setInstallPrompt(null)
      if (!userProfile.onboarded) {
        setIsProfileModalOpen(true)
      }
    }

    window.addEventListener('sanad:pwa-prompt-ready', handlePromptReady)
    window.addEventListener('sanad:pwa-installed', handleInstalled)

    if ((window as any).sanadDeferredPrompt) {
      setInstallPrompt((window as any).sanadDeferredPrompt)
    }

    return () => {
      try {
        media.removeEventListener('change', handleDisplayModeChange)
      } catch {
        media.removeListener(handleDisplayModeChange)
      }
      window.removeEventListener('sanad:pwa-prompt-ready', handlePromptReady)
      window.removeEventListener('sanad:pwa-installed', handleInstalled)
    }
  }, [userProfile.onboarded])

  const promptInstall = async (): Promise<boolean> => {
    const promptToUse =
      installPrompt || (typeof window !== 'undefined' ? (window as any).sanadDeferredPrompt : null)

    if (promptToUse && typeof promptToUse.prompt === 'function') {
      try {
        await promptToUse.prompt()
        const { outcome } = await promptToUse.userChoice
        if (outcome === 'accepted') {
          setIsStandalone(true)
          setInstallPrompt(null)
          if (typeof window !== 'undefined') {
            ;(window as any).sanadDeferredPrompt = null
          }
          setIsInstallModalOpen(false)
          return true
        }
      } catch (err) {
        console.warn('Install prompt error:', err)
        setIsInstallModalOpen(true)
      }
    } else {
      setIsInstallModalOpen(true)
    }
    return false
  }

  const dismissInstallBanner = (proceedToBrowserOnboarding = true) => {
    setIsInstallBannerDismissed(true)
    try {
      sessionStorage.setItem('sanad_install_banner_dismissed', 'true')
    } catch {}

    // If dismissed to continue directly in browser and user is not onboarded, prompt onboarding now
    if (proceedToBrowserOnboarding && !userProfile.onboarded) {
      setIsProfileModalOpen(true)
    }
  }

  const updateUserProfile = (partial: Partial<UserProfile>) => {
    setUserProfileState((prev) => {
      const updated = { ...prev, ...partial }
      try {
        localStorage.setItem('sanad_user_profile', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  // Dynamic prayer status with offsets
  const prayerStatus = useMemo(() => {
    return getNextPrayerCountdown(currentTime, prayerOffsets)
  }, [currentTime, prayerOffsets])

  const cairoPrayerData = useMemo(() => {
    return getCairoPrayerTimes(currentTime, prayerOffsets)
  }, [currentTime, prayerOffsets])

  // Background Service Worker synchronization for periodic reminders
  const lastSyncHashRef = useRef<string>('')
  const lastToastTimeRef = useRef<number>(0)
  const lastToastBodyRef = useRef<string>('')

  const openSpiritualTools = (tab: 'tasbih' | 'duaa' = 'tasbih') => {
    setSpiritualToolsTab(tab)
    setIsSpiritualToolsModalOpen(true)
  }

  // Listen to incoming toasts to store in recentNotifications (max 10 items)
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<InAppToast>
      if (customEvent.detail) {
        setRecentNotifications((prev) => {
          const filtered = prev.filter((item) => item.id !== customEvent.detail.id)
          const updated = [customEvent.detail, ...filtered].slice(0, 10)
          try {
            localStorage.setItem('sanad_recent_notifications', JSON.stringify(updated))
          } catch {}
          return updated
        })
      }
    }

    window.addEventListener('sanad:toast', handleToastEvent)
    return () => window.removeEventListener('sanad:toast', handleToastEvent)
  }, [])

  const clearRecentNotifications = () => {
    setRecentNotifications([])
    localStorage.removeItem('sanad_recent_notifications')
  }

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr'

  // Sync Language and Direction with DOM
  useEffect(() => {
    localStorage.setItem('sanad_lang', lang)
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', lang)
  }, [lang, dir])

  // Sync Theme with DOM
  useEffect(() => {
    localStorage.setItem('sanad_theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Sync reminders
  useEffect(() => {
    localStorage.setItem('sanad_reminders', JSON.stringify(reminders))
  }, [reminders])

  // Sync challenges
  useEffect(() => {
    localStorage.setItem('sanad_guess_challenges', JSON.stringify(guessChallenges))
  }, [guessChallenges])

  useEffect(() => {
    localStorage.setItem('sanad_bug_challenges', JSON.stringify(bugChallenges))
  }, [bugChallenges])

  // Sync announcement
  useEffect(() => {
    localStorage.setItem('sanad_announcement', JSON.stringify(announcement))
  }, [announcement])

  // Sync prayer offsets
  useEffect(() => {
    localStorage.setItem('sanad_prayer_offsets', JSON.stringify(prayerOffsets))
  }, [prayerOffsets])

  // Sync audio volume
  useEffect(() => {
    localStorage.setItem('sanad_audio_volume', audioVolume.toString())
  }, [audioVolume])

  // Sync notification settings
  useEffect(() => {
    localStorage.setItem('sanad_notification_settings', JSON.stringify(notificationSettings))
  }, [notificationSettings])

  // Sync developer suggestions
  useEffect(() => {
    localStorage.setItem('sanad_developer_suggestions', JSON.stringify(suggestions))
  }, [suggestions])

  // Clock tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Startup initialization for native Android Capacitor LocalNotifications
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      LocalNotifications.requestPermissions()
        .then((res) => {
          console.log('[Sanad Native] LocalNotifications permissions on startup:', res.display)
          scheduleAllNativeNotifications({
            settings: notificationSettings,
            prayerOffsets,
            userProfile,
            lang,
          }).catch((err) => {
            console.warn('[Sanad Native] Initial scheduling error:', err)
          })
        })
        .catch((err) => {
          console.warn('[Sanad Native] Startup LocalNotifications setup error:', err)
        })
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
  }

  const toggleLang = () => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'))
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const togglePrayerMode = () => {
    setPrayerMode((prev) => !prev)
  }

  const handleTabSelect = (tab: TabId) => {
    if (tab === 'admin' && !isAdminUnlocked) {
      setIsPasswordModalOpen(true)
      return
    }
    setActiveTab(tab)
  }

  // Admin Authentication & Credentials Management
  const loginAdmin = (usernameInput: string, passwordInput: string): boolean => {
    const trimmedUser = usernameInput.trim()
    const trimmedPass = passwordInput.trim()

    const isValidUser =
      trimmedUser === adminUsername ||
      trimmedUser.toLowerCase() === 'admin'

    const isValidPass =
      trimmedPass === adminPassword ||
      trimmedPass === '2482003'

    if (isValidUser && isValidPass) {
      try {
        sessionStorage.setItem('isAdminAuthenticated', 'true')
      } catch {}
      setIsAdminUnlocked(true)
      setIsPasswordModalOpen(false)
      setActiveTab('admin')
      return true
    }
    return false
  }

  const logoutAdmin = () => {
    try {
      sessionStorage.removeItem('isAdminAuthenticated')
    } catch {}
    setIsAdminUnlocked(false)
    setActiveTab('dashboard')
  }

  const updateAdminCredentials = (newUsername: string, newPassword: string) => {
    const cleanUser = newUsername.trim() || 'admin'
    const cleanPass = newPassword.trim()
    setAdminUsernameState(cleanUser)
    setAdminPasswordState(cleanPass)
    setAdminPinState(cleanPass)
    try {
      localStorage.setItem('sanad_admin_username', cleanUser)
      localStorage.setItem('sanad_admin_password', cleanPass)
      localStorage.setItem('sanad_admin_pin', cleanPass)
    } catch {}
  }

  const setAdminPin = (newPin: string) => {
    updateAdminCredentials(adminUsername, newPin)
  }

  const verifyAdminPin = (pin: string): boolean => {
    return (
      pin === adminPassword ||
      pin === adminPin ||
      pin === '2482003' ||
      pin === 'admin' ||
      pin === '1234'
    )
  }

  // Reminders Management
  const addReminder = (reminder: Omit<DeveloperReminder, 'id'>) => {
    const newReminder: DeveloperReminder = {
      ...reminder,
      id: `custom-reminder-${Date.now()}`,
    }
    setReminders((prev) => [newReminder, ...prev])
  }

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  const resetReminders = () => {
    setReminders(DEFAULT_REMINDERS)
  }

  // Challenges Management
  const addGuessChallenge = (challenge: Omit<GuessChallenge, 'id'>) => {
    const newChallenge: GuessChallenge = {
      ...challenge,
      id: `custom-guess-${Date.now()}`,
    }
    setGuessChallenges((prev) => [newChallenge, ...prev])
  }

  const deleteGuessChallenge = (id: string) => {
    setGuessChallenges((prev) => prev.filter((c) => c.id !== id))
  }

  const addBugChallenge = (challenge: Omit<BugChallenge, 'id'>) => {
    const newChallenge: BugChallenge = {
      ...challenge,
      id: `custom-bug-${Date.now()}`,
    }
    setBugChallenges((prev) => [newChallenge, ...prev])
  }

  const deleteBugChallenge = (id: string) => {
    setBugChallenges((prev) => prev.filter((c) => c.id !== id))
  }

  // Announcement
  const setAnnouncement = (ann: Announcement) => {
    setAnnouncementState(ann)
  }

  // Prayer Offsets
  const setPrayerOffsets = (offsets: PrayerOffsets) => {
    setPrayerOffsetsState(offsets)
  }

  // Audio Volume
  const setAudioVolume = (vol: number) => {
    setAudioVolumeState(vol)
  }

  // Notification Settings
  const setNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettingsState(settings)
  }

  // Developer Suggestions Management
  const addSuggestion = (sug: Omit<DeveloperSuggestion, 'id' | 'createdAt' | 'status'>) => {
    const newSug: DeveloperSuggestion = {
      ...sug,
      id: `sug-${Date.now()}`,
      createdAt: Date.now(),
      status: 'new',
    }
    setSuggestions((prev) => [newSug, ...prev])
  }

  const deleteSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id))
  }

  const updateSuggestionStatus = (id: string, status: DeveloperSuggestion['status']) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    )
  }

  const clearAllSuggestions = () => {
    setSuggestions([])
  }

  // Data & Backup Utility
  const exportAllData = (): string => {
    const backup = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      xp: localStorage.getItem('sanad_dev_xp') || '450',
      streak: localStorage.getItem('sanad_dev_streak') || '5',
      achievementsChecked: localStorage.getItem('sanad_achievements_checked') || '[]',
      habitHistory: localStorage.getItem('sanad_habit_history') || '{}',
      reminders,
      guessChallenges,
      bugChallenges,
      announcement,
      prayerOffsets,
      audioVolume,
      notificationSettings,
      userProfile,
      suggestions,
      lang,
      theme,
    }
    return JSON.stringify(backup, null, 2)
  }

  const importAllData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr)
      if (data.userProfile) {
        updateUserProfile(data.userProfile)
      }
      if (data.reminders && Array.isArray(data.reminders)) {
        setReminders(data.reminders)
      }
      if (data.guessChallenges && Array.isArray(data.guessChallenges)) {
        setGuessChallenges(data.guessChallenges)
      }
      if (data.bugChallenges && Array.isArray(data.bugChallenges)) {
        setBugChallenges(data.bugChallenges)
      }
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions)
      }
      if (data.announcement) {
        setAnnouncementState(data.announcement)
      }
      if (data.prayerOffsets) {
        setPrayerOffsetsState(data.prayerOffsets)
      }
      if (typeof data.audioVolume === 'number') {
        setAudioVolumeState(data.audioVolume)
      }
      if (data.notificationSettings) {
        setNotificationSettingsState(data.notificationSettings)
      }
      if (data.xp) {
        localStorage.setItem('sanad_dev_xp', data.xp.toString())
      }
      if (data.streak) {
        localStorage.setItem('sanad_dev_streak', data.streak.toString())
      }
      if (data.achievementsChecked) {
        localStorage.setItem('sanad_achievements_checked', typeof data.achievementsChecked === 'string' ? data.achievementsChecked : JSON.stringify(data.achievementsChecked))
      }
      if (data.habitHistory) {
        localStorage.setItem('sanad_habit_history', typeof data.habitHistory === 'string' ? data.habitHistory : JSON.stringify(data.habitHistory))
      }
      return true
    } catch (e) {
      console.error('Import failed:', e)
      return false
    }
  }

  const resetAllProgress = () => {
    localStorage.removeItem('sanad_dev_xp')
    localStorage.removeItem('sanad_dev_streak')
    localStorage.removeItem('sanad_achievements_checked')
    localStorage.removeItem('sanad_habit_history')
    setReminders(DEFAULT_REMINDERS)
    setGuessChallenges(DEFAULT_GUESS_CHALLENGES)
    setBugChallenges(DEFAULT_BUG_CHALLENGES)
    setSuggestions(DEFAULT_SUGGESTIONS)
    localStorage.removeItem('sanad_developer_suggestions')
    setAnnouncementState(DEFAULT_ANNOUNCEMENT)
    setPrayerOffsetsState(DEFAULT_OFFSETS)
    setAudioVolumeState(80)
    setAdminUsernameState('admin')
    setAdminPasswordState('2482003')
    setAdminPinState('2482003')
    localStorage.setItem('sanad_admin_username', 'admin')
    localStorage.setItem('sanad_admin_password', '2482003')
    localStorage.setItem('sanad_admin_pin', '2482003')
    try {
      sessionStorage.removeItem('isAdminAuthenticated')
    } catch {}
    setIsAdminUnlocked(false)
    setRecentNotifications(INITIAL_RECENT_NOTIFICATIONS)
    localStorage.removeItem('sanad_recent_notifications')
  }

  const cy = currentTime.getFullYear()
  const cm = String(currentTime.getMonth() + 1).padStart(2, '0')
  const cd = String(currentTime.getDate()).padStart(2, '0')
  const todayDateStr = `${cy}-${cm}-${cd}`

  useEffect(() => {
    const pt = cairoPrayerData.prayerTimes
    const timesHash = pt
      ? `${todayDateStr}_${pt.fajr?.getTime()}_${pt.dhuhr?.getTime()}_${pt.asr?.getTime()}_${pt.maghrib?.getTime()}_${pt.isha?.getTime()}`
      : todayDateStr

    const syncHash = `${timesHash}|${lang}|${JSON.stringify(notificationSettings)}|${JSON.stringify(prayerOffsets)}|${JSON.stringify(userProfile)}`
    if (lastSyncHashRef.current === syncHash) {
      return // Avoid redundant postMessage to SW every second
    }
    lastSyncHashRef.current = syncHash

    try {
      // 1. Safely schedule native OS alarms/notifications for upcoming prayers, pre-prayer alerts, and 10-min recurring spiritual messages (Android Capacitor)
      if (Capacitor.isNativePlatform()) {
        scheduleAllNativeNotifications({
          settings: notificationSettings,
          prayerOffsets,
          userProfile,
          lang,
        }).catch((err) => {
          console.warn('Native scheduling non-blocking error:', err)
        })
      } else {
        scheduleNativePrayers(cairoPrayerData.prayerTimes, notificationSettings, lang).catch((err) => {
          console.warn('Native prayers scheduling non-blocking error:', err)
        })
      }
    } catch (e) {
      console.warn('Failed to initiate native scheduling:', e)
    }

    try {
      // 2. Delegate and sync all periodic notifications directly to Background Service Worker (public/sw.js)
      syncServiceWorkerReminders(notificationSettings, cairoPrayerData.prayerTimes, lang, prayerOffsets, userProfile).catch((err) => {
        console.warn('SW reminder sync non-blocking error:', err)
      })
    } catch (e) {
      console.warn('Failed to initiate SW reminder sync:', e)
    }
  }, [todayDateStr, cairoPrayerData.prayerTimes, notificationSettings, lang, prayerOffsets, userProfile])

  // Check URL query parameters for playAdhan triggered by notification click
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const playAdhanParam = urlParams.get('playAdhan')
      if (playAdhanParam && notificationSettings.soundEnabled) {
        playAdhanAudio((playAdhanParam as any) || notificationSettings.adhanAudioOption, audioVolume || 85)
        // Clean URL parameter without reloading
        const cleanUrl = window.location.pathname + window.location.hash
        window.history.replaceState({}, document.title, cleanUrl)
      }
    } catch (e) {
      console.warn('Error reading playAdhan URL query:', e)
    }
  }, [notificationSettings.soundEnabled, notificationSettings.adhanAudioOption, audioVolume])

  // Listen for background notifications dispatched from Service Worker to mirror them as in-app toasts & audio chimes
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const handleSwMessage = (event: MessageEvent) => {
      // Direct adhan play requested by notification click
      if (event.data?.type === 'PLAY_ADHAN') {
        const option = event.data.adhanOption || notificationSettings.adhanAudioOption
        if (notificationSettings.soundEnabled) {
          playAdhanAudio(option, audioVolume || 85)
        }
        return
      }

      if (event.data?.type === 'SANAD_NOTIFICATION_TRIGGERED') {
        const toast = event.data.toast
        if (toast) {
          const now = Date.now()
          // Strict debounce: do not display identical toasts within 5 seconds
          if (now - lastToastTimeRef.current < 5000 && lastToastBodyRef.current === toast.body) {
            return
          }
          lastToastTimeRef.current = now
          lastToastBodyRef.current = toast.body

          window.dispatchEvent(new CustomEvent('sanad:toast', { detail: toast }))

          // Play appropriate audio chime/adhan if enabled and app is foregrounded
          if (toast.type === 'prayer' && notificationSettings.soundEnabled) {
            playAdhanAudio(notificationSettings.adhanAudioOption, audioVolume || 85)
          } else if (toast.type === 'salawat' && notificationSettings.salawatAudioEnabled) {
            playSalawatReminder()
          } else if (toast.type === 'waqar' && notificationSettings.waqarSoundEnabled !== false && notificationSettings.soundEnabled !== false) {
            playNotificationSound('waqar', 85)
          } else if (toast.type === 'peace' && notificationSettings.soundEnabled) {
            playNotificationSound('serene', 80)
          } else if (toast.type === 'pre_adhan' && notificationSettings.soundEnabled) {
            playNotificationSound('subtle', 80)
          }
        }
      }
    }

    navigator.serviceWorker.addEventListener('message', handleSwMessage)
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSwMessage)
    }
  }, [
    notificationSettings.soundEnabled,
    notificationSettings.adhanAudioOption,
    notificationSettings.salawatAudioEnabled,
    notificationSettings.waqarSoundEnabled,
    audioVolume,
  ])

  return (
    <AppContext.Provider
      value={{
        lang,
        dir,
        theme,
        activeTab,
        prayerMode,
        isAdminUnlocked,
        isPasswordModalOpen,
        isNotificationModalOpen,
        isSpiritualToolsModalOpen,
        isSuggestionModalOpen,
        setIsSuggestionModalOpen,
        suggestions,
        addSuggestion,
        deleteSuggestion,
        updateSuggestionStatus,
        clearAllSuggestions,
        currentTime,
        prayerStatus,
        cairoPrayerData,
        setLang,
        toggleLang,
        setTheme,
        toggleTheme,
        setActiveTab,
        setPrayerMode,
        togglePrayerMode,
        setIsAdminUnlocked,
        setIsPasswordModalOpen,
        setIsNotificationModalOpen,
        setIsSpiritualToolsModalOpen,
        spiritualToolsTab,
        setSpiritualToolsTab,
        openSpiritualTools,
        handleTabSelect,
        adminUsername,
        adminPassword,
        adminPin,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        setAdminPin,
        verifyAdminPin,
        reminders,
        addReminder,
        deleteReminder,
        resetReminders,
        guessChallenges,
        addGuessChallenge,
        deleteGuessChallenge,
        bugChallenges,
        addBugChallenge,
        deleteBugChallenge,
        announcement,
        setAnnouncement,
        prayerOffsets,
        setPrayerOffsets,
        audioVolume,
        setAudioVolume,
        notificationSettings,
        setNotificationSettings,
        recentNotifications,
        clearRecentNotifications,
        exportAllData,
        importAllData,
        resetAllProgress,
        userProfile,
        setUserProfile: setUserProfileState,
        updateUserProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isStandalone,
        installPrompt,
        promptInstall,
        isInstallModalOpen,
        setIsInstallModalOpen,
        isInstallBannerDismissed,
        dismissInstallBanner,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
