import type {
  DeveloperReminder,
  GuessChallenge,
  BugChallenge,
  Announcement,
  PrayerOffsets,
  NotificationSettings,
  FocusAudioTrack,
  DeveloperSuggestion,
  UserProfile,
} from '../types'

export const DEFAULT_REMINDERS: DeveloperReminder[] = [
  {
    id: 'dhikr-istighfar',
    categoryAr: 'ورد الذكر والاستغفار',
    categoryEn: 'Mindful Remembrance',
    iconName: 'Heart',
    textAr: '«أستغفر الله العظيم وأتوب إليه»',
    textEn: 'Astaghfirullah wa atoobu ilayh (I seek Allah’s forgiveness)',
    subtextAr: 'الاستغفار يفتح مغاليق الكود ويجلب بركة الوقت والذهن.',
    subtextEn: 'Mindful repentance clears mental clutter and blesses your coding time.',
  },
  {
    id: 'ergo-eyes',
    categoryAr: 'صحة العين وقاعدة 20-20-20',
    categoryEn: 'Ergonomic Eye Health',
    iconName: 'Eye',
    textAr: 'أرِح عينيك: انظر لشيء يبعد 20 قدماً لمدة 20 ثانية',
    textEn: 'Rest your eyes: Look at something 20 feet away for 20 seconds',
    subtextAr: 'نعمة البصر أمانة؛ احرص على إراحة عضلات العين وترطيبها.',
    subtextEn: 'Preserve eyesight: reduce digital eye strain every 20 minutes.',
  },
  {
    id: 'dhikr-salawat',
    categoryAr: 'الصلاة على النبي ﷺ',
    categoryEn: 'Salawat on the Prophet ﷺ',
    iconName: 'Sparkles',
    textAr: '«اللهم صلِّ وسلِّم وبارك على نبينا محمد»',
    textEn: 'Allahumma salli wa sallim ala Nabiyyina Muhammad',
    subtextAr: 'من صلى عليه صلاة واحدة صلى الله عليه بها عشراً.',
    subtextEn: 'Invoke peace upon the Prophet to attain divine tranquility in your work.',
  },
  {
    id: 'hydration-stretch',
    categoryAr: 'الترطيب وتمدد العمود الفقري',
    categoryEn: 'Hydration & Posture Stretch',
    iconName: 'Droplets',
    textAr: 'اشرب كوب ماء واعتدل في جلستك مع تمديد الظهر',
    textEn: 'Drink a glass of water and stretch your back and neck',
    subtextAr: 'الجسد القوي السليم أقدر على نفع الأمة وكتابة كود نقي.',
    subtextEn: 'Maintain hydration and ergonomic spine alignment for sustainable flow.',
  },
]

export const DEFAULT_GUESS_CHALLENGES: GuessChallenge[] = [
  {
    id: 'js-coercion',
    language: 'JavaScript',
    titleAr: 'لغز الجمع الضمني والتحويل في JavaScript',
    titleEn: 'JavaScript Type Coercion & Addition Precedence',
    code: `console.log(1 + "2" + 3);
console.log(1 + 2 + "3");`,
    options: ['123 و 33', '6 و 6', '123 و 6', 'خطأ في النوع (TypeError)'],
    correctIndex: 0,
    explanationAr:
      'في السطر الأول: يتم جمع 1 مع النص "2" فيتحول الناتج لنص "12"، ثم يضاف 3 فيصبح "123". في السطر الثاني: يبدأ الجمع من اليسار؛ 1+2=3 أولاً كرقم، ثم 3 + "3" تتحول إلى النص "33".',
    explanationEn:
      'In line 1: 1 + "2" converts to string "12", then + 3 yields "123". In line 2: 1 + 2 evaluates first as number 3, then + "3" coerces to "33".',
    xp: 50,
  },
  {
    id: 'py-default-args',
    language: 'Python',
    titleAr: 'فخ القوائم الافتراضية القابلة للتعديل (Mutable Defaults)',
    titleEn: 'Python Mutable Default Arguments Pitfall',
    code: `def add_item(val, items=[]):
    items.append(val)
    return items

print(add_item(1))
print(add_item(2))`,
    options: ['[1] و [2]', '[1] و [1, 2]', '[1, 2] و [1, 2]', 'SyntaxError'],
    correctIndex: 1,
    explanationAr:
      'في Python، تُقيّم الوسائط الافتراضية (Default Arguments) مرة واحدة فقط عند تعريف الدالة، وتُشارك نفس القائمة في الذاكرة عبر جميع الاستدعاءات اللاحقة.',
    explanationEn:
      'In Python, default arguments are evaluated only once at function definition time. The list object is shared across successive function calls.',
    xp: 60,
  },
  {
    id: 'cs-struct-vs-class',
    language: 'C#',
    titleAr: 'الفرق بين أنواع القيمة والمرجع (Struct vs Class)',
    titleEn: 'C# Value Types vs Reference Types',
    code: `struct Point { public int X; }

Point p1 = new Point { X = 10 };
Point p2 = p1;
p2.X = 20;

Console.WriteLine(p1.X);`,
    options: ['10', '20', '0', 'NullReferenceException'],
    correctIndex: 0,
    explanationAr:
      'في C#، تُعد بنية struct نوع قيمة (Value Type). عند نسخ p1 إلى p2، يتم نسخ القيمة بالكامل بشكل مستقل في الذاكرة (Stack)، لذا تعديل p2 لا يؤثر أبداً على p1.',
    explanationEn:
      'In C#, struct is a value type stored on stack. Assigning p1 to p2 creates an independent copy; modifying p2.X leaves p1.X untouched as 10.',
    xp: 60,
  },
]

export const DEFAULT_BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 'js-async-loop',
    language: 'JavaScript',
    titleAr: 'خطأ حلقة التكرار غير المتزامنة (var Scope & Closure)',
    titleEn: 'Asynchronous Loop Scope Closure Bug',
    codeLines: [
      'function fetchOrders(ids) {',
      '  for (var i = 0; i < ids.length; i++) {',
      '    setTimeout(() => {',
      '      console.log("Order index: " + i);',
      '    }, 100);',
      '  }',
      '}',
    ],
    buggyLineIndex: 1, // Line 2
    bugDescriptionAr:
      'استخدام "var" بدلاً من "let" يجعل المتغير ذا نطاق دالة (function-scoped)، مما يؤدي لطباعة آخر قيمة لـ i في جميع استدعاءات الـ setTimeout.',
    bugDescriptionEn:
      'Using "var" instead of block-scoped "let" shares a single mutable binding, logging the final length value for all timeouts.',
    fixExplanationAr:
      'الحل: استبدال "var i" بـ "let i" ليحصل كل تكرار على نطاق كتلة (Block Scope) مستقل ومغلق في الـ Closure.',
    fixExplanationEn:
      'Fix: Replace "var i" with block-scoped "let i" to capture individual iteration bindings in the closure.',
    xp: 75,
  },
  {
    id: 'py-zero-division',
    language: 'Python',
    titleAr: 'خطأ الحافة وقسمة الصفر في معدل الأداء',
    titleEn: 'Division by Zero Edge Case in KPI Calculator',
    codeLines: [
      'def compute_accuracy(correct, total):',
      '    # Bug: Missing check when total evaluations are zero',
      '    ratio = correct / total',
      '    return round(ratio * 100, 2)',
    ],
    buggyLineIndex: 2, // Line 3
    bugDescriptionAr:
      'عدم التحقق من حالة الصفر (total == 0) يؤدي لرمي استثناء ZeroDivisionError عند عدم وجود أي تقييمات مسجلة.',
    bugDescriptionEn:
      'Direct division without verifying if total > 0 throws a fatal ZeroDivisionError exception when total is 0.',
    fixExplanationAr:
      'الحل: إضافة شرط حماية: if total == 0: return 0.0 قبل إجراء القسمة.',
    fixExplanationEn:
      'Fix: Add a guard clause checking if total == 0: return 0.0 before performing the division.',
    xp: 75,
  },
  {
    id: 'cs-null-ref',
    language: 'C#',
    titleAr: 'خطأ المؤشر الفارغ بدون Null-Check',
    titleEn: 'Unsafe Null Reference Dereferencing',
    codeLines: [
      'public string GetDomain(string email)',
      '{',
      '    // Bug: Directly accessing properties without null guard',
      '    return email.Split("@")[1].ToLower();',
      '}',
    ],
    buggyLineIndex: 3, // Line 4
    bugDescriptionAr:
      'محاولة استدعاء Split مباشرة على معامل قد يكون null أو لا يحتوي على رمز @ يسبب NullReferenceException أو IndexOutOfRangeException.',
    bugDescriptionEn:
      'Calling Split without checking for null or missing @ character triggers NullReferenceException or IndexOutOfRangeException.',
    fixExplanationAr:
      'الحل: استخدام string.IsNullOrWhiteSpace(email) مع التحقق من طول المصفوفة بعد التقسيم.',
    fixExplanationEn:
      'Fix: Guard with string.IsNullOrWhiteSpace(email) and ensure Split returns at least 2 parts.',
    xp: 75,
  },
]

export const DEFAULT_ANNOUNCEMENT: Announcement = {
  enabled: true,
  textAr: 'مرحباً بكم في تطبيق "سند المُبرمج" بإشراف وتطوير م. منار عماد — رفيقك التكنولوجي الإيماني نحو البرمجة بإتقان وسكينة.',
  textEn: 'Welcome to Sanad Dev App supervised & developed by Eng. Manar Emad — your tech-spiritual companion for excellence & peace.',
  type: 'info',
}

export const DEFAULT_OFFSETS: PrayerOffsets = {
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  prayerAlerts: true,
  preAdhanAlerts: true,
  dailyTips: true,
  periodicDhikr: true,
  dhikrIntervalMinutes: 60,
  soundEnabled: true,
  adhanAudioOption: 'cairo_refaat',
  salawatAudioEnabled: true,
  salawatIntervalMinutes: 15,
  waqarMessagesEnabled: true,
  waqarSoundEnabled: true,
  peaceRemindersEnabled: true,
  eveningAdhkarEnabled: true,
  challengeAlertsEnabled: true,
  userGender: 'female',
  userName: '',
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '',
  gender: 'female',
  onboarded: false,
}

export const DEFAULT_FOCUS_TRACKS: FocusAudioTrack[] = [
  {
    id: 'quran-cairo',
    nameAr: 'إذاعة القرآن الكريم من القاهرة (بث مباشر)',
    nameEn: 'Cairo Holy Quran Radio Live',
    url: 'https://n12.radiojar.com/8s5u5tpdtwzuv',
    type: 'quran',
  },
  {
    id: 'quran-mishary',
    nameAr: 'تلاوات قرآنية خاشعة للتركيز',
    nameEn: 'Serene Quran Recitation Stream',
    url: 'https://qurango.net/radio/mishary_alafasi',
    type: 'quran',
  },
  {
    id: 'rain-ambient',
    nameAr: 'أصوات الطبيعة والمطر الهادئ للبرمجة',
    nameEn: 'Serene Rain Coding Flow Ambient',
    url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
    type: 'rain',
  },
]

export const DEFAULT_SUGGESTIONS: DeveloperSuggestion[] = [
  {
    id: 'sug-1',
    type: 'feature',
    details: 'إضافة مؤقت إيقاف تلقائي (Sleep Timer) لإذاعة القرآن الكريم وأصوات المطر عند العمل ليلاً.',
    developerName: 'أحمد علي',
    developerContact: 'ahmed.dev@example.com',
    createdAt: Date.now() - 3600000 * 5, // 5 hours ago
    status: 'new',
  },
  {
    id: 'sug-2',
    type: 'content',
    details: 'اقتراح إضافة المزيد من أدعية تيسير العمل وتفريج الكرب عند مواجهة الـ Bugs المستعصية في قسم الأدعية.',
    developerName: 'مهندس برمجيات',
    developerContact: '',
    createdAt: Date.now() - 3600000 * 28, // yesterday
    status: 'reviewed',
  },
]

