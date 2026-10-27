import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { SuggestionType } from '../types'
import {
  MessageSquarePlus,
  X,
  Sparkles,
  BookOpen,
  Bug,
  HelpCircle,
  Send,
  CheckCircle2,
  User,
  Mail,
} from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const DeveloperSuggestionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { lang, addSuggestion } = useApp()
  const isAr = lang === 'ar'

  const [type, setType] = useState<SuggestionType>('feature')
  const [details, setDetails] = useState('')
  const [developerName, setDeveloperName] = useState('')
  const [developerContact, setDeveloperContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const typeOptions: {
    id: SuggestionType
    titleAr: string
    titleEn: string
    descAr: string
    descEn: string
    icon: React.ElementType
    color: string
    activeClass: string
  }[] = [
    {
      id: 'feature',
      titleAr: 'اقتراح ميزة جديدة',
      titleEn: 'New Feature Idea',
      descAr: 'أدوات برمجية، إضافات، أو تحسينات في تجربة الاستخدام',
      descEn: 'Developer tools, enhancements, or UI improvements',
      icon: Sparkles,
      color: 'text-emerald-500',
      activeClass:
        'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30',
    },
    {
      id: 'content',
      titleAr: 'إضافة محتوى أو صوتيات',
      titleEn: 'Content / Audio Request',
      descAr: 'أذكار، أدعية للمبرمج، مقاطع صوتية هادئة أو تلاوات',
      descEn: 'Duas, tech dhikr, focus streams or recitations',
      icon: BookOpen,
      color: 'text-teal-500',
      activeClass:
        'bg-teal-500/10 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/30',
    },
    {
      id: 'bug',
      titleAr: 'الإبلاغ عن مشكلة برمجية',
      titleEn: 'Report Bug / Issue',
      descAr: 'خطأ في الواجهة، مشكلة في التوقيت أو تشغيل الصوت',
      descEn: 'UI glitches, timing inaccuracies, or audio bugs',
      icon: Bug,
      color: 'text-rose-500',
      activeClass:
        'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30',
    },
    {
      id: 'other',
      titleAr: 'ملاحظة أو فكرة عامة',
      titleEn: 'General Feedback',
      descAr: 'كلمة تشجيع، استفسار تقني، أو رأي عام في التطبيق',
      descEn: 'General remarks, technical questions, or feedback',
      icon: HelpCircle,
      color: 'text-indigo-500',
      activeClass:
        'bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30',
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!details.trim()) {
      setError(
        isAr
          ? 'يرجى كتابة تفاصيل الاقتراح قبل الإرسال.'
          : 'Please enter details for your suggestion before submitting.'
      )
      return
    }

    addSuggestion({
      type,
      details: details.trim(),
      developerName: developerName.trim() || undefined,
      developerContact: developerContact.trim() || undefined,
    })

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sanad:toast', {
          detail: {
            id: `sug-toast-${Date.now()}`,
            title: isAr ? 'شكراً لمشاركتك القيّمة!' : 'Thank you for your valuable feedback!',
            body: isAr
              ? 'تم استلام اقتراحك وحفظه في صندوق تطوير تطبيق سند المُبرمج.'
              : 'Your suggestion was successfully recorded in the Sanad Dev suggestions hub.',
            type: 'system',
            timestamp: Date.now(),
          },
        })
      )
    }

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setDetails('')
      setDeveloperName('')
      setDeveloperContact('')
      setError(null)
      onClose()
    }, 1800)
  }

  const handleClose = () => {
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-5 end-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {isAr ? 'صندوق اقتراحات المطورين' : 'Developer Suggestions Hub'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'شاركنا أفكارك واقتراحاتك لتطوير تطبيق سند المُبرمج'
                : 'Share your feature ideas and help us improve Sanad Dev App'}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              {isAr ? 'جزاك الله خيراً، تم تسجيل مشاركتك!' : 'Thank you! Your feedback is saved.'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              {isAr
                ? 'سيتم مراجعة فكرتك بعناية في لوحة الإدارة لتحسين التطبيق وإفادة مجتمع المطورين.'
                : 'Your idea will be reviewed in the Admin Panel to continuously elevate the app.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Feedback Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isAr ? 'نوع المشاركة:' : 'Feedback Category:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map((opt) => {
                  const Icon = opt.icon
                  const isSelected = type === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setType(opt.id)}
                      className={`p-3 rounded-2xl text-start transition border cursor-pointer ${
                        isSelected
                          ? opt.activeClass
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${opt.color}`} />
                        <span className="text-xs font-bold block truncate">
                          {isAr ? opt.titleAr : opt.titleEn}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                        {isAr ? opt.descAr : opt.descEn}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Details Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{isAr ? 'تفاصيل الاقتراح أو المشكلة:' : 'Suggestion or Issue Details:'}</span>
                <span className="text-[10px] text-rose-500 font-normal">
                  {isAr ? '* مطلوب' : '* Required'}
                </span>
              </label>
              <textarea
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value)
                  if (error) setError(null)
                }}
                rows={4}
                placeholder={
                  isAr
                    ? 'اكتب تفاصيل فكرتك، مقترحك، أو وصف المشكلة هنا... كل اقتراح محل تقدير واهتمام!'
                    : 'Describe your idea, suggestion, or issue here... Every feedback matters!'
                }
                className="w-full p-3.5 rounded-2xl text-xs bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
              />
              {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
            </div>

            {/* Optional Developer Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? 'اسم المطور (اختياري):' : 'Your Name (optional):'}</span>
                </label>
                <input
                  type="text"
                  value={developerName}
                  onChange={(e) => setDeveloperName(e.target.value)}
                  placeholder={isAr ? 'م. أحمد علي' : 'Alex Dev'}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? 'البريد أو حساب GitHub (اختياري):' : 'Email or GitHub (optional):'}</span>
                </label>
                <input
                  type="text"
                  value={developerContact}
                  onChange={(e) => setDeveloperContact(e.target.value)}
                  placeholder={isAr ? 'dev@example.com / @username' : 'name@dev.io'}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>{isAr ? 'إرسال الاقتراح للمراجعة' : 'Submit Suggestion'}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
