import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  X,
  Sparkles,
  Heart,
  BookOpen,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Flame,
} from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface DhikrPreset {
  id: string
  textAr: string
  textEn: string
  virtueAr: string
  virtueEn: string
  defaultTarget: number
}

const DHIKR_PRESETS: DhikrPreset[] = [
  {
    id: 'istighfar',
    textAr: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
    textEn: 'Astaghfirullah al-Azeem wa atoobu ilayh',
    virtueAr: 'الاستغفار يزيل تعب الذهن ويفتح مغاليق المشكلات البرمجية المعقدة.',
    virtueEn: 'Seeking forgiveness clears mental fatigue and unblocks difficult architectural challenges.',
    defaultTarget: 33,
  },
  {
    id: 'salawat',
    textAr: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    textEn: 'Allahumma salli wa sallim wa barik ala Nabiyyina Muhammad',
    virtueAr: 'من صلى عليه صلاة واحدة صلى الله عليه بها عشراً ونال السكينة وبركة الوقت.',
    virtueEn: 'Sending peace upon the Prophet brings tranquility, light, and barakah in time.',
    defaultTarget: 33,
  },
  {
    id: 'tasbih',
    textAr: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    textEn: 'Subhanallahi wa bihamdihi, Subhanallahil-Azeem',
    virtueAr: 'كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن.',
    virtueEn: 'Two phrases light on the tongue, heavy in the scale, beloved to the Most Merciful.',
    defaultTarget: 33,
  },
  {
    id: 'hawqala',
    textAr: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    textEn: 'La hawla wa la quwwata illa billahil-Aliyyil-Azeem',
    virtueAr: 'كنز من كنوز الجنة واستعانة تامة بالله وتبرؤ من الحول والقوة الذاتية.',
    virtueEn: 'A treasure from Paradise, acknowledging that strength and success come only from Allah.',
    defaultTarget: 33,
  },
  {
    id: 'tahleel',
    textAr: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    textEn: 'La ilaha illallah wahdahu la shareeka lah',
    virtueAr: 'أفضل ما قال النبيون وتجديد للتوحيد والإخلاص في النية والعمل.',
    virtueEn: 'The best statement of prophets, renewing monotheism and sincerity in craftsmanship.',
    defaultTarget: 100,
  },
]

interface DeveloperDuaa {
  id: string
  titleAr: string
  titleEn: string
  arabic: string
  transliteration: string
  translation: string
  benefitAr: string
  benefitEn: string
}

const DEVELOPER_DUAAS: DeveloperDuaa[] = [
  {
    id: 'unblock-bug',
    titleAr: 'دعاء حل المسائل المستعصية والـ Bugs',
    titleEn: 'Du\'aa for Resolving Elusive Bugs & Complex Blockers',
    arabic: '«اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً»',
    transliteration: 'Allahumma la sahla illa ma ja\'altahu sahla, wa anta taj\'alul-hazna idha shi\'ta sahla.',
    translation: 'O Allah, nothing is easy except what You make easy, and You can make distress and hardship easy if You will.',
    benefitAr: 'يُقال عند مواجهة علة برمجية صعبة أو خطأ منطقي غامض لاستنزال التيسير وشرح الصدر.',
    benefitEn: 'Supplicate this whenever facing a stubborn bug or elusive edge-case to invite divine clarity.',
  },
  {
    id: 'sprint-start',
    titleAr: 'دعاء بداية يوم العمل والبرمجة',
    titleEn: 'Morning & Sprint Kickoff Supplication',
    arabic: '«اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَرِزْقاً طَيِّباً، وَعَمَلاً مُتَقَبَّلاً»',
    transliteration: 'Allahumma inni as\'aluka \'ilman nafi\'an, wa rizqan tayyiban, wa \'amalan mutaqabbala.',
    translation: 'O Allah, I ask You for beneficial knowledge, wholesome sustenance, and accepted deeds.',
    benefitAr: 'يُفتتح به اليوم البرمجي ليكون التعلم والإنتاج التقني مقروناً بالبركة والقبول.',
    benefitEn: 'Kick off your day so software development becomes purposeful, blessed, and accepted.',
  },
  {
    id: 'focus-clarity',
    titleAr: 'دعاء دفع الشتات وحفظ الذهن',
    titleEn: 'Prayer for Mental Focus & Deep Architecture',
    arabic: '«رَبِّ اشْرَحْ لِي صَدْرِي * وَيَسِّرْ لِي أَمْرِي * وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي * يَفْقَهُوا قَوْلِي»',
    transliteration: 'Rabbi-shrah li sadri, wa yassir li amri, wahlul \'uqdatam-mil-lisani yafqahu qawli.',
    translation: 'My Lord, expand for me my chest with clarity, ease for me my task, and untie the knot from my tongue.',
    benefitAr: 'سؤال الله تيسير التفكير المعقد، والهدوء عند الاجتماعات التقنية وكتابة وثائق النظام (Architecture Docs).',
    benefitEn: 'Invoke for mental clarity when designing architecture, solving system design, or code reviews.',
  },
  {
    id: 'sincere-intention',
    titleAr: 'دعاء تجديد نية العمل كعبادة',
    titleEn: 'Renewing Intention: Code as Righteous Service',
    arabic: '«اللَّهُمَّ اجْعَلْ عَمَلِي كُلَّهُ صَالِحاً، وَاجْعَلْهُ لِوَجْهِكَ خَالِصاً، وَلَا تَجْعَلْ لِأَحَدٍ فِيهِ شَيْئاً»',
    transliteration: 'Allahummaj\'al \'amali kullahu saliha, waj\'alhu li-wajhika khalisa, wa la taj\'al li-ahadin feehi shay\'a.',
    translation: 'O Allah, make all my actions righteous, make them purely for Your sake, and leave no share for anyone else.',
    benefitAr: 'يحوّل ساعات كتابة الكود والتصميم إلى طاعة متقبلة وصدقة جارية تنفع المسلمين والناس.',
    benefitEn: 'Transforms daily coding and problem solving into spiritual stewardship and sincere service.',
  },
  {
    id: 'session-end',
    titleAr: 'دعاء كفارة المجلس وختام جلسة البرمجة',
    titleEn: 'Kaffarat Al-Majlis (Session Wrap-up Du\'aa)',
    arabic: '«سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ»',
    transliteration: 'Subhanak-Allahumma wa bihamdika, ash-hadu alla ilaha illa Anta, astaghfiruka wa atoobu ilayk.',
    translation: 'Glory be to You, O Allah, and praise. I bear witness that none has the right to be worshipped but You. I seek Your forgiveness and repent to You.',
    benefitAr: 'يُختم به لقاء الـ Standup أو جلسة البرمجة ليغفر الله أي زلل أو لغو حدث أثناء العمل.',
    benefitEn: 'Recite at the conclusion of sprints, code pairing, or work sessions for divine forgiveness.',
  },
]

export const DevSpiritualToolsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { lang, spiritualToolsTab, setSpiritualToolsTab } = useApp()
  const isAr = lang === 'ar'

  const activeTab = spiritualToolsTab
  const setActiveTab = setSpiritualToolsTab

  // Digital Tasbih State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('istighfar')
  const [count, setCount] = useState<number>(0)
  const [target, setTarget] = useState<number>(33)
  const [totalToday, setTotalToday] = useState<number>(() => {
    const saved = localStorage.getItem('sanad_tasbih_total_today')
    return saved ? parseInt(saved, 10) : 124
  })
  const [soundFeedback, setSoundFeedback] = useState<boolean>(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const activePreset =
    DHIKR_PRESETS.find((p) => p.id === selectedPresetId) || DHIKR_PRESETS[0]

  // Play subtle click sound via Web Audio API
  const playClickSound = () => {
    if (!soundFeedback) return
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.05)
    } catch {
      // ignore
    }
  }

  const handleIncrement = () => {
    const nextCount = count + 1
    const nextTotal = totalToday + 1
    setCount(nextCount)
    setTotalToday(nextTotal)
    localStorage.setItem('sanad_tasbih_total_today', nextTotal.toString())
    playClickSound()

    // Haptic feedback if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15)
    }
  }

  const handleResetCount = () => {
    setCount(0)
  }

  const handleSelectPreset = (preset: DhikrPreset) => {
    setSelectedPresetId(preset.id)
    setTarget(preset.defaultTarget)
    setCount(0)
  }

  const handleCopyDuaa = (duaa: DeveloperDuaa) => {
    const textToCopy = `${duaa.titleAr}\n${duaa.arabic}\n\nالمعنى: ${duaa.translation}`
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(duaa.id)
      setTimeout(() => setCopiedId(null), 2500)
    })
  }

  if (!isOpen) return null

  const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 end-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-600/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
              {isAr ? 'أدوات المبرمج الروحية والإيمانية' : 'Developer Spiritual Suite'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'مسبحة الكود الرقمية وأدعية الاستفتاح وتيسير البرمجة وحل المشكلات'
                : 'Digital coding tasbih and developer du\'aa cheat sheet'}
            </p>
          </div>
        </div>

        {/* Sub-Tabs: Tasbih vs Duaa */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-6 border border-slate-200/80 dark:border-slate-700/60 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('tasbih')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'tasbih'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{isAr ? 'مسبحة المبرمج الرقمية' : 'Digital Tasbih'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('duaa')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'duaa'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'حصن المبرمج ونوايا الكود' : 'Dev Du\'aa & Intentions'}</span>
          </button>
        </div>

        {/* Tab 1: Digital Tasbih */}
        {activeTab === 'tasbih' && (
          <div className="flex-1 overflow-y-auto space-y-6 pe-1">
            {/* Presets Slider */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isAr ? 'اختر ورد الذكر:' : 'Select Dhikr Preset:'}
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {DHIKR_PRESETS.map((p) => {
                  const isSelected = p.id === selectedPresetId
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isAr ? p.textAr.split(' ')[0] + '...' : p.id}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active Dhikr Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-center space-y-1">
              <h4 className="text-base sm:text-lg font-black text-emerald-900 dark:text-emerald-200">
                {isAr ? activePreset.textAr : activePreset.textEn}
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {isAr ? activePreset.virtueAr : activePreset.virtueEn}
              </p>
            </div>

            {/* Big Tactile Counter Button */}
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="relative">
                {/* SVG Progress Ring */}
                <svg className="w-52 h-52 sm:w-60 sm:h-60 -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    className="stroke-emerald-500 transition-all duration-300"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 105}
                    strokeDashoffset={2 * Math.PI * 105 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Tactile Inner Tap Area */}
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="absolute inset-5 rounded-full bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 border-4 border-emerald-500/20 shadow-xl flex flex-col items-center justify-center active:scale-95 transition-transform duration-150 cursor-pointer select-none group"
                >
                  <span className="font-mono text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {count}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {target > 0 ? `${isAr ? 'الهدف' : 'Target'}: ${target}` : '∞'}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    {isAr ? 'اضغط للتسبيح' : 'Tap to Count'}
                  </span>
                </button>
              </div>

              {/* Counter Toolbar: Target Selector, Sound Feedback, Reset */}
              <div className="flex items-center gap-3 text-xs">
                {/* Target Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {[33, 100, 0].map((tVal) => (
                    <button
                      key={tVal}
                      type="button"
                      onClick={() => setTarget(tVal)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                        target === tVal
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tVal === 0 ? '∞' : tVal}
                    </button>
                  ))}
                </div>

                {/* Sound Feedback Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundFeedback(!soundFeedback)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    soundFeedback
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                  title={isAr ? 'صوت النقر' : 'Click Sound'}
                >
                  {soundFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Reset Count Button */}
                <button
                  type="button"
                  onClick={handleResetCount}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                  title={isAr ? 'تصفير العداد' : 'Reset Count'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Total Today Stats */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Flame className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {isAr ? 'مجموع تسبيح اليوم:' : 'Today\'s Total Tasbih:'}{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    {totalToday}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Developer Du'aa & Intentions */}
        {activeTab === 'duaa' && (
          <div className="flex-1 overflow-y-auto space-y-4 pe-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'أدعية مأثورة ومعانٍ إيمانية تعين المطور على التوكل، حل المشكلات المعقدة، واستثمار الوقت.'
                : 'Prophetic invocations and spiritual intentions tailored to software engineering flow.'}
            </p>

            <div className="space-y-3">
              {DEVELOPER_DUAAS.map((item) => {
                const isCopied = copiedId === item.id
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5 transition hover:border-teal-500/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {isAr ? item.titleAr : item.titleEn}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyDuaa(item)}
                        className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                        title={isAr ? 'نسخ الدعاء' : 'Copy Du\'aa'}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isAr ? 'نسخ' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Arabic Text */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-700/50 text-center font-bold text-sm sm:text-base text-slate-900 dark:text-emerald-300 leading-relaxed font-sans">
                      {item.arabic}
                    </div>

                    {/* Transliteration & Translation */}
                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                      <p className="italic text-[11px] text-slate-500 dark:text-slate-500">
                        {item.transliteration}
                      </p>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {item.translation}
                      </p>
                    </div>

                    {/* Benefit / Context */}
                    <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{isAr ? item.benefitAr : item.benefitEn}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            {isAr ? 'تم' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
