export interface WisdomItem {
  id: string
  category: 'code' | 'motivation' | 'hadith' | 'wisdom' | 'waqar'
  categoryAr: string
  categoryEn: string
  titleAr: string
  titleEn: string
  bodyAr: string
  bodyEn: string
  referenceAr: string
  referenceEn: string
  tag: string
}

export const SANAD_WISDOM_BANK: WisdomItem[] = [
  // ================= 1. CLEAN CODE & ENGINEERING BEST PRACTICES (7 Items) =================
  {
    id: 'code-naming',
    category: 'code',
    categoryAr: 'هندسة الكود النظيف',
    categoryEn: 'Clean Code Practice',
    titleAr: 'دقة التسمية أصل الفهم البرمجي',
    titleEn: 'Intent-Revealing Naming',
    bodyAr:
      'اختر أسماء المتغيرات والدوال لتعبر عن «الغاية» بوضوح دون الحاجة لتعليق يشرحها. إذا احتجت إلى تعليق لتفسير اسم متغير، فالاسم بحاجة إلى إعادة كتابة (Refactoring).',
    bodyEn:
      'Choose variable and function names that reveal intent without needing explanatory comments. If you need a comment to explain a name, refactor the name.',
    referenceAr: 'روبرت مارتن • كتاب Clean Code',
    referenceEn: 'Robert C. Martin • Clean Code',
    tag: 'CleanCode',
  },
  {
    id: 'code-pure-functions',
    category: 'code',
    categoryAr: 'هندسة الكود النظيف',
    categoryEn: 'Clean Code Practice',
    titleAr: 'الدوال النقية (Pure Functions) وسهولة الاختبار',
    titleEn: 'Pure Functions & Testability',
    bodyAr:
      'احرص قدر الإمكان على جعل دوالك نقية (نفس المدخلات تعطي نفس المخرجات دائماً بلا آثار جانبية Side Effects)؛ هذا يقلل الأخطاء الخفية ويجعل كتابة Unit Tests أمراً سهلاً وممتعاً.',
    bodyEn:
      'Keep functions pure (same inputs always yield same outputs with zero side effects). This eliminates subtle bugs and makes unit testing effortless.',
    referenceAr: 'مبادئ البرمجة الوظيفية • Functional Patterns',
    referenceEn: 'Functional Architecture Principles',
    tag: 'Refactoring',
  },
  {
    id: 'code-dry-yagni',
    category: 'code',
    categoryAr: 'هندسة الكود النظيف',
    categoryEn: 'Clean Code Practice',
    titleAr: 'قاعدة YAGNI والتجريد المبكر',
    titleEn: 'YAGNI: Avoid Premature Abstraction',
    bodyAr:
      '«You Aren’t Gonna Need It» — لا تبنِ حلولاً معقدة لمشاكل مستقبلية لم تقع بعد. صمم كودك ليلبي احتياجات اليوم بمرونة تسمح بتطويره غداً، وتجنب الإفراط في الهندسة (Over-engineering).',
    bodyEn:
      '"You Aren’t Gonna Need It" — Never build complex solutions for hypothetical future problems. Solve today’s needs with clean architecture that welcomes extension tomorrow.',
    referenceAr: 'فلسفة التطوير الرشيق • Agile Engineering',
    referenceEn: 'Extreme Programming Philosophy',
    tag: 'Architecture',
  },
  {
    id: 'code-async-await',
    category: 'code',
    categoryAr: 'هندسة الكود النظيف',
    categoryEn: 'Clean Code Practice',
    titleAr: 'إدارة العمليات غير المتزامنة (Async/Await)',
    titleEn: 'Robust Asynchronous Flow',
    bodyAr:
      'احذر من ترك Promises بدون `try/catch` أو معالجة الأخطاء غير المتوقعة (Unhandled Rejections). عند تشغيل مهام مستقلة متعددة، استخدم `Promise.all` أو `Task.WhenAll` لتحقيق التوازي وتفادي عنق الزجاجة.',
    bodyEn:
      'Always guard asynchronous logic with try/catch. When awaiting multiple independent operations, run them concurrently via Promise.all / Task.WhenAll rather than sequential waterfalls.',
    referenceAr: 'أفضل ممارسات البرمجة غير المتزامنة • Async Mastery',
    referenceEn: 'Async Concurrency Patterns',
    tag: 'Async',
  },
  {
    id: 'code-small-commits',
    category: 'code',
    categoryAr: 'هندسة الكود النظيف',
    categoryEn: 'Clean Code Practice',
    titleAr: 'بركة الـ Commits الصغيرة والمركزة',
    titleEn: 'Atomic Git Commits & Small PRs',
    bodyAr:
      'قسّم عملك إلى تغييرات صغيرة ذرية (Atomic Commits). الـ Pull Request الصغير (أقل من 200 سطر) يُراجع بدقة، ويُكتشف خطؤه بسرعة، ويسهل دمجه دون نزاعات فروع (Merge Conflicts).',
    bodyEn:
      'Keep your Git commits atomic and PRs under 200 lines. Small PRs get reviewed thoroughly, merge painlessly, and reduce bug escape rates.',
    referenceAr: 'ثقافة هندسة البرمجيات المعاصرة • Git Flow',
    referenceEn: 'Modern Software Engineering Culture',
    tag: 'Git',
  },
  {
    id: 'code-guard-clauses',
    category: 'code',
    categoryAr: 'هندسة الكود النظيف',
    categoryEn: 'Clean Code Practice',
    titleAr: 'تسطيح الشروط باستخدام شروط الحماية (Guard Clauses)',
    titleEn: 'Flatten Logic with Guard Clauses',
    bodyAr:
      'تجنب التشعب العميق لـ `if/else` المتداخلة داخل الدوال. اخرج مبكراً (`return early`) عند عدم تحقق الشروط المسبقة لتجعل المسار الأساسي (Happy Path) يتدفق بسلاسة في سياق الدالة.',
    bodyEn:
      'Avoid deep nested if/else blocks (Arrow Anti-Pattern). Return early using guard clauses so the happy path reads linearly with low cognitive load.',
    referenceAr: 'مارتن فاولر • كتاب Refactoring',
    referenceEn: 'Martin Fowler • Refactoring',
    tag: 'Refactoring',
  },
  {
    id: 'code-defensive-programming',
    category: 'code',
    categoryAr: 'هندسة الكود النظيف',
    categoryEn: 'Clean Code Practice',
    titleAr: 'البرمجة الدفاعية والتحقق من المدخلات',
    titleEn: 'Defensive Programming & Input Validation',
    bodyAr:
      'لا تفترض أبداً أن البيانات الخارجية، استجابات الـ API، أو مدخلات المستخدم سليمة تماماً. تحقق من الحدود (Boundaries) وتأكد من الـ Null Safety عند كل نقطة عبور بين الطبقات.',
    bodyEn:
      'Never assume external API payloads or user inputs are valid. Validate at the boundaries and enforce null-safety across all system tiers.',
    referenceAr: 'مبادئ الأمان الهندسي • Secure Coding',
    referenceEn: 'Robust System Architecture',
    tag: 'Security',
  },

  // ================= 2. MOTIVATION & PRODUCTIVITY (7 Items) =================
  {
    id: 'mot-deep-work',
    category: 'motivation',
    categoryAr: 'تحفيز وإنتاجية المبرمج',
    categoryEn: 'Developer Productivity',
    titleAr: 'حالة التدفق (Flow State) والتركيز العميق',
    titleEn: 'Flow State & Deep Work',
    bodyAr:
      'يحتاج المبرمج لنحو 15 إلى 20 دقيقة لاستعادة تركيزه بعد كل مقاطعة عابرة. أغلق الإشعارات غير الضرورية أثناء جلسات البرمجة، وامنح عقلك متعة الغوص في معمارية الحل.',
    bodyEn:
      'Context switching costs up to 20 minutes of regained focus. Silence notifications during coding blocks and protect your high-value flow state.',
    referenceAr: 'كال نيوپورت • كتاب Deep Work',
    referenceEn: 'Cal Newport • Deep Work',
    tag: 'Focus',
  },
  {
    id: 'mot-burnout',
    category: 'motivation',
    categoryAr: 'تحفيز وإنتاجية المبرمج',
    categoryEn: 'Developer Productivity',
    titleAr: 'الراحة استثمار وليست إهداراً للوقت',
    titleEn: 'Rest is Productive Recharging',
    bodyAr:
      'إذا تعقدت معك معضلة برمجية وبدأت تشعر بالإرهاق، فإن الابتعاد عن الشاشة والمشي 10 دقائق يمنح عقلك الباطن فرصة إعادة تنظيم الأفكار، وغالباً ما يأتيك الحل وأنت في استراحة.',
    bodyEn:
      'When stuck on an elusive bug, stepping away for a 10-minute walk lets your diffuse mode thinking work in the background. Rest often delivers the breakthrough.',
    referenceAr: 'علم الأعصاب والإبداع • Barbara Oakley',
    referenceEn: 'A Mind for Numbers • Focused vs Diffuse',
    tag: 'Wellness',
  },
  {
    id: 'mot-imposter',
    category: 'motivation',
    categoryAr: 'تحفيز وإنتاجية المبرمج',
    categoryEn: 'Developer Productivity',
    titleAr: 'متلازمة المحتال وطبيعة المجال المتجدد',
    titleEn: 'Embracing Learning in Tech',
    bodyAr:
      'لا أحد يعلم كل شيء في عالم البرمجة، والتقنيات تتجدد باستمرار. شعورك بأنك تحتاج للتعلم دائماً هو علامة نضج وتواضع معرفي، وليس نقصاً في كفاءتك.',
    bodyEn:
      'No engineer knows everything in this vast landscape. Feeling there is more to learn is proof of professional humility and curiosity, not impostor syndrome.',
    referenceAr: 'علم النفس المهني للتقنيين',
    referenceEn: 'Engineering Growth Mindset',
    tag: 'Mindset',
  },
  {
    id: 'mot-consistency',
    category: 'motivation',
    categoryAr: 'تحفيز وإنتاجية المبرمج',
    categoryEn: 'Developer Productivity',
    titleAr: 'قوة الخطوات اليومية الصغيرة (1% يومياً)',
    titleEn: 'The Power of 1% Daily Compounding',
    bodyAr:
      'تحسين مستواك البرمجي لا يتطلب سهر ليالٍ كاملة، بل التزاماً يومياً هادئاً. نصف ساعة يومية في تعلم نمط معماري أو قراءة كود مصدر تمنحك قفزة نوعية على مدار عام.',
    bodyEn:
      'Mastery compounds through steady daily practice. Thirty minutes of reading open-source code or exploring system design daily creates monumental growth in a year.',
    referenceAr: 'جيمس كلير • كتاب العادات الذرية Atomic Habits',
    referenceEn: 'James Clear • Atomic Habits',
    tag: 'Habits',
  },
  {
    id: 'mot-posture',
    category: 'motivation',
    categoryAr: 'تحفيز وإنتاجية المبرمج',
    categoryEn: 'Developer Productivity',
    titleAr: 'جسدك هو عتادك الأساسي (Hardware)',
    titleEn: 'Your Spine is Your Primary Hardware',
    bodyAr:
      'الكود العظيم يكتبه مبرمج سليم البدن؛ اضبط ارتفاع شاشتك على مستوى عينيك، وحافظ على استقامة ظهرك، وتذكر أن الوقاية خير من علاج آلام العنق والفقرات.',
    bodyEn:
      'Maintain ergonomic posture: elevate monitors to eye level and stretch regularly. Your health is the foundational hardware powering all your software.',
    referenceAr: 'إرشادات الصحة المهنية للمطورين',
    referenceEn: 'Ergonomics for Developers',
    tag: 'Health',
  },
  {
    id: 'mot-simplify',
    category: 'motivation',
    categoryAr: 'تحفيز وإنتاجية المبرمج',
    categoryEn: 'Developer Productivity',
    titleAr: 'البساطة قمة التطور والذكاء الهندسي',
    titleEn: 'Simplicity is the Ultimate Sophistication',
    bodyAr:
      'أي شخص يستطيع كتابة كود معقد يفهمه الحاسوب، لكن المبرمج البارع هو من يكتب كوداً بسيطاً وأنيقاً يسهل على البشر قراءته وصيانته بعد سنوات.',
    bodyEn:
      'Any fool can write code that a computer understands. Great programmers write clean, simple code that humans can understand and maintain effortlessly.',
    referenceAr: 'مارتن فاولر • هندسة البرمجيات',
    referenceEn: 'Martin Fowler • Software Craft',
    tag: 'Simplicity',
  },
  {
    id: 'mot-debugging-zen',
    category: 'motivation',
    categoryAr: 'تحفيز وإنتاجية المبرمج',
    categoryEn: 'Developer Productivity',
    titleAr: 'الهدوء التام عند تتبع الأخطاء المستعصية',
    titleEn: 'Zen of Systematic Debugging',
    bodyAr:
      'لا تخمّن ولا تعدل الكود عشوائياً بدافع التوتر. اعزل المشكلة، اقرأ رسالة الخطأ والـ Stack Trace بعناية، وتحقق من الفرضيات خطوة بخطوة.',
    bodyEn:
      'Never debug in panic mode with random code tweaks. Hypothesize, inspect the stack trace systematically, isolate the variable, and conquer the root cause.',
    referenceAr: 'منهجية التشخيص الهندسي',
    referenceEn: 'Systematic Problem Solving',
    tag: 'Debugging',
  },

  // ================= 3. PROPHETIC HADITHS & SPIRITUAL EXCELLENCE (7 Items) =================
  {
    id: 'hadith-ihsan',
    category: 'hadith',
    categoryAr: 'حديث نبوي شريف',
    categoryEn: 'Prophetic Hadith',
    titleAr: 'محبة الله لإتقان الصنعة والعمل',
    titleEn: 'Divine Love for Mastery & Ihsan',
    bodyAr:
      'قال رسول الله ﷺ: «إِنَّ اللَّهَ تَعَالَى يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ». الإتقان في هندسة البرمجيات يشمل كتابة كود نقي، واختباره بعناية، ومراعاة مصلحة المستخدم.',
    bodyEn:
      'Prophet Muhammad ﷺ said: "Verily, Allah loves that when anyone of you does a job, he performs it with excellence and mastery." Reflected in clean code, testing, and integrity.',
    referenceAr: 'رواه البيهقي وأبو يعلى • صححه الألباني',
    referenceEn: 'Narrated by Al-Bayhaqi • Sahih Al-Jami',
    tag: 'إتقان',
  },
  {
    id: 'hadith-hand',
    category: 'hadith',
    categoryAr: 'حديث نبوي شريف',
    categoryEn: 'Prophetic Hadith',
    titleAr: 'بركة كسب اليد والعمل النافع',
    titleEn: 'Virtue of Honorable Earning & Craft',
    bodyAr:
      'قال رسول الله ﷺ: «مَا أَكَلَ أَحَدٌ طَعَامًا قَطُّ خَيْرًا مِنْ أَنْ يَأْكُلَ مِنْ عَمَلِ يَدِهِ». كودك وحلولك الرقمية هي كسب يد شريف تنفع به أهلك ومجتمعك.',
    bodyEn:
      'The Prophet ﷺ said: "Nobody has ever eaten a better meal than that which he has earned by working with his own hands." Coding honorable digital solutions is noble earning.',
    referenceAr: 'صحيح البخاري • كتاب البيوع',
    referenceEn: 'Sahih Al-Bukhari • Book of Sales',
    tag: 'كسب_حلال',
  },
  {
    id: 'hadith-morning',
    category: 'hadith',
    categoryAr: 'حديث نبوي شريف',
    categoryEn: 'Prophetic Hadith',
    titleAr: 'دعوة النبي ﷺ بالبركة في البكور',
    titleEn: 'Blessings of Early Morning Productivity',
    bodyAr:
      'دعا النبي ﷺ لأمته فقال: «اللَّهُمَّ بَارِكْ لِأُمَّتِي فِي بُكُورِهَا». ساعات الصباح الأولى بعد صلاة الفجر تحمل صفاءً ذهنياً فائقاً لإنجاز أصعب المهام الهندسية والبرمجية.',
    bodyEn:
      'The Prophet ﷺ prayed: "O Allah, bless my Ummah in their early mornings." Early hours following Fajr offer unparalleled mental clarity for deep intellectual work.',
    referenceAr: 'سنن أبي داود والترمذي • حديث صحيح',
    referenceEn: 'Sunan Abi Dawud & At-Tirmidhi',
    tag: 'بركة_الوقت',
  },
  {
    id: 'hadith-strong-believer',
    category: 'hadith',
    categoryAr: 'حديث نبوي شريف',
    categoryEn: 'Prophetic Hadith',
    titleAr: 'المؤمن القوي علماً وعملاً وبدناً',
    titleEn: 'The Strong Believer in Skill and Faith',
    bodyAr:
      'قال رسول الله ﷺ: «الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ». قوة المؤمن تشمل التمكن من علمه وصنعته ونفع الناس بمهاراته التقنية.',
    bodyEn:
      'The Prophet ﷺ said: "The strong believer is better and more beloved to Allah than the weak believer, while there is good in both." Strength encompasses expertise and engineering excellence.',
    referenceAr: 'صحيح مسلم • كتاب القدر',
    referenceEn: 'Sahih Muslim • Book of Destiny',
    tag: 'قوة_المؤمن',
  },
  {
    id: 'hadith-benefit-people',
    category: 'hadith',
    categoryAr: 'حديث نبوي شريف',
    categoryEn: 'Prophetic Hadith',
    titleAr: 'أحب الناس إلى الله أنفعهم للناس',
    titleEn: 'The Most Beloved to Allah are the Most Beneficial',
    bodyAr:
      'سُئل رسول الله ﷺ: أي الناس أحب إلى الله؟ فقال: «أَحَبُّ النَّاسِ إِلَى اللَّهِ أَنْفَعُهُمْ لِلنَّاسِ». استشعر أن كل تطبيق ييسر حياة إنسان أو يدفع عنه مشقة هو باب للأجر المستمر.',
    bodyEn:
      'The Prophet ﷺ said: "The most beloved of people to Allah are those who bring the most benefit to people." Every tool you build that eases someone’s burden is an ongoing reward.',
    referenceAr: 'رواه الطبراني • السلسلة الصحيحة للألباني',
    referenceEn: 'Narrated by Al-Tabarani • Sahih',
    tag: 'نفع_الناس',
  },
  {
    id: 'hadith-trust',
    category: 'hadith',
    categoryAr: 'حديث نبوي شريف',
    categoryEn: 'Prophetic Hadith',
    titleAr: 'الأمانة في حفظ البيانات وأسرار العمل',
    titleEn: 'Integrity & Trustworthiness in Digital Systems',
    bodyAr:
      'قال رسول الله ﷺ: «أَدِّ الأَمَانَةَ إِلَى مَنِ ائْتَمَنَكَ وَلا تَخُنْ مَنْ خَانَكَ». أمانة المبرمج تتجلى في حماية خصوصية بيانات المستخدمين، وتأمين الثغرات، وعدم الغش في الكود.',
    bodyEn:
      'The Prophet ﷺ said: "Render back the trust to the one who entrusted you." For engineers, trust means safeguarding user data, hardening systems, and writing honest code.',
    referenceAr: 'سنن أبي داود والترمذي • صحيح',
    referenceEn: 'Sunan Abi Dawud • Hadith Sahih',
    tag: 'أمانة',
  },
  {
    id: 'hadith-intention',
    category: 'hadith',
    categoryAr: 'حديث نبوي شريف',
    categoryEn: 'Prophetic Hadith',
    titleAr: 'تحويل العمل الدنيوي إلى عبادة بالنية',
    titleEn: 'Transforming Work into Worship through Niyyah',
    bodyAr:
      'قال رسول الله ﷺ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى». نوّ في جلوسك أمام شاشتك إعفاف نفسك، ونفع أمتك، وتيسير شؤون الناس، ليكون وقتك كله عبادة.',
    bodyEn:
      'The Prophet ﷺ said: "Actions are judged by intentions." Set your intention before opening your IDE to support your family and benefit society, transforming engineering into worship.',
    referenceAr: 'متفق عليه • صحيح البخاري ومسلم',
    referenceEn: 'Muttafaq Alayh • Bukhari & Muslim',
    tag: 'نية_صالحة',
  },

  // ================= 4. WISDOM & PROFOUND APHORISMS (7 Items) =================
  {
    id: 'wis-ibn-qayyim-time',
    category: 'wisdom',
    categoryAr: 'حكمة وأثر عميق',
    categoryEn: 'Timeless Wisdom',
    titleAr: 'قيمة الوقت وعمارة اللحظة الحاضرة',
    titleEn: 'Treasuring Time & Mindful Presence',
    bodyAr:
      'قال الإمام ابن القيم رحمه الله: «إضاعة الوقت أشد من الموت؛ لأن إضاعة الوقت تقطعك عن الله والدار الآخرة، والموت يقطعك عن الدنيا وأهلها». استثمر دقائق عمرك فيما يبني أثرك وآخرتك.',
    bodyEn:
      'Imam Ibn al-Qayyim wrote: "Wasting time is worse than death, because wasting time severs you from Allah and the Hereafter, whereas death only severs you from this world."',
    referenceAr: 'الإمام ابن قيم الجوزية • كتاب الفوائد',
    referenceEn: 'Ibn al-Qayyim • Al-Fawa’id',
    tag: 'قيمة_الوقت',
  },
  {
    id: 'wis-shafii-perseverance',
    category: 'wisdom',
    categoryAr: 'حكمة وأثر عميق',
    categoryEn: 'Timeless Wisdom',
    titleAr: 'مرارة الصبر وحلاوة ثمرة التعلم',
    titleEn: 'Patience in Learning and Mastery',
    bodyAr:
      'قال الإمام الشافعي رحمه الله: «مَنْ لَمْ يَذُقْ مُرَّ التَّعَلُّمِ سَاعَةً • تَجَرَّعَ ذُلَّ الجَهْلِ طُولَ حَيَاتِهِ». الصبر على فهم الخوارزميات والمعماريات المعقدة يثمر تمكناً ورفعة مستمرة.',
    bodyEn:
      'Imam Al-Shafi’i wrote: "Whoever does not taste the bitterness of learning for an hour will swallow the humiliation of ignorance for the rest of his life." Persist in deep study.',
    referenceAr: 'ديوان الإمام الشافعي',
    referenceEn: 'Diwan Al-Imam Al-Shafi’i',
    tag: 'طلب_العلم',
  },
  {
    id: 'wis-hasan-basri-days',
    category: 'wisdom',
    categoryAr: 'حكمة وأثر عميق',
    categoryEn: 'Timeless Wisdom',
    titleAr: 'ابن آدم إنما أنت أيام',
    titleEn: 'You are but a Collection of Days',
    bodyAr:
      'قال الحسن البصري رحمه الله: «يا ابن آدم، إنما أنت أيام، كلما ذهب يوم ذهب بعضك». لا ترضَ أن ينقضي يومك دون أن تترك فيه بصمة كود متقنة، أو علماً نافعاً، أو سجدة خاشعة.',
    bodyEn:
      'Al-Hasan al-Basri said: "O son of Adam, you are but days; whenever a day passes, a part of you has gone." Fill your days with sincere craftsmanship and devotion.',
    referenceAr: 'سير أعلام النبلاء • الحسن البصري',
    referenceEn: 'Siyar A’lam al-Nubala’',
    tag: 'عمارة_العمر',
  },
  {
    id: 'wis-ali-value',
    category: 'wisdom',
    categoryAr: 'حكمة وأثر عميق',
    categoryEn: 'Timeless Wisdom',
    titleAr: 'قيمة كل امرئ ما يحسنه',
    titleEn: 'Every Person’s Worth is in What They Master',
    bodyAr:
      'رُوي عن علي بن أبي طالب رضي الله عنه: «قِيمَةُ كُلِّ امْرِئٍ مَا يُحْسِنُهُ». كلما تعمقت في تخصصك، وأتقنت أدواتك، وركبت الصعب في الفهم، علت قيمتك وأثرك في أمتك.',
    bodyEn:
      'Attributed to Ali ibn Abi Talib (RA): "The value of every person lies in what they do with mastery." Deepen your craft and raise the bar of your technical excellence.',
    referenceAr: 'نهج البلاغة • حكم مأثورة',
    referenceEn: 'Wisdom of Ali ibn Abi Talib',
    tag: 'إتقان_الصنعة',
  },
  {
    id: 'wis-linus-talking',
    category: 'wisdom',
    categoryAr: 'حكمة وأثر عميق',
    categoryEn: 'Timeless Wisdom',
    titleAr: 'الكلام رخيص.. أرني الكود!',
    titleEn: 'Talk is Cheap. Show Me the Code!',
    bodyAr:
      '«Talk is cheap. Show me the code.» — الأفكار والنظريات كثيرة، لكن الفارق يصنعه من يجلس لينفذ ويبني ويحل المشاكل على أرض الواقع بهدوء وتواضع.',
    bodyEn:
      '"Talk is cheap. Show me the code." — Theories are abundant, but enduring value is created by those who sit down, build, test, and ship working solutions.',
    referenceAr: 'لينوس تورفالدس • مؤسس Linux وGit',
    referenceEn: 'Linus Torvalds • Creator of Linux & Git',
    tag: 'Execution',
  },
  {
    id: 'wis-knuth-premature',
    category: 'wisdom',
    categoryAr: 'حكمة وأثر عميق',
    categoryEn: 'Timeless Wisdom',
    titleAr: 'التحسين المبكر أصل كل الشرور',
    titleEn: 'Premature Optimization is the Root of All Evil',
    bodyAr:
      'قال دونالد كنوث: «Premature optimization is the root of all evil». اكتب كوداً صحيحاً وواضحاً أولاً، ثم قِس الأداء (Profile) قبل أن تعقد التصميم بدافع تسريع غير مبرر.',
    bodyEn:
      'Donald Knuth noted: "Premature optimization is the root of all evil." Make it work, make it clear, measure real performance, and only then optimize bottlenecks.',
    referenceAr: 'دونالد كنوث • The Art of Computer Programming',
    referenceEn: 'Donald Knuth • Computer Science Pioneer',
    tag: 'Optimization',
  },
  {
    id: 'wis-steve-craft',
    category: 'wisdom',
    categoryAr: 'حكمة وأثر عميق',
    categoryEn: 'Timeless Wisdom',
    titleAr: 'جمال الصنعة حتى في الأجزاء الخفية',
    titleEn: 'Craftsmanship Even Behind the Walls',
    bodyAr:
      '«عندما تكون نجاراً ماهراً، فإنك لا تستخدم خشباً رديئاً لظهر الخزانة حتى لو كان مواجهاً للحائط ولن يراه أحد». المبرمج الحق يتقن الكود الداخلي بنفس شغف إتقانه لواجهة المستخدم.',
    bodyEn:
      '"When you’re a carpenter making a beautiful chest of drawers, you’re not going to use plywood on the back, even though it faces the wall." True craft shines in the hidden code.',
    referenceAr: 'ستيف جوبز • فلسفة الإتقان في التصميم',
    referenceEn: 'Steve Jobs • Philosophy of Craft',
    tag: 'Craftsmanship',
  },
  // ================= 5. WAQAR & MODESTY REFLECTIONS (3 Items) =================
  {
    id: 'wis-waqar-crown',
    category: 'waqar',
    categoryAr: 'وَقار وعفاف',
    categoryEn: 'Waqar & Modesty',
    titleAr: 'تاج الحياء للمبرمجة المسلمة',
    titleEn: 'Modesty: The Muslimah Dev’s Crown',
    bodyAr:
      '«حجابك الفضفاض ليس مجرد زي، بل طاعة وعبادة مستمرة ترتقين بها عند الله.. كوني فخورة بحيائك وتميزك وسط صخب بيئة العمل التقنية».',
    bodyEn:
      'Your loose, modest hijab is an ongoing act of devotion and honor. Stand proud of your modesty and faith amidst tech sprints.',
    referenceAr: 'رسائل وَقار • سند المُبرمج',
    referenceEn: 'Waqar Reflections • Sanad Dev',
    tag: 'Waqar',
  },
  {
    id: 'wis-waqar-poise',
    category: 'waqar',
    categoryAr: 'وَقار وعفاف',
    categoryEn: 'Waqar & Modesty',
    titleAr: 'شموخ الفكر والستر الفضفاض',
    titleEn: 'Dignity of Intellect & Modesty',
    bodyAr:
      '«بين سطور الكود وإنجاز المهام البرمجية، وقارك وزيّك الساتر هو التاج الحقيقي الذي يزين علمك ومهارتك الهندسية».',
    bodyEn:
      'Between lines of code and solved tickets, your modest attire and dignified presence are the true crown adorning your intellect.',
    referenceAr: 'رسائل وَقار • سند المُبرمج',
    referenceEn: 'Waqar Reflections • Sanad Dev',
    tag: 'Waqar',
  },
  {
    id: 'wis-waqar-respect',
    category: 'waqar',
    categoryAr: 'وَقار وعفاف',
    categoryEn: 'Waqar & Modesty',
    titleAr: 'هيبة الحجاب في بيئة العمل التقنية',
    titleEn: 'Workplace Poise & Reverence',
    bodyAr:
      '«حياؤك ووقارك في اجتماعات العمل والتواصل المهني لا ينقص من كفاءتك، بل يفرض احترام الجميع لعقلك وفكرك وإبداعك الهندسي».',
    bodyEn:
      'Your modesty in meetings and communication never diminishes your value; it commands respect for your mind and engineering prowess.',
    referenceAr: 'رسائل وَقار • سند المُبرمج',
    referenceEn: 'Waqar Reflections • Sanad Dev',
    tag: 'Waqar',
  },
]
