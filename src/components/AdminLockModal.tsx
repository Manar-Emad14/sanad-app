import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  LogIn,
} from 'lucide-react'

export const AdminLockModal: React.FC = () => {
  const {
    lang,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    loginAdmin,
  } = useApp()

  const isAr = lang === 'ar'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isPasswordModalOpen) return null

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!username.trim() || !password.trim()) {
      setErrorMessage(
        isAr
          ? 'يرجى إدخال اسم المستخدم وكلمة المرور للمتابعة.'
          : 'Please enter both username and password.'
      )
      return
    }

    setIsSubmitting(true)

    // Verify credentials via centralized AppContext method
    const success = loginAdmin(username.trim(), password.trim())

    if (success) {
      setUsername('')
      setPassword('')
      setErrorMessage(null)
      setShowPassword(false)
    } else {
      setErrorMessage(
        isAr
          ? 'اسم المستخدم أو كلمة المرور غير صحيحة! يرجى التحقق من البيانات والمحاولة مجدداً.'
          : 'Invalid username or password! Please verify and try again.'
      )
    }

    setIsSubmitting(false)
  }

  const handleClose = () => {
    setIsPasswordModalOpen(false)
    setUsername('')
    setPassword('')
    setErrorMessage(null)
    setShowPassword(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white ring-1 ring-white/10">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -end-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-5 end-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-white">
                {isAr ? 'تسجيل الدخول للوحة التحكم' : 'Admin Portal Login'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'يرجى إدخال بيانات المشرف للوصول لإعدادات النظام'
                : 'Enter admin credentials to unlock management console'}
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isAr ? 'اسم المستخدم (Username)' : 'Username'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (errorMessage) setErrorMessage(null)
                }}
                autoFocus
                placeholder={isAr ? 'اسم المستخدم' : 'Enter username'}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm font-sans transition"
              />
              <User className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Password Input with Show/Hide */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isAr ? 'كلمة المرور (Password)' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errorMessage) setErrorMessage(null)
                }}
                placeholder={isAr ? 'كلمة المرور' : 'Enter password'}
                className="w-full ps-10 pe-11 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm font-mono tracking-wider transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition cursor-pointer"
                title={
                  showPassword
                    ? isAr
                      ? 'إخفاء كلمة المرور'
                      : 'Hide password'
                    : isAr
                    ? 'إظهار كلمة المرور'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-300" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message Alert (Red) */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2 animate-fade-in shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-950/40 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isAr ? 'تسجيل الدخول' : 'Log In'}</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
