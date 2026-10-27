import React from 'react'
import { useApp } from '../context/AppContext'
import { TABS } from '../constants/tabs'
import {
  Home,
  BookOpen,
  Clock,
  Timer,
  Code2,
  Trophy,
  ShieldCheck,
  Lock,
  Download,
} from 'lucide-react'

const TAB_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Home,
  BookOpen,
  Clock,
  Timer,
  Code2,
  Trophy,
  ShieldCheck,
  Lock,
}

export const Navigation: React.FC = () => {
  const { lang, activeTab, handleTabSelect, isAdminUnlocked } = useApp()
  const isAr = lang === 'ar'

  return (
    <>
      {/* ================= DESKTOP NAVIGATION (Horizontal sleek bar) ================= */}
      <nav className="hidden lg:block bg-slate-900/90 dark:bg-slate-950/90 border-b border-slate-800 shadow-xs backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = TAB_ICONS[tab.iconName] || Home
              const isLockedAdmin = tab.id === 'admin' && !isAdminUnlocked

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  type="button"
                  className={`flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl transition-all duration-200 border whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 border-emerald-500/50'
                      : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/40 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{isAr ? tab.nameAr : tab.nameEn}</span>

                  {/* Badge or Lock indicator */}
                  {isLockedAdmin ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                        isActive
                          ? 'bg-emerald-800/60 text-emerald-100'
                          : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                    </span>
                  ) : tab.badge ? (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              )
            })}

            {/* Install Button in Desktop Nav */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('sanad:trigger-pwa-install'))}
              type="button"
              className="ms-auto flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 flex-shrink-0"
              title={isAr ? 'تثبيت التطبيق' : 'Install App'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAr ? 'تثبيت التطبيق' : 'Install App'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ================= TABLET NAVIGATION (Compact scrollable pill bar) ================= */}
      <nav className="hidden sm:block lg:hidden bg-slate-900/95 dark:bg-slate-950/95 border-b border-slate-800 px-4 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = TAB_ICONS[tab.iconName] || Home
            const isLockedAdmin = tab.id === 'admin' && !isAdminUnlocked

            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id)}
                type="button"
                className={`flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl transition-all duration-200 border whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 border-emerald-500/50'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/40 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{isAr ? tab.nameAr : tab.nameEn}</span>
                {isLockedAdmin && <Lock className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            )
          })}

          {/* Install Button in Tablet Nav */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('sanad:trigger-pwa-install'))}
            type="button"
            className="ms-auto flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 flex-shrink-0"
            title={isAr ? 'تثبيت التطبيق' : 'Install App'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAr ? 'تثبيت التطبيق' : 'Install App'}</span>
          </button>
        </div>
      </nav>

      {/* ================= MOBILE BOTTOM NAVIGATION (Fixed at bottom) ================= */}
      <nav className="sm:hidden fixed bottom-0 start-0 end-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl px-1 py-1.5 transition-colors duration-300 safe-area-pb">
        <div className="flex items-center justify-around w-full overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = TAB_ICONS[tab.iconName] || Home
            const isLockedAdmin = tab.id === 'admin' && !isAdminUnlocked

            // Short mobile label
            const shortName = isAr
              ? tab.id === 'dashboard'
                ? 'الرئيسية'
                : tab.id === 'quran'
                ? 'المصحف'
                : tab.id === 'prayer-schedule'
                ? 'الصلاة'
                : tab.id === 'pomodoro'
                ? 'بومودورو'
                : tab.id === 'challenges'
                ? 'تحديات'
                : tab.id === 'achievements'
                ? 'إنجازاتي'
                : 'التحكم'
              : tab.id === 'dashboard'
              ? 'Home'
              : tab.id === 'quran'
              ? 'Quran'
              : tab.id === 'prayer-schedule'
              ? 'Prayer'
              : tab.id === 'pomodoro'
              ? 'Pomo'
              : tab.id === 'challenges'
              ? 'Code'
              : tab.id === 'achievements'
              ? 'Deeds'
              : 'Admin'

            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id)}
                type="button"
                className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-emerald-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive
                      ? 'bg-emerald-950/80 -translate-y-0.5 shadow-xs border border-emerald-500/30'
                      : ''
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full font-medium">
                  {shortName}
                </span>

                {/* Subtle active dot */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
                )}

                {/* Lock icon for admin on mobile */}
                {isLockedAdmin && (
                  <span className="absolute top-1 end-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
