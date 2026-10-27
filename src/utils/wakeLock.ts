/**
 * Prayer Audio Guard & Screen WakeLock Manager
 * Prevents mobile browsers (Chrome / Android / iOS) from aggressively throttling
 * timers and suspending the audio engine when the device is idle.
 */

let wakeLockSentinel: any = null
let keepAliveTimer: ReturnType<typeof setInterval> | null = null
let isGuardActive = false

/**
 * Request Screen WakeLock if supported by the browser
 */
export async function requestScreenWakeLock(): Promise<boolean> {
  if (typeof window === 'undefined' || !('wakeLock' in navigator)) {
    return false
  }

  try {
    wakeLockSentinel = await (navigator as any).wakeLock.request('screen')
    wakeLockSentinel.addEventListener('release', () => {
      wakeLockSentinel = null
    })
    return true
  } catch (err) {
    console.warn('WakeLock request error:', err)
    return false
  }
}

/**
 * Release active screen wake lock
 */
export async function releaseScreenWakeLock(): Promise<void> {
  if (wakeLockSentinel) {
    try {
      await wakeLockSentinel.release()
      wakeLockSentinel = null
    } catch {}
  }
}

/**
 * Start inaudible background audio heartbeat that tells mobile OS
 * this tab has an active media session, keeping the timer running.
 */
export function startPrayerKeepAlive(): void {
  if (typeof window === 'undefined' || isGuardActive) return
  isGuardActive = true

  // 1. Try screen wake lock
  requestScreenWakeLock().catch(() => {})

  // Auto re-acquire wake lock on visibility change
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // 2. Start silent keep-alive pulse every 30s
  if (keepAliveTimer) clearInterval(keepAliveTimer)
  keepAliveTimer = setInterval(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return

      const ctx = new AudioContextClass()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      // Inaudible frequency & near-zero gain (0.0001)
      osc.frequency.value = 40
      gain.gain.value = 0.0001

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      setTimeout(() => {
        try {
          osc.stop()
          ctx.close().catch(() => {})
        } catch {}
      }, 150)
    } catch {}
  }, 30000)
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && isGuardActive) {
    requestScreenWakeLock().catch(() => {})
  }
}

/**
 * Stop prayer guard
 */
export function stopPrayerKeepAlive(): void {
  isGuardActive = false
  releaseScreenWakeLock().catch(() => {})
  document.removeEventListener('visibilitychange', handleVisibilityChange)

  if (keepAliveTimer) {
    clearInterval(keepAliveTimer)
    keepAliveTimer = null
  }
}

export function isPrayerGuardActive(): boolean {
  return isGuardActive
}
