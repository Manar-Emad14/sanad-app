import React from 'react'
import { DownloadCloud, Sparkles, X, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react'
import type { UpdateInfo } from '../services/updateChecker'

interface UpdateModalProps {
  isOpen: boolean
  onClose: () => void
  updateInfo: UpdateInfo | null
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  updateInfo,
}) => {
  if (!isOpen || !updateInfo || !updateInfo.hasUpdate) {
    return null
  }

  const handleDownload = () => {
    try {
      // In native Capacitor apps, '_system' opens the link directly in the external system browser (Chrome/Samsung Internet)
      window.open(updateInfo.downloadUrl, '_system')
    } catch {
      window.open(updateInfo.downloadUrl, '_blank')
    }
  }

  const isMandatory = Boolean(updateInfo.isMandatory)

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (!isMandatory) onClose()
      }}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-emerald-500/30 rounded-3xl shadow-2xl p-6 relative overflow-hidden backdrop-blur-xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-16 -start-16 w-36 h-36 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        {/* Optional Close Button (only if update is not mandatory) */}
        {!isMandatory && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 end-4 w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header with App Update Icon */}
        <div className="flex items-center gap-3.5 mb-5 relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 flex-shrink-0">
            <DownloadCloud className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                تحديث جديد متوفر
              </h2>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono">
                الإصدار الجديد: v{updateInfo.latestVersion}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                (الحالي: v{updateInfo.currentVersion})
              </span>
            </div>
          </div>
        </div>

        {/* Notice Badge */}
        <div className="mb-4 px-3.5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
          {isMandatory ? (
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed font-medium">
            {isMandatory
              ? 'هذا التحديث إلزامي لاستمرار عمل خدمات الأذان والتنبيهات الخلفية بدقة.'
              : 'يتضمن هذا التحديث ميزات جديدة وتحسينات لتجربة استخدام سند المُبرمج.'}
          </p>
        </div>

        {/* Release Notes Box */}
        <div className="mb-6 space-y-1.5">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            ما الجديد في هذا الإصدار:
          </h3>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans max-h-36 overflow-y-auto whitespace-pre-line">
            {updateInfo.releaseNotes}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>تحديث الآن</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          {!isMandatory && (
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm transition-colors cursor-pointer"
            >
              لاحقاً
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
