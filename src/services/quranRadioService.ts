import type { FocusAudioTrack } from '../types'

export interface MP3QuranApiRadio {
  id: number
  name: string
  url: string
  recent_date?: string
}

export const MP3QURAN_RADIOS_API = 'https://mp3quran.net/api/v3/radios?language=ar'
const CACHE_KEY = 'sanad_mp3quran_radios_cache'
const CACHE_TIME_KEY = 'sanad_mp3quran_radios_cache_time'
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

// Always pinned #1: Cairo Holy Quran Radio (إذاعة القرآن الكريم من القاهرة)
export const CAIRO_QURAN_RADIO: FocusAudioTrack = {
  id: 'quran-cairo',
  nameAr: 'إذاعة القرآن الكريم من القاهرة (بث مباشر)',
  nameEn: 'Cairo Holy Quran Radio Live',
  url: 'https://n0a.radiojar.com/8s5u8tpdtwzuv',
  type: 'quran',
}

// Nature / Rain ambient track for coding focus
export const RAIN_AMBIENT_TRACK: FocusAudioTrack = {
  id: 'rain-ambient',
  nameAr: 'أصوات الطبيعة والمطر الهادئ للبرمجة',
  nameEn: 'Serene Rain Coding Flow Ambient',
  url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
  type: 'rain',
}

// Curated top stations from mp3quran API for fast 1-click access
export const CURATED_QURAN_TRACKS: FocusAudioTrack[] = [
  CAIRO_QURAN_RADIO,
  {
    id: 'mp3quran-79',
    nameAr: 'مشاري العفاسي (تلاوات خاشعة)',
    nameEn: 'Mishary Alafasi (Serene Recitation)',
    url: 'https://backup.qurango.net/radio/mishary_alafasi',
    type: 'quran',
  },
  {
    id: 'mp3quran-30',
    nameAr: 'عبدالباسط عبدالصمد (المصحف المجود)',
    nameEn: 'Abdulbasit Abdulsamad (Mujawwad)',
    url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad',
    type: 'quran',
  },
  {
    id: 'mp3quran-69',
    nameAr: 'محمد صديق المنشاوي (المصحف المرتل)',
    nameEn: 'Mohamed Siddiq Al-Minshawi (Murattal)',
    url: 'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi',
    type: 'quran',
  },
  {
    id: 'mp3quran-74',
    nameAr: 'محمود خليل الحصري (المصحف المرتل)',
    nameEn: 'Mahmoud Khalil Al-Hussary (Murattal)',
    url: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary',
    type: 'quran',
  },
  {
    id: 'mp3quran-10902',
    nameAr: 'آيات السكينة والطمأنينة',
    nameEn: 'Ayat Al-Sakeenah (Peace & Serenity)',
    url: 'https://backup.qurango.net/radio/sakeenah',
    type: 'quran',
  },
  {
    id: 'mp3quran-109082',
    nameAr: 'إذاعة القرآن الكريم - مكة المكرمة',
    nameEn: 'Makkah Holy Quran Radio Live',
    url: 'https://stream.radiojar.com/0tpy1h0kxtzuv',
    type: 'quran',
  },
  RAIN_AMBIENT_TRACK,
]

// Helper to clean radio titles from noise like dashes and asterisks
function cleanRadioName(rawName: string): string {
  return rawName
    .replace(/^[\s\*\-]+|[\s\*\-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Loads cached radio tracks from localStorage if present
 */
export function getCachedQuranRadios(): FocusAudioTrack[] {
  try {
    const saved = localStorage.getItem(CACHE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as FocusAudioTrack[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Failed to parse cached radios:', err)
  }
  return CURATED_QURAN_TRACKS
}

/**
 * Fetches the live radio station directory from mp3quran.net official API
 * Falls back transparently to cache or curated offline list.
 */
export async function fetchQuranRadios(): Promise<FocusAudioTrack[]> {
  const cachedTimeStr = localStorage.getItem(CACHE_TIME_KEY)
  const isCacheFresh =
    Boolean(cachedTimeStr && Date.now() - parseInt(cachedTimeStr, 10) < CACHE_MAX_AGE_MS)

  const cached = getCachedQuranRadios()

  if (isCacheFresh && cached.length > 5) {
    return cached
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 7000)

    const response = await fetch(MP3QURAN_RADIOS_API, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`mp3quran API returned HTTP ${response.status}`)
    }

    const data = await response.json()
    if (!data || !Array.isArray(data.radios)) {
      throw new Error('Invalid format from mp3quran API')
    }

    const fetchedTracks: FocusAudioTrack[] = data.radios
      .filter((r: MP3QuranApiRadio) => Boolean(r && r.name && r.url))
      .map((r: MP3QuranApiRadio) => {
        const cleanName = cleanRadioName(r.name)
        return {
          id: `mp3quran-${r.id}`,
          nameAr: cleanName,
          nameEn: cleanName,
          url: r.url.replace(/\\\//g, '/').trim(),
          type: 'quran' as const,
        }
      })

    // Prepend Cairo Holy Quran Radio (always index 0) and append Rain Ambient
    const allTracks: FocusAudioTrack[] = [
      CAIRO_QURAN_RADIO,
      ...fetchedTracks.filter((t) => t.url !== CAIRO_QURAN_RADIO.url),
      RAIN_AMBIENT_TRACK,
    ]

    // Save to cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(allTracks))
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString())
    } catch {}

    return allTracks
  } catch (err) {
    console.warn('mp3quran API request failed or timed out, using fallback cache:', err)
    return cached.length > 0 ? cached : CURATED_QURAN_TRACKS
  }
}
