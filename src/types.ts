import { Prayer } from 'adhan'

export type Language = 'ar' | 'en'
export type Theme = 'dark' | 'light'

export type TabId =
  | 'dashboard'
  | 'prayer-schedule'
  | 'quran'
  | 'pomodoro'
  | 'challenges'
  | 'achievements'
  | 'admin'

export interface NavigationTab {
  id: TabId
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  iconName: string
  badge?: string
}

export interface PrayerStatus {
  currentPrayer: keyof typeof Prayer | 'none'
  nextPrayer: keyof typeof Prayer | 'none'
  nextPrayerNameAr: string
  nextPrayerNameEn: string
  countdown: string
  cairoTime: string
}

export interface DeveloperReminder {
  id: string
  categoryAr: string
  categoryEn: string
  iconName: 'Heart' | 'Eye' | 'Sparkles' | 'Droplets' | 'BookOpen' | 'Activity' | 'Clock'
  textAr: string
  textEn: string
  subtextAr: string
  subtextEn: string
}

export interface GuessChallenge {
  id: string
  language: 'JavaScript' | 'Python' | 'C#'
  titleAr: string
  titleEn: string
  code: string
  options: string[]
  correctIndex: number
  explanationAr: string
  explanationEn: string
  xp: number
}

export interface BugChallenge {
  id: string
  language: 'JavaScript' | 'Python' | 'C#'
  titleAr: string
  titleEn: string
  codeLines: string[]
  buggyLineIndex: number // 0-indexed
  bugDescriptionAr: string
  bugDescriptionEn: string
  fixExplanationAr: string
  fixExplanationEn: string
  xp: number
}

export interface Announcement {
  enabled: boolean
  textAr: string
  textEn: string
  type: 'info' | 'success' | 'warning' | 'urgent'
}

export interface PrayerOffsets {
  fajr: number
  dhuhr: number
  asr: number
  maghrib: number
  isha: number
}

export type AdhanAudioOption =
  | 'makkah'
  | 'madinah'
  | 'cairo_refaat'
  | 'cairo_mustafa'
  | 'alaqsa'
  | 'full_adhan'
  | 'short_takbeerat'
  | 'serene_chime'

export type UserGender = 'female' | 'male'

export interface UserProfile {
  name: string
  gender: UserGender
  onboarded: boolean
}

export interface NotificationSettings {
  prayerAlerts: boolean
  preAdhanAlerts?: boolean
  dailyTips: boolean
  periodicDhikr: boolean
  dhikrIntervalMinutes: number
  soundEnabled: boolean
  adhanAudioOption: AdhanAudioOption
  salawatAudioEnabled: boolean
  salawatIntervalMinutes: number
  waqarMessagesEnabled: boolean
  waqarSoundEnabled?: boolean
  waqarIntervalMinutes?: number
  peaceRemindersEnabled?: boolean
  eveningAdhkarEnabled?: boolean
  challengeAlertsEnabled?: boolean
  userGender?: UserGender
  userName?: string
}

export interface InAppToast {
  id: string
  title: string
  body: string
  type: 'prayer' | 'pre_adhan' | 'tip' | 'dhikr' | 'system' | 'salawat' | 'waqar' | 'peace' | 'challenge' | 'evening_adhkar'
  timestamp: number
}

export interface FocusAudioTrack {
  id: string
  nameAr: string
  nameEn: string
  url: string
  type: 'quran' | 'rain' | 'ambient'
}

export type SuggestionType = 'feature' | 'content' | 'bug' | 'other'

export interface DeveloperSuggestion {
  id: string
  type: SuggestionType
  details: string
  developerName?: string
  developerContact?: string
  createdAt: number
  status: 'new' | 'reviewed' | 'implemented'
}
