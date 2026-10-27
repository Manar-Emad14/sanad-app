import React from 'react'
import { Download, X, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

export const SmartInstallBanner: React.FC = () => {
  const {
    lang,
    isStandalone,
    isInstallBannerDismissed,
    dismissInstallBanner,
    promptInstall,
  } = useApp()

  const isAr = lang === 'ar'

  // Do not show banner if the app is already installed/running in standalone mode
  // or if user previously dismissed it
  if (isStandalone || isInstallBannerDismissed) {
    return null
  }

  const handleInstall = async () => {
    await promptInstall()
  }

  const handleDismiss = () => {
    dismissInstallBanner(true)
  }

  return (
    <div
      className="fixed top-3 inset-x-3 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl z-50 animate-in fade-in slide-in-from-top-3 duration-300"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white border border-emerald-500/40 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl p-3.5 sm:p-4">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -start-12 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />

        {/* Close / Dismiss 'X' Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2.5 end-2.5 w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title={isAr ? 'المتابعة في المتصفح' : 'Continue in browser'}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start sm:items-center gap-3">
          {/* App Branded Icon */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 border border-emerald-400/40 flex-shrink-0 flex items-center justify-center shadow-md shadow-emerald-950/30">
            <img
              src="/icon-192.png"
              alt="Sanad Dev Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-contain"
              onError={(e) => {
                // Fallback if icon fails to render
                ;(e.currentTarget as HTMLElement).style.display = 'none'
              }}
            />
          </div>

          {/* Banner Text Content */}
          <div className="flex-1 min-w-0 pe-6 sm:pe-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <h3 className="font-extrabold text-xs sm:text-sm text-white truncate">
                {isAr
                  ? 'ثبّت تطبيق سند المُبرمج على هاتفك بضغطة واحدة'
                  : 'Install Sanad Dev on your device in one tap'}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200/80 leading-relaxed line-clamp-2">
              {isAr
                ? 'تشغيل فوري، دقة في مواقيت الصلاة والأذان بدون إنترنت، وتنبيهات أذكار في الخلفية'
                : 'Instant access, offline prayer times, adhan, and background reminders'}
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800">
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAr ? 'تثبيت الآن' : 'Install Now'}</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isAr ? 'المتابعة في المتصفح' : 'Use in Browser'}</span>
            {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  )
}
