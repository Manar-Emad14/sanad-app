import React, { useState, useEffect } from 'react'
import { BellRing, Volume2, CheckCircle2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  getNotificationPermission,
  requestNotificationPermission,
  dispatchNotification,
  type NotificationPermissionStatus,
} from '../utils/notifications'
import { playAdhanAudio, unlockGlobalAudio } from '../utils/audio'

export const NotificationPermissionBanner: React.FC = () => {
  const { lang, notificationSettings, setNotificationSettings } = useApp()
  const isAr = lang === 'ar'

  const [permission, setPermission] = useState<NotificationPermissionStatus>('default')
  const [isActivating, setIsActivating] = useState(false)
  const [justActivated, setJustActivated] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const current = getNotificationPermission()
    setPermission(current)
  }, [])

  // If permission is already granted or user dismissed this session, don't show
  if (permission === 'granted' && !justActivated) {
    return null
  }

  if (isDismissed && !justActivated) {
    return null
  }

  const handleActivate = async () => {
    setIsActivating(true)
    try {
      // 1. Unlock audio pipeline with this user gesture
      unlockGlobalAudio()

      // 2. Request native browser notification permission
      const status = await requestNotificationPermission()
      setPermission(status)

      if (status === 'granted') {
        // Ensure settings are enabled
        setNotificationSettings({
          ...notificationSettings,
          prayerAlerts: true,
          soundEnabled: true,
          salawatAudioEnabled: true,
          waqarMessagesEnabled: true,
        })

        // 3. Play test Adhan takbeerat immediately
        playAdhanAudio('short_takbeerat', 90)

        // 4. Dispatch a real system test notification to the lock screen / notification bar
        dispatchNotification({
          title: isAr ? 'سند المُبرمج • تم تفعيل الأذان بنجاح' : 'Sanad Dev • Adhan & Notifications Enabled',
          body: isAr
            ? 'الله أكبر.. تم تفعيل إشعارات الأذان والصلوات الخمس وسماع الصوت بنجاح!'
            : 'Allahu Akbar! Prayer alerts, Adhan audio, and spiritual reminders are now active.',
          type: 'prayer',
          sound: true,
          adhanAudioOption: 'short_takbeerat',
        })

        setJustActivated(true)
        setTimeout(() => {
          setJustActivated(false)
        }, 8000)
      }
    } catch (err) {
      console.warn('Activation error:', err)
    } finally {
      setIsActivating(false)
    }
  }

  if (justActivated) {
    return (
      <div className="mb-4 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border-2 border-emerald-500/40 text-emerald-900 dark:text-emerald-100 shadow-sm flex items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              {isAr ? 'تم تفعيل إشعارات الأذان والصوت بنجاح!' : 'Adhan & Notifications Active!'}
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              {isAr
                ? 'ستصلك الآن تنبيهات الصلوات الخمس في أوقاتها مع صوت الأذان، وأذكار الصلاة على النبي ﷺ والوقار.'
                : 'You will now receive prayer notifications with audio adhan and scheduled spiritual reminders.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/15 relative overflow-hidden border border-emerald-400/30">
      {/* Background Islamic decorative pattern overlay */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-32 h-32 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner">
            <BellRing className="w-6 h-6 text-white animate-bounce" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-black uppercase tracking-wider text-emerald-100">
                {isAr ? 'خطوة ضرورية' : 'Required Step'}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {isAr ? 'تفعيل أذان الصلوات والإشعارات على هاتفك' : 'Enable Prayer Adhan & Notifications'}
              </h3>
            </div>
            <p className="text-xs text-emerald-50 max-w-xl leading-relaxed">
              {permission === 'denied'
                ? (isAr
                    ? 'الإشعارات محظورة في متصفحك. اضغط على علامة القفل 🔒 بجانب رابط الموقع في المتصفح وغيّر إذن الإشعارات إلى (سماح / Allow) لسماع الأذان.'
                    : 'Notifications are blocked. Please click the lock icon next to the URL to enable notifications.')
                : (isAr
                    ? 'لسماع صوت الأذان عند دخول وقت الصلاة وتلقي أذكار «صلّ على النبي ﷺ» ورسائل «وَقار»، يرجى الضغط هنا لمنح إذن المتصفح.'
                    : 'To hear the Adhan at prayer times and receive Salawat and Waqar reminders, please allow browser notifications.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-shrink-0">
          {permission !== 'denied' && (
            <button
              type="button"
              onClick={handleActivate}
              disabled={isActivating}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-75"
            >
              {isActivating ? (
                <>
                  <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                  <span>{isAr ? 'جاري التفعيل...' : 'Activating...'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>{isAr ? 'تفعيل وسماع تجربة الأذان' : 'Enable & Test Adhan'}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title={isAr ? 'إغلاق التنبيه' : 'Dismiss'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
