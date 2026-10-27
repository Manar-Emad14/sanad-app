import React, { useState, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import type { FocusAudioTrack } from '../types'
import {
  fetchQuranRadios,
  getCachedQuranRadios,
  CURATED_QURAN_TRACKS,
  CAIRO_QURAN_RADIO,
} from '../services/quranRadioService'
import {
  playFocusTrack,
  stopFocusTrack,
  isFocusTrackPlaying,
  setFocusTrackVolume,
} from '../utils/audio'
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  CloudRain,
  ListMusic,
  Search,
  X,
  Check,
  Sparkles,
  Globe,
  BookOpen,
} from 'lucide-react'

export const FocusAudioBar: React.FC = () => {
  const { lang, handleTabSelect } = useApp()
  const isAr = lang === 'ar'

  const [tracks, setTracks] = useState<FocusAudioTrack[]>(() => getCachedQuranRadios())
  const [isLoadingRadios, setIsLoadingRadios] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const [currentTrackId, setCurrentTrackId] = useState<string>(() => {
    return localStorage.getItem('sanad_focus_track_id') || 'quran-cairo'
  })

  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('sanad_focus_volume')
    return saved ? parseInt(saved, 10) : 60
  })

  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    return localStorage.getItem('sanad_focus_bar_minimized') === 'true'
  })

  const [isRadioDirectoryOpen, setIsRadioDirectoryOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Fetch live radio list from official mp3quran API
  useEffect(() => {
    let isMounted = true
    setIsLoadingRadios(true)

    fetchQuranRadios()
      .then((fetched) => {
        if (isMounted && fetched.length > 0) {
          setTracks(fetched)
        }
      })
      .catch((err) => {
        console.warn('Could not refresh mp3quran list:', err)
      })
      .finally(() => {
        if (isMounted) setIsLoadingRadios(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Sync playing state with global audio events
  useEffect(() => {
    const onStart = () => setIsPlaying(true)
    const onStop = () => setIsPlaying(false)

    window.addEventListener('sanad:focus-audio-playing', onStart)
    window.addEventListener('sanad:focus-audio-stopped', onStop)
    return () => {
      window.removeEventListener('sanad:focus-audio-playing', onStart)
      window.removeEventListener('sanad:focus-audio-stopped', onStop)
    }
  }, [])

  const currentTrack = useMemo(() => {
    return tracks.find((t) => t.id === currentTrackId) || tracks[0] || CAIRO_QURAN_RADIO
  }, [tracks, currentTrackId])

  const handleTogglePlay = () => {
    if (isPlaying || isFocusTrackPlaying()) {
      stopFocusTrack()
      setIsPlaying(false)
    } else {
      playFocusTrack(currentTrack.url, isMuted ? 0 : volume)
      setIsPlaying(true)
    }
  }

  const handleTrackSelect = (track: FocusAudioTrack) => {
    setCurrentTrackId(track.id)
    localStorage.setItem('sanad_focus_track_id', track.id)
    if (isPlaying || isFocusTrackPlaying()) {
      playFocusTrack(track.url, isMuted ? 0 : volume)
    }
    setIsRadioDirectoryOpen(false)
  }

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol)
    localStorage.setItem('sanad_focus_volume', newVol.toString())
    if (isMuted) setIsMuted(false)
    setFocusTrackVolume(newVol)
  }

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
      setFocusTrackVolume(volume)
    } else {
      setIsMuted(true)
      setFocusTrackVolume(0)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev
      localStorage.setItem('sanad_focus_bar_minimized', String(next))
      return next
    })
  }

  const getTrackIcon = (type: string) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
      case 'quran':
      default:
        return <Radio className="w-3.5 h-3.5 text-emerald-400" />
    }
  }

  // Quick Curated List for the compact player
  const curatedQuickTracks = useMemo(() => {
    const list: FocusAudioTrack[] = []
    const ids = CURATED_QURAN_TRACKS.map((c) => c.id)

    // Add matching from loaded tracks
    for (const cur of CURATED_QURAN_TRACKS) {
      const found = tracks.find((t) => t.id === cur.id)
      list.push(found || cur)
    }

    // If current track is custom (not in curated list), prepend it
    if (!ids.includes(currentTrack.id)) {
      list.splice(1, 0, currentTrack)
    }

    return list
  }, [tracks, currentTrack])

  // Filtered tracks for the full directory modal
  const filteredDirectoryTracks = useMemo(() => {
    if (!searchQuery.trim()) return tracks
    const q = searchQuery.toLowerCase().trim()
    return tracks.filter(
      (t) =>
        t.nameAr.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q)
    )
  }, [tracks, searchQuery])

  return (
    <>
      <aside
        aria-label={isAr ? 'صوتيات التركيز وإذاعات القرآن' : 'Focus Audio & Quran Radios'}
        className={`fixed z-30 transition-all duration-300 ${
          isAr ? 'left-2 right-2 sm:right-auto sm:left-6' : 'right-2 left-2 sm:left-auto sm:right-6'
        } bottom-16 sm:bottom-6 sm:w-88 sm:max-w-sm`}
      >
        <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl text-white overflow-hidden ring-1 ring-white/10">
          {/* Compact Header / Minimized Bar */}
          <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2.5">
            <div
              className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
              onClick={() => {
                if (window.innerWidth < 640) {
                  setIsRadioDirectoryOpen(true)
                } else {
                  toggleMinimize()
                }
              }}
            >
              {/* Animated Equalizer or Radio Icon */}
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                {isPlaying ? (
                  <div className="flex items-end justify-center gap-0.5 h-4 w-4">
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite] h-2" />
                    <span className="w-0.5 bg-emerald-300 rounded-full animate-[bounce_1s_infinite_0.2s] h-3.5" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.7s_infinite_0.4s] h-2.5" />
                  </div>
                ) : (
                  <Radio className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {isAr ? 'صوتيات التركيز' : 'Focus Audio'}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-0.5 font-mono">
                    <Globe className="w-2.5 h-2.5 text-teal-400" />
                    <span>mp3quran</span>
                  </span>
                  {isPlaying && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <h4 className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                  {isAr ? currentTrack.nameAr : currentTrack.nameEn}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Holy Quran 114 Surahs offline reader shortcut */}
              <button
                type="button"
                onClick={() => handleTabSelect('quran')}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-emerald-950/80 text-emerald-400 hover:text-emerald-300 flex items-center justify-center transition cursor-pointer border border-slate-700/60 shadow-xs"
                title={isAr ? 'المصحف الشريف (114 سورة قراءة واستماع أوفلاين)' : 'Holy Quran (114 Surahs offline)'}
              >
                <BookOpen className="w-4 h-4" />
              </button>

              {/* Browse Radios Button (Directly opens full stations Bottom Sheet) */}
              <button
                type="button"
                onClick={() => setIsRadioDirectoryOpen(true)}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 flex items-center justify-center transition cursor-pointer border border-slate-700/60 shadow-xs"
                title={isAr ? 'تصفح كل الإذاعات القرآنية' : 'Browse All Radios'}
              >
                <ListMusic className="w-4 h-4" />
              </button>

              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer shadow-xs ${
                  isPlaying
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                title={isPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل' : 'Play')}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ms-0.5" />
                )}
              </button>

              {/* Minimize / Expand Toggle (Hidden on mobile, desktop only) */}
              <button
                type="button"
                onClick={toggleMinimize}
                className="hidden sm:flex w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 items-center justify-center transition cursor-pointer"
                title={isMinimized ? (isAr ? 'توسيع' : 'Expand') : (isAr ? 'تصغير' : 'Minimize')}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded Controls (Hidden on mobile so it never covers the screen) */}
          {!isMinimized && (
            <div className="hidden sm:block px-3 pb-3 pt-1 border-t border-slate-800/80 space-y-2.5 animate-fade-in text-xs">
              {/* Curated Track List */}
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-400">
                    {isAr ? 'محطات السكينة المختارة:' : 'Curated Streams:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRadioDirectoryOpen(true)}
                    className="text-[10px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer transition hover:underline"
                    title={isAr ? 'تصفح كل القراء والإذاعات' : 'Browse all radios'}
                  >
                    <ListMusic className="w-3 h-3" />
                    <span>{isAr ? `كل الإذاعات (${tracks.length})` : `All (${tracks.length})`}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-1 max-h-44 overflow-y-auto pe-1">
                  {curatedQuickTracks.map((t) => {
                    const active = t.id === currentTrack.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleTrackSelect(t)}
                        className={`w-full p-1.5 px-2.5 rounded-lg flex items-center justify-between transition cursor-pointer text-start ${
                          active
                            ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          {getTrackIcon(t.type)}
                          <span className="truncate text-xs">
                            {isAr ? t.nameAr : t.nameEn}
                          </span>
                        </div>
                        {active && isPlaying && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse ms-2" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 text-slate-400">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-white transition cursor-pointer"
                  title={isMuted ? (isAr ? 'إلغاء الكتم' : 'Unmute') : (isAr ? 'كتم' : 'Mute')}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <span className="text-[10px] font-mono w-7 text-end text-slate-300">
                  {isMuted ? '0%' : `${volume}%`}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Full Quran Radios Directory Modal (100+ Reciters from mp3quran API) */}
      {isRadioDirectoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[85vh] text-white overflow-hidden ring-1 ring-white/10">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
                  <ListMusic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                    <span>{isAr ? 'دليل إذاعات القرآن الكريم' : 'Live Quranic Radios'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center gap-1">
                      {isLoadingRadios && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      )}
                      <span>{tracks.length}</span>
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isAr
                      ? 'بث مباشر عالي النقاء عبر API القرآن الرسمي (mp3quran.net)'
                      : 'Live high-fidelity streams from official mp3quran API'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRadioDirectoryOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="py-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ابحث عن قارئ أو سورة أو إذاعة (مثال: المنشاوي، القاهرة، العفاسي)...'
                      : 'Search reciter or station (e.g., Minshawi, Cairo, Alafasy)...'
                  }
                  className="w-full ps-9 pe-8 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Holy Quran Offline Card */}
            <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-slate-900 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {isAr ? 'المصحف الشريف كاملاً (114 سورة)' : 'Complete Holy Quran (114 Surahs)'}
                  </h4>
                  <p className="text-[10px] text-emerald-300/80 truncate">
                    {isAr ? 'قراءة وتلاوات مسجلة لكبار القراء تعمل بدون إنترنت' : 'Offline reading & recitations'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRadioDirectoryOpen(false)
                  handleTabSelect('quran')
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex-shrink-0 cursor-pointer shadow-xs"
              >
                {isAr ? 'فتح المصحف' : 'Open'}
              </button>
            </div>

            {/* Quick Filter Badges */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px]">
              {[
                { label: isAr ? 'الكل' : 'All', query: '' },
                { label: isAr ? 'إذاعة القاهرة' : 'Cairo', query: 'القاهرة' },
                { label: isAr ? 'المنشاوي' : 'Al-Minshawi', query: 'المنشاوي' },
                { label: isAr ? 'عبدالباسط' : 'Abdulbasit', query: 'عبدالباسط' },
                { label: isAr ? 'الحصري' : 'Al-Hussary', query: 'الحصري' },
                { label: isAr ? 'العفاسي' : 'Alafasy', query: 'العفاسي' },
                { label: isAr ? 'المعيقلي' : 'Al-Muaiqly', query: 'المعيقلي' },
                { label: isAr ? 'البقرة' : 'Al-Baqarah', query: 'البقرة' },
                { label: isAr ? 'السكينة' : 'Sakeenah', query: 'السكينة' },
              ].map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSearchQuery(pill.query)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                    searchQuery === pill.query
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Station List */}
            <div className="flex-1 overflow-y-auto space-y-1 pe-1 max-h-[50vh] divide-y divide-slate-800/40">
              {filteredDirectoryTracks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  {isAr ? 'لم يتم العثور على محطات مطابقة' : 'No matching stations found'}
                </div>
              ) : (
                filteredDirectoryTracks.map((t) => {
                  const isCurrent = t.id === currentTrack.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTrackSelect(t)}
                      className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-start transition cursor-pointer group ${
                        isCurrent
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'hover:bg-slate-800/60 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isCurrent
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400'
                          }`}
                        >
                          {getTrackIcon(t.type)}
                        </div>
                        <div className="truncate">
                          <span className="text-xs block truncate">
                            {isAr ? t.nameAr : t.nameEn}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono truncate">
                            {t.url.replace(/^https?:\/\//, '')}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="flex items-center gap-1.5 flex-shrink-0 ms-2">
                          {isPlaying && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                          <Check className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                    </button>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>
                  {isAr
                    ? 'بث سحابي مستقر لا يستهلك مساحة التخزين'
                    : 'Streamed live without APK storage overhead'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setIsRadioDirectoryOpen(false)}
                className="py-1 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
