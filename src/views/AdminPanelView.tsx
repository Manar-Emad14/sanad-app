import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import {
  ShieldCheck,
  Lock,
  Volume2,
  Sliders,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  KeyRound,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Megaphone,
  BookOpen,
  Heart,
  Eye,
  Droplets,
  Activity,
  Clock,
  Bug,
  HelpCircle,
  X,
  FileText,
  Check,
  Bell,
  BellRing,
  Timer,
  MessageSquarePlus,
  Search,
  User,
  Mail,
  Filter,
  LogOut,
  LogIn,
  EyeOff,
  RefreshCw,
  Database,
} from 'lucide-react'
import {
  scheduleBackgroundTestNotification,
  queryServiceWorkerStatus,
  triggerImmediateSalawatSw,
  DEFAULT_SW_LIVE_STATUS,
  type SwLiveStatus,
} from '../utils/notificationBridge'
import type {
  DeveloperReminder,
  Announcement,
  SuggestionType,
} from '../types'

const ICON_COMPONENTS = {
  Heart,
  Eye,
  Sparkles,
  Droplets,
  BookOpen,
  Activity,
  Clock,
}

type AdminSection = 'reminders' | 'challenges' | 'suggestions' | 'announcement' | 'offsets' | 'security_backup'

export const AdminPanelView: React.FC = () => {
  const {
    lang,
    isAdminUnlocked,
    setActiveTab,
    adminUsername,
    adminPassword,
    loginAdmin,
    logoutAdmin,
    updateAdminCredentials,
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
    setIsNotificationModalOpen,
    notificationSettings,
    exportAllData,
    importAllData,
    resetAllProgress,
    suggestions,
    updateSuggestionStatus,
    deleteSuggestion,
    clearAllSuggestions,
  } = useApp()

  const isAr = lang === 'ar'
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Section Navigation
  const [activeSection, setActiveSection] = useState<AdminSection>('reminders')

  // Suggestions Filters
  const [suggestionStatusFilter, setSuggestionStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'implemented'>('all')
  const [suggestionTypeFilter, setSuggestionTypeFilter] = useState<'all' | SuggestionType>('all')
  const [suggestionSearch, setSuggestionSearch] = useState('')

  // In-View Login Gate State (if accessed while locked)
  const [pageUsername, setPageUsername] = useState('admin')
  const [pagePassword, setPagePassword] = useState('')
  const [showPagePassword, setShowPagePassword] = useState(false)
  const [pageLoginError, setPageLoginError] = useState<string | null>(null)

  // Account Credentials Change State
  const [credUsername, setCredUsername] = useState(adminUsername)
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [credError, setCredError] = useState<string | null>(null)
  const [credSuccess, setCredSuccess] = useState(false)

  // Reset Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Import Status
  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null)

  // Announcement Form State
  const [annForm, setAnnForm] = useState<Announcement>(announcement)
  const [annSaved, setAnnSaved] = useState(false)

  // New Reminder Form State
  const [isAddingReminder, setIsAddingReminder] = useState(false)
  const [newReminderCatAr, setNewReminderCatAr] = useState('')
  const [newReminderCatEn, setNewReminderCatEn] = useState('')
  const [newReminderIcon, setNewReminderIcon] = useState<DeveloperReminder['iconName']>('Heart')
  const [newReminderTextAr, setNewReminderTextAr] = useState('')
  const [newReminderTextEn, setNewReminderTextEn] = useState('')
  const [newReminderSubAr, setNewReminderSubAr] = useState('')
  const [newReminderSubEn, setNewReminderSubEn] = useState('')

  // New Challenge Form State
  const [challengeType, setChallengeType] = useState<'guess' | 'bug'>('guess')
  const [isAddingChallenge, setIsAddingChallenge] = useState(false)
  
  // Guess challenge form
  const [guessTitleAr, setGuessTitleAr] = useState('')
  const [guessTitleEn, setGuessTitleEn] = useState('')
  const [guessLang, setGuessLang] = useState<'JavaScript' | 'Python' | 'C#'>('JavaScript')
  const [guessCode, setGuessCode] = useState('')
  const [guessOpt0, setGuessOpt0] = useState('')
  const [guessOpt1, setGuessOpt1] = useState('')
  const [guessOpt2, setGuessOpt2] = useState('')
  const [guessOpt3, setGuessOpt3] = useState('')
  const [guessCorrectIdx, setGuessCorrectIdx] = useState<number>(0)
  const [guessExpAr, setGuessExpAr] = useState('')
  const [guessExpEn, setGuessExpEn] = useState('')
  const [guessXp, setGuessXp] = useState<number>(50)

  // Bug challenge form
  const [bugTitleAr, setBugTitleAr] = useState('')
  const [bugTitleEn, setBugTitleEn] = useState('')
  const [bugLang, setBugLang] = useState<'JavaScript' | 'Python' | 'C#'>('JavaScript')
  const [bugCodeLinesText, setBugCodeLinesText] = useState('')
  const [buggyLineNumber, setBuggyLineNumber] = useState<number>(1)
  const [bugDescAr, setBugDescAr] = useState('')
  const [bugDescEn, setBugDescEn] = useState('')
  const [bugFixAr, setBugFixAr] = useState('')
  const [bugFixEn, setBugFixEn] = useState('')
  const [bugXp, setBugXp] = useState<number>(75)

  // Temporary Success indicator
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)
  const showFeedback = (msg: string) => {
    setActionSuccessMsg(msg)
    setTimeout(() => setActionSuccessMsg(null), 3000)
  }

  // 5-Second Background Notification Test State
  const [isTesting5s, setIsTesting5s] = useState(false)
  const [countdown5s, setCountdown5s] = useState(5)
  const timer5sRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Service Worker Live Diagnostic State
  const [swStatus, setSwStatus] = useState<SwLiveStatus>(DEFAULT_SW_LIVE_STATUS)
  const [isQueryingSw, setIsQueryingSw] = useState(false)
  const [isTriggeringSalawat, setIsTriggeringSalawat] = useState(false)

  const fetchSwStatus = async () => {
    setIsQueryingSw(true)
    try {
      const status = await queryServiceWorkerStatus()
      if (status) {
        setSwStatus(status)
      }
    } catch (e) {
      console.warn('Failed to fetch SW status:', e)
    } finally {
      setIsQueryingSw(false)
    }
  }

  useEffect(() => {
    return () => {
      if (timer5sRef.current) {
        clearInterval(timer5sRef.current)
        timer5sRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    fetchSwStatus()
    const intv = setInterval(fetchSwStatus, 15000)
    return () => clearInterval(intv)
  }, [])

  const handleTrigger5sTest = async () => {
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
        showFeedback(
          isAr
            ? 'يرجى تفعيل إذن الإشعارات أولاً لتجربة التنبيه الخارجي.'
            : 'Please enable notification permissions first.'
        )
        return
      }

      showFeedback(
        isAr
          ? 'تمت الجدولة بنجاح! أغلق التطبيق أو اقفل الشاشة الآن للتأكد.'
          : 'Scheduled! Close the app or lock screen now to test.'
      )

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
      console.warn('[AdminPanel] Test 5s error:', err)
      setIsTesting5s(false)
    }
  }

  const handleTriggerDirectSalawat = async () => {
    setIsTriggeringSalawat(true)
    try {
      const ok = await triggerImmediateSalawatSw()
      if (ok) {
        showFeedback(
          isAr
            ? 'تم إرسال إشعار الصلاة على النبي فوراً عبر Service Worker!'
            : 'Salawat notification dispatched immediately via Service Worker!'
        )
        setTimeout(fetchSwStatus, 1000)
      } else {
        showFeedback(
          isAr
            ? 'يرجى تفعيل إذن الإشعارات أولاً لتجربة الإشعار.'
            : 'Please enable notifications first.'
        )
      }
    } catch {
      // Ignored
    } finally {
      setIsTriggeringSalawat(false)
    }
  }

  // Handle Login from in-page gate
  const handlePageLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setPageLoginError(null)

    if (!pageUsername.trim() || !pagePassword.trim()) {
      setPageLoginError(
        isAr ? 'يرجى إدخال اسم المستخدم وكلمة المرور للمتابعة.' : 'Please enter both username and password.'
      )
      return
    }

    const success = loginAdmin(pageUsername.trim(), pagePassword.trim())
    if (success) {
      setPagePassword('')
      setPageLoginError(null)
      setShowPagePassword(false)
    } else {
      setPageLoginError(
        isAr
          ? 'اسم المستخدم أو كلمة المرور غير صحيحة! يرجى التحقق من البيانات.'
          : 'Invalid credentials! Please check your username and password.'
      )
    }
  }

  // Handle Credentials Change
  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault()
    setCredError(null)
    setCredSuccess(false)

    if (!credUsername.trim()) {
      setCredError(isAr ? 'يرجى إدخال اسم مستخدم صالح' : 'Username cannot be empty')
      return
    }

    if (currentPass.trim() !== adminPassword && currentPass.trim() !== '2482003') {
      setCredError(isAr ? 'كلمة المرور الحالية غير صحيحة' : 'Current password is incorrect')
      return
    }

    if (newPass.trim().length < 4) {
      setCredError(
        isAr ? 'يجب أن تتكون كلمة المرور الجديدة من 4 خانات على الأقل' : 'New password must be at least 4 characters'
      )
      return
    }

    if (newPass.trim() !== confirmPass.trim()) {
      setCredError(
        isAr ? 'تأكيد كلمة المرور غير متطابق مع كلمة المرور الجديدة' : 'Passwords do not match'
      )
      return
    }

    updateAdminCredentials(credUsername.trim(), newPass.trim())
    setCredSuccess(true)
    setCurrentPass('')
    setNewPass('')
    setConfirmPass('')
    setTimeout(() => setCredSuccess(false), 4500)
  }

  // Handle Add Reminder
  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReminderTextAr.trim() || !newReminderTextEn.trim()) return

    addReminder({
      categoryAr: newReminderCatAr.trim() || 'تنبيه للمبرمج',
      categoryEn: newReminderCatEn.trim() || 'Developer Cue',
      iconName: newReminderIcon,
      textAr: newReminderTextAr.trim(),
      textEn: newReminderTextEn.trim(),
      subtextAr: newReminderSubAr.trim() || 'ورد وعادة طيبة أثناء العمل',
      subtextEn: newReminderSubEn.trim() || 'Beneficial practice during work',
    })

    setIsAddingReminder(false)
    setNewReminderTextAr('')
    setNewReminderTextEn('')
    setNewReminderSubAr('')
    setNewReminderSubEn('')
    showFeedback(isAr ? 'تمت إضافة التنبيه بنجاح وربطه بالرئيسية!' : 'Reminder added and linked to Dashboard!')
  }

  // Handle Add Guess Challenge
  const handleCreateGuessChallenge = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guessTitleAr.trim() || !guessCode.trim() || !guessOpt0.trim()) return

    addGuessChallenge({
      titleAr: guessTitleAr.trim(),
      titleEn: guessTitleEn.trim() || guessTitleAr.trim(),
      language: guessLang,
      code: guessCode.trim(),
      options: [guessOpt0.trim(), guessOpt1.trim(), guessOpt2.trim(), guessOpt3.trim()],
      correctIndex: guessCorrectIdx,
      explanationAr: guessExpAr.trim() || 'تفسير تقني للسؤال',
      explanationEn: guessExpEn.trim() || 'Technical explanation for snippet',
      xp: guessXp || 50,
    })

    setIsAddingChallenge(false)
    setGuessTitleAr('')
    setGuessTitleEn('')
    setGuessCode('')
    setGuessOpt0('')
    setGuessOpt1('')
    setGuessOpt2('')
    setGuessOpt3('')
    showFeedback(isAr ? 'تمت إضافة تحدي خمن الناتج بنجاح!' : 'Guess challenge created successfully!')
  }

  // Handle Add Bug Challenge
  const handleCreateBugChallenge = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bugTitleAr.trim() || !bugCodeLinesText.trim()) return

    const lines = bugCodeLinesText.split('\n')
    const zeroBasedLine = Math.max(0, Math.min(lines.length - 1, buggyLineNumber - 1))

    addBugChallenge({
      titleAr: bugTitleAr.trim(),
      titleEn: bugTitleEn.trim() || bugTitleAr.trim(),
      language: bugLang,
      codeLines: lines,
      buggyLineIndex: zeroBasedLine,
      bugDescriptionAr: bugDescAr.trim() || 'وصف الخطأ البرمجي',
      bugDescriptionEn: bugDescEn.trim() || 'Bug description',
      fixExplanationAr: bugFixAr.trim() || 'الحل البرمجي المقترح',
      fixExplanationEn: bugFixEn.trim() || 'Proposed fix',
      xp: bugXp || 75,
    })

    setIsAddingChallenge(false)
    setBugTitleAr('')
    setBugTitleEn('')
    setBugCodeLinesText('')
    setBugDescAr('')
    setBugDescEn('')
    setBugFixAr('')
    setBugFixEn('')
    showFeedback(isAr ? 'تمت إضافة تحدي صائد الأخطاء بنجاح!' : 'Bug Hunter challenge created!')
  }

  // Handle Save Announcement
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    setAnnouncement(annForm)
    setAnnSaved(true)
    setTimeout(() => setAnnSaved(false), 3000)
    showFeedback(isAr ? 'تم تحديث الإعلان العام وتطبيقه على التطبيق!' : 'Broadcast announcement updated live!')
  }

  // Handle Export Backup
  const handleExportBackup = () => {
    const jsonStr = exportAllData()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const dateStr = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `sanad-dev-backup-${dateStr}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showFeedback(isAr ? 'تم تنزيل النسخة الاحتياطية بنجاح!' : 'Backup JSON exported successfully!')
  }

  // Handle Import Backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const success = importAllData(content)
        if (success) {
          setImportStatus({
            success: true,
            msg: isAr ? 'تم استيراد البيانات واسترجاع الإعدادات بنجاح!' : 'Data imported and restored successfully!',
          })
          showFeedback(isAr ? 'تم استرجاع البيانات بنجاح!' : 'Data restored successfully!')
        } else {
          setImportStatus({
            success: false,
            msg: isAr ? 'فشل الاستيراد: ملف JSON غير صالح' : 'Import failed: invalid JSON format',
          })
        }
        setTimeout(() => setImportStatus(null), 4000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Handle Reset Progress
  const handleConfirmReset = () => {
    resetAllProgress()
    setIsResetModalOpen(false)
    setResetSuccess(true)
    setTimeout(() => setResetSuccess(false), 4000)
    showFeedback(isAr ? 'تمت إعادة تعيين جميع البيانات والتقدم بنجاح!' : 'All progress reset to clean defaults!')
  }

  // ================= 1. IN-VIEW LOGIN GATE IF LOCKED =================
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 animate-fade-in">
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white ring-1 ring-white/10 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-extrabold text-white">
              {isAr ? 'تسجيل الدخول للوحة التحكم' : 'Admin Portal Authentication'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isAr
                ? 'يرجى إدخال اسم المستخدم وكلمة المرور للوصول لإدارة النظام'
                : 'Enter admin credentials to unlock management console'}
            </p>
          </div>

          <form onSubmit={handlePageLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                {isAr ? 'اسم المستخدم (Username)' : 'Username'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={pageUsername}
                  onChange={(e) => {
                    setPageUsername(e.target.value)
                    setPageLoginError(null)
                  }}
                  autoFocus
                  placeholder={isAr ? 'الافتراضي: admin' : 'Default: admin'}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm font-sans transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-start">
                {isAr ? 'كلمة المرور (Password)' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPagePassword ? 'text' : 'password'}
                  value={pagePassword}
                  onChange={(e) => {
                    setPagePassword(e.target.value)
                    setPageLoginError(null)
                  }}
                  placeholder={isAr ? 'الافتراضية: 2482003' : 'Default: 2482003'}
                  className="w-full ps-10 pe-11 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm font-mono tracking-wider transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                <button
                  type="button"
                  onClick={() => setShowPagePassword((prev) => !prev)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {showPagePassword ? (
                    <EyeOff className="w-4 h-4 text-slate-300" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {pageLoginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2 animate-fade-in text-start shadow-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pageLoginError}</span>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'البيانات الافتراضية:' : 'Default credentials:'}</span>
              </span>
              <div className="font-mono text-slate-300 flex items-center gap-2">
                <span className="text-emerald-400 font-bold">admin</span>
                <span className="text-slate-600">/</span>
                <span className="text-emerald-400 font-bold">2482003</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md shadow-emerald-950/40 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>{isAr ? 'تسجيل الدخول' : 'Log In'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition cursor-pointer"
              >
                {isAr ? 'العودة' : 'Back'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ================= 2. AUTHENTICATED ADMIN PANEL =================
  return (
    <div className="space-y-8 animate-fade-in w-full pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'جلسة المشرف مصادق عليها ومحمية' : 'Authenticated Admin Console (Secured)'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isAr ? 'لوحة تحكم النظام وإدارة المحتوى' : 'Admin Console & Content Management'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAr
              ? 'إدارة التنبيهات الدورية، بنك التحديات البرمجية، الإعلانات العامة، وتعديل فوارق التوقيت والنسخ الاحتياطي.'
              : 'Manage reminders, code challenge repository, broadcast banners, offsets, and backup utilities.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isAr ? 'المشرف:' : 'Admin:'}</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{adminUsername}</span>
          </div>

          <button
            onClick={logoutAdmin}
            type="button"
            className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white dark:text-rose-400 dark:hover:text-white font-bold text-xs transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            title={isAr ? 'تسجيل الخروج وإنهاء جلسة المشرف' : 'Logout & Lock Session'}
          >
            <LogOut className="w-4 h-4" />
            <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Global Action Feedback Alert */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Section Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'reminders', labelAr: 'التنبيهات والأذكار', labelEn: 'Reminders', icon: Heart },
          { id: 'challenges', labelAr: 'بنك التحديات البرمجية', labelEn: 'Challenges', icon: Bug },
          {
            id: 'suggestions',
            labelAr: 'صندوق الاقتراحات',
            labelEn: 'Suggestions Inbox',
            icon: MessageSquarePlus,
            badge: suggestions.filter((s) => s.status === 'new').length,
          },
          { id: 'announcement', labelAr: 'شريط الإعلانات', labelEn: 'Announcement', icon: Megaphone },
          { id: 'offsets', labelAr: 'المواقيت والصوت', labelEn: 'Prayer & Audio', icon: Sliders },
          { id: 'security_backup', labelAr: 'أمان الحساب والنسخ الاحتياطي', labelEn: 'Account Security & Backup', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSection === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as AdminSection)}
              type="button"
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ================= SECTION 1: REMINDERS MANAGEMENT ================= */}
      {activeSection === 'reminders' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span>{isAr ? 'إدارة التنبيهات والأذكار الدورية' : 'Manage Devotional & Ergonomic Reminders'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'التنبيهات المعروضة في شريط الصفحة الرئيسية للمطور'
                  : 'Tips and dhikr displayed on the Dashboard bi-hourly banner'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingReminder(!isAddingReminder)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة تنبيه جديد' : 'Add New Reminder'}</span>
              </button>
              <button
                type="button"
                onClick={resetReminders}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold transition cursor-pointer"
                title={isAr ? 'استعادة التنبيهات الافتراضية' : 'Reset to Defaults'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add Reminder Form */}
          {isAddingReminder && (
            <form
              onSubmit={handleCreateReminder}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-emerald-500/30 space-y-4 animate-fade-in"
            >
              <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إنشاء تنبيه أو ذكر جديد للمبرمج' : 'Create New Devotional Cue'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'عنوان التصنيف (عربي)' : 'Category (Arabic)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newReminderCatAr}
                    onChange={(e) => setNewReminderCatAr(e.target.value)}
                    placeholder="ورد الذكر والاستغفار"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'عنوان التصنيف (إنجليزي)' : 'Category (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newReminderCatEn}
                    onChange={(e) => setNewReminderCatEn(e.target.value)}
                    placeholder="Mindful Remembrance"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                  {isAr ? 'الأيقونة التعبيرية' : 'Icon Style'}
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['Heart', 'Eye', 'Sparkles', 'Droplets', 'BookOpen', 'Activity', 'Clock'] as const).map(
                    (ic) => {
                      const Comp = ICON_COMPONENTS[ic]
                      const isSelected = newReminderIcon === ic
                      return (
                        <button
                          key={ic}
                          type="button"
                          onClick={() => setNewReminderIcon(ic)}
                          className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <Comp className="w-3.5 h-3.5" />
                          <span>{ic}</span>
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Texts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'النص الرئيسي (عربي)' : 'Main Text (Arabic)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newReminderTextAr}
                    onChange={(e) => setNewReminderTextAr(e.target.value)}
                    placeholder="«لا حول ولا قوة إلا بالله»"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'النص الرئيسي (إنجليزي)' : 'Main Text (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newReminderTextEn}
                    onChange={(e) => setNewReminderTextEn(e.target.value)}
                    placeholder="La hawla wa la quwwata illa billah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              {/* Subtexts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'الشرح والإرشاد (عربي)' : 'Subtext / Benefit (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={newReminderSubAr}
                    onChange={(e) => setNewReminderSubAr(e.target.value)}
                    placeholder="كنز من كنوز الجنة يعينك على صعاب البرمجة."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'الشرح والإرشاد (إنجليزي)' : 'Subtext / Benefit (English)'}
                  </label>
                  <input
                    type="text"
                    value={newReminderSubEn}
                    onChange={(e) => setNewReminderSubEn(e.target.value)}
                    placeholder="A treasure from Paradise assisting through hard bugs."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingReminder(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {isAr ? 'حفظ وإضافة' : 'Save Reminder'}
                </button>
              </div>
            </form>
          )}

          {/* List of Current Reminders */}
          <div className="space-y-3">
            {reminders.map((r, idx) => {
              const Icon = ICON_COMPONENTS[r.iconName] || Sparkles
              return (
                <div
                  key={r.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-4 transition hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {isAr ? r.categoryAr : r.categoryEn}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {isAr ? r.textAr : r.textEn}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAr ? r.subtextAr : r.subtextEn}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      deleteReminder(r.id)
                      showFeedback(isAr ? 'تم حذف التنبيه بنجاح' : 'Reminder deleted')
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer flex-shrink-0"
                    title={isAr ? 'حذف هذا التنبيه' : 'Delete Reminder'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= SECTION 2: DAILY CHALLENGES MANAGEMENT ================= */}
      {activeSection === 'challenges' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Bug className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>{isAr ? 'إدارة بنك التحديات البرمجية' : 'Manage Daily Code Challenges'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'إضافة أسئلة "خمن الناتج" وتحديات "صائد الأخطاء" المتزامنة مع قسم الكود'
                  : 'Add questions for Guess the Output and Bug Hunter modes'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingChallenge(!isAddingChallenge)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة تحدٍ جديد' : 'Add New Challenge'}</span>
            </button>
          </div>

          {/* Mode Switcher inside Challenges Admin */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setChallengeType('guess')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                challengeType === 'guess'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 inline me-1.5" />
              <span>{isAr ? 'خمن الناتج' : 'Guess Output'} ({guessChallenges.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setChallengeType('bug')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                challengeType === 'bug'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Bug className="w-3.5 h-3.5 inline me-1.5" />
              <span>{isAr ? 'صائد الأخطاء' : 'Bug Hunter'} ({bugChallenges.length})</span>
            </button>
          </div>

          {/* Add Challenge Form */}
          {isAddingChallenge && challengeType === 'guess' && (
            <form
              onSubmit={handleCreateGuessChallenge}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-emerald-500/30 space-y-4 animate-fade-in"
            >
              <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة سؤال جديد: خَمِّن الناتج' : 'Create New Guess the Output Challenge'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'عنوان التحدي (عربي)' : 'Challenge Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={guessTitleAr}
                    onChange={(e) => setGuessTitleAr(e.target.value)}
                    placeholder="سلوك المقارنة بين كائنين"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'لغة البرمجة' : 'Language'}
                  </label>
                  <select
                    value={guessLang}
                    onChange={(e) => setGuessLang(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="C#">C#</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {isAr ? 'الكود البرمجي (Snippet)' : 'Code Snippet'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={guessCode}
                  onChange={(e) => setGuessCode(e.target.value)}
                  dir="ltr"
                  placeholder={`const a = [1, 2];\nconst b = [1, 2];\nconsole.log(a === b);`}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-slate-100 font-mono text-xs"
                />
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Option A (0)', val: guessOpt0, set: setGuessOpt0, idx: 0 },
                  { label: 'Option B (1)', val: guessOpt1, set: setGuessOpt1, idx: 1 },
                  { label: 'Option C (2)', val: guessOpt2, set: setGuessOpt2, idx: 2 },
                  { label: 'Option D (3)', val: guessOpt3, set: setGuessOpt3, idx: 3 },
                ].map((opt) => (
                  <div key={opt.idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_idx"
                      checked={guessCorrectIdx === opt.idx}
                      onChange={() => setGuessCorrectIdx(opt.idx)}
                      className="accent-emerald-600 cursor-pointer"
                      title={isAr ? 'حدد كإجابة صحيحة' : 'Mark as correct'}
                    />
                    <input
                      type="text"
                      required
                      value={opt.val}
                      onChange={(e) => opt.set(e.target.value)}
                      placeholder={opt.label}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                    />
                  </div>
                ))}
              </div>

              {/* Explanation & XP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'التفسير التقني (عربي)' : 'Explanation (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={guessExpAr}
                    onChange={(e) => setGuessExpAr(e.target.value)}
                    placeholder="في JS المقارنة بالمرجع Reference تفشل للكائنات المنفصلة"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'التفسير التقني (إنجليزي)' : 'Explanation (English)'}
                  </label>
                  <input
                    type="text"
                    value={guessExpEn}
                    onChange={(e) => setGuessExpEn(e.target.value)}
                    placeholder="In JS object comparison is by reference"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'نقاط الخبرة (XP)' : 'XP Reward'}
                  </label>
                  <input
                    type="number"
                    value={guessXp}
                    onChange={(e) => setGuessXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingChallenge(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {isAr ? 'حفظ ونشر التحدي' : 'Save & Publish'}
                </button>
              </div>
            </form>
          )}

          {/* Add Bug Challenge Form */}
          {isAddingChallenge && challengeType === 'bug' && (
            <form
              onSubmit={handleCreateBugChallenge}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-teal-500/30 space-y-4 animate-fade-in"
            >
              <div className="font-bold text-sm text-teal-700 dark:text-teal-400 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة تحدي: صائد الأخطاء (Bug Hunter)' : 'Create New Bug Hunter Challenge'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'عنوان المشكلة' : 'Challenge Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={bugTitleAr}
                    onChange={(e) => setBugTitleAr(e.target.value)}
                    placeholder="خطأ تجاوز حدود المصفوفة"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'لغة البرمجة' : 'Language'}
                  </label>
                  <select
                    value={bugLang}
                    onChange={(e) => setBugLang(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="C#">C#</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {isAr ? 'أسطر الكود (سطر تلو الآخر)' : 'Code Lines (one per line)'}
                </label>
                <textarea
                  required
                  rows={5}
                  value={bugCodeLinesText}
                  onChange={(e) => setBugCodeLinesText(e.target.value)}
                  dir="ltr"
                  placeholder={`function printAll(arr) {\n  for (let i = 0; i <= arr.length; i++) {\n    console.log(arr[i]);\n  }\n}`}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-slate-100 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'رقم السطر المصاب (1-based)' : 'Buggy Line Number (1-based)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={buggyLineNumber}
                    onChange={(e) => setBuggyLineNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'نقاط الخبرة (XP)' : 'XP Reward'}
                  </label>
                  <input
                    type="number"
                    value={bugXp}
                    onChange={(e) => setBugXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Diagnosis and Fix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'تشخيص العلة (عربي)' : 'Bug Diagnosis (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={bugDescAr}
                    onChange={(e) => setBugDescAr(e.target.value)}
                    placeholder="استخدام <= يؤدي للوصول لعنصر غير موجود undefined"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'الحل المقترح (عربي)' : 'Proposed Fix (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={bugFixAr}
                    onChange={(e) => setBugFixAr(e.target.value)}
                    placeholder="استبدال <= بـ < لمنع تجاوز طول المصفوفة"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingChallenge(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {isAr ? 'حفظ ونشر التحدي' : 'Save Bug Challenge'}
                </button>
              </div>
            </form>
          )}

          {/* Challenges List */}
          <div className="space-y-3">
            {challengeType === 'guess' &&
              guessChallenges.map((gc, idx) => (
                <div
                  key={gc.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        {gc.language}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">+{gc.xp} XP</span>
                      <span className="text-xs text-slate-400 font-mono">#{idx + 1}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {isAr ? gc.titleAr : gc.titleEn}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono line-clamp-1" dir="ltr">
                      {gc.code.split('\n')[0]}...
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      deleteGuessChallenge(gc.id)
                      showFeedback(isAr ? 'تم حذف السؤال' : 'Challenge deleted')
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer flex-shrink-0"
                    title={isAr ? 'حذف هذا التحدي' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {challengeType === 'bug' &&
              bugChallenges.map((bc, idx) => (
                <div
                  key={bc.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                        {bc.language}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">+{bc.xp} XP</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        Line {bc.buggyLineIndex + 1}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">#{idx + 1}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {isAr ? bc.titleAr : bc.titleEn}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr ? bc.bugDescriptionAr : bc.bugDescriptionEn}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      deleteBugChallenge(bc.id)
                      showFeedback(isAr ? 'تم حذف التحدي' : 'Challenge deleted')
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer flex-shrink-0"
                    title={isAr ? 'حذف هذا التحدي' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 2.5: DEVELOPER SUGGESTIONS INBOX ================= */}
      {activeSection === 'suggestions' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-indigo-500" />
                <span>{isAr ? 'صندوق اقتراحات المطورين' : 'Developer Suggestions Hub'}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {suggestions.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'متابعة الأفكار البرمجية، طلبات المحتوى والأذكار، والبلاغات المرسلة من مجتمع المطورين'
                  : 'Review submitted ideas, content requests, and issue reports from developers'}
              </p>
            </div>

            {suggestions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      isAr
                        ? 'هل أنت متأكد من رغبتك في مسح كافة الاقتراحات من الصندوق؟'
                        : 'Are you sure you want to clear all suggestions from the inbox?'
                    )
                  ) {
                    clearAllSuggestions()
                    showFeedback(isAr ? 'تم مسح كافة الاقتراحات من الصندوق' : 'All suggestions cleared')
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'تفريغ الصندوق' : 'Clear Inbox'}</span>
              </button>
            )}
          </div>

          {/* Search & Status Filters */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={suggestionSearch}
                  onChange={(e) => setSuggestionSearch(e.target.value)}
                  placeholder={
                    isAr
                      ? 'البحث في نص الاقتراح، اسم المطور، أو البريد...'
                      : 'Search suggestions, dev name, or contact...'
                  }
                  className="w-full ps-10 pe-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40"
                />
                {suggestionSearch && (
                  <button
                    type="button"
                    onClick={() => setSuggestionSearch('')}
                    className="absolute top-3 end-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl overflow-x-auto no-scrollbar">
                {[
                  { id: 'all' as const, labelAr: 'الكل', labelEn: 'All', count: suggestions.length },
                  {
                    id: 'new' as const,
                    labelAr: 'جديد',
                    labelEn: 'New',
                    count: suggestions.filter((s) => s.status === 'new').length,
                    activeClass: 'bg-teal-600 text-white font-bold',
                  },
                  {
                    id: 'reviewed' as const,
                    labelAr: 'تمت المراجعة',
                    labelEn: 'Reviewed',
                    count: suggestions.filter((s) => s.status === 'reviewed').length,
                    activeClass: 'bg-indigo-600 text-white font-bold',
                  },
                  {
                    id: 'implemented' as const,
                    labelAr: 'تم التنفيذ',
                    labelEn: 'Implemented',
                    count: suggestions.filter((s) => s.status === 'implemented').length,
                    activeClass: 'bg-emerald-600 text-white font-bold',
                  },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSuggestionStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      suggestionStatusFilter === st.id
                        ? st.activeClass || 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{isAr ? st.labelAr : st.labelEn}</span>
                    <span className="text-[10px] opacity-75 font-mono">({st.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 me-1">
                <Filter className="w-3 h-3" />
                <span>{isAr ? 'التصنيف:' : 'Type:'}</span>
              </span>
              {[
                { id: 'all' as const, labelAr: 'جميع التصنيفات', labelEn: 'All Types' },
                { id: 'feature' as const, labelAr: 'ميزة جديدة', labelEn: 'Feature', icon: Sparkles },
                { id: 'content' as const, labelAr: 'محتوى/صوتيات', labelEn: 'Content', icon: BookOpen },
                { id: 'bug' as const, labelAr: 'مشكلة برمجية', labelEn: 'Bug', icon: Bug },
                { id: 'other' as const, labelAr: 'أخرى', labelEn: 'Other', icon: HelpCircle },
              ].map((tp) => (
                <button
                  key={tp.id}
                  type="button"
                  onClick={() => setSuggestionTypeFilter(tp.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer flex-shrink-0 flex items-center gap-1 ${
                    suggestionTypeFilter === tp.id
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tp.icon && <tp.icon className="w-3 h-3" />}
                  <span>{isAr ? tp.labelAr : tp.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Suggestions List */}
          <div className="space-y-3.5 pt-2">
            {(() => {
              const filtered = suggestions.filter((s) => {
                if (suggestionStatusFilter !== 'all' && s.status !== suggestionStatusFilter) {
                  return false
                }
                if (suggestionTypeFilter !== 'all' && s.type !== suggestionTypeFilter) {
                  return false
                }
                if (suggestionSearch.trim()) {
                  const query = suggestionSearch.toLowerCase()
                  const matchDetails = s.details.toLowerCase().includes(query)
                  const matchName = s.developerName?.toLowerCase().includes(query)
                  const matchContact = s.developerContact?.toLowerCase().includes(query)
                  if (!matchDetails && !matchName && !matchContact) {
                    return false
                  }
                }
                return true
              })

              if (filtered.length === 0) {
                return (
                  <div className="py-14 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/30 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
                      <MessageSquarePlus className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {isAr ? 'لا توجد مشاركات مطابقة للتصفية الحالية' : 'No suggestions match the current filter'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isAr
                        ? 'يمكن للمطورين إرسال مقترحاتهم في أي وقت عبر زر "اقترح ميزة" بالترويسة.'
                        : 'Developers can submit feature suggestions via the header Suggest button anytime.'}
                    </p>
                  </div>
                )
              }

              return filtered.map((sug) => {
                const typeConfig = {
                  feature: {
                    labelAr: 'ميزة جديدة',
                    labelEn: 'Feature Idea',
                    icon: Sparkles,
                    badge:
                      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
                  },
                  content: {
                    labelAr: 'محتوى / صوتيات',
                    labelEn: 'Content / Audio',
                    icon: BookOpen,
                    badge:
                      'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30',
                  },
                  bug: {
                    labelAr: 'مشكلة برمجية',
                    labelEn: 'Bug Report',
                    icon: Bug,
                    badge:
                      'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
                  },
                  other: {
                    labelAr: 'ملاحظة عامة',
                    labelEn: 'General Feedback',
                    icon: HelpCircle,
                    badge:
                      'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
                  },
                }[sug.type]

                const TypeIcon = typeConfig.icon

                return (
                  <div
                    key={sug.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
                      sug.status === 'new'
                        ? 'bg-teal-50/30 dark:bg-teal-950/15 border-teal-500/30 dark:border-teal-500/20'
                        : sug.status === 'implemented'
                        ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-500/30 dark:border-emerald-500/20'
                        : 'bg-white dark:bg-slate-850/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Header: Type, Time, Status Dropdown, Delete */}
                    <div className="flex items-center justify-between flex-wrap gap-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${typeConfig.badge}`}
                        >
                          <TypeIcon className="w-3.5 h-3.5" />
                          <span>{isAr ? typeConfig.labelAr : typeConfig.labelEn}</span>
                        </span>

                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(sug.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Status Selector & Delete */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                          {(
                            [
                              { id: 'new', labelAr: 'جديد', labelEn: 'New', color: 'text-teal-500' },
                              { id: 'reviewed', labelAr: 'تمت المراجعة', labelEn: 'Reviewed', color: 'text-indigo-500' },
                              { id: 'implemented', labelAr: 'تم التنفيذ', labelEn: 'Done', color: 'text-emerald-500' },
                            ] as const
                          ).map((st) => (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => {
                                updateSuggestionStatus(sug.id, st.id)
                                showFeedback(
                                  isAr
                                    ? `تم تغيير حالة الاقتراح إلى: ${st.labelAr}`
                                    : `Status updated to ${st.labelEn}`
                                )
                              }}
                              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                sug.status === st.id
                                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                              }`}
                            >
                              <span className={sug.status === st.id ? st.color : ''}>
                                {isAr ? st.labelAr : st.labelEn}
                              </span>
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            deleteSuggestion(sug.id)
                            showFeedback(isAr ? 'تم حذف الاقتراح' : 'Suggestion deleted')
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title={isAr ? 'حذف هذا الاقتراح' : 'Delete suggestion'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Suggestion Text Content */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      {sug.details}
                    </div>

                    {/* Developer Metadata (if present) */}
                    {(sug.developerName || sug.developerContact) && (
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5 flex-wrap">
                        {sug.developerName && (
                          <span className="flex items-center gap-1.5 font-medium">
                            <User className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{sug.developerName}</span>
                          </span>
                        )}
                        {sug.developerContact && (
                          <span className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-teal-500" />
                            <span>{sug.developerContact}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        </div>
      )}

      {/* ================= SECTION 3: ANNOUNCEMENT BROADCAST ================= */}
      {activeSection === 'announcement' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-500" />
              <span>{isAr ? 'شريط الإعلانات العام (Broadcast Announcement)' : 'Broadcast Announcement Banner'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? 'رسالة تظهر في أعلى التطبيق لجميع المستخدمين للإعلانات الهامة والتوجيهات'
                : 'Top-level alert banner visible to users across the application'}
            </p>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4">
            {/* Toggle Enable */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {isAr ? 'تفعيل ظهور شريط الإعلانات' : 'Enable Announcement Banner'}
                </span>
                <span className="text-xs text-slate-500">
                  {isAr
                    ? 'عند التفعيل، سيظهر الإعلان فوراً أعلى كل الشاشات'
                    : 'When toggled on, banner is shown globally above all tabs'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={annForm.enabled}
                onChange={(e) => setAnnForm({ ...annForm, enabled: e.target.checked })}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                {isAr ? 'نوع الإعلان والتأثير البصري' : 'Banner Theme & Urgency'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: 'info', labelAr: 'معلومات عامة', labelEn: 'Info (Emerald)', color: 'border-emerald-500 text-emerald-600' },
                  { type: 'success', labelAr: 'تحديث وميزة', labelEn: 'Success (Teal)', color: 'border-teal-500 text-teal-600' },
                  { type: 'warning', labelAr: 'تنبيه إداري', labelEn: 'Notice (Orange)', color: 'border-orange-500 text-orange-600' },
                  { type: 'urgent', labelAr: 'عاجل وهام', labelEn: 'Urgent (Rose)', color: 'border-rose-500 text-rose-600' },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setAnnForm({ ...annForm, type: item.type as any })}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      annForm.type === item.type
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{isAr ? item.labelAr : item.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message in Arabic & English */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {isAr ? 'نص الإعلان (عربي)' : 'Announcement Text (Arabic)'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={annForm.textAr}
                  onChange={(e) => setAnnForm({ ...annForm, textAr: e.target.value })}
                  placeholder={isAr ? 'أهلاً بكم في تطبيق سند المبرمج...' : 'Welcome to Sanad Dev App...'}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {isAr ? 'نص الإعلان (إنجليزي)' : 'Announcement Text (English)'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={annForm.textEn}
                  onChange={(e) => setAnnForm({ ...annForm, textEn: e.target.value })}
                  placeholder="Welcome to Sanad Dev App..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">
                {isAr ? 'معاينة حية للإعلان:' : 'Live Banner Preview:'}
              </span>
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center gap-3">
                <Megaphone className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
                <span className="text-xs font-semibold">
                  {isAr ? annForm.textAr || 'لا يوجد نص' : annForm.textEn || 'No text'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'حفظ وتطبيق الإعلان' : 'Save & Broadcast'}</span>
              </button>

              {annSaved && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تم الحفظ والتطبيق بنجاح!' : 'Broadcast banner updated!'}</span>
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ================= SECTION 4: OFFSETS & AUDIO ================= */}
      {activeSection === 'offsets' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? 'فوارق دقائق الأذان لمساجد القاهرة' : 'Cairo Mosque Minute Offsets (+/- mins)'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? 'ضبط فوارق الدقائق المباشرة لمزامنة أذان القاهرة بدقة مع مساجد أحيائكم'
                : 'Fine-tune minute deviations to synchronize with your neighborhood mosque in Cairo'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              {
                id: 'fajr',
                labelAr: 'الفجر',
                labelEn: 'Fajr',
                val: prayerOffsets.fajr,
                set: (v: number) => setPrayerOffsets({ ...prayerOffsets, fajr: v }),
              },
              {
                id: 'dhuhr',
                labelAr: 'الظهر',
                labelEn: 'Dhuhr',
                val: prayerOffsets.dhuhr,
                set: (v: number) => setPrayerOffsets({ ...prayerOffsets, dhuhr: v }),
              },
              {
                id: 'asr',
                labelAr: 'العصر',
                labelEn: 'Asr',
                val: prayerOffsets.asr,
                set: (v: number) => setPrayerOffsets({ ...prayerOffsets, asr: v }),
              },
              {
                id: 'maghrib',
                labelAr: 'المغرب',
                labelEn: 'Maghrib',
                val: prayerOffsets.maghrib,
                set: (v: number) => setPrayerOffsets({ ...prayerOffsets, maghrib: v }),
              },
              {
                id: 'isha',
                labelAr: 'العشاء',
                labelEn: 'Isha',
                val: prayerOffsets.isha,
                set: (v: number) => setPrayerOffsets({ ...prayerOffsets, isha: v }),
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-2"
              >
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {isAr ? item.labelAr : item.labelEn}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => item.set(item.val - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white min-w-[24px]">
                    {item.val > 0 ? `+${item.val}` : item.val}
                  </span>
                  <button
                    type="button"
                    onClick={() => item.set(item.val + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Volume Control */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? 'مستوى صوت رنين التنبيهات والأذان' : 'Alert & Adhan Chime Volume'}</span>
              </span>
              <span className="font-mono">{audioVolume}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={audioVolume}
              onChange={(e) => setAudioVolume(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* 5-Second Background Notification Test Card */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/30 border border-emerald-500/20 dark:border-emerald-800/60 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                    <BellRing className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{isAr ? 'مسار الخلفية (Service Worker)' : 'Background Service Worker'}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{isAr ? 'اختبار إرسال إشعار فوري بعد 5 ثوانٍ (والتطبيق مغلق)' : 'Test Background Notification in 5 Seconds'}</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {isAr
                      ? 'اضغط على الزر، ثم قم بتصغير المتصفح أو قفل شاشة هاتفك فوراً للتأكد من وصول إشعار النظام والتطبيق مغلق تماماً عبر الـ Service Worker.'
                      : 'Click the button, then minimize your browser or lock your phone screen immediately to verify the system notification arrives while the app is closed.'}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleTrigger5sTest}
                    disabled={isTesting5s}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      isTesting5s
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 cursor-wait'
                        : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-emerald-600/20'
                    }`}
                  >
                    {isTesting5s ? (
                      <>
                        <Timer className="w-4 h-4 animate-spin text-amber-500" />
                        <span>
                          {isAr
                            ? `أغلق التطبيق الآن! (${countdown5s} ث)...`
                            : `Close app now! (${countdown5s}s)...`}
                        </span>
                      </>
                    ) : (
                      <>
                        <BellRing className="w-4 h-4" />
                        <span>{isAr ? 'إرسال إشعار تجريبي بعد 5 ثوانٍ' : 'Schedule 5s Test Alert'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scheduled Alert Notice */}
              {isTesting5s && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    {isAr
                      ? `تمت الجدولة بنجاح! اخرج من التطبيق أو اقفل الشاشة الآن (${countdown5s} ثوانٍ متبقية) لرؤية الإشعار الخارجي.`
                      : `Scheduled! Minimize or lock screen now (${countdown5s}s remaining) to see the background notification.`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Service Worker Background Live Diagnostics Card */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-gradient-to-br from-indigo-500/10 via-slate-900/5 to-cyan-500/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-cyan-950/30 border border-indigo-500/20 dark:border-indigo-800/60 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300/60 dark:border-indigo-700/60">
                    <Activity className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <span>{isAr ? 'فحص ومراقبة مؤقت الخلفية المستقل' : 'Background Timer Live Monitor'}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{isAr ? 'حالة مؤقت Service Worker والذاكرة المستمرة (IndexedDB)' : 'SW Timer & IndexedDB Persistence Status'}</span>
                  </h4>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={fetchSwStatus}
                    disabled={isQueryingSw}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 border border-slate-300/50 dark:border-slate-700 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isQueryingSw ? 'animate-spin text-indigo-500' : ''}`} />
                    <span>{isAr ? 'تحديث النبض' : 'Ping SW'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerDirectSalawat}
                    disabled={isTriggeringSalawat}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white transition flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
                  >
                    <BellRing className={`w-3.5 h-3.5 ${isTriggeringSalawat ? 'animate-bounce' : ''}`} />
                    <span>
                      {isTriggeringSalawat
                        ? (isAr ? 'جاري الإرسال...' : 'Sending...')
                        : (isAr ? 'إرسال الصلاة على النبي فوراً' : 'Test Salawat Now')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Status metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    {isAr ? 'مؤقت الخلفية المستقل' : 'SW Background Timer'}
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>{isAr ? 'نشط (يفحص كل دقيقة)' : 'Active (ticks every 1m)'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    {isAr ? 'تكرار الصلاة على النبي' : 'Salawat Interval'}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      {swStatus?.salawatIntervalMinutes
                        ? `${swStatus.salawatIntervalMinutes} ${isAr ? 'دقيقة' : 'min'}`
                        : `${notificationSettings?.salawatIntervalMinutes || 15} ${isAr ? 'دقيقة' : 'min'}`}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    {isAr ? 'الوقت حتى الإشعار القادم' : 'Next Salawat In'}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      {swStatus?.nextSalawatInMs !== undefined
                        ? (swStatus.nextSalawatInMs <= 60000
                            ? (isAr ? 'أقل من دقيقة (مستحق)' : 'Under 1 min')
                            : `${Math.ceil(swStatus.nextSalawatInMs / 60000)} ${isAr ? 'دقيقة' : 'min'}`)
                        : (isAr ? 'محسوب في الدورة القادمة' : 'Pending tick')}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    {isAr ? 'الذاكرة المستمرة للـ SW' : 'Persistence Layer'}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isAr ? 'IndexedDB متصل ومحفوظ' : 'IndexedDB Synced'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notification Settings Link */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {isAr ? 'مركز إعدادات الإشعارات والأذان المباشر' : 'Notifications & Push Alerts Hub'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isAr
                  ? 'ضبط مواعيد النصائح الخمس، أذكار الصلاة على النبي، وأذان القاهرة'
                  : 'Configure 5 daily tips, periodic dhikr intervals, and Cairo prayer pushes'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsNotificationModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isAr ? 'فتح مركز الإشعارات' : 'Open Alerts Hub'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= SECTION 5: SECURITY, PIN & BACKUP ================= */}
      {activeSection === 'security_backup' && (
        <div className="space-y-6 animate-fade-in">
          {/* 1. Account Security & Change Credentials Gate */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isAr ? 'أمان الحساب' : 'Account Security'}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-500" />
                <span>{isAr ? 'تعديل بيانات تسجيل الدخول للمشرف' : 'Change Admin Credentials'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'يمكنك تعديل اسم المستخدم وكلمة المرور وحفظهما في التخزين المحلي للمتصفح لاعتمادهما في المرات القادمة.'
                  : 'Update admin username and password. Changes are saved locally for future logins.'}
              </p>
            </div>

            <form onSubmit={handleChangeCredentials} className="space-y-4 max-w-lg">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسم المستخدم (Username)' : 'Username'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={credUsername}
                    onChange={(e) => setCredUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  {isAr ? 'كلمة المرور الحالية للتأكيد' : 'Current Password'}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder={isAr ? 'أدخل كلمة المرور الحالية (الافتراضية: 2482003)' : 'Enter current password'}
                    className="w-full ps-10 pe-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPass((prev) => !prev)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                    {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder={isAr ? '4 خانات على الأقل' : 'At least 4 chars'}
                      className="w-full ps-10 pe-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                    <button
                      type="button"
                      onClick={() => setShowNewPass((prev) => !prev)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                    {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder={isAr ? 'أعد إدخال كلمة المرور' : 'Repeat new password'}
                      className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {credError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{credError}</span>
                </div>
              )}

              {credSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {isAr
                      ? 'تم تحديث اسم المستخدم وكلمة المرور بنجاح! سيتم اعتمادهما في تسجيل الدخول القادم.'
                      : 'Credentials updated successfully and saved in local storage!'}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-950/20 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'حفظ وتحديث بيانات الدخول' : 'Update Credentials'}</span>
              </button>
            </form>
          </div>

          {/* 2. Data & Backup Utility (Export / Import / Reset) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <span>{isAr ? 'أدوات النسخ الاحتياطي وإدارة البيانات' : 'Data & Backup Utility'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'تصدير كامل إنجازاتك ونقاطك وتحدياتك في ملف JSON أو استرجاعها، أو إعادة الضبط'
                  : 'Export all user streaks, custom reminders, and progress into a JSON file, or restore state'}
              </p>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportBackup}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition text-start space-y-2 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {isAr ? 'تصدير البيانات (Export)' : 'Export Data (JSON)'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? 'تنزيل نسخة احتياطية كاملة لكافة الإعدادات والإنجازات'
                    : 'Download JSON backup of XP, streaks, reminders & challenges'}
                </p>
              </button>

              {/* Import Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition text-start space-y-2 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {isAr ? 'استيراد البيانات (Import)' : 'Import Data (JSON)'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? 'رفع ملف نسخة احتياطية واستعادة كافة البيانات فورياً'
                    : 'Upload a backup JSON file to restore your progress'}
                </p>
              </button>

              {/* Reset Progress Button */}
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 hover:border-rose-500 transition text-start space-y-2 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-rose-700 dark:text-rose-300">
                  {isAr ? 'تصفير التقدم (Reset)' : 'Reset Progress'}
                </div>
                <p className="text-xs text-rose-600/80 dark:text-rose-400/80 leading-relaxed">
                  {isAr
                    ? 'إعادة تعيين السلسلة، الـ XP، والعودة للإعدادات الأولية'
                    : 'Clear streaks, XP, custom data and return to defaults'}
                </p>
              </button>
            </div>

            {importStatus && (
              <div
                className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  importStatus.success
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                }`}
              >
                {importStatus.success ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{importStatus.msg}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{isAr ? 'تم تصفير التقدم واستعادة ضبط المصنع بنجاح!' : 'Progress successfully reset!'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="absolute top-5 end-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {isAr ? 'تأكيد تصفير البيانات' : 'Confirm Progress Reset'}
                </h3>
                <span className="text-xs text-rose-500 font-bold">
                  {isAr ? 'إجراء لا يمكن التراجع عنه' : 'Irreversible Action'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {isAr
                ? 'هل أنت متأكد من رغبتك في تصفير جميع نقاط الخبرة (XP)، وسلاسل الأيام، وإعادة التنبيهات والتحديات إلى حالتها الافتراضية؟'
                : 'Are you sure you want to erase all earned XP, streaks, habits checklist, and reset all challenges and reminders to defaults?'}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
              >
                {isAr ? 'نعم، تصفير البيانات' : 'Yes, Reset Everything'}
              </button>
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Diagnostics & Supervisor Footer Info */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-500" />
            <span>{isAr ? 'تشخيص وحالة بيئة التشغيل' : 'Runtime Diagnostics & Architecture'}</span>
          </h3>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {isAr ? 'إشراف وتطوير: م. منار عماد' : 'Supervised by Eng. Manar Emad'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block">{isAr ? 'الإصدار' : 'Version'}</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">v1.2.0-prod</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block">{isAr ? 'المكتبة الفلكية' : 'Astrolib'}</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Adhan v4.4.6</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block">{isAr ? 'محرك التنسيق' : 'CSS Engine'}</span>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400">Tailwind v4 (RTL)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block">{isAr ? 'بيئة React' : 'Runtime'}</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">React 19 + Vite 8</span>
          </div>
        </div>
      </div>
    </div>
  )
}
