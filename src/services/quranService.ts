export interface SurahMeta {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: 'Meccan' | 'Medinan'
  numberOfAyahs: number
  startPage: number
  startJuz: number
}

export interface Ayah {
  number: number
  numberInSurah: number
  text: string
  juz: number
  page: number
  sajda?: boolean | object
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[]
}

export interface QuranReciter {
  id: string
  nameAr: string
  nameEn: string
  styleAr: string
  styleEn: string
  primaryUrlPattern: string // contains {pad3}
  fallbackPatterns: string[]
}

export interface QuranBookmark {
  surahNumber: number
  surahNameAr: string
  ayahNumber: number
  page?: number
  updatedAt: number
}

// ----------------- Top Tier Quran Reciters -----------------
export const QURAN_RECITERS: QuranReciter[] = [
  {
    id: 'hussary',
    nameAr: 'محمود خليل الحصري',
    nameEn: 'Mahmoud Khalil Al-Hussary',
    styleAr: 'المصحف المرتل (رواية حفص)',
    styleEn: 'Murattal (Hafs)',
    primaryUrlPattern: 'https://cdn.mp3quran.net/audio/mahmoud-husary/r1/{pad3}.mp3',
    fallbackPatterns: [
      'https://server13.mp3quran.net/husr/{pad3}.mp3',
      'https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree_iza3a/{pad3}.mp3',
    ],
  },
  {
    id: 'minshawi',
    nameAr: 'محمد صديق المنشاوي',
    nameEn: 'Mohamed Siddiq Al-Minshawi',
    styleAr: 'المصحف المرتل (رواية حفص)',
    styleEn: 'Murattal (Hafs)',
    primaryUrlPattern: 'https://cdn.mp3quran.net/audio/muhammad-minshawi/r1/{pad3}.mp3',
    fallbackPatterns: [
      'https://server10.mp3quran.net/minsh/{pad3}.mp3',
      'https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee/{pad3}.mp3',
    ],
  },
  {
    id: 'alafasi',
    nameAr: 'مشاري راشد العفاسي',
    nameEn: 'Mishary Rashid Alafasi',
    styleAr: 'تلاوة خاشعة مرصعة',
    styleEn: 'Serene Recitation',
    primaryUrlPattern: 'https://cdn.mp3quran.net/audio/mishary-alafasy/r1/{pad3}.mp3',
    fallbackPatterns: [
      'https://server8.mp3quran.net/afs/{pad3}.mp3',
      'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/{pad3}.mp3',
    ],
  },
  {
    id: 'abdulbasit',
    nameAr: 'عبدالباسط عبدالصمد',
    nameEn: 'Abdulbasit Abdulsamad',
    styleAr: 'المصحف المجود الأيقوني',
    styleEn: 'Iconic Mujawwad',
    primaryUrlPattern: 'https://cdn.mp3quran.net/audio/abdulbasit-abdulsamad/r3/{pad3}.mp3',
    fallbackPatterns: [
      'https://server7.mp3quran.net/basit_mjwd/{pad3}.mp3',
      'https://download.quranicaudio.com/quran/abdul_baasit_mujawwad/{pad3}.mp3',
    ],
  },
]

const QURAN_AUDIO_CACHE_NAME = 'sanad-quran-audio-v1'
const BOOKMARK_KEY = 'sanad_quran_bookmark'

let inMemoryMeta: SurahMeta[] | null = null
let inMemoryFullQuran: any = null

/**
 * Loads the metadata for all 114 Surahs
 */
export async function loadSurahsMeta(): Promise<SurahMeta[]> {
  if (inMemoryMeta && inMemoryMeta.length === 114) {
    return inMemoryMeta
  }

  try {
    const res = await fetch('/quran-surahs-meta.json')
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        inMemoryMeta = data
        return data
      }
    }
  } catch (err) {
    console.warn('[QuranService] Failed to fetch meta from json, trying full uthmani fallback:', err)
  }

  // Fallback: extract from full uthmani if available
  const full = await loadFullQuranData()
  if (full?.data?.surahs) {
    inMemoryMeta = full.data.surahs.map((s: any) => ({
      number: s.number,
      name: s.name,
      englishName: s.englishName,
      englishNameTranslation: s.englishNameTranslation,
      revelationType: s.revelationType,
      numberOfAyahs: s.ayahs.length,
      startPage: s.ayahs[0]?.page || 1,
      startJuz: s.ayahs[0]?.juz || 1,
    }))
    return inMemoryMeta!
  }

  return []
}

/**
 * Loads the complete Quran dataset from local cached JSON
 */
async function loadFullQuranData(): Promise<any> {
  if (inMemoryFullQuran) return inMemoryFullQuran
  try {
    const res = await fetch('/quran-uthmani.json')
    if (res.ok) {
      inMemoryFullQuran = await res.json()
      return inMemoryFullQuran
    }
  } catch (err) {
    console.error('[QuranService] Could not load quran-uthmani.json:', err)
  }
  return null
}

/**
 * Loads a single Surah with all its ayahs in Uthmani script
 */
export async function loadSurahDetail(surahNumber: number): Promise<SurahDetail | null> {
  const full = await loadFullQuranData()
  if (!full?.data?.surahs) return null

  const found = full.data.surahs.find((s: any) => s.number === surahNumber)
  if (!found) return null

  return {
    number: found.number,
    name: found.name,
    englishName: found.englishName,
    englishNameTranslation: found.englishNameTranslation,
    revelationType: found.revelationType,
    numberOfAyahs: found.ayahs.length,
    startPage: found.ayahs[0]?.page || 1,
    startJuz: found.ayahs[0]?.juz || 1,
    ayahs: found.ayahs,
  }
}

/**
 * Formats a number with Arabic numerals ﴿١﴾, ﴿٢﴾, etc.
 */
export function getArabicNumber(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return num
    .toString()
    .split('')
    .map((d) => arabicDigits[parseInt(d, 10)] || d)
    .join('')
}

/**
 * Generates an array of fallback candidate URLs for a given Surah and Reciter
 */
export function getSurahAudioCandidates(reciterId: string, surahNumber: number): string[] {
  const reciter = QURAN_RECITERS.find((r) => r.id === reciterId) || QURAN_RECITERS[0]
  const pad3 = surahNumber.toString().padStart(3, '0')

  const candidates: string[] = []
  candidates.push(reciter.primaryUrlPattern.replace('{pad3}', pad3))

  for (const pattern of reciter.fallbackPatterns) {
    candidates.push(pattern.replace('{pad3}', pad3))
  }

  return candidates
}

/**
 * Checks whether the audio of a specific Surah is cached in Cache Storage for 100% offline playback
 */
export async function isSurahAudioCached(reciterId: string, surahNumber: number): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false
  try {
    const candidates = getSurahAudioCandidates(reciterId, surahNumber)
    const cache = await caches.open(QURAN_AUDIO_CACHE_NAME)
    for (const url of candidates) {
      const match = await cache.match(url)
      if (match) return true
    }
  } catch {
    // Ignore cache error
  }
  return false
}

/**
 * Downloads and caches a Surah audio in Cache Storage for offline listening
 */
export async function cacheSurahAudio(
  reciterId: string,
  surahNumber: number,
  onProgress?: (progress: number) => void
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false

  const candidates = getSurahAudioCandidates(reciterId, surahNumber)
  const cache = await caches.open(QURAN_AUDIO_CACHE_NAME)

  for (const url of candidates) {
    try {
      if (onProgress) onProgress(20)
      const res = await fetch(url)
      if (res.ok && res.status === 200) {
        if (onProgress) onProgress(70)
        await cache.put(url, res.clone())
        if (onProgress) onProgress(100)
        return true
      }
    } catch {
      // Try next candidate
    }
  }

  return false
}

/**
 * Bookmark management
 */
export function getSavedBookmark(): QuranBookmark | null {
  try {
    const saved = localStorage.getItem(BOOKMARK_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return null
}

export function saveBookmark(bookmark: QuranBookmark): void {
  try {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sanad:quran-bookmark-changed', { detail: bookmark }))
    }
  } catch {}
}
