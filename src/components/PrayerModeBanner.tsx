import React from 'react'
import { useApp } from '../context/AppContext'
import { MoonStar, VolumeX, X } from 'lucide-react'

export const PrayerModeBanner: React.FC = () => {
  const { lang, prayerMode, setPrayerMode } = useApp()
  const isAr = lang === 'ar'

  if (!prayerMode) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-500/30 animate-fade-in mb-6">
      <div className="absolute top-0 end-0 -mt-8 -me-8 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0">
            <MoonStar className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-emerald-200">
                {isAr ? 'وضع الصلاة والخلوة الإيمانية مفعّل' : 'Prayer & Focus Mode Active'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <VolumeX className="w-3 h-3" />
                <span>{isAr ? 'تم كتم الإشعارات' : 'Muted'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr
                ? '«أرِحْنا بها يا بلال» • تم تعليق الإشعارات الصوتية لتهيئة النفس واستحضار الخشوع.'
                : '"Call the prayer that we may find rest in it" • Audio alerts paused for tranquil focus.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setPrayerMode(false)}
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isAr ? 'إنهاء وضع الصلاة' : 'Exit Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
