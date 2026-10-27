import React from 'react'
import { useApp } from '../context/AppContext'
import { PwaInstallModal } from './PwaInstallModal'
import {
  Sparkles,
  Sunrise,
  Clock,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Languages,
  Bell,
  Heart,
  Download,
  MessageSquarePlus,
  User,
} from 'lucide-react'

export const Header: React.FC = () => {
  const {
    lang,
    theme,
    toggleTheme,
    toggleLang,
    prayerMode,
    togglePrayerMode,
    prayerStatus,
    setIsNotificationModalOpen,
    notificationSettings,
    recentNotifications,
    setIsSpiritualToolsModalOpen,
    setIsSuggestionModalOpen,
    userProfile,
    setIsProfileModalOpen,
    isStandalone,
    installPrompt,
    promptInstall,
    isInstallModalOpen,
    setIsInstallModalOpen,
  } = useApp()

  const isAr = lang === 'ar'
  const nextPrayerName = isAr
    ? prayerStatus.nextPrayerName.ar
    : prayerStatus.nextPrayerName.en

  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between py-2.5 sm:py-0 sm:h-20 gap-2 sm:gap-4">
          
          {/* 1. Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 min-w-0">
            <div className="relative group flex-shrink-0 cursor-pointer">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl p-0.5 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 border border-emerald-400/40 shadow-sm shadow-emerald-950/20 group-hover:scale-105 group-hover:border-emerald-300 transition-all duration-300 flex items-center justify-center">
                <img
                  src="/logo.svg?v=2"
                  alt="تطبيق سند المُبرمج | Sanad Dev"
                  className="w-7 h-7 sm:w-9 sm:h-9 object-contain rounded-lg sm:rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col min-w-0 leading-tight">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-extrabold text-sm sm:text-lg lg:text-xl tracking-tight text-slate-900 dark:text-white truncate">
                  {isAr ? 'تطبيق سَنَد المُبرمِج' : 'Sanad Dev App'}
                </h1>
                <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{isAr ? 'كود بروح إيمانية' : 'Faith & Code'}</span>
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] lg:max-w-xs">
                {isAr
                  ? 'تطبيق سند المُبرمج للإنتاجية والتوازن الروحي'
                  : 'Sanad Dev App • Productivity & Balance'}
              </p>
            </div>
          </div>

          {/* 2. Center: Compact Cairo Next Prayer Pill (Desktop >= 1024px) */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/60 shadow-xs flex-shrink-0">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>{isAr ? 'الصلاة القادمة:' : 'Next Prayer:'}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                  {nextPrayerName}
                </span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 tracking-wider">
                  {prayerStatus.countdown}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900 font-mono">
                  {isAr ? 'متبقي' : 'left'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Desktop Action Controls (hidden on mobile, visible on sm and up) */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Prayer Mode Switch */}
            <button
              onClick={togglePrayerMode}
              type="button"
              className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer shadow-sm ${
                prayerMode
                  ? 'bg-emerald-600 text-white border border-emerald-500 shadow-emerald-600/30'
                  : 'bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400'
              }`}
              title={
                isAr
                  ? prayerMode
                    ? 'وضع الصلاة مفعّل (كتم الإشعارات وتفعيل الأجواء الإيمانية)'
                    : 'وضع الصلاة: كتم الإشعارات والأجواء الإيمانية'
                  : 'Prayer Mode: Mute notifications & focus spiritually'
              }
            >
              {prayerMode ? (
                <VolumeX className="w-4 h-4 text-emerald-100 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span
                className={`w-1.5 h-1.5 rounded-full absolute top-1 end-1 ${
                  prayerMode ? 'bg-emerald-400 animate-ping' : 'hidden'
                }`}
              />
            </button>

            {/* Developer Spiritual Tools (Tasbih & Du'aa) */}
            <button
              onClick={() => setIsSpiritualToolsModalOpen(true)}
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-colors shadow-sm cursor-pointer"
              title={isAr ? 'مسبحة المبرمج الرقمية وأدعية الكود' : "Digital Tasbih & Dev Du'aa"}
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Notification Hub & Recent Archive */}
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              type="button"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-colors shadow-sm cursor-pointer"
              title={
                isAr
                  ? `إعدادات وسجل الإشعارات (${recentNotifications.length} تنبيهات محفوظة)`
                  : `Notification Hub & Archive (${recentNotifications.length} saved)`
              }
            >
              <Bell className="w-4 h-4" />
              {recentNotifications.length > 0 ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 end-1.5 ring-2 ring-slate-900 animate-pulse" />
              ) : (notificationSettings.prayerAlerts || notificationSettings.dailyTips || notificationSettings.periodicDhikr) ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1.5 end-1.5" />
              ) : null}
            </button>

            {/* Developer Suggestions Box */}
            <button
              onClick={() => setIsSuggestionModalOpen(true)}
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-colors shadow-sm cursor-pointer"
              title={
                isAr
                  ? 'صندوق اقتراحات المطورين: اقترح ميزة / شاركنا برأيك'
                  : 'Developer Suggestions: Propose a Feature'
              }
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>

            {/* User Profile & Personalization Button */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-colors shadow-sm cursor-pointer"
              title={isAr ? 'الملف الشخصي وتخصيص الاسم والوقار' : 'Profile & Personalization'}
            >
              <User className="w-4 h-4 text-emerald-400" />
              {userProfile.name ? (
                <span className="text-xs font-semibold max-w-[85px] truncate text-emerald-200">
                  {userProfile.name}
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400">
                  {isAr ? 'حسابك' : 'Profile'}
                </span>
              )}
            </button>

            {/* PWA Install Button (Shown if not standalone) */}
            {!isStandalone && (
              <button
                onClick={promptInstall}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm hover:shadow-emerald-600/30 transition-all cursor-pointer active:scale-95 flex-shrink-0 animate-fade-in"
                title={isAr ? 'تثبيت التطبيق' : 'Install App'}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تثبيت التطبيق' : 'Install App'}</span>
              </button>
            )}

            {/* Dual Theme Switcher */}
            <button
              onClick={toggleTheme}
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-colors shadow-sm cursor-pointer"
              title={
                isAr
                  ? theme === 'dark'
                    ? 'التحويل للوضع النهاري'
                    : 'التحويل للوضع الليلي'
                  : 'Toggle Theme'
              }
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-emerald-400 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-colors shadow-sm cursor-pointer"
              title={isAr ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
            >
              <Languages className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Quick status/notification button on mobile header right */}
          <div className="sm:hidden flex items-center gap-1.5 flex-shrink-0">
            {!isStandalone && (
              <button
                onClick={promptInstall}
                type="button"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm active:scale-95 cursor-pointer flex-shrink-0"
                title={isAr ? 'تثبيت التطبيق' : 'Install App'}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تثبيت' : 'Install'}</span>
              </button>
            )}

            <button
              onClick={() => setIsNotificationModalOpen(true)}
              type="button"
              className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-emerald-400 shadow-sm cursor-pointer"
              title={isAr ? 'مركز الإشعارات' : 'Notification Hub'}
            >
              <Bell className="w-3.5 h-3.5" />
              {recentNotifications.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 end-1 ring-1 ring-slate-900 animate-pulse" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-emerald-400 shadow-sm cursor-pointer"
              title={isAr ? 'تبديل المظهر' : 'Toggle Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tools Capsule (Glass Bar under Logo on Mobile) */}
        <div className="sm:hidden flex items-center justify-around gap-1 px-2 py-1.5 mb-2 rounded-2xl bg-slate-800/70 border border-slate-700/60 shadow-xs">
          <button
            onClick={togglePrayerMode}
            type="button"
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition cursor-pointer ${
              prayerMode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700/40 text-slate-300 hover:text-emerald-400'
            }`}
            title={isAr ? 'وضع الصلاة' : 'Prayer Mode'}
          >
            {prayerMode ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsSpiritualToolsModalOpen(true)}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-700/40 text-slate-300 hover:text-emerald-400 cursor-pointer"
            title={isAr ? 'مسبحة المبرمج' : 'Dev Tasbih'}
          >
            <Heart className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsSuggestionModalOpen(true)}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-700/40 text-slate-300 hover:text-emerald-400 cursor-pointer"
            title={isAr ? 'صندوق الاقتراحات' : 'Suggestions'}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-700/40 text-slate-300 hover:text-emerald-400 cursor-pointer"
            title={isAr ? 'الملف الشخصي وتخصيص الاسم والوقار' : 'Profile'}
          >
            <User className="w-3.5 h-3.5" />
          </button>

          {!isStandalone && (
            <button
              onClick={promptInstall}
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs cursor-pointer active:scale-95 animate-pulse"
              title={isAr ? 'تثبيت التطبيق' : 'Install App'}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={toggleLang}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-700/40 text-emerald-400 font-mono text-[11px] font-bold cursor-pointer"
            title={isAr ? 'التبديل إلى الإنجليزية' : 'Switch Language'}
          >
            {isAr ? 'EN' : 'عربي'}
          </button>
        </div>

        {/* Next Prayer Full-Width Strip on Mobile / Tablet (< lg) */}
        <div className="lg:hidden w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-800/40 border border-slate-700/40 mb-2 text-xs gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 min-w-0">
            <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-[11px]">{isAr ? 'صلاة القاهرة:' : 'Cairo Prayer:'}</span>
            <span className="font-bold text-slate-100 text-[11px] truncate">
              {nextPrayerName}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('sanad:trigger-wisdom'))}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 active:scale-95 cursor-pointer hover:bg-emerald-900/50"
              title={isAr ? 'عرض إشراقة سند' : 'Sanad Wisdom'}
            >
              <Sunrise size={14} className="inline ml-1 text-emerald-400" />
              <span>{isAr ? 'إشراقة سند' : 'Sanad Wisdom'}</span>
            </button>

            <div className="flex items-center gap-1 font-mono font-bold text-emerald-400">
              <span className="text-xs">{prayerStatus.countdown}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                {isAr ? 'متبقي' : 'left'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* PWA Install Guidance Modal */}
      <PwaInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onDirectInstall={promptInstall}
        canDirectInstall={!!installPrompt}
        isAr={isAr}
      />
    </header>
  )
}
