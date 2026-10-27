import React, { useState, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import {
  Flame,
  CheckCircle2,
  GitCommit,
  Award,
  Trophy,
  BookOpen,
  Code2,
  Clock,
  Zap,
} from 'lucide-react'
import { playSereneChime } from '../utils/audio'

interface DailyDeed {
  id: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  completed: boolean
}

interface BadgeItem {
  id: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  icon: React.FC<{ className?: string }>
  unlocked: boolean
  progress: number // 0 - 100
  category: 'spiritual' | 'engineering'
}

export const AchievementsView: React.FC = () => {
  const { lang } = useApp()
  const isAr = lang === 'ar'

  // 1. Daily Check-in Checklist State (5 items requested)
  const initialDeeds: DailyDeed[] = [
    {
      id: 'prayers',
      titleAr: 'الصلوات الخمس في وقتها',
      titleEn: 'Five Daily Prayers on Schedule',
      descAr: 'إقامة الصلوات في وقتها واستحضار الخشوع',
      descEn: 'Praying all five daily prayers with focus',
      completed: true,
    },
    {
      id: 'dhikr',
      titleAr: 'أذكار الصباح والمساء',
      titleEn: 'Morning & Evening Athkar',
      descAr: 'تحصين النفس بذكر الله في أول النهار وآخره',
      descEn: 'Spiritual mindfulness at dawn and dusk',
      completed: true,
    },
    {
      id: 'quran',
      titleAr: 'ورد القرآن اليومي',
      titleEn: 'Daily Quran Recitation',
      descAr: 'تلاوة وتدبر صفحة أو حزب من كتاب الله',
      descEn: 'Reflective recitation of daily Quran portion',
      completed: true,
    },
    {
      id: 'deep_work',
      titleAr: 'ساعة تركيز برمجي (Deep Work)',
      titleEn: 'Deep Work Coding Hour',
      descAr: 'جلسة برمجة نقية خالية من المشتتات بنية الإتقان',
      descEn: 'Focused distraction-free software development',
      completed: true,
    },
    {
      id: 'problem_solving',
      titleAr: 'تمرين حل المشكلات (Problem Solving / LeetCode)',
      titleEn: 'Problem Solving & Algorithmic Practice',
      descAr: 'صقل المهارات الخوارزمية بحل تحدٍّ يومي',
      descEn: 'Sharpening logic by solving daily coding problems',
      completed: false,
    },
  ]

  const [deeds, setDeeds] = useState<DailyDeed[]>(() => {
    const saved = localStorage.getItem('sanad_daily_deeds_state')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return initialDeeds
      }
    }
    return initialDeeds
  })

  useEffect(() => {
    localStorage.setItem('sanad_daily_deeds_state', JSON.stringify(deeds))
  }, [deeds])

  const toggleDeed = (id: string) => {
    setDeeds((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.completed
          if (nextState) {
            playSereneChime()
          }
          return { ...d, completed: nextState }
        }
        return d
      })
    )
  }

  const completedCount = deeds.filter((d) => d.completed).length
  const progressPercent = Math.round((completedCount / deeds.length) * 100)

  // 2. Summary Statistics
  const [currentStreak] = useState<number>(14)
  const [longestStreak] = useState<number>(21)
  const [totalSprints] = useState<number>(56)
  const [totalDeedsCount] = useState<number>(132 + completedCount)

  // 3. GitHub-style Contribution Matrix (26 weeks x 7 days)
  const weeksCount = 26
  const daysPerWeek = 7

  // Cell hover tooltip state
  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string
    count: number
  } | null>(null)

  // Generate matrix cells
  const contributionGrid = useMemo(() => {
    return Array.from({ length: weeksCount }, (_, wIdx) => {
      return Array.from({ length: daysPerWeek }, (_, dIdx) => {
        // Today is the last cell of the last week
        const isToday = wIdx === weeksCount - 1 && dIdx === daysPerWeek - 1

        if (isToday) {
          // Dynamic intensity based on today's completed deeds!
          return {
            level: completedCount >= 5 ? 4 : completedCount >= 3 ? 3 : completedCount >= 1 ? 2 : 1,
            count: completedCount,
            isToday: true,
            dateOffset: 0,
          }
        }

        // Deterministic pseudo intensity for realistic historical look
        const pseudoSeed = (wIdx * 7 + dIdx * 3 + 11) % 17
        const level = pseudoSeed > 13 ? 4 : pseudoSeed > 9 ? 3 : pseudoSeed > 5 ? 2 : pseudoSeed > 2 ? 1 : 0
        const count = level * 2 + (pseudoSeed % 2)
        const dateOffset = (weeksCount - 1 - wIdx) * 7 + (daysPerWeek - 1 - dIdx)

        return {
          level,
          count,
          isToday: false,
          dateOffset,
        }
      })
    })
  }, [weeksCount, daysPerWeek, completedCount])

  // Month header labels
  const monthLabels = isAr
    ? ['مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر']
    : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

  // 4. Earned Badges
  const BADGES: BadgeItem[] = [
    {
      id: 'master_craftsman',
      titleAr: 'مُطوِّر مُتقِن',
      titleEn: 'Master Craftsman',
      descAr: 'أتممت 50 ساعة تركيز برمجي مع الالتزام بمعايير الكود النظيف.',
      descEn: 'Completed 50 deep work coding sprints with clean code rigor.',
      icon: Trophy,
      unlocked: true,
      progress: 100,
      category: 'engineering',
    },
    {
      id: 'fajr_guardian',
      titleAr: 'حارس الفجر',
      titleEn: 'Fajr Guardian',
      descAr: 'حافظت على صلاة الفجر في وقتها 14 يوماً متواصلة.',
      descEn: 'Maintained Fajr prayer on time for 14 consecutive days.',
      icon: Clock,
      unlocked: true,
      progress: 100,
      category: 'spiritual',
    },
    {
      id: 'bug_slayer',
      titleAr: 'قاهر الـ Bugs',
      titleEn: 'Bug Slayer',
      descAr: 'اكتشفت وحللت أكثر من 20 خطأ برمجياً في طور صائد الأخطاء.',
      descEn: 'Identified and fixed 20 logic bugs in the Bug Hunter arena.',
      icon: Zap,
      unlocked: true,
      progress: 100,
      category: 'engineering',
    },
    {
      id: 'quran_companion',
      titleAr: 'صاحب القرآن',
      titleEn: 'Quran Companion',
      descAr: 'الالتزام بالورد القرآني اليومي لمدة 20 يوماً.',
      descEn: 'Consistent daily Quran recitation for 20 days.',
      icon: BookOpen,
      unlocked: false,
      progress: 75,
      category: 'spiritual',
    },
    {
      id: 'algo_engineer',
      titleAr: 'مُهندِس الخوارزميات',
      titleEn: 'Algorithm Engineer',
      descAr: 'إكمال 30 تمريناً في حل المشكلات والخوارزميات.',
      descEn: 'Solved 30 advanced algorithmic and data structure problems.',
      icon: Code2,
      unlocked: false,
      progress: 60,
      category: 'engineering',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* 1. Header & Summary Statistics Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 mb-2">
            <Flame className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'مصفوفة إنجاز المبرمج' : 'Developer Deed Matrix'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isAr ? 'إنجازاتي ومصفوفة المساهمات' : 'Git Contributions & Daily Deeds'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {isAr
              ? 'تتبع أثر عملك اليومي؛ فكل commit برمجية وكل سجدة وورد ذكر هي لبنة في ميزان حسناتك وإتقانك المهني.'
              : 'Track your daily software engineering contributions harmonized with spiritual habits.'}
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center min-w-[90px]">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">
              {isAr ? 'السلسلة الحالية' : 'Current'}
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-300 font-mono inline-flex items-center justify-center gap-1">
              <span>{currentStreak}</span>
              <Flame className="w-4 h-4 text-emerald-500 fill-emerald-500 animate-pulse" />
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[90px]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
              {isAr ? 'أطول سلسلة' : 'Best'}
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {longestStreak}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[90px]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
              {isAr ? 'جلسات كود' : 'Sprints'}
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {totalSprints}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[90px]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
              {isAr ? 'إجمالي الأوراد' : 'Deeds'}
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {totalDeedsCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. GitHub-Style Contribution Heatmap Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? 'سجل المساهمات البرمجية والأوراد (Git & Spiritual Heatmap)' : 'Combined Git & Spiritual Heatmap'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? 'تتوهج خانة اليوم تلقائياً باللون الأخضر الزاهي عند إتمامك للأوراد ومهام الكود!'
                : 'Today’s cell dynamically lights up emerald green as you check off daily habits!'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>{isAr ? 'أقل' : 'Less'}</span>
            <span className="w-3.5 h-3.5 rounded-xs bg-slate-100 dark:bg-slate-800" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-200 dark:bg-emerald-950" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-400 dark:bg-emerald-800" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 dark:bg-emerald-600" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-600 dark:bg-emerald-400 ring-1 ring-emerald-400" />
            <span>{isAr ? 'أكثر' : 'More'}</span>
          </div>
        </div>

        {/* Month Headers */}
        <div className="overflow-x-auto pb-2">
          <div className="flex justify-between text-[11px] font-bold text-slate-400 px-8 min-w-[700px] mb-1">
            {monthLabels.map((m, idx) => (
              <span key={idx}>{m}</span>
            ))}
          </div>

          {/* Grid Container with Day Labels */}
          <div className="flex gap-2 min-w-[700px] items-center">
            {/* Day of Week Labels */}
            <div className="flex flex-col justify-between text-[9px] font-semibold text-slate-400 py-1 h-[116px]">
              <span>{isAr ? 'سبت' : 'Sat'}</span>
              <span>{isAr ? 'إثنين' : 'Mon'}</span>
              <span>{isAr ? 'أربعاء' : 'Wed'}</span>
            </div>

            {/* Matrix Cells */}
            <div className="flex gap-1.5">
              {contributionGrid.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((cell, dIdx) => {
                    const levelClass =
                      cell.level === 0
                        ? 'bg-slate-100 dark:bg-slate-800'
                        : cell.level === 1
                        ? 'bg-emerald-200 dark:bg-emerald-950/90'
                        : cell.level === 2
                        ? 'bg-emerald-400 dark:bg-emerald-800'
                        : cell.level === 3
                        ? 'bg-emerald-500 dark:bg-emerald-600'
                        : 'bg-emerald-600 dark:bg-emerald-400'

                    const todayHighlight = cell.isToday
                      ? 'ring-2 ring-emerald-400 ring-offset-1 dark:ring-offset-slate-900 shadow-md shadow-emerald-500/30'
                      : ''

                    return (
                      <div
                        key={dIdx}
                        onMouseEnter={() =>
                          setHoveredCell({
                            dateStr: cell.isToday
                              ? isAr
                                ? 'اليوم'
                                : 'Today'
                              : `${cell.dateOffset} ${isAr ? 'يوماً مضت' : 'days ago'}`,
                            count: cell.count,
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-3.5 h-3.5 rounded-xs ${levelClass} ${todayHighlight} transition-all duration-300 cursor-pointer hover:scale-125`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Information readout */}
        <div className="min-h-[20px] text-xs font-medium text-slate-500 dark:text-slate-400">
          {hoveredCell ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {hoveredCell.count} {isAr ? 'مساهمة وعمل صالح تم إنجازه' : 'deeds & commits recorded'} ({hoveredCell.dateStr})
            </span>
          ) : (
            <span>{isAr ? '365 مساهمة مسجلة هذا العام • اليوم نشط بنسبة إنجاز ' : '365 activities logged this year • Today active at '}{progressPercent}%</span>
          )}
        </div>
      </div>

      {/* 3. Daily Check-in Checklist (5 Items Specified by User) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? 'قائمة الفحص اليومية للمبرمج (Daily Habits Check-in)' : 'Daily Habits Check-in'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr ? 'انقر على البند لتحديده كمنجز وتحديث مصفوفة المساهمات فوراً' : 'Check items to mark complete and dynamically illuminate your Git matrix'}
            </p>
          </div>

          <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
            {completedCount} / {deeds.length} ({progressPercent}%)
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 5 Deeds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {deeds.map((deed) => (
            <button
              key={deed.id}
              onClick={() => toggleDeed(deed.id)}
              type="button"
              className={`p-4 rounded-2xl border transition-all text-start flex items-center justify-between cursor-pointer ${
                deed.completed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-800 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                    deed.completed
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border-2 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {deed.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div>
                  <div
                    className={`text-xs sm:text-sm font-bold ${
                      deed.completed
                        ? 'text-emerald-950 dark:text-emerald-200 line-through opacity-85'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {isAr ? deed.titleAr : deed.titleEn}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? deed.descAr : deed.descEn}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Earned Badges Showcase */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <span>{isAr ? 'أوسمة الإتقان والإنجاز' : 'Earned Mastery Badges'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr ? 'أوسمة تقديرية تمنح عند الالتزام المستمر بالعادات البرمجية والإيمانية' : 'Recognition badges awarded for consistent programming & spiritual discipline'}
            </p>
          </div>

          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
            3 / {BADGES.length} {isAr ? 'أوسمة مكتسبة' : 'Unlocked'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const Icon = badge.icon

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        badge.unlocked
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        badge.unlocked
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {badge.unlocked ? (isAr ? 'تم التحصيل' : 'Unlocked') : `${badge.progress}%`}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {isAr ? badge.titleAr : badge.titleEn}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {isAr ? badge.descAr : badge.descEn}
                  </p>
                </div>

                {!badge.unlocked && (
                  <div className="mt-4 pt-2">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
