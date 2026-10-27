import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import {
  loadSurahsMeta,
  loadSurahDetail,
  getArabicNumber,
  getSurahAudioCandidates,
  isSurahAudioCached,
  cacheSurahAudio,
  getSavedBookmark,
  saveBookmark,
  QURAN_RECITERS,
  type SurahMeta,
  type SurahDetail,
  type QuranBookmark,
  type QuranReciter,
} from '../services/quranService'
import {
  BookOpen,
  Bookmark,
  Play,
  Pause,
  Search,
  Download,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Compass,
  ArrowRight,
  Headphones,
  X,
  FastForward,
  Rewind,
  WifiOff,
} from 'lucide-react'

export const QuranView: React.FC = () => {
  const { lang } = useApp()
  const isAr = lang === 'ar'

  // Surahs Metadata & Selection State
  const [surahs, setSurahs] = useState<SurahMeta[]>([])
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true)
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1)
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false)

  // Navigation & View Mode
  const [viewTab, setViewTab] = useState<'reader' | 'index' | 'audio'>('reader')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all')
  const [juzFilter, setJuzFilter] = useState<number | 'all'>('all')

  // Reading Experience Customization
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('sanad_quran_font_size')
    return saved ? parseInt(saved, 10) : 26
  })
  const [displayMode, setDisplayMode] = useState<'verse' | 'mushaf'>(() => {
    return (localStorage.getItem('sanad_quran_display_mode') as 'verse' | 'mushaf') || 'verse'
  })

  // Bookmark State
  const [bookmark, setBookmark] = useState<QuranBookmark | null>(() => getSavedBookmark())
  const [bookmarkFeedback, setBookmarkFeedback] = useState<string | null>(null)
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null)

  // Audio Playback & Reciter State
  const [selectedReciterId, setSelectedReciterId] = useState<string>(() => {
    return localStorage.getItem('sanad_quran_reciter') || 'hussary'
  })
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)
  const [audioProgress, setAudioProgress] = useState<number>(0)
  const [audioDuration, setAudioDuration] = useState<number>(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false)
  const [candidateIndex, setCandidateIndex] = useState<number>(0)
  const [isCachedOffline, setIsCachedOffline] = useState<boolean>(false)
  const [isCaching, setIsCaching] = useState<boolean>(false)
  const [cacheProgressPercent, setCacheProgressPercent] = useState<number>(0)

  // Audio Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const readerTopRef = useRef<HTMLDivElement | null>(null)

  // Filtered Surahs for directory view
  const filteredSurahs = useMemo(() => {
    let result = surahs

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter(
        (s) =>
          s.number.toString() === query ||
          s.name.includes(query) ||
          s.englishName.toLowerCase().includes(query) ||
          s.englishNameTranslation.toLowerCase().includes(query)
      )
    }

    if (revelationFilter !== 'all') {
      result = result.filter((s) => s.revelationType === revelationFilter)
    }

    if (juzFilter !== 'all') {
      result = result.filter((s) => s.startJuz === juzFilter)
    }

    return result
  }, [surahs, searchQuery, revelationFilter, juzFilter])

  // Save font size & mode preferences
  useEffect(() => {
    localStorage.setItem('sanad_quran_font_size', fontSize.toString())
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('sanad_quran_display_mode', displayMode)
  }, [displayMode])

  useEffect(() => {
    localStorage.setItem('sanad_quran_reciter', selectedReciterId)
  }, [selectedReciterId])

  // Load 114 Surahs Metadata on mount
  useEffect(() => {
    let isMounted = true
    setIsLoadingList(true)
    loadSurahsMeta()
      .then((data) => {
        if (isMounted) {
          setSurahs(data)
          setIsLoadingList(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load surahs metadata:', err)
        if (isMounted) setIsLoadingList(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Load detailed text for the selected surah
  useEffect(() => {
    let isMounted = true
    setIsLoadingDetail(true)

    loadSurahDetail(selectedSurahNumber)
      .then((detail) => {
        if (isMounted) {
          setSurahDetail(detail)
          setIsLoadingDetail(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load surah detail:', err)
        if (isMounted) setIsLoadingDetail(false)
      })

    // Check offline audio cache status
    isSurahAudioCached(selectedReciterId, selectedSurahNumber).then((cached) => {
      if (isMounted) setIsCachedOffline(cached)
    })

    // Reset candidate audio index when surah changes
    setCandidateIndex(0)
    setIsPlayingAudio(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    return () => {
      isMounted = false
    }
  }, [selectedSurahNumber, selectedReciterId])

  // Selected Reciter object
  const currentReciter = useMemo<QuranReciter>(() => {
    return QURAN_RECITERS.find((r) => r.id === selectedReciterId) || QURAN_RECITERS[0]
  }, [selectedReciterId])

  // Audio Candidate URLs for currently selected surah & reciter
  const audioCandidates = useMemo<string[]>(() => {
    return getSurahAudioCandidates(selectedReciterId, selectedSurahNumber)
  }, [selectedReciterId, selectedSurahNumber])

  // Active audio stream URL
  const currentAudioUrl = useMemo<string>(() => {
    if (audioCandidates.length === 0) return ''
    return audioCandidates[candidateIndex % audioCandidates.length]
  }, [audioCandidates, candidateIndex])

  // Handle Audio playback logic
  const handleToggleAudio = () => {
    if (!audioRef.current) return

    if (isPlayingAudio) {
      audioRef.current.pause()
      setIsPlayingAudio(false)
    } else {
      setIsAudioLoading(true)
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true)
          setIsAudioLoading(false)
        })
        .catch((err) => {
          console.warn('[QuranAudio] Play error, attempting fallback:', err)
          setIsAudioLoading(false)
          handleAudioFallback()
        })
    }
  }

  // Fallback to next CDN mirror on failure
  const handleAudioFallback = () => {
    if (candidateIndex < audioCandidates.length - 1) {
      const nextIndex = candidateIndex + 1
      setCandidateIndex(nextIndex)
      console.info(`[QuranAudio] Switching to fallback mirror ${nextIndex}:`, audioCandidates[nextIndex])
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load()
          audioRef.current.play().catch(() => {
            setIsPlayingAudio(false)
          })
        }
      }, 200)
    } else {
      console.warn('[QuranAudio] All fallback mirrors exhausted')
      setIsPlayingAudio(false)
    }
  }

  // Handle audio progress and time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const duration = audioRef.current.duration || 1
      setAudioCurrentTime(current)
      setAudioDuration(duration)
      setAudioProgress((current / duration) * 100)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (audioRef.current && audioDuration > 0) {
      const newTime = (val / 100) * audioDuration
      audioRef.current.currentTime = newTime
      setAudioCurrentTime(newTime)
      setAudioProgress(val)
    }
  }

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioDuration, audioRef.current.currentTime + seconds))
    }
  }

  const handleSpeedChange = () => {
    const rates = [0.75, 1, 1.25, 1.5]
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length
    const nextRate = rates[nextIdx]
    setPlaybackRate(nextRate)
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate
    }
  }

  // Cache Audio for Offline
  const handleDownloadSurahAudio = async () => {
    if (isCaching || isCachedOffline) return
    setIsCaching(true)
    setCacheProgressPercent(15)

    try {
      const success = await cacheSurahAudio(selectedReciterId, selectedSurahNumber, (p) => {
        setCacheProgressPercent(p)
      })

      if (success) {
        setIsCachedOffline(true)
        setBookmarkFeedback(isAr ? 'تم تخزين التلاوة في ذاكرة التطبيق للعمل بدون إنترنت!' : 'Audio saved offline in browser cache!')
        setTimeout(() => setBookmarkFeedback(null), 3500)
      } else {
        setBookmarkFeedback(isAr ? 'تعذر تحميل التلاوة، يرجى التحقق من الاتصال' : 'Failed to cache audio stream')
        setTimeout(() => setBookmarkFeedback(null), 3500)
      }
    } catch {
      setBookmarkFeedback(isAr ? 'حدث خطأ أثناء التخزين المؤقت' : 'Error caching audio')
      setTimeout(() => setBookmarkFeedback(null), 3500)
    } finally {
      setIsCaching(false)
    }
  }

  // Bookmark an Ayah
  const handleSaveBookmark = (ayahNumberInSurah: number, pageNumber?: number) => {
    if (!surahDetail) return
    const newBm: QuranBookmark = {
      surahNumber: surahDetail.number,
      surahNameAr: surahDetail.name,
      ayahNumber: ayahNumberInSurah,
      page: pageNumber,
      updatedAt: Date.now(),
    }
    saveBookmark(newBm)
    setBookmark(newBm)
    setBookmarkFeedback(
      isAr
        ? `تم حفظ علامة التوقف: ${surahDetail.name} • الآية ${getArabicNumber(ayahNumberInSurah)}`
        : `Bookmark saved: ${surahDetail.englishName} • Verse ${ayahNumberInSurah}`
    )
    setTimeout(() => setBookmarkFeedback(null), 3000)
  }

  // Jump to saved bookmark
  const handleResumeBookmark = () => {
    if (!bookmark) return
    setSelectedSurahNumber(bookmark.surahNumber)
    setViewTab('reader')
    setTimeout(() => {
      const elem = document.getElementById(`ayah-${bookmark.ayahNumber}`)
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 400)
  }

  // Copy Ayah text to clipboard
  const handleCopyAyah = (ayahText: string, ayahNumber: number) => {
    if (!surahDetail) return
    const formatted = `${ayahText} ﴿${getArabicNumber(ayahNumber)}﴾ [${surahDetail.name}: ${ayahNumber}]`
    navigator.clipboard.writeText(formatted).then(() => {
      setCopiedAyah(ayahNumber)
      setTimeout(() => setCopiedAyah(null), 2000)
    })
  }

  // Next / Previous Surah Navigation
  const handleNextSurah = () => {
    if (selectedSurahNumber < 114) {
      setSelectedSurahNumber((prev) => prev + 1)
      readerTopRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handlePrevSurah = () => {
    if (selectedSurahNumber > 1) {
      setSelectedSurahNumber((prev) => prev - 1)
      readerTopRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 pb-24 animate-fade-in" ref={readerTopRef}>
      {/* Hidden Audio Element for Recitations */}
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlayingAudio(false)}
        onError={handleAudioFallback}
        onWaiting={() => setIsAudioLoading(true)}
        onPlaying={() => {
          setIsAudioLoading(false)
          setIsPlayingAudio(true)
        }}
      />

      {/* ================= HEADER HERO BANNER ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/40">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 -mb-8 -ms-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                {isAr ? 'المصحف الشريف كاملاً (114 سورة)' : 'Complete Holy Quran (114 Surahs)'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
                <WifiOff className="w-3 h-3" />
                {isAr ? 'يعمل بدون إنترنت (Offline First)' : 'Works 100% Offline'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700">
                {isAr ? 'رواية حفص عن عاصم بالرسم العثماني' : 'Uthmani Script • Hafs'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{isAr ? 'القرآن الكريم' : 'The Holy Quran'}</span>
              <span className="text-emerald-400 text-base font-normal">
                {surahDetail ? `• ${isAr ? surahDetail.name : surahDetail.englishName}` : ''}
              </span>
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              {isAr
                ? 'تصفح وقراءة آيات الذكر الحكيم بنصوص عثمانية مخزنة محلياً، مع تلاوات خاشعة مسجلة لكبار القراء مع حفظ علامة التوقف تلقائياً واستئناف التلاوة في أي وقت.'
                : 'Read and listen to the Holy Quran completely offline with authentic Uthmani typography, renowned recitations, and automatic bookmarking.'}
            </p>
          </div>

          {/* Quick Bookmark Action Pill */}
          {bookmark && (
            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/40 shadow-lg flex flex-col gap-2 min-w-[240px]">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  {isAr ? 'علامة التوقف المحفوظة' : 'Last Bookmark'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(bookmark.updatedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                </span>
              </div>
              <div className="text-sm font-bold text-white">
                {bookmark.surahNameAr} • {isAr ? `الآية ${getArabicNumber(bookmark.ayahNumber)}` : `Ayah ${bookmark.ayahNumber}`}
              </div>
              <button
                type="button"
                onClick={handleResumeBookmark}
                className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer"
              >
                <span>{isAr ? 'متابعة التلاوة' : 'Resume Reading'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Floating Bookmark Feedback Toast */}
      {bookmarkFeedback && (
        <div className="fixed top-20 start-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm font-semibold border border-emerald-400/50 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{bookmarkFeedback}</span>
        </div>
      )}

      {/* ================= NAVIGATION TABS & VIEW SWITCHER ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* View Mode Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewTab('reader')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewTab === 'reader'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isAr ? 'المصحف والقراءة' : 'Reading View'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewTab('index')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewTab === 'index'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isAr ? 'فهرس السور (114)' : 'Surahs Index'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewTab('audio')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewTab === 'audio'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>{isAr ? 'التلاوات الصوتية' : 'Recitations'}</span>
          </button>
        </div>

        {/* Reader Customization Toolbar (Visible in Reader Mode) */}
        {viewTab === 'reader' && surahDetail && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Display Mode: Verse by Verse vs Mushaf */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setDisplayMode('verse')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                  displayMode === 'verse'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                title={isAr ? 'عرض الآيات بطاقات منفصلة' : 'Verse by Verse'}
              >
                {isAr ? 'آيات' : 'Verses'}
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('mushaf')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                  displayMode === 'mushaf'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                title={isAr ? 'عرض متصل على هيئة المصحف الشريف' : 'Continuous Mushaf'}
              >
                {isAr ? 'مصحف' : 'Mushaf'}
              </button>
            </div>

            {/* Font Size Adjusters */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setFontSize((prev) => Math.max(18, prev - 2))}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition cursor-pointer"
                title={isAr ? 'تصغير الخط' : 'Decrease font size'}
              >
                A-
              </button>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 px-1">
                {fontSize}px
              </span>
              <button
                type="button"
                onClick={() => setFontSize((prev) => Math.min(44, prev + 2))}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition cursor-pointer"
                title={isAr ? 'تكبير الخط' : 'Increase font size'}
              >
                A+
              </button>
            </div>

            {/* Quick Surah Selector dropdown */}
            <select
              value={selectedSurahNumber}
              onChange={(e) => setSelectedSurahNumber(parseInt(e.target.value, 10))}
              aria-label={isAr ? 'اختر السورة' : 'Select Surah'}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              {surahs.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name} ({isAr ? `${s.numberOfAyahs} آية` : `${s.numberOfAyahs} v`})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ================= TAB 1: READING VIEW (OFFLINE-FIRST) ================= */}
      {viewTab === 'reader' && (
        <div className="space-y-6">
          {isLoadingDetail ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-slate-400">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold">{isAr ? 'جارٍ تحميل السورة بالرسم العثماني...' : 'Loading Uthmani Text...'}</p>
            </div>
          ) : surahDetail ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Surah Title Header Card */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 p-6 border-b border-slate-200 dark:border-slate-800 text-center relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 mb-2">
                  <span>{surahDetail.revelationType === 'Meccan' ? (isAr ? 'مكية' : 'Meccan') : (isAr ? 'مدنية' : 'Medinan')}</span>
                  <span>•</span>
                  <span>{isAr ? `${surahDetail.numberOfAyahs} آيات` : `${surahDetail.numberOfAyahs} Verses`}</span>
                  <span>•</span>
                  <span>{isAr ? `الجزء ${getArabicNumber(surahDetail.startJuz)}` : `Juz ${surahDetail.startJuz}`}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-900 dark:text-emerald-300 font-serif tracking-wide">
                  {surahDetail.name}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  {surahDetail.englishName} • {surahDetail.englishNameTranslation}
                </p>

                {/* Quick Audio Bar for current Surah */}
                <div className="mt-4 max-w-xl mx-auto flex items-center justify-between gap-3 bg-white dark:bg-slate-900/90 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={handleToggleAudio}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition flex-shrink-0 cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-emerald-500 hover:bg-emerald-400 shadow-xs'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                      title={isPlayingAudio ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'استماع للسورة' : 'Listen')}
                    >
                      {isAudioLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : isPlayingAudio ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ms-0.5" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1 text-start">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {currentReciter.nameAr}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Offline Cache Status / Download Button */}
                    <button
                      type="button"
                      onClick={handleDownloadSurahAudio}
                      disabled={isCaching || isCachedOffline}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isCachedOffline
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : isCaching
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}
                      title={
                        isCachedOffline
                          ? (isAr ? 'مخزنة في ذاكرة المتصفح وتعمل بدون إنترنت' : 'Saved offline')
                          : (isAr ? 'حفظ التلاوة للاستماع بدون إنترنت' : 'Download for offline')
                      }
                    >
                      {isCachedOffline ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="hidden sm:inline">{isAr ? 'مخزنة أوفلاين' : 'Offline Ready'}</span>
                        </>
                      ) : isCaching ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px]">{cacheProgressPercent}%</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          <span className="hidden sm:inline">{isAr ? 'حفظ أوفلاين' : 'Save Offline'}</span>
                        </>
                      )}
                    </button>

                    {/* Bookmark Whole Surah button */}
                    <button
                      type="button"
                      onClick={() => handleSaveBookmark(1, surahDetail.startPage)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                      title={isAr ? 'حفظ بداية السورة كعلامة توقف' : 'Bookmark Surah Start'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar when audio is playing */}
                {isPlayingAudio && (
                  <div className="mt-3 max-w-xl mx-auto flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={audioProgress}
                      onChange={handleSeek}
                      aria-label={isAr ? 'شريط التقديم الصوتي' : 'Audio seek bar'}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Basmala Banner (Omitted for Surah At-Tawbah 9) */}
              {surahDetail.number !== 9 && (
                <div className="py-6 text-center border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                  <p className="text-xl sm:text-2xl font-serif text-slate-800 dark:text-slate-200 select-none">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
              )}

              {/* ================= CONTENT: VERSE BY VERSE OR MUSHAF ================= */}
              <div className="p-4 sm:p-8">
                {displayMode === 'verse' ? (
                  /* ============= VERSE BY VERSE MODE ============= */
                  <div className="space-y-4">
                    {surahDetail.ayahs.map((ayah) => {
                      const isBookmarked =
                        bookmark?.surahNumber === surahDetail.number &&
                        bookmark?.ayahNumber === ayah.numberInSurah

                      return (
                        <div
                          key={ayah.number}
                          id={`ayah-${ayah.numberInSurah}`}
                          className={`group relative p-4 sm:p-6 rounded-2xl transition-all border ${
                            isBookmarked
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30'
                              : 'bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 border-slate-200/70 dark:border-slate-800'
                          }`}
                        >
                          {/* Ayah Top Utilities */}
                          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-2xs">
                                {ayah.numberInSurah}
                              </span>
                              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                {isAr ? `صفحة ${ayah.page}` : `p. ${ayah.page}`} • {isAr ? `الجزء ${ayah.juz}` : `Juz ${ayah.juz}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* Copy Verse */}
                              <button
                                type="button"
                                onClick={() => handleCopyAyah(ayah.text, ayah.numberInSurah)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-700 transition cursor-pointer"
                                title={isAr ? 'نسخ الآية الكريمة' : 'Copy Ayah'}
                              >
                                {copiedAyah === ayah.numberInSurah ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Save Bookmark */}
                              <button
                                type="button"
                                onClick={() => handleSaveBookmark(ayah.numberInSurah, ayah.page)}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  isBookmarked
                                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40'
                                    : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-700'
                                }`}
                                title={isAr ? 'حفظ كعلامة توقف' : 'Save bookmark'}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* Uthmani Ayah Text */}
                          <p
                            className="font-serif leading-loose text-slate-900 dark:text-slate-100 text-end selection:bg-emerald-200 dark:selection:bg-emerald-900/60"
                            style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
                            dir="rtl"
                          >
                            {ayah.text}{' '}
                            <span className="text-emerald-600 dark:text-emerald-400 font-serif font-bold text-base sm:text-lg select-none px-1">
                              ﴿{getArabicNumber(ayah.numberInSurah)}﴾
                            </span>
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* ============= CONTINUOUS MUSHAF MODE ============= */
                  <div className="bg-amber-50/20 dark:bg-slate-950/40 p-6 sm:p-10 rounded-2xl border border-amber-200/40 dark:border-slate-800">
                    <p
                      className="font-serif text-justify text-slate-900 dark:text-slate-100 selection:bg-emerald-200 dark:selection:bg-emerald-900/60 leading-loose"
                      style={{ fontSize: `${fontSize}px`, lineHeight: 2.3 }}
                      dir="rtl"
                    >
                      {surahDetail.ayahs.map((ayah) => {
                        const isBookmarked =
                          bookmark?.surahNumber === surahDetail.number &&
                          bookmark?.ayahNumber === ayah.numberInSurah

                        return (
                          <React.Fragment key={ayah.number}>
                            <span
                              id={`ayah-${ayah.numberInSurah}`}
                              onClick={() => handleSaveBookmark(ayah.numberInSurah, ayah.page)}
                              className={`cursor-pointer transition-colors px-0.5 rounded ${
                                isBookmarked
                                  ? 'bg-emerald-200/50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500/40'
                                  : 'hover:bg-emerald-100/40 dark:hover:bg-emerald-950/40'
                              }`}
                              title={isAr ? 'انقر لحفظ علامة التوقف عند هذه الآية' : 'Click to bookmark'}
                            >
                              {ayah.text}
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-serif font-bold text-base sm:text-lg select-none px-1.5">
                              ﴿{getArabicNumber(ayah.numberInSurah)}﴾
                            </span>
                          </React.Fragment>
                        )
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Footer: Previous & Next Surah Buttons */}
              <div className="flex items-center justify-between gap-4 p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handlePrevSurah}
                  disabled={selectedSurahNumber <= 1}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedSurahNumber <= 1
                      ? 'opacity-40 cursor-not-allowed text-slate-400'
                      : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  <span>{isAr ? 'السورة السابقة' : 'Previous Surah'}</span>
                </button>

                <div className="text-xs font-mono font-bold text-slate-500">
                  {selectedSurahNumber} / 114
                </div>

                <button
                  type="button"
                  onClick={handleNextSurah}
                  disabled={selectedSurahNumber >= 114}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedSurahNumber >= 114
                      ? 'opacity-40 cursor-not-allowed text-slate-400'
                      : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{isAr ? 'السورة التالية' : 'Next Surah'}</span>
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ================= TAB 2: SURAHS INDEX (114 SURAHS DIRECTORY) ================= */}
      {viewTab === 'index' && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث باسم السورة (الفاتحة، البقرة...) أو برقمها...' : 'Search by Surah name or number...'}
                className="w-full ps-9 pe-9 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setRevelationFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  revelationFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isAr ? 'الكل (114)' : 'All (114)'}
              </button>
              <button
                type="button"
                onClick={() => setRevelationFilter('Meccan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  revelationFilter === 'Meccan'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isAr ? 'مكية (86)' : 'Meccan'}
              </button>
              <button
                type="button"
                onClick={() => setRevelationFilter('Medinan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  revelationFilter === 'Medinan'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isAr ? 'مدنية (28)' : 'Medinan'}
              </button>

              {/* Juz Filter Selector */}
              <select
                value={juzFilter === 'all' ? 'all' : juzFilter}
                onChange={(e) => setJuzFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-hidden"
                aria-label={isAr ? 'تصفية حسب الجزء' : 'Filter by Juz'}
              >
                <option value="all">{isAr ? 'الأجزاء (الكل)' : 'All Ajzaa'}</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                  <option key={j} value={j}>
                    {isAr ? `الجزء ${getArabicNumber(j)}` : `Juz ${j}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Surahs Grid */}
          {isLoadingList ? (
            <div className="text-center py-12 text-slate-400">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">{isAr ? 'جارٍ تحميل الفهرس الشامل...' : 'Loading index...'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSurahs.map((surah) => {
                const isCurrent = selectedSurahNumber === surah.number
                const isBookmarkedSurah = bookmark?.surahNumber === surah.number

                return (
                  <div
                    key={surah.number}
                    onClick={() => {
                      setSelectedSurahNumber(surah.number)
                      setViewTab('reader')
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      isCurrent
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Number Stamp */}
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700 transition">
                        {surah.number}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-500 transition">
                            {surah.name}
                          </h3>
                          {isBookmarkedSurah && (
                            <Bookmark className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {surah.englishName} • {surah.revelationType === 'Meccan' ? (isAr ? 'مكية' : 'Meccan') : (isAr ? 'مدنية' : 'Medinan')}
                        </p>
                      </div>
                    </div>

                    <div className="text-end flex-shrink-0">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {isAr ? `${surah.numberOfAyahs} آية` : `${surah.numberOfAyahs} v`}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {isAr ? `جزء ${surah.startJuz}` : `Juz ${surah.startJuz}`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: AUDIO & RECITERS ================= */}
      {viewTab === 'audio' && (
        <div className="space-y-6">
          {/* Reciter Selector Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-500" />
              <span>{isAr ? 'اختر القارئ (تلاوات مسجلة عالية الجودة)' : 'Select Reciter'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {QURAN_RECITERS.map((reciter) => {
                const isSelected = selectedReciterId === reciter.id

                return (
                  <button
                    key={reciter.id}
                    type="button"
                    onClick={() => setSelectedReciterId(reciter.id)}
                    className={`p-4 rounded-2xl border text-start transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/20'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">{reciter.nameAr}</div>
                    <div className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {reciter.styleAr}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Full Player Console */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
            <div className="max-w-2xl mx-auto space-y-6 text-center">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  {currentReciter.nameAr} • {currentReciter.styleAr}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {surahDetail ? surahDetail.name : `السورة رقم ${selectedSurahNumber}`}
                </h2>
                <p className="text-xs text-slate-400">
                  {isCachedOffline
                    ? (isAr ? '✓ المقطع الصوتي مخزن محلياً ويعمل بدون اتصال بالإنترنت' : '✓ Audio cached for offline playback')
                    : (isAr ? 'يتم التشغيل عبر خوادم البث المباشر متعددة البدائل' : 'Streaming via resilient fallback CDN')}
                </p>
              </div>

              {/* Progress Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={handleSeek}
                  aria-label={isAr ? 'شريط التقدم' : 'Seek bar'}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{formatTime(audioCurrentTime)}</span>
                  <span>{formatTime(audioDuration)}</span>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-center gap-4">
                {/* 10s Rewind */}
                <button
                  type="button"
                  onClick={() => handleSkip(-10)}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
                  title={isAr ? 'إرجاع 10 ثوانٍ' : 'Rewind 10s'}
                >
                  <Rewind className="w-4 h-4" />
                </button>

                {/* Big Play/Pause Button */}
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition transform hover:scale-105 cursor-pointer"
                >
                  {isAudioLoading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlayingAudio ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ms-1" />
                  )}
                </button>

                {/* 10s Fast-Forward */}
                <button
                  type="button"
                  onClick={() => handleSkip(10)}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
                  title={isAr ? 'تقديم 10 ثوانٍ' : 'Forward 10s'}
                >
                  <FastForward className="w-4 h-4" />
                </button>
              </div>

              {/* Additional Utility Bar */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 flex-wrap">
                {/* Speed toggle */}
                <button
                  type="button"
                  onClick={handleSpeedChange}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300 transition cursor-pointer"
                >
                  {playbackRate}x
                </button>

                {/* Offline Cache Surah Audio */}
                <button
                  type="button"
                  onClick={handleDownloadSurahAudio}
                  disabled={isCaching || isCachedOffline}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    isCachedOffline
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : isCaching
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {isCachedOffline ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{isAr ? 'التلاوة مخزنة أوفلاين' : 'Cached Offline'}</span>
                    </>
                  ) : isCaching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span>{isAr ? `جارٍ التخزين (${cacheProgressPercent}%)` : `Caching (${cacheProgressPercent}%)`}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>{isAr ? 'تخزين في الكاش للاستماع أوفلاين' : 'Download to Cache for Offline'}</span>
                    </>
                  )}
                </button>

                {/* Read Surah Link */}
                <button
                  type="button"
                  onClick={() => setViewTab('reader')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فتح نص السورة للقراءة' : 'Read Surah Text'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
