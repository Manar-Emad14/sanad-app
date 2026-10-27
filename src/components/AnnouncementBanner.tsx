import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
} from 'lucide-react'

export const AnnouncementBanner: React.FC = () => {
  const { lang, announcement } = useApp()
  const [dismissed, setDismissed] = useState(false)

  if (!announcement.enabled || dismissed) return null

  const isAr = lang === 'ar'
  const rawMessage = isAr ? announcement.textAr : announcement.textEn
  if (!rawMessage) return null
  const message = rawMessage.replace(/منصة سند/g, 'تطبيق سند')

  const typeConfig = {
    info: {
      bg: 'bg-emerald-950/80 text-emerald-100 border-emerald-500/30',
      icon: Megaphone,
      iconColor: 'text-emerald-400',
      badge: isAr ? 'إعلان إداري' : 'Announcement',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    },
    success: {
      bg: 'bg-teal-950/80 text-teal-100 border-teal-500/30',
      icon: CheckCircle2,
      iconColor: 'text-teal-400',
      badge: isAr ? 'تحديث جديد' : 'Update',
      badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    },
    warning: {
      bg: 'bg-orange-950/80 text-orange-100 border-orange-500/30',
      icon: AlertTriangle,
      iconColor: 'text-orange-400',
      badge: isAr ? 'تنبيه هام' : 'Notice',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
    },
    urgent: {
      bg: 'bg-rose-950/80 text-rose-100 border-rose-500/30',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
      badge: isAr ? 'عاجل' : 'Urgent',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    },
  }[announcement.type || 'info']

  const Icon = typeConfig.icon

  return (
    <div
      className={`mb-6 p-4 rounded-2xl border ${typeConfig.bg} shadow-md backdrop-blur-md flex items-center justify-between gap-4 animate-fade-in relative overflow-hidden`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Icon className={`w-4 h-4 ${typeConfig.iconColor} animate-pulse`} />
        </div>
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${typeConfig.badgeBg} inline-flex items-center`}
          >
            <Megaphone size={15} className="inline ml-1.5 text-emerald-400" />
            <span>{typeConfig.badge}</span>
          </span>
          <p className="text-xs sm:text-sm font-semibold leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition flex-shrink-0 cursor-pointer"
        title={isAr ? 'إخفاء الإعلان' : 'Dismiss'}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
