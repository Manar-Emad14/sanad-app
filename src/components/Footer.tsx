import React from 'react'
import { useApp } from '../context/AppContext'
import { Heart, Sparkles, Code2, Terminal } from 'lucide-react'

export const Footer: React.FC = () => {
  const { lang } = useApp()
  const isAr = lang === 'ar'
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md pb-24 sm:pb-8 pt-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Main Brand & Supervisor Attribution */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-start">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 flex-shrink-0">
              <Terminal className="w-5 h-5" />
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                <span>
                  {isAr
                    ? 'إشراف وتطوير: م. منار عماد | جميع الحقوق محفوظة لـ سند المُبرمج'
                    : 'Supervised & Developed by Eng. Manar Emad | All Rights Reserved'}
                </span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? `© ${currentYear} تطبيق سند المُبرمج • يجمع نقاء الروح مع إتقان البرمجة والتقنية`
                  : `© ${currentYear} Sanad Dev App • Blending spiritual mindfulness with software craftsmanship`}
              </p>
            </div>
          </div>

          {/* Quick Stats / Tech Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
              <Sparkles className="w-3 h-3" />
              <span>{isAr ? 'حساب هيئة المساحة المصرية' : 'Egyptian Survey Calc'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Code2 className="w-3 h-3" />
              <span>React 19 • Tailwind v4 • Adhan</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
