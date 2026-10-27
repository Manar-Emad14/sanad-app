import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import {
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bug,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Zap,
} from 'lucide-react'
import { playSereneChime } from '../utils/audio'

type GameMode = 'guess_output' | 'bug_hunter'

export const ChallengesView: React.FC = () => {
  const { lang, guessChallenges, bugChallenges } = useApp()
  const isAr = lang === 'ar'
  const Arrow = isAr ? ArrowLeft : ArrowRight

  const [gameMode, setGameMode] = useState<GameMode>('guess_output')

  // Score & Streak System in localStorage
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('sanad_dev_xp')
    return saved ? parseInt(saved, 10) : 450
  })

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('sanad_dev_streak')
    return saved ? parseInt(saved, 10) : 5
  })

  useEffect(() => {
    localStorage.setItem('sanad_dev_xp', xp.toString())
  }, [xp])

  useEffect(() => {
    localStorage.setItem('sanad_dev_streak', streak.toString())
  }, [streak])

  // Mode A State
  const [guessIndex, setGuessIndex] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [guessAnswered, setGuessAnswered] = useState<boolean>(false)

  // Mode B State
  const [bugIndex, setBugIndex] = useState<number>(0)
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [bugAnswered, setBugAnswered] = useState<boolean>(false)

  const safeGuessIdx = guessChallenges.length > 0 ? guessIndex % guessChallenges.length : 0
  const currentGuess = guessChallenges[safeGuessIdx]

  const safeBugIdx = bugChallenges.length > 0 ? bugIndex % bugChallenges.length : 0
  const currentBug = bugChallenges[safeBugIdx]

  const handleSelectOption = (idx: number) => {
    if (guessAnswered || !currentGuess) return
    setSelectedOption(idx)
    setGuessAnswered(true)

    if (idx === currentGuess.correctIndex) {
      playSereneChime()
      setXp((prev) => prev + currentGuess.xp)
      setStreak((prev) => prev + 1)
    }
  }

  const nextGuessQuestion = () => {
    setSelectedOption(null)
    setGuessAnswered(false)
    if (guessChallenges.length > 0) {
      setGuessIndex((prev) => (prev + 1) % guessChallenges.length)
    }
  }

  const handleSelectLine = (lineIdx: number) => {
    if (bugAnswered || !currentBug) return
    setSelectedLine(lineIdx)
    setBugAnswered(true)

    if (lineIdx === currentBug.buggyLineIndex) {
      playSereneChime()
      setXp((prev) => prev + currentBug.xp)
      setStreak((prev) => prev + 1)
    }
  }

  const nextBugQuestion = () => {
    setSelectedLine(null)
    setBugAnswered(false)
    if (bugChallenges.length > 0) {
      setBugIndex((prev) => (prev + 1) % bugChallenges.length)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* 1. Spiritual & Craftsmanship Quote Banner (حديث وآية اليوم للمبرمج) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-500/30 shadow-lg">
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'حديث شريف في إتقان الصنعة' : 'Prophetic Principle of Craftsmanship'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
              {isAr
                ? '«إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ»'
                : '"Verily, Allah loves that whenever any of you does a deed, he excels at it with mastery."'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'الإتقان في البرمجة ليس مجرد تشغيل الكود؛ بل فهم السلوك الباطن للغات البرمجة، وتجنب الأخطاء الخفية، وابتغاء النفع العام.'
                : 'Excellence in engineering goes beyond passing unit tests; it is deeply understanding language internals, eradicating edge cases, and serving users with honesty.'}
            </p>
          </div>

          {/* Gamification Stats: XP & Streaks */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-center min-w-[100px]">
              <span className="text-[11px] text-slate-300 font-bold block flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'نقاط الخبرة' : 'Total XP'}</span>
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {xp} XP
              </span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-center min-w-[100px]">
              <span className="text-[11px] text-slate-300 font-bold block flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'سلسلة الفوز' : 'Win Streak'}</span>
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono inline-flex items-center justify-center gap-1">
                <span>{streak}</span>
                <Flame className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-pulse" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mode Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            onClick={() => setGameMode('guess_output')}
            type="button"
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              gameMode === 'guess_output'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isAr ? 'الطور الأول: خَمِّن الناتج' : 'Mode A: Guess the Output'}</span>
          </button>

          <button
            onClick={() => setGameMode('bug_hunter')}
            type="button"
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              gameMode === 'bug_hunter'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>{isAr ? 'الطور الثاني: صائد الأخطاء' : 'Mode B: Bug Hunter'}</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'أجب بشكل صحيح لرفع رصيد الـ XP وسلسلة الإتقان' : 'Answer accurately to earn XP and extend your streak'}</span>
        </div>
      </div>

      {/* 3. MODE A: GUESS THE OUTPUT */}
      {gameMode === 'guess_output' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-fade-in">
          {/* Header of Question */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {currentGuess.language}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +{currentGuess.xp} XP
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-slate-400">
              {safeGuessIdx + 1} / {guessChallenges.length}
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
              {isAr ? currentGuess.titleAr : currentGuess.titleEn}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAr
                ? 'اقرأ الكود أدناه بدقة، ثم اختر الناتج الفعلي الذي سيُطبع في الـ Console:'
                : 'Analyze the snippet below, then choose the exact value printed to the console:'}
            </p>
          </div>

          {/* Code Box with Syntax Styling */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner border border-slate-800 leading-relaxed text-left ltr" dir="ltr">
            <pre>{currentGuess.code}</pre>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentGuess.options.map((option, idx) => {
              const isSelected = selectedOption === idx
              const isCorrect = idx === currentGuess.correctIndex

              let btnStyle =
                'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200'

              if (guessAnswered) {
                if (isCorrect) {
                  btnStyle =
                    'bg-emerald-100/90 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-bold'
                } else if (isSelected && !isCorrect) {
                  btnStyle =
                    'bg-rose-100/90 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30'
                } else {
                  btnStyle = 'opacity-40 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={guessAnswered}
                  type="button"
                  className={`p-4 rounded-2xl border text-start transition-all flex items-center justify-between font-mono text-xs sm:text-sm cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {guessAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {guessAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {guessAnswered && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                {selectedOption === currentGuess.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{isAr ? 'أحسنت! إجابة صحيحة وموفقة (+50 XP)' : 'Excellent! Correct Answer (+50 XP)'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-rose-700 dark:text-rose-400">{isAr ? 'إجابة غير دقيقة! راجع التفسير التقني أدناه:' : 'Incorrect! Review the technical explanation below:'}</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {isAr ? currentGuess.explanationAr : currentGuess.explanationEn}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={nextGuessQuestion}
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                >
                  <span>{isAr ? 'السؤال التالي' : 'Next Question'}</span>
                  <Arrow className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MODE B: BUG HUNTER */}
      {gameMode === 'bug_hunter' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-fade-in">
          {/* Header of Question */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                {currentBug.language}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +{currentBug.xp} XP
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-slate-400">
              {safeBugIdx + 1} / {bugChallenges.length}
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Bug className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>{isAr ? currentBug.titleAr : currentBug.titleEn}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAr
                ? 'انقر مباشرة على سطر الكود الذي يحتوي على الخطأ البرمجي (Bug):'
                : 'Click directly on the code line that contains the bug:'}
            </p>
          </div>

          {/* Interactive Clickable Code Lines */}
          <div className="rounded-2xl bg-slate-950 p-3 sm:p-4 font-mono text-xs sm:text-sm shadow-inner border border-slate-800 text-left ltr" dir="ltr">
            {currentBug.codeLines.map((line, idx) => {
              const isSelected = selectedLine === idx
              const isBuggy = idx === currentBug.buggyLineIndex

              let lineStyle = 'hover:bg-slate-800/80 text-slate-300'

              if (bugAnswered) {
                if (isBuggy) {
                  lineStyle = 'bg-rose-950/80 text-rose-300 border-s-4 border-rose-500 font-bold'
                } else if (isSelected && !isBuggy) {
                  lineStyle = 'bg-rose-950/40 text-rose-300 border-s-4 border-rose-400/50'
                } else {
                  lineStyle = 'opacity-50 text-slate-500'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectLine(idx)}
                  disabled={bugAnswered}
                  type="button"
                  className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-all text-start cursor-pointer group ${lineStyle}`}
                >
                  <span className="w-8 text-slate-500 select-none group-hover:text-emerald-400 text-xs">
                    {idx + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">{line}</span>
                  {bugAnswered && isBuggy && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                      Bug Line!
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Feedback & Bug Explanation */}
          {bugAnswered && (
            <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedLine === currentBug.buggyLineIndex ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-800 dark:text-emerald-300">
                      {isAr ? 'صيد موفق! اكتشفت السطر الخاطئ بدقة (+75 XP)' : 'Bug Hunted! You accurately spotted the defect (+75 XP)'}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-500" />
                    <span className="text-rose-700 dark:text-rose-400">
                      {isAr ? `السطر المختار سليم، الخطأ في السطر رقم ${currentBug.buggyLineIndex + 1}` : `Selected line is fine. Defect is on line ${currentBug.buggyLineIndex + 1}`}
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? 'تشخيص المشكلة:' : 'Diagnosis:'}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr ? currentBug.bugDescriptionAr : currentBug.bugDescriptionEn}
                </p>

                <div className="font-bold text-emerald-700 dark:text-emerald-300 pt-1">
                  {isAr ? 'الحل البرمجي المقترح:' : 'Recommended Fix:'}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-teal-200/60 dark:border-slate-800">
                  {isAr ? currentBug.fixExplanationAr : currentBug.fixExplanationEn}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={nextBugQuestion}
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm shadow-teal-600/20"
                >
                  <span>{isAr ? 'التحدي البرمجي التالي' : 'Next Bug Challenge'}</span>
                  <Arrow className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
