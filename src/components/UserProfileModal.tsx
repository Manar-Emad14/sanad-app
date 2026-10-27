import React, { useState, useEffect } from 'react'
import { User, Sparkles, Check, Heart, Shield, AlertCircle, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { UserGender } from '../types'

export const UserProfileModal: React.FC = () => {
  const { lang, userProfile, updateUserProfile, isProfileModalOpen, setIsProfileModalOpen } = useApp()
  const isAr = lang === 'ar'

  const [name, setName] = useState(userProfile.name || '')
  // If user is already onboarded, load saved gender, otherwise require explicit choice (null)
  const [gender, setGender] = useState<UserGender | null>(() => {
    if (userProfile.onboarded && (userProfile.gender === 'female' || userProfile.gender === 'male')) {
      return userProfile.gender
    }
    return null
  })

  // Sync internal state when modal opens
  useEffect(() => {
    if (isProfileModalOpen) {
      setName(userProfile.name || '')
      if (userProfile.onboarded && (userProfile.gender === 'female' || userProfile.gender === 'male')) {
        setGender(userProfile.gender)
      }
    }
  }, [isProfileModalOpen, userProfile])

  // Allow ESC key to close modal ONLY if user is already onboarded
  useEffect(() => {
    if (!isProfileModalOpen || !userProfile.onboarded) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isProfileModalOpen, userProfile.onboarded, setIsProfileModalOpen])

  // Validation rules: Name must be >= 2 characters, Gender must be explicitly selected
  const isNameValid = name.trim().length >= 2
  const isGenderValid = gender === 'female' || gender === 'male'
  const isFormValid = isNameValid && isGenderValid

  if (!isProfileModalOpen) return null

  const handleSave = () => {
    if (!isFormValid || !gender) return
    updateUserProfile({
      name: name.trim(),
      gender,
      onboarded: true,
    })
    setIsProfileModalOpen(false)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (userProfile.onboarded) {
          setIsProfileModalOpen(false)
        }
      }}
    >
      <div
        className="w-full max-w-md bg-emerald-950/95 dark:bg-emerald-950/95 bg-white/95 text-slate-800 dark:text-emerald-50 border border-emerald-500/30 rounded-2xl shadow-2xl p-6 relative overflow-hidden backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Close Button (Rendered ONLY if already onboarded) */}
        {userProfile.onboarded && (
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 end-4 w-8 h-8 rounded-xl bg-slate-200/60 dark:bg-emerald-900/40 hover:bg-slate-300 dark:hover:bg-emerald-800/60 text-slate-500 dark:text-emerald-300 flex items-center justify-center transition-colors cursor-pointer z-10"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -start-16 w-36 h-36 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-5 relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isAr ? 'مرحباً بك في سَنَد المُبرمج' : 'Welcome to Sanad Dev'}
              </h2>
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
            </div>
            <p className="text-xs text-slate-500 dark:text-emerald-300/80 mt-0.5">
              {isAr
                ? 'يرجى إتمام البيانات الإلزامية لتخصيص التجربة والبدء'
                : 'Please complete your setup to personalize your experience'}
            </p>
          </div>
        </div>

        {/* Mandatory Requirement Badge */}
        <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-emerald-500" />
          <span className="text-[11px] font-medium leading-relaxed">
            {isAr
              ? 'إعداد إلزامي لمرة واحدة: لتخصيص الأذكار، وتنبيهات الصلاة، ورسائل وقار'
              : 'Mandatory one-time setup to tailor prayer alerts, reflections & Waqar reminders'}
          </span>
        </div>

        {/* Name Input */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-200">
              {isAr ? 'اسمك الكريم أو الكنية المفضلة *' : 'Your Name or Preferred Title *'}
            </label>
            <span
              className={`text-[10px] font-semibold ${
                isNameValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
              }`}
            >
              {isAr ? 'حرفان على الأقل' : 'Min 2 characters'}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? 'مثال: عبد الرحمن، فاطمة، أبو بكر...' : 'e.g., Omar, Sarah, Rayan...'}
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-emerald-900/40 border border-slate-300 dark:border-emerald-600/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-400/40"
              maxLength={40}
              autoFocus
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-emerald-400/70 leading-relaxed">
            {isAr
              ? 'سيُضاف اسمك تلقائياً لرسائل التحفيز والسكينة وتنبيهات الصلوات (مثل: "يا [اسمك]، أقبل على ربك...")'
              : 'Your name will be gently woven into motivation and prayer reminders (e.g., "O [Name], rely on Allah...")'}
          </p>
        </div>

        {/* Gender Selection for Waqar Reminders */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-emerald-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'حدد صفتك لتخصيص رسائل «وَقار» *' : 'Choose Your Theme *'}</span>
            </label>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isGenderValid
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isGenderValid ? (isAr ? 'تم الاختيار' : 'Selected') : (isAr ? 'إلزامي' : 'Required')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Sister Option */}
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer relative ${
                gender === 'female'
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-md shadow-emerald-500/15 ring-2 ring-emerald-500/30'
                  : 'bg-slate-50 dark:bg-emerald-900/20 border-slate-200 dark:border-emerald-800/40 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  {isAr ? 'أخت' : 'Sister'}
                </span>
                {gender === 'female' && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-emerald-300/80 leading-normal">
                {isAr
                  ? 'تنبيهات تركز على الحجاب، العفة، والوقار الإيماني للمهندسة المسلمة'
                  : 'Modesty, hijab, and spiritual dignity for Muslim engineers'}
              </p>
            </button>

            {/* Brother Option */}
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer relative ${
                gender === 'male'
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-md shadow-emerald-500/15 ring-2 ring-emerald-500/30'
                  : 'bg-slate-50 dark:bg-emerald-900/20 border-slate-200 dark:border-emerald-800/40 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  {isAr ? 'أخ' : 'Brother'}
                </span>
                {gender === 'male' && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-emerald-300/80 leading-normal">
                {isAr
                  ? 'تنبيهات تركز على غض البصر، المروءة، القوامة، وأمانة العمل والبرمجة'
                  : 'Lowering the gaze, chivalry, family guardianship, and professional integrity'}
              </p>
            </button>
          </div>
        </div>

        {/* Mandatory Action Button (Strictly Single Button, Disabled Until Complete) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isFormValid}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isFormValid
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer active:scale-[0.98] shadow-emerald-600/25'
                : 'bg-slate-200 dark:bg-emerald-950/60 text-slate-400 dark:text-emerald-600/40 cursor-not-allowed border border-slate-300/60 dark:border-emerald-800/30'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>
              {isAr
                ? userProfile.onboarded
                  ? 'حفظ التعديلات'
                  : 'حفظ ومتابعة الدخول للتطبيق'
                : userProfile.onboarded
                ? 'Save Changes'
                : 'Save & Enter Sanad'}
            </span>
          </button>

          {/* Realtime Feedback Notice */}
          {!isFormValid && (
            <p className="text-[11px] text-center text-slate-500 dark:text-emerald-400/60 mt-2 font-medium">
              {!isNameValid && !isGenderValid
                ? (isAr ? 'يرجى كتابة اسمك واختيار صفتك (أخت / أخ) للتفعيل' : 'Please enter your name and select a theme to proceed')
                : !isNameValid
                ? (isAr ? 'يرجى كتابة حرفين على الأقل في حقل الاسم' : 'Please enter at least 2 characters for your name')
                : (isAr ? 'يرجى تحديد صفتك (أخت أو أخ)' : 'Please select your theme (Sister or Brother)')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
