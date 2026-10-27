import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Download,
  Laptop,
  Smartphone,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react'

interface PwaInstallModalProps {
  isOpen: boolean
  onClose: () => void
  onDirectInstall?: () => void
  canDirectInstall?: boolean
  isAr?: boolean
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  onDirectInstall,
  canDirectInstall = false,
  isAr = true,
}) => {
  const [copied, setCopied] = useState<boolean>(false)

  if (!isOpen) return null

  const isIOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream

  const handleCopyLink = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.origin)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch (e) {
      console.warn('Copy link failed:', e)
    }
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden text-white ring-1 ring-white/10 space-y-5">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -end-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 end-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30 flex-shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-white">
                {isAr ? 'تثبيت تطبيق سند المُبرمج' : 'Install Sanad Dev App'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'استمتع بتجربة تطبيق سطح المكتب والهاتف الكاملة بدون شريط المتصفح'
                : 'Experience full standalone desktop and mobile offline app'}
            </p>
          </div>
        </div>

        {/* If direct install prompt is ready */}
        {canDirectInstall && onDirectInstall && (
          <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-start space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'التثبيت الفوري متاح الآن بنقرة واحدة!' : 'One-click install is ready!'}</span>
            </div>
            <button
              onClick={() => {
                onDirectInstall()
                onClose()
              }}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md shadow-emerald-950/40 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تثبيت الآن على هذا الجهاز' : 'Install Now on this device'}</span>
            </button>
          </div>
        )}

        {/* Notice when direct install prompt is unavailable (e.g. WhatsApp / In-App browser / Chrome heuristics) */}
        {!canDirectInstall && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-start space-y-2.5">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-300">
                  {isAr ? 'تنبيه تثبيت التطبيق:' : 'Installation Notice:'}
                </p>
                <p className="text-xs text-amber-100 font-semibold leading-relaxed mt-1">
                  {isAr
                    ? 'يرجى فتح الرابط عبر متصفح Chrome الرسمي، ثم الضغط على (⋮) واختيار تثبيت التطبيق'
                    : 'Please open this link in the official Chrome browser, tap (⋮), and choose "Install App"'}
                </p>
              </div>
            </div>
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copied
                    ? (isAr ? 'تم نسخ الرابط!' : 'Copied!')
                    : (isAr ? 'نسخ رابط التطبيق لفتحه في Chrome' : 'Copy link for Chrome')}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step-by-Step Device Guides */}
        <div className="space-y-3 text-start">
          {/* 1. iOS / iPhone Guide */}
          <div className={`p-3.5 rounded-2xl border transition-all ${isIOS ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-800/40 border-slate-700/60'}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                {isAr ? 'على هواتف آيفون وiPad (Safari):' : 'On iPhone & iPad (Safari):'}
              </span>
              {isIOS && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {isAr ? 'جهازك الحالي' : 'Your Device'}
                </span>
              )}
            </div>
            <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside leading-relaxed ps-1">
              <li className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{isAr ? 'اضغط على زر المشاركة (Share) في شريط المتصفح السفلي.' : 'Tap the Share icon at the bottom of Safari.'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <PlusSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{isAr ? 'مرر لأسفل واختر «إضافة إلى الشاشة الرئيسية» (Add to Home Screen).' : 'Scroll down and tap "Add to Home Screen".'}</span>
              </li>
            </ol>
          </div>

          {/* 2. Desktop / Laptop (Chrome / Edge / Opera) */}
          <div className={`p-3.5 rounded-2xl border transition-all ${!isIOS ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-800/40 border-slate-700/60'}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Laptop className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                {isAr ? 'على أجهزة الكمبيوتر واللابتوب (Chrome / Edge):' : 'On Desktop & Laptop (Chrome / Edge):'}
              </span>
              {!isIOS && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {isAr ? 'جهازك الحالي' : 'Your Device'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed ps-1">
              {isAr
                ? 'انقر على أيقونة التثبيت ⊕ في أقصى يمين شريط عنوان المتصفح (URL)، أو افتح القائمة (⋮) ثم اضغط «تثبيت سند المُبرمج».'
                : 'Click the install icon in the browser address bar, or open the menu (⋮) and select "Install Sanad Dev".'}
            </p>
          </div>

          {/* 3. Android Guide */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center gap-2 mb-1.5">
              <Smartphone className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-slate-200">
                {isAr ? 'على هواتف أندرويد (Chrome / Samsung):' : 'On Android (Chrome / Samsung):'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed ps-1">
              {isAr
                ? 'اضغط على قائمة المتصفح (⋮) ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».'
                : 'Tap the browser menu (⋮) and choose "Install App" or "Add to Home screen".'}
            </p>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{isAr ? 'يعمل بدون إنترنت (Offline)' : 'Works fully offline'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{isAr ? 'أذان وإشعارات مستقلة' : 'Native Adhan alerts'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{isAr ? 'سرعة فائقة وخفيف جداً' : 'Fast and lightweight'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{isAr ? 'بدون شريط متصفح مزعج' : 'Standalone window'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
          >
            {isAr ? 'حسناً، فهمت' : 'Got it'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
