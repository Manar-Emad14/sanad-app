import type { AdhanAudioOption } from '../types'

// Shared AudioContext for procedural synthesizers and audio unlock
let sharedAudioCtx: AudioContext | null = null

// Audio URLs for Adhan options with robust fallback chain
// 1. Local Vite asset (served from /public/audio/) - authentic Egyptian Adhan (Sheikh Mohamed Refaat)
// 2. High-availability jsdelivr CDN with Access-Control-Allow-Origin: *
// 3. Wikimedia Commons fallback
export const ADHAN_AUDIO_URLS: Record<Exclude<AdhanAudioOption, 'serene_chime'>, string[]> = {
  makkah: [
    '/audio/makkah-adhan.mp3',
    'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Ali_Ibn_Ahmad_Mala_1_-_Al_Haram_Al_Maki_(%D8%B9%D9%84%D9%8A_%D8%A8%D9%86_%D8%A3%D8%AD%D9%85%D8%AF_%D9%85%D9%84%D8%A7_-_%D8%A7%D9%84%D8%AD%D8%B1%D9%85_%D8%A7%D9%84%D9%85%D9%83%D9%8A).mp3',
    'https://upload.wikimedia.org/wikipedia/commons/7/7d/The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3',
  ],
  madinah: [
    '/audio/madinah-adhan.mp3',
    'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Adhan_Al_Haram_Al_Madani_-_Al_Madinah_1_(%D8%A3%D8%B0%D8%A7%D9%86_%D8%A7%D9%84%D8%AD%D8%B1%D9%85_%D8%A7%D9%84%D9%85%D8%AF%D9%86%D9%8A_-_%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%86%D8%A9_%D8%A7%D9%84%D9%85%D9%86%D9%88%D8%B1%D8%A9).mp3',
    '/audio/cairo-adhan.mp3',
  ],
  cairo_refaat: [
    '/audio/cairo-adhan.mp3',
    'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Muhammad_Refaat_-_Cairo_(%D9%85%D8%AD%D9%85%D8%AF_%D8%B1%D9%81%D8%B9%D8%AA_-_%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9).mp3',
    'https://upload.wikimedia.org/wikipedia/commons/7/7d/The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3',
  ],
  cairo_mustafa: [
    '/audio/mustafa-ismail-adhan.mp3',
    'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Mustafa_Ismail_-_Egypt_(%D9%85%D8%B5%D8%B7%D9%81%D9%89_%D8%A5%D8%B3%D9%85%D8%A7%D8%B9%D9%8A%D9%84_-_%D9%85%D8%B5%D8%B1).mp3',
    '/audio/cairo-adhan.mp3',
  ],
  alaqsa: [
    '/audio/alaqsa-adhan.mp3',
    'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Adhan_Al_Aqsa_-_Jerusalem_(%D8%A3%D8%B0%D8%A7%D9%86_%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF_%D8%A7%D9%84%D8%A3%D9%82%D8%B5%D9%89_-_%D8%A7%D9%84%D9%82%D8%AF%D8%B3).mp3',
    '/audio/cairo-adhan.mp3',
  ],
  full_adhan: [
    '/audio/cairo-adhan.mp3',
    'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Muhammad_Refaat_-_Cairo_(%D9%85%D8%AD%D9%85%D8%AF_%D8%B1%D9%81%D8%B9%D8%AA_-_%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9).mp3',
    'https://upload.wikimedia.org/wikipedia/commons/7/7d/The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3',
  ],
  short_takbeerat: [
    '/audio/takbeerat.mp3',
    '/audio/cairo-adhan.mp3',
    'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Muhammad_Refaat_-_Cairo_(%D9%85%D8%AD%D9%85%D8%AF_%D8%B1%D9%81%D8%B9%D8%AA_-_%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9).mp3',
    'https://upload.wikimedia.org/wikipedia/commons/7/7d/The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3',
  ],
}

export interface AdhanOptionInfo {
  id: AdhanAudioOption
  labelAr: string
  labelEn: string
  subAr: string
  subEn: string
  badge?: string
}

export const ADHAN_OPTIONS_LIST: AdhanOptionInfo[] = [
  {
    id: 'makkah',
    labelAr: 'أذان الحرم المكي الشريف (السعودية)',
    labelEn: 'Makkah Holy Mosque Adhan',
    subAr: 'الشيخ علي أحمد ملا (أذان مكة الخاشع)',
    subEn: 'Sheikh Ali Mulla (Iconic Makkah)',
    badge: 'مكة',
  },
  {
    id: 'madinah',
    labelAr: 'أذان المسجد النبوي الشريف (المدينة المنورة)',
    labelEn: 'Madinah Prophet Mosque Adhan',
    subAr: 'المدينة المنورة • سكينة وخشوع مهيب',
    subEn: 'Al-Madinah Al-Munawwarah',
    badge: 'المدينة',
  },
  {
    id: 'cairo_refaat',
    labelAr: 'أذان التلفزيون المصري الرسمي (الشيخ محمد رفعت)',
    labelEn: 'Egyptian Radio (Sheikh Refaat)',
    subAr: 'الصوت التراثي الأصيل لإذاعة القرآن بالقاهرة',
    subEn: 'Classic Cairo Ramadan & Friday Adhan',
    badge: 'مصر',
  },
  {
    id: 'cairo_mustafa',
    labelAr: 'أذان الشيخ مصطفى إسماعيل (مصر)',
    labelEn: 'Sheikh Mustafa Ismail Adhan',
    subAr: 'تلاوة وأذان هادئ بمقام الصبا والبيات',
    subEn: 'Iconic Egyptian Recitation & Adhan',
    badge: 'مصر',
  },
  {
    id: 'alaqsa',
    labelAr: 'أذان المسجد الأقصى المبارك (القدس)',
    labelEn: 'Al-Aqsa Mosque Adhan (Jerusalem)',
    subAr: 'من رحاب القدس الشريف وفلسطين الحبيبة',
    subEn: 'Holy Jerusalem & Palestine',
    badge: 'الأقصى',
  },
  {
    id: 'short_takbeerat',
    labelAr: 'تكبيرات مقتضبة للتركيز البرمجي',
    labelEn: 'Short Takbeerat',
    subAr: '«الله أكبر.. الله أكبر» تنبيه هادئ (15 ثانية)',
    subEn: 'Brief focus alert (15s)',
    badge: 'مختصر',
  },
  {
    id: 'serene_chime',
    labelAr: 'رنين توافقي هادئ',
    labelEn: 'Serene Harmonic Chime',
    subAr: 'نغمة تصنيعية صامتة تعمل بدون اتصال',
    subEn: 'Procedural offline synthesizer chime',
    badge: 'رنين',
  },
]

// Stream fallback map for high availability (Cairo Quran Radio live stream & nature ambient)
export const FOCUS_FALLBACKS: Record<string, string[]> = {
  'https://n0a.radiojar.com/8s5u8tpdtwzuv': [
    'https://stream.zeno.fm/f3wvbbqmdg8uv',
    'https://stream.radiojar.com/8s5u8tpdtwzuv',
    'https://n08.radiojar.com/8s5u82pm61duv',
    'https://backup.qurango.net/radio/cairo',
    'https://n12.radiojar.com/8s5u5tpdtwzuv',
  ],
  'https://n12.radiojar.com/8s5u5tpdtwzuv': [
    'https://stream.zeno.fm/f3wvbbqmdg8uv',
    'https://n0a.radiojar.com/8s5u8tpdtwzuv',
    'https://stream.radiojar.com/8s5u8tpdtwzuv',
    'https://n08.radiojar.com/8s5u82pm61duv',
  ],
  'https://stream.zeno.fm/f3wvbbqmdg8uv': [
    'https://n0a.radiojar.com/8s5u8tpdtwzuv',
    'https://stream.radiojar.com/8s5u8tpdtwzuv',
    'https://n08.radiojar.com/8s5u82pm61duv',
  ],
  'https://n08.radiojar.com/8s5u82pm61duv': [
    'https://stream.zeno.fm/f3wvbbqmdg8uv',
    'https://n0a.radiojar.com/8s5u8tpdtwzuv',
  ],
  'https://stream.radiojar.com/8s5u8tpdtwzuv': [
    'https://stream.zeno.fm/f3wvbbqmdg8uv',
    'https://n0a.radiojar.com/8s5u8tpdtwzuv',
  ],
  'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg': [
    'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
  ],
  'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg': [
    'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg',
  ],
}

// Generate candidate fallback URLs including dynamic mp3quran mirrors
export function getFocusStreamCandidates(initialUrl: string): string[] {
  const result: string[] = [initialUrl]

  if (FOCUS_FALLBACKS[initialUrl]) {
    for (const fb of FOCUS_FALLBACKS[initialUrl]) {
      if (!result.includes(fb)) result.push(fb)
    }
  }

  // Auto-generate mirror fallback for mp3quran streaming CDN
  if (initialUrl.includes('backup.qurango.net')) {
    const mirror = initialUrl.replace('backup.qurango.net', 'qurango.net')
    if (!result.includes(mirror)) result.push(mirror)
  } else if (initialUrl.includes('qurango.net')) {
    const mirror = initialUrl.replace('qurango.net', 'backup.qurango.net')
    if (!result.includes(mirror)) result.push(mirror)
  }

  return result
}

// 1. Get or initialize unlocked AudioContext on user interaction
export function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return null

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass()
    }

    // Always resume suspended AudioContext on user gesture
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch((err) => {
        console.warn('AudioContext resume warning:', err)
      })
    }

    return sharedAudioCtx
  } catch (e) {
    console.error('Failed to initialize or resume AudioContext:', e)
    return null
  }
}

// 2. Procedural Web Audio API chime synthesizer (Serene harmonic arpeggio)
export function playSereneChime() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Frequencies for a meditative, peaceful harmony (E4, G#4, B4, E5)
    const notes = [329.63, 415.3, 493.88, 659.25]

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      // Stagger notes slightly for an arpeggiated melodic chime
      const startTime = now + idx * 0.16
      const duration = 2.4

      gain.gain.setValueAtTime(0.0001, startTime)
      gain.gain.exponentialRampToValueAtTime(0.28 / notes.length, startTime + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + duration)
    })

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sanad:adhan-playing', { detail: { option: 'serene_chime' } })
      )
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('sanad:adhan-stopped'))
      }, 2500)
    }
  } catch (e) {
    console.error('Web Audio synthesis playback error:', e)
  }
}

/**
 * 3. Centralized Global Audio Manager Singleton
 * Guarantees that only ONE sound stream can exist and play at any given moment.
 * Immediately purges any running or buffering audio when another sound is initiated.
 */
export class GlobalAudioManager {
  private static instance: GlobalAudioManager | null = null
  private sharedAudio: HTMLAudioElement | null = null
  private salawatAudio: HTMLAudioElement | null = null
  private waqarAudio: HTMLAudioElement | null = null
  private savedFocusVolume: number | null = null
  private adhanTimeoutId: number | null = null
  private salawatTimeoutId: number | null = null
  private currentMode: 'focus' | 'adhan' | null = null
  private currentIdentifier: string | null = null
  private currentStreamToken: number = 0

  private constructor() {
    // Singleton constructor
  }

  public static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager()
    }
    return GlobalAudioManager.instance
  }

  /**
   * Stop ALL running audio decisively across the entire application.
   * Cancels any pending retries, removes event listeners, pauses, clears src, and calls load().
   */
  public stopAll(options?: { silent?: boolean }): void {
    // Invalidate any ongoing asynchronous stream attempts or retries
    this.currentStreamToken++

    if (this.adhanTimeoutId !== null) {
      clearTimeout(this.adhanTimeoutId)
      this.adhanTimeoutId = null
    }

    if (this.salawatTimeoutId !== null) {
      clearTimeout(this.salawatTimeoutId)
      this.salawatTimeoutId = null
    }

    if (this.salawatAudio) {
      try {
        this.salawatAudio.onerror = null
        this.salawatAudio.onended = null
        this.salawatAudio.onplaying = null
        this.salawatAudio.pause()
        this.salawatAudio.currentTime = 0
        this.salawatAudio.removeAttribute('src')
        this.salawatAudio.src = ''
        this.salawatAudio.load()
      } catch (e) {
        console.warn('Error resetting salawat audio:', e)
      }
    }

    if (this.waqarAudio) {
      try {
        this.waqarAudio.onerror = null
        this.waqarAudio.onended = null
        this.waqarAudio.onplaying = null
        this.waqarAudio.pause()
        this.waqarAudio.currentTime = 0
        this.waqarAudio.removeAttribute('src')
        this.waqarAudio.src = ''
        this.waqarAudio.load()
      } catch (e) {
        console.warn('Error resetting waqar audio:', e)
      }
    }

    if (this.sharedAudio) {
      try {
        // Clean event listeners to prevent zombie callbacks
        this.sharedAudio.onerror = null
        this.sharedAudio.onended = null
        this.sharedAudio.onplaying = null
        this.sharedAudio.onpause = null
        this.sharedAudio.oncanplay = null

        this.sharedAudio.pause()
        this.sharedAudio.currentTime = 0
        this.sharedAudio.removeAttribute('src')
        this.sharedAudio.src = ''
        // .load() tells the browser to immediately abort any pending network stream/buffer
        this.sharedAudio.load()
      } catch (e) {
        console.warn('Error resetting shared audio element:', e)
      }
    }

    this.savedFocusVolume = null
    const prevMode = this.currentMode
    this.currentMode = null
    this.currentIdentifier = null

    if (!options?.silent && typeof window !== 'undefined') {
      if (prevMode === 'focus' || prevMode === null) {
        window.dispatchEvent(new CustomEvent('sanad:focus-audio-stopped'))
      }
      if (prevMode === 'adhan' || prevMode === null) {
        window.dispatchEvent(new CustomEvent('sanad:adhan-stopped'))
      }
      window.dispatchEvent(new CustomEvent('sanad:salawat-stopped'))
    }
  }

  private getOrCreateAudio(): HTMLAudioElement {
    if (!this.sharedAudio) {
      this.sharedAudio = new Audio()
    }
    this.sharedAudio.crossOrigin = 'anonymous'
    this.sharedAudio.preload = 'auto'
    return this.sharedAudio
  }

  public playFocus(initialUrl: string, volumePercent: number = 60): void {
    // 1. Unconditionally stop any previously playing audio
    this.stopAll()
    getAudioContext()

    const attemptToken = ++this.currentStreamToken
    const candidates = getFocusStreamCandidates(initialUrl)
    let candidateIndex = 0

    const audio = this.getOrCreateAudio()
    audio.volume = Math.min(1, Math.max(0, volumePercent / 100))
    this.currentMode = 'focus'
    this.currentIdentifier = initialUrl

    const tryCandidate = (url: string) => {
      // Guard against stale stream attempts
      if (this.currentStreamToken !== attemptToken) return

      // Detach prior listeners on the shared element
      audio.onerror = null
      audio.onended = null
      audio.onplaying = null
      audio.onstalled = null

      let stallTimer: ReturnType<typeof setTimeout> | null = null

      const clearStallTimer = () => {
        if (stallTimer) {
          clearTimeout(stallTimer)
          stallTimer = null
        }
      }

      const handleFallback = (err?: unknown) => {
        clearStallTimer()
        audio.onerror = null
        audio.onstalled = null
        audio.onplaying = null
        if (this.currentStreamToken !== attemptToken) return
        console.warn(`Focus stream candidate failed on ${url}:`, err)
        candidateIndex++
        if (candidateIndex < candidates.length) {
          console.log(
            `Switching to focus stream fallback (${candidateIndex + 1}/${candidates.length}): ${candidates[candidateIndex]}`
          )
          tryCandidate(candidates[candidateIndex])
        } else {
          console.error('All focus audio stream candidates failed.')
          this.stopAll()
        }
      }

      audio.onerror = (e) => {
        handleFallback(e)
      }

      // Handle stream stalls gracefully (e.g. buffering hung for > 6 seconds)
      audio.onstalled = () => {
        if (!stallTimer) {
          stallTimer = setTimeout(() => {
            if (this.currentStreamToken === attemptToken && (audio.paused || audio.readyState < 2)) {
              console.warn(`Focus stream stalled on ${url}, switching to mirror...`)
              handleFallback(new Error('Stream stalled'))
            }
          }, 6000)
        }
      }

      audio.onplaying = () => {
        clearStallTimer()
      }

      audio.src = url
      audio.load()

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (this.currentStreamToken !== attemptToken) {
              // User already stopped or switched while promise was resolving
              clearStallTimer()
              audio.pause()
              audio.src = ''
              return
            }
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('sanad:focus-audio-playing', { detail: { url: initialUrl } })
              )
            }
          })
          .catch((err) => {
            handleFallback(err)
          })
      }
    }

    tryCandidate(candidates[0])
  }

  public playAdhan(
    option: AdhanAudioOption = 'short_takbeerat',
    volumePercent: number = 85
  ): void {
    // 1. Unconditionally stop any previously playing audio (focus, other adhan, etc.)
    this.stopAll()
    getAudioContext()

    if (option === 'serene_chime') {
      playSereneChime()
      return
    }

    const attemptToken = ++this.currentStreamToken
    const urls = ADHAN_AUDIO_URLS[option] || ADHAN_AUDIO_URLS.short_takbeerat
    let urlIndex = 0

    const audio = this.getOrCreateAudio()
    audio.volume = Math.min(1, Math.max(0, volumePercent / 100))
    this.currentMode = 'adhan'
    this.currentIdentifier = option

    // Auto-stop for short takbeerat after 16s
    if (option === 'short_takbeerat') {
      this.adhanTimeoutId = window.setTimeout(() => {
        if (this.currentStreamToken === attemptToken) {
          this.stopAll()
        }
      }, 16000)
    }

    const tryCandidate = (url: string) => {
      if (this.currentStreamToken !== attemptToken) return

      audio.onerror = null
      audio.onended = null

      audio.onended = () => {
        if (this.currentStreamToken === attemptToken) {
          this.stopAll()
        }
      }

      const handleFallback = (err?: unknown) => {
        if (this.currentStreamToken !== attemptToken) return
        console.warn(`Adhan audio failed on ${url}:`, err)
        urlIndex++
        if (urlIndex < urls.length) {
          console.log(`Trying adhan fallback (${urlIndex + 1}/${urls.length}): ${urls[urlIndex]}`)
          tryCandidate(urls[urlIndex])
        } else {
          console.warn('All adhan audio URLs failed. Falling back to synthesized chime.')
          this.stopAll()
          playSereneChime()
        }
      }

      audio.onerror = (e) => {
        handleFallback(e)
      }

      audio.src = url
      audio.load()

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (this.currentStreamToken !== attemptToken) {
              audio.pause()
              audio.src = ''
              return
            }
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('sanad:adhan-playing', { detail: { option } })
              )
              try {
                if ('mediaSession' in navigator) {
                  const optInfo = ADHAN_OPTIONS_LIST.find((o) => o.id === option)
                  navigator.mediaSession.metadata = new MediaMetadata({
                    title: optInfo ? optInfo.labelAr : 'أذان الصلاة • الله أكبر',
                    artist: 'سند المُبرمج • بتوقيت القاهرة',
                    album: 'مواقيت الصلاة والأذان',
                    artwork: [
                      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
                    ],
                  })
                  navigator.mediaSession.setActionHandler('stop', () => this.stopAll())
                  navigator.mediaSession.setActionHandler('pause', () => this.stopAll())
                }
              } catch (e) {}
            }
          })
          .catch((err) => {
            handleFallback(err)
          })
      }
    }

    tryCandidate(urls[0])
  }

  public setVolume(volumePercent: number): void {
    if (this.sharedAudio) {
      this.sharedAudio.volume = Math.min(1, Math.max(0, volumePercent / 100))
    }
  }

  public isFocusPlaying(): boolean {
    return (
      this.currentMode === 'focus' &&
      this.sharedAudio !== null &&
      !this.sharedAudio.paused
    )
  }

  public isAdhanPlaying(): boolean {
    return (
      this.currentMode === 'adhan' &&
      this.sharedAudio !== null &&
      !this.sharedAudio.paused
    )
  }

  public isAnyPlaying(): boolean {
    return (
      (this.sharedAudio !== null && !this.sharedAudio.paused) ||
      (this.salawatAudio !== null && !this.salawatAudio.paused)
    )
  }

  public isSalawatPlaying(): boolean {
    return this.salawatAudio !== null && !this.salawatAudio.paused
  }

  public getCurrentTrack(): string | null {
    return this.currentIdentifier
  }

  /**
   * Play the periodic Salawat reminder audio ("صلّ على النبي ﷺ")
   * Smoothly ducks background focus audio volume (e.g., Cairo Quran Radio/Rain) to ~15%,
   * plays the serene Salawat audio clip, and restores the original volume upon completion.
   */
  public playSalawat(volumePercent: number = 90): void {
    // If Adhan is currently active, do not play Salawat on top of Adhan
    if (this.isAdhanPlaying()) {
      console.log('Adhan is currently playing, skipping Salawat reminder')
      return
    }

    getAudioContext()

    // Duck background audio if focus track is running
    if (this.isFocusPlaying() && this.sharedAudio) {
      if (this.savedFocusVolume === null) {
        this.savedFocusVolume = this.sharedAudio.volume
      }
      this.sharedAudio.volume = Math.max(0.08, this.savedFocusVolume * 0.15)
    }

    if (!this.salawatAudio) {
      this.salawatAudio = new Audio()
    }

    const audio = this.salawatAudio
    audio.crossOrigin = 'anonymous'
    audio.preload = 'auto'
    audio.volume = Math.min(1, Math.max(0, volumePercent / 100))

    if (this.salawatTimeoutId !== null) {
      clearTimeout(this.salawatTimeoutId)
      this.salawatTimeoutId = null
    }

    const restoreDucking = () => {
      if (this.savedFocusVolume !== null && this.sharedAudio && !this.sharedAudio.paused) {
        const targetVol = this.savedFocusVolume
        this.savedFocusVolume = null
        let step = 0
        const startVol = this.sharedAudio.volume
        const fadeInterval = setInterval(() => {
          step++
          if (!this.sharedAudio || this.sharedAudio.paused || step >= 10) {
            if (this.sharedAudio) this.sharedAudio.volume = targetVol
            clearInterval(fadeInterval)
            return
          }
          this.sharedAudio.volume = startVol + (targetVol - startVol) * (step / 10)
        }, 50)
      } else {
        this.savedFocusVolume = null
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sanad:salawat-stopped'))
      }
    }

    const onDone = () => {
      audio.onerror = null
      audio.onended = null
      if (this.salawatTimeoutId !== null) {
        clearTimeout(this.salawatTimeoutId)
        this.salawatTimeoutId = null
      }
      restoreDucking()
    }

    audio.onended = onDone

    // Safety timeout in case audio hangs (max 12 seconds)
    this.salawatTimeoutId = window.setTimeout(() => {
      onDone()
    }, 12000)

    const candidates = [
      '/audio/salawat.mp3',
      'https://archive.org/download/saly-3ala-mo7amad/saly-3ala-mo7amad.mp3',
    ]
    let candidateIdx = 0

    const tryCandidate = (url: string) => {
      audio.onerror = (e) => {
        console.warn(`Salawat candidate failed on ${url}:`, e)
        candidateIdx++
        if (candidateIdx < candidates.length) {
          tryCandidate(candidates[candidateIdx])
        } else {
          console.warn('All salawat audio sources failed. Using peaceful chime fallback.')
          onDone()
          playSereneChime()
        }
      }

      audio.src = url
      audio.load()

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('sanad:salawat-playing'))
            }
          })
          .catch((err) => {
            console.warn('Salawat play error:', err)
            audio.onerror?.(new Event('error'))
          })
      }
    }

    tryCandidate(candidates[0])
  }

  /**
   * Play the serene notification chime for Waqar modesty & hijab reminders
   * Uses local /audio/waqar-chime.wav with fallback to procedural Web Audio synthesizer.
   * Smoothly ducks background audio if running and restores it.
   */
  public playWaqarChime(volumePercent: number = 85): void {
    if (this.isAdhanPlaying()) {
      return
    }

    getAudioContext()

    // Duck background audio if focus track is running
    if (this.isFocusPlaying() && this.sharedAudio) {
      if (this.savedFocusVolume === null) {
        this.savedFocusVolume = this.sharedAudio.volume
      }
      this.sharedAudio.volume = Math.max(0.08, this.savedFocusVolume * 0.25)
    }

    if (!this.waqarAudio) {
      this.waqarAudio = new Audio()
    }

    const audio = this.waqarAudio
    audio.crossOrigin = 'anonymous'
    audio.preload = 'auto'
    audio.volume = Math.min(1, Math.max(0, volumePercent / 100))

    const restoreDucking = () => {
      if (this.savedFocusVolume !== null && this.sharedAudio && !this.sharedAudio.paused) {
        const targetVol = this.savedFocusVolume
        this.savedFocusVolume = null
        let step = 0
        const startVol = this.sharedAudio.volume
        const fadeInterval = setInterval(() => {
          step++
          if (!this.sharedAudio || this.sharedAudio.paused || step >= 10) {
            if (this.sharedAudio) this.sharedAudio.volume = targetVol
            clearInterval(fadeInterval)
            return
          }
          this.sharedAudio.volume = startVol + (targetVol - startVol) * (step / 10)
        }, 50)
      } else {
        this.savedFocusVolume = null
      }
    }

    const onDone = () => {
      audio.onerror = null
      audio.onended = null
      restoreDucking()
    }

    audio.onended = onDone
    audio.onerror = () => {
      onDone()
      playSereneChime()
    }

    audio.src = '/audio/waqar-chime.wav'
    audio.load()

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        onDone()
        playSereneChime()
      })
    }
  }
}

// Global Singleton Instance Export
export const globalAudioManager = GlobalAudioManager.getInstance()

// Backwards-compatible utility wrappers
export function playFocusTrack(url: string, volumePercent: number = 60) {
  globalAudioManager.playFocus(url, volumePercent)
}

export function stopFocusTrack() {
  globalAudioManager.stopAll()
}

export function isFocusTrackPlaying(): boolean {
  return globalAudioManager.isFocusPlaying()
}

export function setFocusTrackVolume(volumePercent: number) {
  globalAudioManager.setVolume(volumePercent)
}

export function playAdhanAudio(
  option: AdhanAudioOption = 'short_takbeerat',
  volumePercent: number = 85
) {
  globalAudioManager.playAdhan(option, volumePercent)
}

export function stopAdhanAudio() {
  globalAudioManager.stopAll()
}

export function isAdhanAudioPlaying(): boolean {
  return globalAudioManager.isAdhanPlaying()
}

export function playSalawatReminder(volumePercent: number = 90) {
  globalAudioManager.playSalawat(volumePercent)
}

export function isSalawatPlaying(): boolean {
  return globalAudioManager.isSalawatPlaying()
}

export function playWaqarChime(volumePercent: number = 85) {
  globalAudioManager.playWaqarChime(volumePercent)
}

export function playNotificationSound(type: 'waqar' | string = 'waqar', volumePercent: number = 85) {
  if (type === 'waqar') {
    globalAudioManager.playWaqarChime(volumePercent)
  } else {
    playSereneChime()
  }
}

export function stopAllAudio() {
  globalAudioManager.stopAll()
}

let isAudioGloballyUnlocked = false

/**
 * Prime and unlock HTMLAudioElement and AudioContext on the user's first touch or interaction.
 * Crucial for mobile Chrome & Safari to allow automated adhan and prayer playback.
 */
export function unlockGlobalAudio(): void {
  if (isAudioGloballyUnlocked || typeof window === 'undefined') return
  try {
    const ctx = getAudioContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const mgr = GlobalAudioManager.getInstance()
    const audio = (mgr as any).getOrCreateAudio?.()
    if (audio && !audio.src) {
      audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
      audio.volume = 0.01
      audio
        .play()
        .then(() => {
          audio.pause()
          audio.currentTime = 0
          audio.removeAttribute('src')
          audio.src = ''
          audio.volume = 1
          isAudioGloballyUnlocked = true
        })
        .catch(() => {})
    }
  } catch (err) {
    console.warn('Audio unlock warning:', err)
  }
}
