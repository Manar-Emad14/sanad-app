// Sanad Dev - Service Worker (Offline-First Architecture & Resilient Scheduler)
// Supervised & developed by Eng. Manar Emad

const CACHE_NAME = 'sanad-dev-shell-v14'
const STATE_CACHE_NAME = 'sanad-sw-state-v1'
const QURAN_AUDIO_CACHE_NAME = 'sanad-quran-audio-v1'
const STATE_URL = '/__sanad_sw_state__'
const APP_ICON_URL = self.location.origin + '/icon-192.png'
const APP_ORIGIN = self.location.origin

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/favicon.svg',
  '/icon-sanad.svg',
  '/icons.svg',
  '/logo.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/audio/cairo-adhan.mp3',
  '/audio/makkah-adhan.mp3',
  '/audio/madinah-adhan.mp3',
  '/audio/alaqsa-adhan.mp3',
  '/audio/mustafa-ismail-adhan.mp3',
  '/audio/salawat.mp3',
  '/audio/takbeerat.mp3',
  '/audio/waqar-chime.wav',
  '/quran-surahs-meta.json',
  '/quran-uthmani.json',
]

// ================= DATASETS: SALAWAT, DHIKR, ISHRAQA, WAQAR, PEACE, EVENING, CHALLENGES =================
const SALAWAT_LIST = [
  {
    titleAr: 'سند المُبرمج • الصلاة على النبي ﷺ',
    titleEn: 'Sanad Dev • Salawat on the Prophet ﷺ',
    bodyAr: '«اللهم صلِّ وسلِّم وبارك على نبينا محمد وعلى آله وصحبه أجمعين» • أقبل على عملك بسكينة وبركة ونور.',
    bodyEn: 'O Allah, bestow peace and blessings upon Prophet Muhammad ﷺ. Approach your code with serenity and purpose.',
  },
  {
    titleAr: 'سند المُبرمج • الصلاة على النبي ﷺ',
    titleEn: 'Sanad Dev • Salawat on the Prophet ﷺ',
    bodyAr: '«إن أولى الناس بي يوم القيامة أكثرهم عليّ صلاة» • استراحة قصيرة وعطّر لسانك بالصلاة على الحبيب ﷺ.',
    bodyEn: '"The closest of people to me on the Day of Resurrection are those who sent the most blessings upon me." • Pause and invoke peace upon the Prophet.',
  },
  {
    titleAr: 'سند المُبرمج • الصلاة على النبي ﷺ',
    titleEn: 'Sanad Dev • Salawat on the Prophet ﷺ',
    bodyAr: '«من صلى عليّ صلاة صلى الله عليه بها عشراً» • جدد نشاطك الذهني واشرب كوب ماء مع الصلاة على نبينا محمد ﷺ.',
    bodyEn: 'Refresh your focus, hydrate, and invoke peace upon Prophet Muhammad ﷺ.',
  },
  {
    titleAr: 'سند المُبرمج • الصلاة على النبي ﷺ',
    titleEn: 'Sanad Dev • Salawat on the Prophet ﷺ',
    bodyAr: '«يا أيها الذين آمنوا صلوا عليه وسلموا تسليماً» • الصلاة على خير الأنام تفرّج الكرب وتشرح الصدر وتيسر العسير.',
    bodyEn: 'Invoking peace upon the Prophet relieves distress, brings peace to the heart, and eases every challenge.',
  },
  {
    titleAr: 'سند المُبرمج • الصلاة على النبي ﷺ',
    titleEn: 'Sanad Dev • Salawat on the Prophet ﷺ',
    bodyAr: '«البخيل من ذُكِرتُ عنده فلم يُصَلِّ عليّ» • عطّر لسانك بالصلاة على نبي الهدى والرحمة المهداة ﷺ.',
    bodyEn: 'Enrich your tongue with salawat upon the Messenger of guidance and mercy ﷺ.',
  },
]

const DHIKR_LIST = [
  {
    titleAr: 'سند المُبرمج • استغفار وتيسير',
    titleEn: 'Sanad Dev • Istighfar & Relief',
    bodyAr: '«أستغفر الله العظيم وأتوب إليه» • كثرة الاستغفار تفتح مغاليق الفهم وتيسر حل المشكلات البرمجية المعقدة.',
    bodyEn: '"Astaghfirullah wa atoobu ilayh" • Seeking forgiveness brings clarity of mind and opens solutions to complex challenges.',
  },
  {
    titleAr: 'سند المُبرمج • تسبيح وبركة',
    titleEn: 'Sanad Dev • Tasbih & Renewal',
    bodyAr: '«سبحان الله وبحمده، سبحان الله العظيم» • كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن.',
    bodyEn: '"Subhanallahi wa bihamdihi, Subhanallahil-Azeem" • Words light on the tongue yet heavy in the divine scales.',
  },
  {
    titleAr: 'سند المُبرمج • حوقلة وتوكل',
    titleEn: 'Sanad Dev • Trust & Reliance',
    bodyAr: '«لا حول ولا قوة إلا بالله العلي العظيم» • استعن بحول الله وقوته في كل سطر كود وخوارزمية تبنيها.',
    bodyEn: '"La hawla wa la quwwata illa billah" • Rely upon divine strength in every sprint and algorithm.',
  },
  {
    titleAr: 'سند المُبرمج • تفريج الكروب',
    titleEn: 'Sanad Dev • Relief from Stress',
    bodyAr: '«لا إله إلا أنت سبحانك إني كنت من الظالمين» • دعاء ذي النون لتفريج الضيق وإزالة التوتر وتيسير المهام.',
    bodyEn: '"La ilaha illa Anta subhanaka inni kuntu minaz-zalimeen" • The prayer that eases hardship and relieves tension.',
  },
  {
    titleAr: 'سند المُبرمج • تجديد النية الصالحة',
    titleEn: 'Sanad Dev • Sincere Intention',
    bodyAr: '«إنما الأعمال بالنيات» • انوِ بعملك البرمجي نفع المسلمين والناس وعمارة الأرض بما يرضي الله.',
    bodyEn: '"Actions are by intentions." • Sincerity in intentions turns engineering effort into lasting worship.',
  },
]

// إشراقة سَنَد • SANAD ISHRAQA & WISDOM BANK
const SANAD_ISHRAQA_LIST = [
  {
    titleAr: 'إشراقة سَنَد • الإتقان والبركة',
    titleEn: 'Sanad Ishraqa • Excellence & Barakah',
    bodyAr: '«إن الله يحب إذا عمل أحدكم عملاً أن يتقنه» • نظافة شفرتك البرمجية وحسن بنيتها المعمارية أمانة ومظهر من مظاهر الإتقان الإسلامي.',
    bodyEn: '"Allah loves when one of you does a job, they do it with excellence." Code cleanliness and architecture reflect true craftsmanship.',
    referenceAr: 'الحديث الشريف',
    referenceEn: 'Prophetic Guidance',
  },
  {
    titleAr: 'إشراقة سَنَد • بركة الوقت والنية',
    titleEn: 'Sanad Ishraqa • Time & Intention',
    bodyAr: 'ابدأ جلستك البرمجية ببسم الله، وجدد نيتك بأن يكون علمك نافعاً للأمة وعوناً للناس.. النية الصالحة تحول الجهد الهندسي إلى عبادة مستمرة.',
    bodyEn: 'Begin your coding with Bismillah and intend to benefit people. Sincere intention turns technical effort into worship.',
    referenceAr: 'أدب المهندس المسلم',
    referenceEn: 'Muslim Engineer Ethos',
  },
  {
    titleAr: 'إشراقة سَنَد • صفاء الذهن واستراحة المطور',
    titleEn: 'Sanad Ishraqa • Mental Clarity & Rest',
    bodyAr: 'الراحة المنتظمة ليست تضييعاً للوقت بل هي إعادة شحن للبصيرة.. ابتعد عن الشاشة بضع دقائق، تحرك، وتنفس بعمق.',
    bodyEn: 'Rest is not lost time; it recharges insight. Step away from your monitor, move around, and breathe deeply.',
    referenceAr: 'الصحة والإنتاجية',
    referenceEn: 'Health & Focus',
  },
  {
    titleAr: 'إشراقة سَنَد • الصبر عند حل الأخطاء (Bugs)',
    titleEn: 'Sanad Ishraqa • Patience in Debugging',
    bodyAr: 'كل خطأ برمجي مستعصٍ تواجهه هو فرصة لاكتساب علم جديد وتدريب على الصبر الجميل.. استعن بالله ولا تعجز.',
    bodyEn: 'Every stubborn bug is a hidden lesson in patience and deep learning. Seek Allah’s help and never feel helpless.',
    referenceAr: 'أخلاق المبرمج',
    referenceEn: 'Engineering Poise',
  },
  {
    titleAr: 'إشراقة سَنَد • التواضع عند الإنجاز',
    titleEn: 'Sanad Ishraqa • Humility in Achievement',
    bodyAr: 'إذا أتممت مشروعك ونجحت شفرتك البرمجية، فانسب الفضل لصاحب الفضل: «وما توفيقي إلا بالله».. التواضع زكاة العلم.',
    bodyEn: 'When your project deploys successfully, attribute success to the Provider: "My success is only by Allah."',
    referenceAr: 'القرآن الكريم',
    referenceEn: 'Holy Quran',
  },
]

// ================= رسائل وَقار • الأخوات (42 رسالة حياء وعفاف وحجاب) =================
const WAQAR_FEMALE_MESSAGES = [
  {
    "id": "waqar-1",
    "titleAr": "وَقار • تاج الحياء للمبرمجة",
    "titleEn": "Waqar • Crown of Modesty",
    "bodyAr": "«حجابك الفضفاض ليس مجرد زي، بل طاعة وعبادة مستمرة ترتقين بها عند الله.. كوني فخورة بحيائك وتميزك وسط صخب بيئة العمل التقنية»",
    "bodyEn": "Your modest, loose hijab is not merely attire; it is an ongoing act of worship. Stand proud of your modesty and faith amidst tech sprints.",
    "themeTagAr": "طاعة واعتزاز",
    "themeTagEn": "Faith & Pride"
  },
  {
    "id": "waqar-2",
    "titleAr": "وَقار • شموخ الفكر والستر",
    "titleEn": "Waqar • The Muslimah Dev Poise",
    "bodyAr": "«بين سطور الكود وإنجاز المهام البرمجية، وقارك وزيّك الساتر هو التاج الحقيقي الذي يزين علمك ومهارتك الهندسية»",
    "bodyEn": "Between lines of code and solved tickets, your modest attire and dignified presence are the true crown adorning your intellect.",
    "themeTagAr": "علم وحياء",
    "themeTagEn": "Knowledge & Dignity"
  },
  {
    "id": "waqar-3",
    "titleAr": "وَقار • بهاء الحجاب الشرعي",
    "titleEn": "Waqar • The Grace of Modesty",
    "bodyAr": "«الستر الفضفاض يزيد المرأة هيبة ونوراً في كل محفل.. اجعلي زيّك رسالة صامتة تعكس إيمانك وعمق اعتزازك بهويتك الإسلامية»",
    "bodyEn": "Loose modest attire bestows aura, dignity, and divine light in every professional setting. Let your presence silently reflect your values.",
    "themeTagAr": "هيبة ونور",
    "themeTagEn": "Grace & Aura"
  },
  {
    "id": "waqar-4",
    "titleAr": "وَقار • نقاء في بيئة العمل التقنية",
    "titleEn": "Waqar • Purity at the Workplace",
    "bodyAr": "«حياؤك ووقارك في اجتماعات العمل والتواصل المهني لا ينقص من كفاءتك، بل يفرض احترام الجميع لعقلك وفكرك وإبداعك»",
    "bodyEn": "Your modesty in meetings and professional communication never diminishes your value; it commands respect for your mind and creativity.",
    "themeTagAr": "احترام واحترافية",
    "themeTagEn": "Professional Respect"
  },
  {
    "id": "waqar-5",
    "titleAr": "وَقار • ثبات واعتزاز بالهوية",
    "titleEn": "Waqar • Steadfastness & Honor",
    "bodyAr": "«طوبى لمهندسة تمسكت بحجابها الشرعي التام في زمن الماديات.. أنتِ حارسة للقيم وسفيرة للهدى والجمال الإيماني الراقي»",
    "bodyEn": "Blessed is the engineer holding firmly to full Islamic hijab in a materialistic era; you are an ambassador of purity and faith.",
    "themeTagAr": "ثبات على المبدأ",
    "themeTagEn": "Steadfast Principles"
  },
  {
    "id": "waqar-6",
    "titleAr": "وَقار • اللؤلؤة المصونة",
    "titleEn": "Waqar • The Preserved Pearl",
    "bodyAr": "«اللؤلؤة المصونة لا يراها إلا من يستحق.. ستر محاسنك طاعة لربك وصيانة لقلبك ونقاء روحك من كل كدر»",
    "bodyEn": "Like a cherished pearl, modesty shields your soul and preserves your heart in obedience to your Lord.",
    "themeTagAr": "عفاف وطهارة",
    "themeTagEn": "Purity of Soul"
  },
  {
    "id": "waqar-7",
    "titleAr": "وَقار • بصمة مهنية عفيفة",
    "titleEn": "Waqar • Pure Professionalism",
    "bodyAr": "«تألقي بروعة برمجتك وجودة خوارزمياتك، ودعي وقارك الشرعي يتحدث عن أصالة مبادئك ورقي تربيتك وأخلاقك»",
    "bodyEn": "Shine through algorithmic excellence and code craftsmanship, while your Islamic poise reflects noble character.",
    "themeTagAr": "إتقان وسمو",
    "themeTagEn": "Excellence & Poise"
  },
  {
    "id": "waqar-8",
    "titleAr": "وَقار • عبادة مستمرة في ساعات العمل",
    "titleEn": "Waqar • Continuous Worship in Sprint",
    "bodyAr": "«كل دقيقة تقضينها في مكتبك وأنتِ مرتدية زيّك الساتر الفضفاض، تُكتب لكِ في ميزان حسناتك طاعة دائمة متجددة لا تنقطع»",
    "bodyEn": "Every minute at your workstation in loose, modest attire is recorded in your scales as continuous, renewed worship.",
    "themeTagAr": "أجر متواصل",
    "themeTagEn": "Continuous Reward"
  },
  {
    "id": "waqar-9",
    "titleAr": "وَقار • قدوة مباركة للأجيال",
    "titleEn": "Waqar • An Inspiring Role Model",
    "bodyAr": "«أنتِ لستِ مجرد مبرمجة ماهرة، بل قدوة ملهمة لأخواتك وبنات جيلك بأن التفوق التقني والستر الشرعي قرينان لا يفترقان»",
    "bodyEn": "You prove to the upcoming generation of tech girls that technical excellence and Islamic modesty are inseparable partners.",
    "themeTagAr": "قدوة ملهمة",
    "themeTagEn": "Role Model"
  },
  {
    "id": "waqar-10",
    "titleAr": "وَقار • سكينة القلب والضمير",
    "titleEn": "Waqar • Serenity of Heart",
    "bodyAr": "«ما أجمل أن تنتهي جلسة البرمجة اليومية وأنتِ هادئة البال، قد أرضيتِ ربك وحفظتِ عهدك الصادق مع الحياء والعفاف»",
    "bodyEn": "Ending your daily coding sprint with profound inner peace, knowing you pleased Allah and kept your pledge of modesty.",
    "themeTagAr": "راحة الضمير",
    "themeTagEn": "Inner Peace"
  },
  {
    "id": "waqar-11",
    "titleAr": "وَقار • أجر الصبر والاحتساب",
    "titleEn": "Waqar • Rewarded Patient Effort",
    "bodyAr": "«كل مجاهدة تبذلينها للالتزام بالحجاب الشرعي السابغ في بيئات العمل المتنوعة، يراها الله بلطفه ويثيبك عليها أعظم الثواب»",
    "bodyEn": "Every effort made to maintain full, modest clothing in diverse workplaces is seen by Allah and rewarded abundantly.",
    "themeTagAr": "صبر واحتساب",
    "themeTagEn": "Patient Devotion"
  },
  {
    "id": "waqar-12",
    "titleAr": "وَقار • رداء التقوى والعفاف",
    "titleEn": "Waqar • The Garment of Taqwa",
    "bodyAr": "«﴿وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ﴾.. الستر الظاهر يغذي طمأنينة الباطن، ويجعل في محياك نوراً إيمانياً وضاحاً يفيض سكينة»",
    "bodyEn": "\"And the garment of piety—that is best.\" Outward modesty nurtures inward peace and illuminates your aura with faith.",
    "themeTagAr": "لباس التقوى",
    "themeTagEn": "Garment of Piety"
  },
  {
    "id": "waqar-13",
    "titleAr": "وَقار • وقار التخاطب والتعامل المهني",
    "titleEn": "Waqar • Grace in Interaction",
    "bodyAr": "«الوقار منظومة متكاملة: زيٌ ساتر سابغ، وأسلوب راقٍ محتشم في مراسلات العمل والاجتماعات، وجدية وأمانة في أداء الواجب»",
    "bodyEn": "Waqar is a complete virtue: modest dress, refined professional speech, and utmost integrity in technical duty.",
    "themeTagAr": "سمت الصالحات",
    "themeTagEn": "Righteous Conduct"
  },
  {
    "id": "waqar-14",
    "titleAr": "وَقار • عزة المبدأ في الفضاء الرقمي",
    "titleEn": "Waqar • Pride in Digital Space",
    "bodyAr": "«لا تجاملي في ثوابت حجابك وزيّك؛ فالعالم التقني يحترم أصحاب المبادئ الواثقين، وخالق الكون أعظم وأجلّ من كل المعايير»",
    "bodyEn": "Never compromise on Islamic dress codes; the tech world respects principled confidence, and Allah is greatest above all.",
    "themeTagAr": "ثقة واعتزاز",
    "themeTagEn": "Principled Confidence"
  },
  {
    "id": "waqar-15",
    "titleAr": "وَقار • بركة العمل والتوفيق الإلهي",
    "titleEn": "Waqar • Divine Blessings & Barakah",
    "bodyAr": "«حين تبدئين يومك التقني بستر شرعي يرضي الله، تتنزل عليك البركات وييسر الله لك حل أعقد المشكلات البرمجية المستعصية»",
    "bodyEn": "When your dev day starts pleasing Allah in modest attire, divine blessings ease the most stubborn software bugs.",
    "themeTagAr": "بركة وتوفيق",
    "themeTagEn": "Divine Barakah"
  },
  {
    "id": "waqar-16",
    "titleAr": "وَقار • تحرير الروح من قيود المظاهر",
    "titleEn": "Waqar • True Liberation",
    "bodyAr": "«حجابك الساتر ليس قيداً، بل هو تحرير حقيقي لإنسانيتك من قيود المظاهر السطحية، ليكون تركيز الجميع على جوهر عقلك وعظيم فضلك»",
    "bodyEn": "Your modest hijab liberates you from superficial vanity, ensuring your sharp mind and intellect take center stage.",
    "themeTagAr": "حرية الروح",
    "themeTagEn": "Spiritual Freedom"
  },
  {
    "id": "waqar-17",
    "titleAr": "وَقار • وريثة الصالحات وأمهات المؤمنين",
    "titleEn": "Waqar • Emulating the Righteous",
    "bodyAr": "«كوني كأمهات المؤمنين والصالحات: قمة في الحياء والستر، وقمة في نفع الأمة والمجتمع بما وهبكِ الله من علم وذكاء وبصيرة»",
    "bodyEn": "Walk in the footsteps of the Mothers of the Believers: the pinnacle of modesty and the summit of beneficial service to humanity.",
    "themeTagAr": "اقتداء بالصالحات",
    "themeTagEn": "Noble Heritage"
  },
  {
    "id": "waqar-18",
    "titleAr": "وَقار • دعاء الحفظ والستر الجميل",
    "titleEn": "Waqar • Supplication for Divine Cover",
    "bodyAr": "«اللهم استرنا بسترك الجميل، واجعل تحت الستر ما ترضى به عنا.. استعيني بربك في كل خطوة، فإنه نعم المولى ونعم النصير»",
    "bodyEn": "O Allah, veil us with Your beautiful grace, and make all that is concealed pleasing to You. Seek Allah in every step.",
    "themeTagAr": "ستر ودعاء",
    "themeTagEn": "Prayer for Grace"
  },
  {
    "id": "waqar-19",
    "titleAr": "وَقار • صيانة اللسان وطيب الكلم",
    "titleEn": "Waqar • Purity of Speech",
    "bodyAr": "«حياء المسلمة يظهر في منطقها وطيب كلامها، فتنزه لسانها عن الغيبة والمزاح المبتذل؛ فالكلمة الطيبة صدقة ورفعة»",
    "bodyEn": "A Muslimah’s modesty shines through refined speech, abstaining from gossip and trivial banter. Kind words are enduring charity.",
    "themeTagAr": "طيب الكلام",
    "themeTagEn": "Refined Speech"
  },
  {
    "id": "waqar-20",
    "titleAr": "وَقار • حياء المشية وهيبة السمت",
    "titleEn": "Waqar • Dignified Composure",
    "bodyAr": "«﴿فَجَاءَتْهُ إِحْدَاهُمَا تَمْشِي عَلَى اسْتِحْيَاءٍ﴾ • سارعي في مشيتك بهدوء ووقار؛ فالحياء في السمت والحركة يبعث في النفوس إجلالاً واحتراماً»",
    "bodyEn": "\"Then one of the two women came to him walking with modesty.\" A calm, dignified gait inspires admiration and deep respect.",
    "themeTagAr": "حياء وسمت",
    "themeTagEn": "Modest Walk"
  },
  {
    "id": "waqar-21",
    "titleAr": "وَقار • أمانة المراسلات الرقمية",
    "titleEn": "Waqar • Digital Communication Poise",
    "bodyAr": "«اجعلي رسائلك في قنوات العمل (Slack / Teams) واضحة، مهنية، محتشمة، لا تكلف فيها ولا خضوع بالقول؛ عزة المؤمنة تظهر في كل حرف»",
    "bodyEn": "Keep workplace messages professional, concise, and dignified. An honorable believer shines through every typed character.",
    "themeTagAr": "تواصل مهني راقٍ",
    "themeTagEn": "Digital Dignity"
  },
  {
    "id": "waqar-22",
    "titleAr": "وَقار • غض البصر وطهارة السريرة",
    "titleEn": "Waqar • Guarding the Gaze",
    "bodyAr": "«﴿وَقُل لِّلْمُؤْمِنَاتِ يَغْضُضْنَ مِنْ أَبْصَارِهِنَّ﴾ • غض البصر في الواقع وعلى شاشات الإنترنت يورث حلاوة في القلب ونوراً في البصيرة»",
    "bodyEn": "\"And tell the believing women to lower their gaze.\" Guarding your eyes offline and online blesses the heart with spiritual sweetness.",
    "themeTagAr": "طهارة القلب",
    "themeTagEn": "Heart Purity"
  },
  {
    "id": "waqar-23",
    "titleAr": "وَقار • جمال الجوهر وعمق الفكر",
    "titleEn": "Waqar • Beauty of Intellect",
    "bodyAr": "«المرأة المسلمة تستمد قيمتها من تقواها وعلمها وصلاحها، لا من معايير الموضة الزائلة.. عقلك السديد وحياؤك أعظم زينتك»",
    "bodyEn": "A Muslim woman draws her worth from piety, knowledge, and virtue, not ephemeral fashion trends. Your intellect is your true jewel.",
    "themeTagAr": "قيمة وجوهر",
    "themeTagEn": "True Worth"
  },
  {
    "id": "waqar-24",
    "titleAr": "وَقار • الخضوع بالقول صيانة للنفس",
    "titleEn": "Waqar • Guarding Tone of Voice",
    "bodyAr": "«﴿فَلَا تَخْضَعْنَ بِالْقَوْلِ فَيَطْمَعَ الَّذِي فِي قَلْبِهِ مَرَضٌ﴾ • جديتك ونبرتك الوقورة في الاجتماعات حاجز يحمي حدودك ويبني هيبتك»",
    "bodyEn": "\"Do not be soft in speech, lest he in whose heart is disease should covet.\" A poised, dignified voice commands respect.",
    "themeTagAr": "عفة الكلام",
    "themeTagEn": "Guarded Voice"
  },
  {
    "id": "waqar-25",
    "titleAr": "وَقار • العفاف في الفضاء العام",
    "titleEn": "Waqar • Modesty in Public Life",
    "bodyAr": "«في السوق، في المواصلات، في قاعات المؤتمرات.. كوني دائماً صاحبة السمت الهادئ والزي السابغ الذي يبعث الطمأنينة والإجلال»",
    "bodyEn": "In transit, conferences, or markets, maintain a calm presence and modest coverage that radiates reassurance and grace.",
    "themeTagAr": "سمت عام",
    "themeTagEn": "Public Poise"
  },
  {
    "id": "waqar-26",
    "titleAr": "وَقار • بر الوالدين وحسن العشرة",
    "titleEn": "Waqar • Familial Duty & Warmth",
    "bodyAr": "«وقارك مع أسرتك ووالديك بخفض الجناح ولين الجانب وطيب المعاملة هو صلب دينك.. الحياء مع الغرباء يقابله برٌّ ورحمة مع الأهل»",
    "bodyEn": "True dignity begins at home: lowering wings of humility with parents and family with gentleness and warmth.",
    "themeTagAr": "بر ورحمة",
    "themeTagEn": "Family Honor"
  },
  {
    "id": "waqar-27",
    "titleAr": "وَقار • الحياء شعبة من الإيمان",
    "titleEn": "Waqar • Modesty is Faith",
    "bodyAr": "«قال رسول الله ﷺ: «الحَيَاءُ شُعْبَةٌ مِنَ الإِيمَانِ».. فكلما زاد حياؤك زاد إيمانك، وإذا اجتمع العلم الشرعي مع التميز التقني ارتقت الأمة»",
    "bodyEn": "Prophet Muhammad ﷺ said: \"Modesty is a branch of faith.\" When technical mastery marries faith and modesty, nations rise.",
    "themeTagAr": "إيمان وحياء",
    "themeTagEn": "Faith & Shyness"
  },
  {
    "id": "waqar-28",
    "titleAr": "وَقار • ثبات الأخت الكبرى والمربية",
    "titleEn": "Waqar • Leading by Example",
    "bodyAr": "«أخواتك وبنات محيطك يراقبن ثباتك على الحجاب الشرعي.. بتمسكك ونجاحك تقدمين درساً حياً في الجمع بين التدين والتفوق العلمي»",
    "bodyEn": "Younger sisters and girls watch your steadfastness. Your achievements in modest hijab teach living lessons in faith and excellence.",
    "themeTagAr": "أثر صالح",
    "themeTagEn": "Living Inspiration"
  },
  {
    "id": "waqar-29",
    "titleAr": "وَقار • الحجاب حماية وستر",
    "titleEn": "Waqar • Shield & Protection",
    "bodyAr": "«الحجاب الشرعي ليس قطعة قماش، بل هو أمر إلهي محكم يحميكِ ويصونك.. حين تلبسينه فأنكِ تتزينين بأمر رب السماوات والأرض»",
    "bodyEn": "The Islamic veil is a divine decree that shields and honors you. Wearing it is adorned compliance with your Creator.",
    "themeTagAr": "حماية إلهية",
    "themeTagEn": "Divine Shield"
  },
  {
    "id": "waqar-30",
    "titleAr": "وَقار • الصدق في المجاهدة",
    "titleEn": "Waqar • Sincere Striving",
    "bodyAr": "«﴿وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا﴾ • كل مجاهدة لهوى النفس ولضغوط المظاهر يتبعها الله بنور وهداية وتثبيت لا ينفد»",
    "bodyEn": "\"Those who strive for Us—We will surely guide them to Our ways.\" Every struggle against vanity brings divine guidance.",
    "themeTagAr": "مجاهدة النفس",
    "themeTagEn": "Inner Striving"
  },
  {
    "id": "waqar-31",
    "titleAr": "وَقار • الترفع عن سفاسف الأمور",
    "titleEn": "Waqar • Rising Above Trivialities",
    "bodyAr": "«المسلمة الوقورة لا تنشغل بالجدال العقيم ولا بمتابعة سفاسف منصات التواصل.. وقتك وفكرك أثمن من أن يضيع في غير نفع»",
    "bodyEn": "A dignified believer avoids futile debates and social media trivia. Your time and intellect are too precious to be squandered.",
    "themeTagAr": "علو الهمة",
    "themeTagEn": "High Ambition"
  },
  {
    "id": "waqar-32",
    "titleAr": "وَقار • الأناقة الشرعية المحتشمة",
    "titleEn": "Waqar • Modest Elegance",
    "bodyAr": "«الإسلام دين الجمال والنظافة، والستر لا ينافي الترتيب والأناقة المحتشمة.. كوني نظيفة المظهر، مرتبة الثياب، ساترة العورة بلا تبرج»",
    "bodyEn": "Islam cherishes cleanliness and neatness. Modest attire is elegant and tidy without exhibitionism or vanity.",
    "themeTagAr": "أناقة الستر",
    "themeTagEn": "Modest Elegance"
  },
  {
    "id": "waqar-33",
    "titleAr": "وَقار • الصبر عند التعرض للملاحظات",
    "titleEn": "Waqar • Patience Under Pressure",
    "bodyAr": "«إذا واجهتِ سؤالاً أو فضولاً حول حجابك الكامل، ردي بابتسامة وثقة واعتزاز: «إنه طاعة لربي واختياري الحر».. الثقة تخرس الشكوك»",
    "bodyEn": "If questioned about your full hijab, respond with calm confidence: \"It is obedience to my Lord and my free choice.\" Confidence speaks volumes.",
    "themeTagAr": "ثقة وإقناع",
    "themeTagEn": "Calm Confidence"
  },
  {
    "id": "waqar-34",
    "titleAr": "وَقار • حفظ السر وأمانة المجالس",
    "titleEn": "Waqar • Guarding Confidentiality",
    "bodyAr": "«المجالس بالأمانات.. وقار المرأة يمنعها من نقل الأحاديث وإفشاء أسرار العمل أو البيوت؛ فإن حفظ السر خصلة من خصال النبلاء»",
    "bodyEn": "Confidentiality is an honor. A dignified woman guards the secrets of her home and workplace with trustworthy silence.",
    "themeTagAr": "حفظ الأمانة",
    "themeTagEn": "Trustworthiness"
  },
  {
    "id": "waqar-35",
    "titleAr": "وَقار • تجنب الخلوة والمواطن المشبوهة",
    "titleEn": "Waqar • Guarding Boundaries",
    "bodyAr": "«الحرص على الوضوح في المعاملات وتجنب الخلوات غير المشروعة في الواقع أو العمل عن بعد حصن حصين يحفظ دينك وعرضك»",
    "bodyEn": "Maintaining clear professional boundaries and avoiding unmonitored isolation offline or online safeguards your faith and honor.",
    "themeTagAr": "صيانة الحدود",
    "themeTagEn": "Clear Boundaries"
  },
  {
    "id": "waqar-36",
    "titleAr": "وَقار • جمال الحياء الداخلي والخارجي",
    "titleEn": "Waqar • Inward & Outward Harmony",
    "bodyAr": "«الحياء شجرة أصلها في القلب وثمارها على الجوارح.. فإذا طهر القلب صفت النظرة ورَقَّ المنطق واستقام السلوك والزي»",
    "bodyEn": "Modesty is a tree rooted in the heart whose fruits appear on limbs: in pure sight, gentle speech, and upright dress.",
    "themeTagAr": "تناغم الإيمان",
    "themeTagEn": "Spiritual Harmony"
  },
  {
    "id": "waqar-37",
    "titleAr": "وَقار • رعاية النوايا عند التميز والنجاح",
    "titleEn": "Waqar • Humility in Success",
    "bodyAr": "«كلما ارتفعت درجاتك المهنية ونلتِ ثناء الزملاء، ازداد تواضعك وحياؤك لله.. فالفضل كله من الله وحده، وما بتوفيقي إلا به»",
    "bodyEn": "As career achievements rise and accolades flow, deepen in humility and gratitude to Allah. All success stems from His grace.",
    "themeTagAr": "تواضع وإخبات",
    "themeTagEn": "Humble Gratitude"
  },
  {
    "id": "waqar-38",
    "titleAr": "وَقار • عفة العين عن عورات الآخرين",
    "titleEn": "Waqar • Respecting Others’ Privacy",
    "bodyAr": "«من تمام الحياء كف الأذى وتجنب تتبع عورات الناس وسقطاتهم.. طوبى لمن شغله عيبه عن عيوب غيره»",
    "bodyEn": "True modesty refrains from probing others’ flaws. Blessed is the soul busy mending its own faults rather than inspecting others.",
    "themeTagAr": "صيانة الفضول",
    "themeTagEn": "Respecting Privacy"
  },
  {
    "id": "waqar-39",
    "titleAr": "وَقار • شرف الانتماء لخير أمة",
    "titleEn": "Waqar • Honor of the Ummah",
    "bodyAr": "«﴿كُنتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ﴾.. أنتِ ابنة هذه الأمة الشريفة، فكوني في كل ميدان فخرها وعزتها بحيائك وعلمك وبذلك»",
    "bodyEn": "\"You are the best nation brought forth for mankind.\" As a daughter of this noble Ummah, be its pride in modesty and knowledge.",
    "themeTagAr": "عزة الأمة",
    "themeTagEn": "Honor of Faith"
  },
  {
    "id": "waqar-40",
    "titleAr": "وَقار • بركة الدعاء بالثبات والستر",
    "titleEn": "Waqar • Constant Dua for Steadfastness",
    "bodyAr": "««اللهم إني أسألك الهدى والتقى والعفاف والغنى».. داومي على هذا الدعاء النبوي الجامع؛ فهو كنز يجمع لك خير الدنيا والآخرة»",
    "bodyEn": "\"O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.\" Hold close this prophetic supplication.",
    "themeTagAr": "دعاء جامع",
    "themeTagEn": "Prophetic Prayer"
  },
  {
    "id": "waqar-41",
    "titleAr": "وَقار • الرضا بنصيبك من الدنيا",
    "titleEn": "Peace of Waqar • Serene Contentment",
    "bodyAr": "«ما فاتك من زينة الدنيا الفانية يعوضك الله عنه نعيماً مقيماً في جنات الخلد.. الستر والحياء هما الربح الدائم الذي لا يبور»",
    "bodyEn": "Whatever superficial worldly glitter passes you by, Allah replaces with everlasting bliss. Modesty is the eternal trade that never fails.",
    "themeTagAr": "ربح الآخرة",
    "themeTagEn": "Eternal Reward"
  },
  {
    "id": "waqar-42",
    "titleAr": "وَقار • مسك الختام والوعد الحق",
    "titleEn": "Waqar • The Ultimate Promise",
    "bodyAr": "«﴿مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً﴾.. هذا وعد الله الحق، فامضي على درب الحياء واثقة ومستبشرة»",
    "bodyEn": "\"Whoever does righteousness, male or female, while a believer—We will surely cause them to live a good life.\" Walk with joyous certainty.",
    "themeTagAr": "حياة طيبة",
    "themeTagEn": "The Good Life"
  }
]

// ================= رسائل وَقار • الإخوة (42 رسالة غض بصر وشهامة ومروءة ورجولة) =================
const WAQAR_MALE_MESSAGES = [
  {
    "id": "waqar-m-1",
    "titleAr": "وَقار • غض البصر شرف ونور",
    "titleEn": "Waqar • Lowering the Gaze",
    "bodyAr": "«﴿قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ ذَٰلِكَ أَزْكَىٰ لَهُمْ﴾ • غض البصر في الواقع وأمام شاشات العمل يورث القلب حلاوة إيمانية ونوراً في البصيرة يفتح لك مغاليق الفهم»",
    "bodyEn": "\"Tell the believing men to lower their gaze and guard their modesty; that is purer for them.\" Guarding your eyes at work and on screens blesses the heart with spiritual clarity.",
    "themeTagAr": "غض البصر",
    "themeTagEn": "Guarding the Gaze"
  },
  {
    "id": "waqar-m-2",
    "titleAr": "وَقار • شهامة ومروءة المهندس المسلم",
    "titleEn": "Waqar • Chivalry & Noble Character",
    "bodyAr": "«المروءة والشهامة تاج الرجل المسلم؛ ترفع عن سفاسف الأمور والجدال العقيم، واجعل سمتك في بيئة العمل التقنية عنواناً للرجولة الحقة والنبل والأخلاق الرفيعة»",
    "bodyEn": "True chivalry and dignity are the crown of a Muslim man. Rise above trivialities and let your presence at work embody noble manhood and high morals.",
    "themeTagAr": "مروءة وشهامة",
    "themeTagEn": "Noble Chivalry"
  },
  {
    "id": "waqar-m-3",
    "titleAr": "وَقار • صيانة الحدود المهنية الراقية",
    "titleEn": "Waqar • Guarding Workplace Boundaries",
    "bodyAr": "«اجعل تعاملك مع الزميلات في قنوات العمل والاجتماعات منضبطاً بأعلى معايير الحياء والاحترام، جاداً في إنجاز المهام، بعيداً عن المزاح المبتذل والخضوع بالقول»",
    "bodyEn": "Keep interactions with female colleagues professional, dignified, and respectful. Focus on technical excellence without inappropriate humor.",
    "themeTagAr": "حدود مهنية",
    "themeTagEn": "Workplace Boundaries"
  },
  {
    "id": "waqar-m-4",
    "titleAr": "وَقار • تقوى الله في الخلوات والشاشات",
    "titleEn": "Waqar • Piety in Digital Seclusion",
    "bodyAr": "«إذا خلوت بشاشتك ومكتبك وغابت الأعين، فتذكر نظر الله الدائم إليك.. من ترك شيئاً لله عوضه الله خيراً منه في دينه وذهنه وصفاء فكره»",
    "bodyEn": "When alone at your desk with your screen, remember Allah’s watchful presence. Whoever leaves something for the sake of Allah is compensated with profound insight.",
    "themeTagAr": "تقوى الخلوات",
    "themeTagEn": "Private Piety"
  },
  {
    "id": "waqar-m-5",
    "titleAr": "وَقار • بركة الكسب الحلال النقي",
    "titleEn": "Waqar • Halal Earnings & Integrity",
    "bodyAr": "«أطب مطعمك تكن مستجاب الدعوة؛ اجعل كل دقيقة في دوامك وساعات عملك البرمجية خالصة من الغش والتسويف، فإن البركة ثمرة الأمانة والإتقان»",
    "bodyEn": "Ensure your earnings are pure and halal. Dedicate your sprint hours honestly without procrastination; divine barakah follows integrity.",
    "themeTagAr": "كسب حلال",
    "themeTagEn": "Halal Earnings"
  },
  {
    "id": "waqar-m-6",
    "titleAr": "وَقار • هيبة السمت الإيماني",
    "titleEn": "Waqar • Faithful Composure",
    "bodyAr": "«الوقار هيبة تفيض على محيا الرجل المتقي؛ احرص على هدوء سمتك، وطيب حديثك، وصدق لهجتك، ودع عملك الهندسي يتحدث عن إتقانك»",
    "bodyEn": "Dignity is a divine aura gracing a mindful man. Maintain calm composure, sincere speech, and let your craftsmanship showcase your excellence.",
    "themeTagAr": "سمت وهيبة",
    "themeTagEn": "Dignified Aura"
  },
  {
    "id": "waqar-m-7",
    "titleAr": "وَقار • غيرة المؤمن وحفظ المحارم",
    "titleEn": "Waqar • Protecting Sanctity & Honor",
    "bodyAr": "«غيرة الرجل المؤمن على دينه ومحارمه خصلة كريمة لا يتخلى عنها الشرفاء.. عامل نساء المسلمين كما تحب أن تُعامل به أخواتك وأهلك»",
    "bodyEn": "Protective honor for faith and family is the mark of noble men. Treat women in professional spheres with the deep respect you desire for your own sisters.",
    "themeTagAr": "غيرة وشرف",
    "themeTagEn": "Protective Honor"
  },
  {
    "id": "waqar-m-8",
    "titleAr": "وَقار • عفة اللسان وطيب الكلم",
    "titleEn": "Waqar • Speech Purity",
    "bodyAr": "««المسلم من سلم المسلمون من لسانه ويده» • نزّه لسانك وأصابعك على لوحة المفاتيح عن السباب والغيبة والاستهزاء بزملائك؛ فالكلمة الطيبة رفعة»",
    "bodyEn": "\"A true Muslim is one from whose tongue and hand others are safe.\" Guard your speech and keyboard from cynicism, mockery, or slander.",
    "themeTagAr": "عفة اللسان",
    "themeTagEn": "Pure Speech"
  },
  {
    "id": "waqar-m-9",
    "titleAr": "وَقار • حسن القوامة والمسؤولية",
    "titleEn": "Waqar • Noble Responsibility",
    "bodyAr": "«﴿الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ﴾ • القوامة مسؤولية ورعاية وبذل وحسن خلق.. لا تدع ضغوط السبرنت تنسيك واجبك تجاه والديك وأهلك وبيتك»",
    "bodyEn": "Family guardianship is care, tenderness, and sacrifice. Never allow software sprints to distract you from honouring your parents and family.",
    "themeTagAr": "مسؤولية وقوامة",
    "themeTagEn": "Family Responsibility"
  },
  {
    "id": "waqar-m-10",
    "titleAr": "وَقار • التواضع عند علو المنصب",
    "titleEn": "Waqar • Humility in Seniority",
    "bodyAr": "«كلما ارتفعت درجاتك كـ Senior أو Lead، ازدد تواضعاً للحق ولزملائك؛ فالشجرة المثمرة تنحني تواضعاً، والكبر يمحق بركة العلم والخبرة»",
    "bodyEn": "As your technical seniority advances, deepen in humility and grace. A fruitful tree bends low; pride erodes the blessings of knowledge.",
    "themeTagAr": "تواضع ورفعة",
    "themeTagEn": "Humble Leadership"
  },
  {
    "id": "waqar-m-11",
    "titleAr": "وَقار • الصبر والاحتساب عند الأزمات",
    "titleEn": "Waqar • Resilience & Fortitude",
    "bodyAr": "««عجباً لأمر المؤمن إن أمره كله له خير» • عند تعطل السيرفرات أو ضغط الديدلاين، تحلّ بثبات الرجال ورباطة الجأش ولا تيأس؛ فالتيسير بيد الله»",
    "bodyEn": "When deployments fail or deadlines tighten, embody masculine composure and patience; relief and clarity are in Allah’s hands.",
    "themeTagAr": "ثبات وصبر",
    "themeTagEn": "Patient Fortitude"
  },
  {
    "id": "waqar-m-12",
    "titleAr": "وَقار • أمانة الكود والبيانات",
    "titleEn": "Waqar • Integrity of Data & Code",
    "bodyAr": "«بيانات المستخدمين والشفرة المصدرية أمانة بين يديك.. احفظ أسرار عملك ولا تخن ثقة من ائتمنك، فإن خيانة الأمانة تهدم الدين والدنيا»",
    "bodyEn": "User data and proprietary source code are sacred trusts. Guard confidentiality with honor; integrity is the bedrock of faith.",
    "themeTagAr": "حفظ الأمانة",
    "themeTagEn": "Sacred Trust"
  },
  {
    "id": "waqar-m-13",
    "titleAr": "وَقار • كظم الغيظ ولين الجانب",
    "titleEn": "Waqar • Restraining Anger",
    "bodyAr": "««ليس الشديد بالصُّرَعَة، إنما الشديد الذي يملك نفسه عند الغضب» • إذا استفزك زميل في مراجعة الكود (Code Review)، فردّ بأدب ونضج ووقار»",
    "bodyEn": "\"The strong man is not the wrestler; the strong man is the one who controls himself in anger.\" Respond to critique with poise and wisdom.",
    "themeTagAr": "كظم الغيظ",
    "themeTagEn": "Self-Control"
  },
  {
    "id": "waqar-m-14",
    "titleAr": "وَقار • الحياء من الإيمان للرجال والنساء",
    "titleEn": "Waqar • Modesty Honors Men",
    "bodyAr": "«الحياء خلق الإسلام، وهو زينة للرجل كما هو زينة للمرأة؛ استحِ من الله أن يراك حيث نهاك أو يفقدك حيث أمرك في سائر أحوالك»",
    "bodyEn": "Modesty is the hallmark of Islam, adorning men as it adorns women. Feel shame before Allah to be found where He forbade you.",
    "themeTagAr": "حياء وإيمان",
    "themeTagEn": "Modesty in Faith"
  },
  {
    "id": "waqar-m-15",
    "titleAr": "وَقار • نصرة الحق وقول الصدق",
    "titleEn": "Waqar • Standing for Truth",
    "bodyAr": "«كن شجاعاً في نصرة الحق، واعترف بالخطأ الهندسي إن وقعت فيه؛ فالاعتراف بالحق فضيلة تبني المصداقية وتورث توفيق الرحمن»",
    "bodyEn": "Stand firmly for truth and admit technical mistakes honestly. Acknowledging error builds respect and invites divine guidance.",
    "themeTagAr": "صدق وشجاعة",
    "themeTagEn": "Honest Courage"
  },
  {
    "id": "waqar-m-16",
    "titleAr": "وَقار • الترفع عن المزاح الهابط",
    "titleEn": "Waqar • Dignified Humor",
    "bodyAr": "«الضحك الكثير يميت القلب ويذهب بهيبة الرجل.. اجعل مزاحك مع زملائك صادقاً عفيفاً لا كذب فيه ولا تجريح ولا خروج عن الوقار»",
    "bodyEn": "Excessive frivolity dulls the heart. Keep humor light, honest, and dignified, preserving your stature and respect.",
    "themeTagAr": "سمت راقٍ",
    "themeTagEn": "Refined Poise"
  },
  {
    "id": "waqar-m-17",
    "titleAr": "وَقار • عون الإخوان ونفع المسلمين",
    "titleEn": "Waqar • Serving Others",
    "bodyAr": "««خير الناس أنفعهم للناس» • لا تبخل بعلمك أو خبرتك البرمجية على زملائك المبتدئين؛ فإن زكاة العلم بذله لوجه الله بنية صالحة»",
    "bodyEn": "\"The best of people are those most beneficial to others.\" Mentor junior engineers generously; sharing knowledge is its divine zakah.",
    "themeTagAr": "نفع وعطاء",
    "themeTagEn": "Selfless Service"
  },
  {
    "id": "waqar-m-18",
    "titleAr": "وَقار • الوفاء بالعهود والعقود",
    "titleEn": "Waqar • Honoring Contracts",
    "bodyAr": "«﴿يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ﴾ • التزامك بمواعيد التسليم ومواصفات المشروع البرمجي هو انعكاس لوفائك الديني والأخلاقي»",
    "bodyEn": "\"O you who have believed, fulfill all contracts.\" Delivering milestones on time with promised specifications is a religious duty.",
    "themeTagAr": "وفاء بالعهد",
    "themeTagEn": "Honoring Pledges"
  },
  {
    "id": "waqar-m-19",
    "titleAr": "وَقار • صلاة الجماعة في المسجد",
    "titleEn": "Waqar • Congregational Prayer",
    "bodyAr": "«إذا نادى المنادي: حي على الصلاة، فاغلق شاشتك والتحق بركاب المصلين في المسجد؛ فالصلاة في وقتها أحب الأعمال إلى الله وأعظم أسباب الفلاح»",
    "bodyEn": "When the Adhan calls, step away from your monitor and join the congregation. Prayer in its time is the dearest deed to Allah.",
    "themeTagAr": "صلاة الجماعة",
    "themeTagEn": "Masjid Prayer"
  },
  {
    "id": "waqar-m-20",
    "titleAr": "وَقار • بر الوالدين والدعاء لهما",
    "titleEn": "Waqar • Honoring Parents",
    "bodyAr": "«مهما بلغت من مراتب علمية وهندسية، فخفض جناح الذل لوالديك بالرحمة والبر والإحسان هو بابك المفتوح إلى الجنة وبركة الدنيا»",
    "bodyEn": "No matter how high your technical accolades rise, humility and tenderness with your parents is your gateway to Jannah and barakah.",
    "themeTagAr": "بر الوالدين",
    "themeTagEn": "Parental Honor"
  },
  {
    "id": "waqar-m-21",
    "titleAr": "وَقار • مراقبة الله في الخوارزميات والذكاء الاصطناعي",
    "titleEn": "Waqar • Ethical AI & Code",
    "bodyAr": "«لا تسخر علمك البرمجي في بناء ما يغضب الله أو يروّج للمحرمات؛ ابنِ تقنيات تنفع البشرية وتكون لك صدقة جارية بعد مماتك»",
    "bodyEn": "Never employ your coding prowess in systems promoting vice. Build algorithms that serve humanity and become enduring charity for you.",
    "themeTagAr": "أخلاقيات التقنية",
    "themeTagEn": "Ethical Tech"
  },
  {
    "id": "waqar-m-22",
    "titleAr": "وَقار • سلامة الصدر وطهارة القلب",
    "titleEn": "Waqar • Pure Heart",
    "bodyAr": "«طهر قلبك من الحسد والغيرة من نجاح زملائك؛ فالأرزاق مقسومة بحكمة الله، وتمنَّ الخير للجميع يأتيك الخير من حيث لا تحتسب»",
    "bodyEn": "Purge your heart of envy towards peers’ achievements. Sustenance is divinely apportioned; rejoice in others’ success to invite your own.",
    "themeTagAr": "سلامة الصدر",
    "themeTagEn": "Clean Heart"
  },
  {
    "id": "waqar-m-23",
    "titleAr": "وَقار • نظافة الهندام وطيب الرائحة",
    "titleEn": "Waqar • Dignified Presentation",
    "bodyAr": "««إن الله جميل يحب الجمال» • وقار المبرمج المسلم يكتمل بحسن هندامه وطيب رائحته ونظافة مكانه ومظهره اللائق برجل العلم»",
    "bodyEn": "\"Allah is Beautiful and loves beauty.\" A Muslim dev’s poise is crowned with clean attire, pleasant fragrance, and an orderly workspace.",
    "themeTagAr": "جمال ونظافة",
    "themeTagEn": "Neatness & Poise"
  },
  {
    "id": "waqar-m-24",
    "titleAr": "وَقار • الحزم مع النفس ومحاربة التسويف",
    "titleEn": "Waqar • Mastering Discipline",
    "bodyAr": "«الرجولة إرادة وعزيمة؛ حارب التسويف والكسل، ونظم وقتك بين عبادتك وعملك وراحتك، ولا تكن عبداً للمشتتات الرقمية التافهة»",
    "bodyEn": "True manhood is discipline and resolute will. Overcome procrastination and organize your hours between worship, deep work, and rest.",
    "themeTagAr": "انضباط وعزيمة",
    "themeTagEn": "Disciplined Will"
  },
  {
    "id": "waqar-m-25",
    "titleAr": "وَقار • الشكر عند النعمة والتوفيق",
    "titleEn": "Waqar • Gratitude for Insight",
    "bodyAr": "«﴿لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ﴾ • إذا وفقك الله لحل معضلة برمجية معقدة، فقل: الحمد لله حمداً كثيراً؛ فالشكر قيد النعم وضمان دوامها»",
    "bodyEn": "\"If you are grateful, I will surely increase you.\" When Allah grants you a breakthrough in complex code, express profound gratitude.",
    "themeTagAr": "شكر النعمة",
    "themeTagEn": "Grateful Praise"
  },
  {
    "id": "waqar-m-26",
    "titleAr": "وَقار • حفظ السر في العمل والحياة",
    "titleEn": "Waqar • Preserving Confidentiality",
    "bodyAr": "««المجالس بالأمانة» • الرجل الوقور يحفظ أسرار شركته وزملائه وبيته، ولا ينقل الكلام بين الناس؛ فإن النميمة تفسد المروءة والدين»",
    "bodyEn": "Meetings are held in sacred trust. A dignified man guards the confidences of his company, peers, and family with resolute honor.",
    "themeTagAr": "حفظ السر",
    "themeTagEn": "Confidentiality"
  },
  {
    "id": "waqar-m-27",
    "titleAr": "وَقار • تجنب الخلوة الرقمية غير المشروعة",
    "titleEn": "Waqar • Avoiding Private Chats",
    "bodyAr": "«احرص على أن تكون محادثاتك المهنية مع الزميلات علنية في قنوات الفريق الرسمية وتجنب الرسائل الخاصة غير الضرورية صيانةً لدينك وقلبك»",
    "bodyEn": "Keep professional correspondence with female colleagues visible in team channels, avoiding unnecessary private DMs to safeguard your faith.",
    "themeTagAr": "صيانة القلوب",
    "themeTagEn": "Guarded Hearts"
  },
  {
    "id": "waqar-m-28",
    "titleAr": "وَقار • العدل والإنصاف مع الفريق",
    "titleEn": "Waqar • Fairness & Justice",
    "bodyAr": "«﴿وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ﴾ • اعدل في تقييم زملائك ولا تبخس أحداً حقه في مراجعات الكود أو تقييمات الأداء»",
    "bodyEn": "\"And when you judge between people, judge with justice.\" Be scrupulously fair when evaluating peers’ work and pull requests.",
    "themeTagAr": "عدل وإنصاف",
    "themeTagEn": "Fairness & Justice"
  },
  {
    "id": "waqar-m-29",
    "titleAr": "وَقار • عزة الهوية الإسلامية في المؤتمرات",
    "titleEn": "Waqar • Islamic Identity in Tech",
    "bodyAr": "«في المؤتمرات العالمية والشركات متعددة الجنسيات، اعتز بهويتك الإسلامية وأخلاقك النبيلة؛ فالعالم يقدر الرجل الواثق من مبادئه وقيمه»",
    "bodyEn": "At global conferences and multinationals, take pride in your Islamic values. The tech world respects principled confidence.",
    "themeTagAr": "عزة الهوية",
    "themeTagEn": "Principled Identity"
  },
  {
    "id": "waqar-m-30",
    "titleAr": "وَقار • التناصح بالمعروف والرفق",
    "titleEn": "Waqar • Gentle Advice",
    "bodyAr": "««الدين النصيحة» • إذا رأيت من أخيك أو زميلك تقصيراً في عمل أو خلق، فانصحه سراً برفق ومحبة؛ فالنصيحة في الملأ فضيحة»",
    "bodyEn": "\"Religion is sincere advice.\" If you counsel a brother or colleague, advise privately with warmth and gentleness.",
    "themeTagAr": "نصح بالمعروف",
    "themeTagEn": "Gentle Counsel"
  },
  {
    "id": "waqar-m-31",
    "titleAr": "وَقار • قوة البدن وصحة الجسد",
    "titleEn": "Waqar • Physical Vitality",
    "bodyAr": "««المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف» • اعتنِ ببدنك وصحتك وممارستك للرياضة؛ فجسدك أمانة لخدمة أمتك ومواصلة إتقانك»",
    "bodyEn": "\"The strong believer is better and more beloved to Allah.\" Care for your physical fitness and health; your body is a vessel to serve.",
    "themeTagAr": "قوة البدن",
    "themeTagEn": "Physical Vitality"
  },
  {
    "id": "waqar-m-32",
    "titleAr": "وَقار • الصدقة الخفية في الرخاء",
    "titleEn": "Waqar • Hidden Charity",
    "bodyAr": "««صدقة السر تطفئ غضب الرب» • اجعل لجزء من راتبك ودخلك البرمجي سهماً ثابتاً في كفالة المحتاجين وإطعام الطعام سراً بينك وبين ربك»",
    "bodyEn": "\"Secret charity extinguishes divine wrath.\" Dedicate a steady portion of your developer salary to uplift the needy in quiet devotion.",
    "themeTagAr": "صدقة السر",
    "themeTagEn": "Hidden Charity"
  },
  {
    "id": "waqar-m-33",
    "titleAr": "وَقار • مجاهدة النفس في ساعات الفراغ",
    "titleEn": "Waqar • Guarding Free Time",
    "bodyAr": "««نعمتان مغبون فيهما كثير من الناس: الصحة والفراغ» • استثمر ساعات فراغك في بناء مشاريع نافعة وتطوير مداركك وقراءة ما يثبت إيمانك»",
    "bodyEn": "\"Two blessings many people lose: health and free time.\" Invest free hours building open source goods, studying, and strengthening faith.",
    "themeTagAr": "استثمار الوقت",
    "themeTagEn": "Valuing Time"
  },
  {
    "id": "waqar-m-34",
    "titleAr": "وَقار • لين الجانب مع الأهل والأولاد",
    "titleEn": "Waqar • Tenderness at Home",
    "bodyAr": "««خيركم خيركم لأهله وأنا خيركم لأهلي» • صلابة الرجل وجديته في العمل يقابلها لين ورحمة وتبسم وأنس في بيته ومع أسرته»",
    "bodyEn": "\"The best of you is the best to his family.\" A man’s firmness at work should be matched by gentle warmth and smiles at home.",
    "themeTagAr": "رحمة وأنس",
    "themeTagEn": "Gentle Warmth"
  },
  {
    "id": "waqar-m-35",
    "titleAr": "وَقار • سلامة الصدر من الشحناء",
    "titleEn": "Waqar • Forgiving Spirit",
    "bodyAr": "«﴿فَمَنْ عَفَا وَأَصْلَحَ فَأَجْرُهُ عَلَى اللَّهِ﴾ • سامح من أساء إليك، ونم طاهر القلب سليم الصدر؛ فإن العفو من شيم الكرام والنبلاء»",
    "bodyEn": "\"Whoever pardons and makes reconciliation—his reward is with Allah.\" Forgive slights and sleep with a heart free of malice.",
    "themeTagAr": "عفو وإحسان",
    "themeTagEn": "Forgiving Grace"
  },
  {
    "id": "waqar-m-36",
    "titleAr": "وَقار • الاستعانة بالله في بداية كل مشروع",
    "titleEn": "Waqar • Starting with Bismillah",
    "bodyAr": "««كل أمر ذي بال لا يبدأ فيه ببسم الله فهو أبتر» • ابدأ كل نظام وشفرة تبرمجها مستعيناً بالله ومتوكلاً على توفيقه وسداده»",
    "bodyEn": "Begin every architectural milestone with Bismillah, placing complete reliance on divine guidance and enablement.",
    "themeTagAr": "توكل واستعانة",
    "themeTagEn": "Divine Reliance"
  },
  {
    "id": "waqar-m-37",
    "titleAr": "وَقار • الجرأة في الحق بلا تهور",
    "titleEn": "Waqar • Wise Courage",
    "bodyAr": "«كن رجلاً شجاعاً حكيماً في اتخاذ القرارات المعمارية الصعبة، لا تتردد، واستخر ربك ثم امضِ بعزم المؤمن الواثق»",
    "bodyEn": "Combine technical courage with wisdom in tough architectural decisions. Consult, seek Istikhara, and proceed with calm conviction.",
    "themeTagAr": "شجاعة وحكمة",
    "themeTagEn": "Wise Courage"
  },
  {
    "id": "waqar-m-38",
    "titleAr": "وَقار • عفة اليد عن المال المشبوه",
    "titleEn": "Waqar • Shunning Questionable Wealth",
    "bodyAr": "««دع ما يريبك إلى ما لا يريبك» • إذا عرض عليك مشروع فيه شبهة قمار أو ربا أو ترويج لمنكر، فارفضه لوجه الله؛ ورزق الله آتٍ لا محالة»",
    "bodyEn": "\"Leave that which makes you doubt for that which does not.\" Turn down projects tainted by usury or vice; Allah’s pure sustenance is assured.",
    "themeTagAr": "ورع وتقوى",
    "themeTagEn": "Pious Scruple"
  },
  {
    "id": "waqar-m-39",
    "titleAr": "وَقار • حسن الاستماع وأدب الإنصات",
    "titleEn": "Waqar • Attentive Listening",
    "bodyAr": "«من تمام المروءة حسن الإنصات للآخرين وعدم مقاطعتهم في الحديث؛ دَع زميلك يكمل فكرته ثم عقب بأدب وعلم»",
    "bodyEn": "True chivalry listens patiently without interruption. Allow your peer to conclude their thought, then reply with grace and clarity.",
    "themeTagAr": "أدب الاستماع",
    "themeTagEn": "Art of Listening"
  },
  {
    "id": "waqar-m-40",
    "titleAr": "وَقار • الدعاء بطلب الثبات والرجولة الحقة",
    "titleEn": "Waqar • Prayer for Steadfast Manhood",
    "bodyAr": "««يا مقلب القلوب ثبت قلبي على دينك» • داوم على هذا الدعاء؛ فإن الفتن كثيرة والشاشات مغرية، ولا عاصم من الزلل إلا رحمة الله وتثبيته»",
    "bodyEn": "\"O Turner of hearts, keep my heart steadfast upon Your religion.\" Screens hold many temptations; steadfastness is a divine gift.",
    "themeTagAr": "دعاء الثبات",
    "themeTagEn": "Steadfast Prayer"
  },
  {
    "id": "waqar-m-41",
    "titleAr": "وَقار • أثر الصالحين وبصمة الأثر",
    "titleEn": "Waqar • Lasting Legacy",
    "bodyAr": "«عش رجلاً يبني ويثمر ويترك أثراً صالحاً يذكره الناس به ويدعون له بعد رحيله.. اجعل كودك وعلمك وسيرتك ناصعة البياض»",
    "bodyEn": "Live as a builder who leaves an enduring legacy of goodness. Let your code, character, and reputation shine with immaculate purity.",
    "themeTagAr": "أثر صالح",
    "themeTagEn": "Enduring Legacy"
  },
  {
    "id": "waqar-m-42",
    "titleAr": "وَقار • ختام المجد والوعد الحق",
    "titleEn": "Waqar • The Honorable Promise",
    "bodyAr": "«﴿رِجَالٌ لَّا تُلْهِيهِمْ تِجَارَةٌ وَلَا بَيْعٌ عَن ذِكْرِ اللَّهِ وَإِقَامِ الصَّلَاةِ﴾ • كن من هؤلاء الرجال الأخيار؛ فالرجولة دين ومروءة وإتقان وظفر بالآخرة»",
    "bodyEn": "\"Men whom neither commerce nor sale distracts from the remembrance of Allah and establishing prayer.\" Stand tall among these noble men.",
    "themeTagAr": "رجال صدقوا",
    "themeTagEn": "True Men of Faith"
  }
]

// ================= رسائل السكينة والبشرى • 42 رسالة طمأنينة ويقين (مكتبتي وكتكوتي) =================
const PEACE_MOTIVATION_MESSAGES = [
  {
    "id": "peace-1",
    "titleAr": "سكينة وبُشرى • حكمة الأقدار",
    "titleEn": "Peace & Solace • Divine Wisdom",
    "bodyAr": "«ربنا له حكمة بالغة في كل ما يحدث؛ فليكن يقينك بالله أعظم من كل خوف، وثقتك بعوضه أكبر من كل ألم.. ما صرفه الله عنك كان شراً لو بقي»",
    "bodyEn": "Allah has profound wisdom in everything that unfolds. Let your certainty in Him surpass any fear; what was turned away from you was never for your good.",
    "themeTagAr": "يقين وتوكل",
    "themeTagEn": "Certainty & Trust"
  },
  {
    "id": "peace-2",
    "titleAr": "سكينة وبُشرى • وصية غالية للقلب",
    "titleEn": "Peace & Solace • Guard Your Peace",
    "bodyAr": "«يا بني.. اعتزل ما يؤذيك، واطلب راحة قلبك في القرب من ربك؛ فمن وجد الله فماذا فقد؟ ومن فقد الله فماذا وجد؟»",
    "bodyEn": "Detach from all that harms your peace and seek solace near your Lord. For whoever finds Allah has lost nothing, and whoever loses Allah has found nothing.",
    "themeTagAr": "سلام داخلي",
    "themeTagEn": "Inner Peace"
  },
  {
    "id": "peace-3",
    "titleAr": "سكينة وبُشرى • ألطاف خفية",
    "titleEn": "Peace & Solace • Hidden Mercies",
    "bodyAr": "«﴿لَا تَدْرِي لَعَلَّ اللَّهَ يُحْدِثُ بَعْدَ ذَٰلِكَ أَمْرًا﴾ • ضيق اللحظة يحمل في طياته فرج السنين، ولطف الله ينساب إليك في اللحظة التي تظن فيها أن الأبواب قد أغلقت»",
    "bodyEn": "\"You know not, perhaps Allah will bring about something new after that.\" In the narrowest moments, divine breakthroughs are quietly prepared.",
    "themeTagAr": "فرج قريب",
    "themeTagEn": "Imminent Relief"
  },
  {
    "id": "peace-4",
    "titleAr": "سكينة وبُشرى • رعاية لا تنام",
    "titleEn": "Peace & Solace • Unsleeping Care",
    "bodyAr": "«﴿وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا﴾ • تكفيك هذه الآية طمأنينة لتعلم أنك تحت نظر الله ورعايته وحفظه الذي لا يغفل ولا ينام»",
    "bodyEn": "\"And be patient for the decision of your Lord, for indeed you are in Our eyes.\" Rest your heart knowing you are under divine sleepless care.",
    "themeTagAr": "معية الله",
    "themeTagEn": "Divine Presence"
  },
  {
    "id": "peace-5",
    "titleAr": "سكينة وبُشرى • استرح واطمئن",
    "titleEn": "Peace & Solace • Rest Your Mind",
    "bodyAr": "«ما كتبه الله لك لن يفوّتك ولو طارت به الرياح، وما فاتك لم يكن يوماً لك؛ فاسترح من عناء المقارنات وكثرة التفكير، ورزقك يسعى إليك كما تسعى إليه»",
    "bodyEn": "What is destined for you will never miss you, and what missed you was never yours. Free your mind from restless anxiety.",
    "themeTagAr": "قناعة ورضا",
    "themeTagEn": "Contentment"
  },
  {
    "id": "peace-6",
    "titleAr": "سكينة وبُشرى • بشارة الفرج",
    "titleEn": "Peace & Solace • Dawn is Near",
    "bodyAr": "«كل مُرٍّ سيمر، وكل كربٍ سينجلي؛ وإذا أذن الله بالفرج أدهش العقول وأرضى القلوب بأضعاف ما تمنيت»",
    "bodyEn": "Every bitter chapter shall pass. When divine relief arrives, it will amaze your heart beyond your wildest hopes.",
    "themeTagAr": "بشارة وتيسير",
    "themeTagEn": "Good Tidings"
  },
  {
    "id": "peace-7",
    "titleAr": "سكينة وبُشرى • ملاذ القلوب",
    "titleEn": "Peace & Solace • Sanctuary of Remembrance",
    "bodyAr": "«﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ • كلما تراكمت عليك ضغوط الحياة وتشتت فكرك، اهرب إلى سجدة طويلة ومحراب الاستغفار؛ تجد برداً وسلاماً»",
    "bodyEn": "\"Unquestionably, by the remembrance of Allah hearts are assured.\" Whenever life feels heavy, flee into heartfelt prostration and dhikr.",
    "themeTagAr": "طمأنينة الذكر",
    "themeTagEn": "Heart Solace"
  },
  {
    "id": "peace-8",
    "titleAr": "سكينة وبُشرى • عزة التوكل",
    "titleEn": "Peace & Solace • Power of Trust",
    "bodyAr": "«استعن بالله ولا تعجز؛ فلو اجتمعت الأمة كلها على أن يضروك بشيء لم يضروك إلا بشيء قد كتبه الله عليك، رفعت الأقلام وجفت الصحف»",
    "bodyEn": "Seek Allah’s aid and never feel helpless. If the entire creation gathered to harm you, they could not harm you except by what Allah decreed.",
    "themeTagAr": "توكل وتفويض",
    "themeTagEn": "Reliance on God"
  },
  {
    "id": "peace-9",
    "titleAr": "سكينة وبُشرى • جبر الخواطر",
    "titleEn": "Peace & Solace • Mending Hearts",
    "bodyAr": "«الله هو الجبّار.. يجبر كسر فؤادك، ويعوضك عن كل دمعة خفية حبستها في صدرك، ويجعل في قادم أيامك بهجة تنسيك تعب الأيام الماضية»",
    "bodyEn": "Allah is Al-Jabbar, the One who mends the brokenhearted. He will compensate every silent tear with unmeasured joy.",
    "themeTagAr": "جبر الخواطر",
    "themeTagEn": "Mending Hearts"
  },
  {
    "id": "peace-10",
    "titleAr": "سكينة وبُشرى • كفاية الله لك",
    "titleEn": "Peace & Solace • Divine Sufficiency",
    "bodyAr": "«﴿أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ﴾ • كفاك الله في رزقك، في عافيتك، في حفظ أهلك، وفي كل همٍّ تحمله.. فوض أمرك له وابتسم»",
    "bodyEn": "\"Is not Allah sufficient for His servant?\" He is sufficient for your sustenance, wellness, and every silent burden. Smile and trust Him.",
    "themeTagAr": "كفاية وأمان",
    "themeTagEn": "Sufficiency & Safety"
  },
  {
    "id": "peace-11",
    "titleAr": "سكينة وبُشرى • مع العسر يسراً",
    "titleEn": "Peace & Solace • Ease with Hardship",
    "bodyAr": "«﴿إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾ • لم يقل بعد العسر، بل معه وفي قلبه! كل صعوبة في طريقك يولد معها مفتاح الفرج وقوة جديدة لم تكن تعرفها»",
    "bodyEn": "\"Indeed, with hardship comes ease.\" It is not after hardship, but woven inside it. Every struggle brings with it unseen strength.",
    "themeTagAr": "يسر وأمل",
    "themeTagEn": "Ease & Hope"
  },
  {
    "id": "peace-12",
    "titleAr": "سكينة وبُشرى • خطوة السعي المباركة",
    "titleEn": "Peace & Solace • Blessed Striving",
    "bodyAr": "«عليك السعي وليس عليك إدراك النتائج.. ابذل وسعك بهدوء، وأتقن ما بين يديك، ودع تصريف الأقدار وتفاصيل المستقبل لمالك الملك»",
    "bodyEn": "You are tasked with striving with excellence, not controlling outcomes. Do your best and leave the future to the Lord of the worlds.",
    "themeTagAr": "سعي متزن",
    "themeTagEn": "Balanced Effort"
  },
  {
    "id": "peace-13",
    "titleAr": "سكينة وبُشرى • حسن الظن بالله",
    "titleEn": "Peace & Solace • Beautiful Expectation",
    "bodyAr": "«قال الله تعالى في الحديث القدسي: «أنا عند ظن عبدي بي».. فلا تظن بربك إلا جميلاً، ولا ترتقب لغدك إلا خيراً ورحمة وتيسيراً»",
    "bodyEn": "Allah says in Hadith Qudsi: \"I am as My servant expects Me to be.\" Harbor only beautiful expectations and radiant hope for tomorrow.",
    "themeTagAr": "حسن الظن",
    "themeTagEn": "Radiant Hope"
  },
  {
    "id": "peace-14",
    "titleAr": "سكينة وبُشرى • باب الدعاء المفتوح",
    "titleEn": "Peace & Solace • The Open Gate of Dua",
    "bodyAr": "«﴿وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ﴾ • ليس بينك وبينه حجاب ولا وسيط؛ بث إليه همك، وتكلم بما في قلبك، فإنه يسمع دبيب النملة ووجيب الفؤاد»",
    "bodyEn": "\"When My servants ask you concerning Me, indeed I am near.\" No barriers stand between you and Allah; pour out your heart in dua.",
    "themeTagAr": "قرب ومناجاة",
    "themeTagEn": "Supplication & Intimacy"
  },
  {
    "id": "peace-15",
    "titleAr": "سكينة وبُشرى • نعمة العافية والستر",
    "titleEn": "Peace & Solace • Blessings of Wellness",
    "bodyAr": "«أصبحت معافى في بدنك، آمناً في سربك، عندك قوت يومك؟ فقد حيزت لك الدنيا بحذافيرها! احمد الله بصدق، فالرضا يفتح أبواب المزيد»",
    "bodyEn": "Waking up healthy in body, secure in your home, with sustenance for the day is owning the entire world. Give thanks from the heart.",
    "themeTagAr": "شكر النعم",
    "themeTagEn": "Gratitude"
  },
  {
    "id": "peace-16",
    "titleAr": "سكينة وبُشرى • لطف التدبير",
    "titleEn": "Peace & Solace • Sublime Orchestration",
    "bodyAr": "«كم من أمرٍ بكت له عينك وحسبته نهاية المطاف، فإذا به بداية لأجمل أقدارك وأنفعها لك.. ثق بأن رب الخير لا يأتي إلا بالخير»",
    "bodyEn": "How many events caused you grief only to become the foundation of your greatest blessings? The Lord of Goodness brings only good.",
    "themeTagAr": "خير الأقدار",
    "themeTagEn": "Divine Goodness"
  },
  {
    "id": "peace-17",
    "titleAr": "سكينة وبُشرى • راحة البال من كلام الناس",
    "titleEn": "Peace & Solace • Freedom from Judgment",
    "bodyAr": "«رضا الناس غاية لا تدرك، ورضا الله غاية لا تترك؛ فاترك ما لا يدرك وأدرك ما لا يترك.. اجعل بوصلتك إرضاء ربك وحده تعش حراً مطمئناً»",
    "bodyEn": "Pleasing people is an unattainable goal; pleasing Allah is an essential duty. Live for Allah alone and walk freely.",
    "themeTagAr": "إخلاص وحرية",
    "themeTagEn": "Sincerity"
  },
  {
    "id": "peace-18",
    "titleAr": "سكينة وبُشرى • بركة الصباح والبدايات",
    "titleEn": "Peace & Solace • Morning Barakah",
    "bodyAr": "«ابدأ يومك بنية طيبة، وقل: «اللهم إني أصبحت أشهدك وأشهد حملة عرشك أنك أنت الله لا إله إلا أنت».. ترتب الأفكار وتنزل البركات»",
    "bodyEn": "Begin with pure intention and morning remembrance; divine barakah will arrange your thoughts and ease your work.",
    "themeTagAr": "بركة الصباح",
    "themeTagEn": "Morning Light"
  },
  {
    "id": "peace-19",
    "titleAr": "سكينة وبُشرى • صانع المعجزات",
    "titleEn": "Peace & Solace • Miracle Maker",
    "bodyAr": "«الذي شق البحر لموسى، وحفظ يونس في بطن الحوت، ونجّى إبراهيم من النار.. قادر على تبديد حيرتك وتفريج ما أهمّك في طرفة عين»",
    "bodyEn": "He who split the sea for Moses and saved Jonah from the whale is fully capable of clearing your confusion in a blink.",
    "themeTagAr": "قدرة الله",
    "themeTagEn": "Omnipotence"
  },
  {
    "id": "peace-20",
    "titleAr": "سكينة وبُشرى • رفق بالنفس",
    "titleEn": "Peace & Solace • Gentleness with Self",
    "bodyAr": "«لا تقسُ على نفسك؛ فالطريق طويل، والله لا يكلف نفساً إلا وسعها.. استرح قليلاً، التقط أنفاسك، وتذكر أن خطواتك البطيئة مع الصدق ثوابها عظيم»",
    "bodyEn": "Be gentle with yourself. The journey is long and Allah burdens no soul beyond its capacity. Rest, breathe, and keep moving.",
    "themeTagAr": "رفق ورحمة",
    "themeTagEn": "Self-Compassion"
  },
  {
    "id": "peace-21",
    "titleAr": "سكينة وبُشرى • حلاوة الصبر الجميل",
    "titleEn": "Peace & Solace • Sweetness of Patience",
    "bodyAr": "«﴿إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ﴾ • الصبر ليس انتظاراً بل هو ثقة وثبات بحسن العاقبة، وأجره كرم إلهي بلا حدود»",
    "bodyEn": "\"Indeed, the patient will be given their reward without account.\" Patience is steadfast trust in Allah’s beautiful timing.",
    "themeTagAr": "صبر جميل",
    "themeTagEn": "Noble Patience"
  },
  {
    "id": "peace-22",
    "titleAr": "سكينة وبُشرى • عطاء الحرمان",
    "titleEn": "Peace & Solace • The Blessing of Denial",
    "bodyAr": "«ربما أعطاك فمنعك، وربما منعك فأعطاك.. متى فتح لك باب الفهم في المنع عاد المنع عين العطاء»",
    "bodyEn": "Sometimes Allah gives by withholding, protecting you from what would have distracted your soul. His denial is pure protection.",
    "themeTagAr": "حكمة وعطاء",
    "themeTagEn": "Divine Insight"
  },
  {
    "id": "peace-23",
    "titleAr": "سكينة وبُشرى • أنس الخلوة بربك",
    "titleEn": "Peace & Solace • Solitude with the Divine",
    "bodyAr": "«خلوة خمس دقائق تناجي فيها ربك بصدق وتستغفره تزن الدنيا وما فيها.. اجعل لك مع الله خبيئة لا يعلمها أحد من خلقه»",
    "bodyEn": "Five quiet minutes communing sincerely with Allah outweigh the treasures of this world. Keep a secret deed known only to Him.",
    "themeTagAr": "خبيئة صالحة",
    "themeTagEn": "Secret Devotion"
  },
  {
    "id": "peace-24",
    "titleAr": "سكينة وبُشرى • عظمة التوبة وتجديد العهد",
    "titleEn": "Peace & Solace • The Door of Repentance",
    "bodyAr": "«﴿قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ﴾ • لا تيأس أبداً، فباب المغفرة أوسع من كل ذنوبك»",
    "bodyEn": "\"Say: O My servants who have transgressed against themselves, do not despair of Allah’s mercy.\" The door of forgiveness is boundless.",
    "themeTagAr": "توبة ورجاء",
    "themeTagEn": "Boundless Mercy"
  },
  {
    "id": "peace-25",
    "titleAr": "سكينة وبُشرى • السكينة في الصلاة",
    "titleEn": "Peace & Solace • Serenity in Prayer",
    "bodyAr": "«كان رسول الله ﷺ إذا حزبه أمر فزع إلى الصلاة وقال: «أرحنا بها يا بلال».. الصلاة ليست عبئاً تؤديه، بل واحة تستريح فيها من عناء الدنيا»",
    "bodyEn": "When distressed, the Prophet ﷺ rushed to prayer, saying: \"Comfort us with it, O Bilal.\" Prayer is a soothing oasis from worldly noise.",
    "themeTagAr": "واحة الصلاة",
    "themeTagEn": "Prayer Oasis"
  },
  {
    "id": "peace-26",
    "titleAr": "سكينة وبُشرى • نفع الناس وسلامة الصدر",
    "titleEn": "Peace & Solace • Pure Heart & Benevolence",
    "bodyAr": "«أحب الناس إلى الله أنفعهم للناس، وسرور تدخله على قلب مسلم يفتح لك أبواب السكينة.. انشر الخير بكلمة طيبة وابتسامة صادقة»",
    "bodyEn": "The most beloved people to Allah are those most beneficial to others. Spreading joy and kindness fills your own heart with deep peace.",
    "themeTagAr": "إحسان ونفع",
    "themeTagEn": "Benevolence"
  },
  {
    "id": "peace-27",
    "titleAr": "سكينة وبُشرى • الثبات في زمن المتغيرات",
    "titleEn": "Peace & Solace • Firmness in Changing Times",
    "bodyAr": "««يا مقلب القلوب ثبّت قلبي على دينك».. دعاء كان يكثر منه النبي ﷺ، فاستمسك به واسأل الله الثبات على الحق والهدى دائماً»",
    "bodyEn": "\"O Turner of hearts, keep my heart firm upon Your faith.\" Hold tight to this supplication for spiritual stability.",
    "themeTagAr": "ثبات ويقين",
    "themeTagEn": "Spiritual Steadfastness"
  },
  {
    "id": "peace-28",
    "titleAr": "سكينة وبُشرى • لطف الله بأهلك وأحبابك",
    "titleEn": "Peace & Solace • Care for Loved Ones",
    "bodyAr": "«أودع أهلك وأبناءك ومن تحب في ودائع الله؛ فإن ودائع الله لا تضيع أبداً.. توكل عليه فهو خير حافظاً وهو أرحم الراحمين»",
    "bodyEn": "Entrust your loved ones and your family to Allah; whatever is placed in His custody is never lost. He is the Best of Protectors.",
    "themeTagAr": "حفظ وودائع",
    "themeTagEn": "Divine Custody"
  },
  {
    "id": "peace-29",
    "titleAr": "سكينة وبُشرى • بركة الصدق في القول والعمل",
    "titleEn": "Peace & Solace • Truthfulness & Integrity",
    "bodyAr": "«الصدق طمأنينة والكذب ريبة.. اجعل الصدق شعارك في كل كلمة، في كل تعامل، وفي كل سطر كود؛ فإنه يهدي إلى البر والجنة»",
    "bodyEn": "Truthfulness brings tranquility, while falsehood brings doubt. Anchor your work and speech in unwavering honesty.",
    "themeTagAr": "صدق وأمانة",
    "themeTagEn": "Integrity"
  },
  {
    "id": "peace-30",
    "titleAr": "سكينة وبُشرى • الأثر الطيب الباقي",
    "titleEn": "Peace & Solace • Lasting Legacy",
    "bodyAr": "«﴿إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ﴾ • ابنِ شيئاً ينفع الناس بعد رحيلك؛ علماً تنشره أو نفعاً تقيمه أو دعاءً يستمر»",
    "bodyEn": "\"We record what they sent forth and their footprints.\" Build something that serves humanity and outlives you in righteous reward.",
    "themeTagAr": "أثر صالح",
    "themeTagEn": "Good Footprints"
  },
  {
    "id": "peace-31",
    "titleAr": "سكينة وبُشرى • هدوء الليل والاستغفار بالأسحار",
    "titleEn": "Peace & Solace • Serenity of Late Night",
    "bodyAr": "«﴿وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ﴾ • دقائق يسيرة قبل الفجر تصلي فيها ركعتين وتستغفر الله تنزل سكينة تضيء سائر يومك بنور إيماني»",
    "bodyEn": "A few quiet moments before dawn in prayer and repentance descend peace that illuminates your entire coming day.",
    "themeTagAr": "استغفار الأسحار",
    "themeTagEn": "Dawn Repentance"
  },
  {
    "id": "peace-32",
    "titleAr": "سكينة وبُشرى • سرور الرضا بالمقسوم",
    "titleEn": "Peace & Solace • Joy of Contentment",
    "bodyAr": "«ارضَ بما قسم الله لك تكن أغنى الناس.. الغنى الحقيقي غنى النفس وقناعة الضمير، وليس بكثرة العَرَض والمتاع الفاني»",
    "bodyEn": "Be content with what Allah allotted for you, and you will be the richest of people. True wealth is richness of soul.",
    "themeTagAr": "غنى النفس",
    "themeTagEn": "Richness of Soul"
  },
  {
    "id": "peace-33",
    "titleAr": "سكينة وبُشرى • نجاة القلب من الغل والحسد",
    "titleEn": "Peace & Solace • A Clean Heart",
    "bodyAr": "«سلامة الصدر جنة الدنيا المعجلة.. ادعُ دائماً: «ربنا لا تجعل في قلوبنا غلاً للذين آمنوا»؛ تعش خفيف الحمل مرتاح الفؤاد»",
    "bodyEn": "A heart cleansed of malice and jealousy is a taste of Paradise in this life. Walk light-hearted with pure love for all.",
    "themeTagAr": "سلامة الصدر",
    "themeTagEn": "Pure Heart"
  },
  {
    "id": "peace-34",
    "titleAr": "سكينة وبُشرى • نور القرآن وشفاء الصدور",
    "titleEn": "Peace & Solace • Healing of the Quran",
    "bodyAr": "«﴿وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ﴾ • صفحة واحدة تتلوها بتدبر كفيلة بغسل هموم النهار وإعادة التوازن لروحك»",
    "bodyEn": "\"And We send down of the Quran that which is healing and mercy.\" Reading a single page with reflection restores soul balance.",
    "themeTagAr": "شفاء القرآن",
    "themeTagEn": "Quranic Healing"
  },
  {
    "id": "peace-35",
    "titleAr": "سكينة وبُشرى • العطاء الخفي وصدقة السر",
    "titleEn": "Peace & Solace • Secret Charity",
    "bodyAr": "«صدقة السر تطفئ غضب الرب وتدفع ميتة السوء.. حتى التبسم والكلمة الطيبة صدقة تؤنس بها قلباً مكسوراً»",
    "bodyEn": "Secret charity brings divine love and averts hardships. Even a sincere kind word or supportive smile is a blessed charity.",
    "themeTagAr": "بذل وإحسان",
    "themeTagEn": "Secret Charity"
  },
  {
    "id": "peace-36",
    "titleAr": "سكينة وبُشرى • نور التوكل عند اتخاذ القرارات",
    "titleEn": "Peace & Solace • Clarity in Decisions",
    "bodyAr": "«صلِّ الاستخارة واستشر أهل الحكمة، فإذا عزمت فتوكل على الله.. لا تلتفت للوراء، فما اختاره الله لك هو عين المصلحة والهدى»",
    "bodyEn": "Pray Istikhara, consult wise companions, and then move forward with trust in Allah. He directs you to what is best.",
    "themeTagAr": "استخارة وتوكل",
    "themeTagEn": "Decisive Trust"
  },
  {
    "id": "peace-37",
    "titleAr": "سكينة وبُشرى • بر الوالدين ومفتاح التوفيق",
    "titleEn": "Peace & Solace • Honoring Parents",
    "bodyAr": "«دعوة واحدة من والدتك أو والدك برضا صادق تفتح لك أبواباً مغلقة وتيسر لك أموراً عسيرة.. اجعل برهما على رأس أولوياتك اليومية»",
    "bodyEn": "A single sincere prayer from your parents unlocks shut doors and paves your way with unseen success. Cherish them daily.",
    "themeTagAr": "بر وتوفيق",
    "themeTagEn": "Honoring Parents"
  },
  {
    "id": "peace-38",
    "titleAr": "سكينة وبُشرى • حسن المعاشرة والصحبة الصالحة",
    "titleEn": "Peace & Solace • Righteous Companionship",
    "bodyAr": "«اختر لجلساتك من يذكرك بالله إذا نسيت، ويعينك إذا ذكرت.. الصحبة الصالحة سياج يحمي قلبك من الانجراف ويثبتك على الحق»",
    "bodyEn": "Choose companions who remind you of Allah and encourage you in virtue. Good company protects your soul and keeps you grounded.",
    "themeTagAr": "صحبة صالحة",
    "themeTagEn": "Noble Companions"
  },
  {
    "id": "peace-39",
    "titleAr": "سكينة وبُشرى • الإيمان بالقدر خيره وشره",
    "titleEn": "Peace & Solace • Embracing Destiny",
    "bodyAr": "««عجباً لأمر المؤمن إن أمره كله له خير».. إن أصابته سراء شكر فكان خيراً له، وإن أصابته ضراء صبر فكان خيراً له.. أنت في خير دائم»",
    "bodyEn": "\"Amazing is the affair of the believer; all of it is good.\" In blessings he gives thanks, in trials he is patient. You are always in goodness.",
    "themeTagAr": "يقين المؤمن",
    "themeTagEn": "Believer State"
  },
  {
    "id": "peace-40",
    "titleAr": "سكينة وبُشرى • الحمد عند المساء والختام",
    "titleEn": "Peace & Solace • Evening Praise",
    "bodyAr": "«اختم يومك بالحمد والاستغفار؛ فما كان من توفيق فمن الله وحده، وما كان من تقصير فاستغفر منه.. نم وأنت سالم الصدر لجميع خلق الله»",
    "bodyEn": "Close your day with praise and repentance. Sleep with a clean heart free of grudges, entrusting tomorrow to Allah.",
    "themeTagAr": "حمد وسلام",
    "themeTagEn": "Peaceful Night"
  },
  {
    "id": "peace-41",
    "titleAr": "سكينة وبُشرى • الأمل المتجدد كل شروق",
    "titleEn": "Peace & Solace • Renewed Hope",
    "bodyAr": "«مع كل شروق شمس فرصة جديدة يمنحك الله إياها: لتبدأ من جديد، لتصلح ما فسد، ولتزرع بذور الخير.. استبشر واعمل بجد»",
    "bodyEn": "With every sunrise comes a fresh gift from Allah: a chance to begin anew, repair what was broken, and sow seeds of good.",
    "themeTagAr": "أمل وتجديد",
    "themeTagEn": "Renewed Hope"
  },
  {
    "id": "peace-42",
    "titleAr": "سكينة وبُشرى • السعادة الحقيقية في طاعة الله",
    "titleEn": "Peace & Solace • True Happiness",
    "bodyAr": "«ليست السعادة في كثرة ما تملك، بل في نقاء ما في قلبك وقربك من مولاك.. من أرضى الله كفاه الله ورضي عنه وأرضى عنه خلقه»",
    "bodyEn": "True happiness is not in what you possess, but in the purity of your heart and closeness to your Creator. Seek His pleasure above all.",
    "themeTagAr": "سعادة حقيقية",
    "themeTagEn": "True Happiness"
  }
]

const EVENING_ADHKAR_LIST = [
  {
    titleAr: 'سند المُبرمج • أذكار المساء وحفظ الرحمن',
    titleEn: 'Sanad Dev • Evening Adhkar & Peace',
    bodyAr: '«أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له» • طمأنينة للقلب، وحصن حصين للمبرمج بعد ساعات العمل والبرمجة.',
    bodyEn: '"We have reached the evening, and dominion belongs to Allah." • Spiritual renewal after focused engineering.',
  },
  {
    titleAr: 'سند المُبرمج • أذكار المساء والسكينة',
    titleEn: 'Sanad Dev • Evening Remembrance',
    bodyAr: '«اللهم إني أسألك العافية في ديني ودنياي وأهلي ومالي» • راحة للبال وانشراح للصدر وتمام التوكل على الله.',
    bodyEn: 'Seeking divine wellness in faith, work, and life brings serene clarity and inner peace.',
  },
  {
    titleAr: 'سند المُبرمج • أذكار المساء وبركة الحفظ',
    titleEn: 'Sanad Dev • Evening Protection',
    bodyAr: '«أعوذ بكلمات الله التامات من شر ما خلق» (3 مرات) • حفظ ورعاية للمطور في أهله وعمله وفكره.',
    bodyEn: 'Divine refuge and protection from all harm throughout the night.',
  },
]

const CHALLENGE_NOTIFICATIONS_LIST = [
  {
    titleAr: 'سند المُبرمج • تحدي اليوم الهندسي',
    titleEn: 'Sanad Dev • Daily Engineering Challenge',
    bodyAr: 'تحدٍّ برمجي جديد ينتظرك في سند! تفضل بفحص شفرة اليوم، اكتشف الخطأ البرمجي (Bug)، وارتقِ بمستواك البرمجي.',
    bodyEn: 'A new coding challenge is live in Sanad! Inspect the code, squash the bug, and level up today.',
  },
  {
    titleAr: 'سند المُبرمج • تحدي تخمين الخرج البرمجي',
    titleEn: 'Sanad Dev • Output Guess Challenge',
    bodyAr: 'اختبر فهمك للغات البرمجة وأعماق تنفيذ الـ Memory والـ Scope في تحدي اليوم!',
    bodyEn: 'Test your grasp of runtime memory and execution scopes in today’s challenge.',
  },
]

const PRAYER_NAMES = {
  fajr: { ar: 'الفجر', en: 'Fajr' },
  dhuhr: { ar: 'الظهر', en: 'Dhuhr' },
  asr: { ar: 'العصر', en: 'Asr' },
  maghrib: { ar: 'المغرب', en: 'Maghrib' },
  isha: { ar: 'العشاء', en: 'Isha' },
}

const PRAYER_NOTIFICATIONS = {
  fajr: {
    titleAr: 'أذان الفجر • الله أكبر',
    titleEn: 'Fajr Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان الفجر بتوقيت القاهرة | الصلاة خير من النوم، أقبل على ربك بنشاط ونور.',
    bodyEn: 'Now is Fajr prayer time in Cairo | Prayer is better than sleep. Rise and greet your Lord.',
  },
  dhuhr: {
    titleAr: 'أذان الظهر • الله أكبر',
    titleEn: 'Dhuhr Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان الظهر بتوقيت القاهرة | توقف عن الكود، أسبغ الوضوء وأرح بدنك بالصلاة.',
    bodyEn: 'Now is Dhuhr prayer time in Cairo | Step away from code, perform ablution, and find peace in prayer.',
  },
  asr: {
    titleAr: 'أذان العصر • الله أكبر',
    titleEn: 'Asr Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان العصر بتوقيت القاهرة | حافظوا على الصلوات والصلاة الوسطى.',
    bodyEn: 'Now is Asr prayer time in Cairo | Strictly guard your prayers, especially the middle prayer.',
  },
  maghrib: {
    titleAr: 'أذان المغرب • الله أكبر',
    titleEn: 'Maghrib Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان المغرب بتوقيت القاهرة | تقبل الله طاعاتكم وصالح أعمالكم.',
    bodyEn: 'Now is Maghrib prayer time in Cairo | May Allah accept your work, worship, and sincere deeds.',
  },
  isha: {
    titleAr: 'أذان العشاء • الله أكبر',
    titleEn: 'Isha Adhan • Allahu Akbar',
    bodyAr: 'حان الآن موعد أذان العشاء بتوقيت القاهرة | اختم يومك بالصلاة والسكينة.',
    bodyEn: 'Now is Isha prayer time in Cairo | Conclude your active day with serene prayer and devotion.',
  },
}

const ADHAN_AUDIO_MAP = {
  makkah: '/audio/makkah-adhan.mp3',
  madinah: '/audio/madinah-adhan.mp3',
  cairo_refaat: '/audio/cairo-adhan.mp3',
  cairo_mustafa: '/audio/mustafa-ismail-adhan.mp3',
  alaqsa: '/audio/alaqsa-adhan.mp3',
  full_adhan: '/audio/cairo-adhan.mp3',
  short_takbeerat: '/audio/takbeerat.mp3',
  serene_chime: '/audio/waqar-chime.wav',
}

// ================= DYNAMIC NAME & VOCATIVE PERSONALIZER =================
function personalizeNotification(text, name) {
  if (!name || typeof name !== 'string') return text
  const cleanName = name.trim()
  if (!cleanName) return text
  if (text.includes(cleanName)) return text

  if (text.startsWith('«')) {
    return `«يا ${cleanName}، ` + text.slice(1)
  }
  return `يا ${cleanName}، ` + text
}

// ================= STANDALONE CAIRO ASTRONOMICAL PRAYER CALCULATOR =================
// Standalone fallback: Egyptian General Authority of Survey (Fajr 19.5 deg, Isha 17.5 deg, Cairo 30.0444, 31.2357)
function calculateCairoPrayerTimes(date, offsets = {}) {
  try {
    const lat = 30.0444
    const lng = 31.2357
    const d = new Date(date)
    const startOfYear = new Date(d.getFullYear(), 0, 1)
    const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1
    const B = (2 * Math.PI * (dayOfYear - 81)) / 365
    const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)
    const declination = 23.45 * Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365) * (Math.PI / 180)
    const latRad = lat * (Math.PI / 180)
    const tzOffset = -d.getTimezoneOffset() / 60
    const noon = 12 + (4 * (tzOffset * 15 - lng) - EoT) / 60

    function hourAngle(altitudeAngleRad) {
      const cosHA =
        (Math.sin(altitudeAngleRad) - Math.sin(latRad) * Math.sin(declination)) /
        (Math.cos(latRad) * Math.cos(declination))
      if (cosHA > 1) return 0
      if (cosHA < -1) return 180 / 15
      return (Math.acos(cosHA) * (180 / Math.PI)) / 15
    }

    const fajrHA = hourAngle(-19.5 * (Math.PI / 180))
    const sunriseHA = hourAngle(-0.833 * (Math.PI / 180))
    const noonSunAlt = Math.asin(
      Math.sin(latRad) * Math.sin(declination) + Math.cos(latRad) * Math.cos(declination)
    )
    const noonShadow = 1 / Math.tan(noonSunAlt)
    const asrAlt = Math.atan(1 / (1 + Math.max(0, noonShadow)))
    const asrHA = hourAngle(asrAlt)
    const maghribHA = hourAngle(-0.833 * (Math.PI / 180))
    const ishaHA = hourAngle(-17.5 * (Math.PI / 180))

    function toTimeMs(hoursFloat, offsetMins = 0) {
      const totalMinutes = Math.round(hoursFloat * 60) + (offsetMins || 0)
      const res = new Date(d)
      res.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0)
      return res.getTime()
    }

    return {
      fajr: toTimeMs(noon - fajrHA, offsets.fajr),
      sunrise: toTimeMs(noon - sunriseHA, 0),
      dhuhr: toTimeMs(noon, offsets.dhuhr),
      asr: toTimeMs(noon + asrHA, offsets.asr),
      maghrib: toTimeMs(noon + maghribHA, offsets.maghrib),
      isha: toTimeMs(noon + ishaHA, offsets.isha),
    }
  } catch (err) {
    console.warn('[Sanad SW] Cairo astronomical calculation fallback error:', err)
    return null
  }
}

// ================= NON-REPEATING SHUFFLED POOL ALGORITHM =================
// Exhausts entire pool before recycling; never repeats consecutively across cycles
function getNextNonRepeatingItem(poolKey, itemsList, state) {
  if (!itemsList || itemsList.length === 0) return null
  if (!state.pools) state.pools = {}
  let pool = state.pools[poolKey]

  if (!pool || !Array.isArray(pool.remainingIndices) || pool.remainingIndices.length === 0) {
    const indices = []
    for (let i = 0; i < itemsList.length; i++) indices.push(i)
    // Fisher-Yates Shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = indices[i]
      indices[i] = indices[j]
      indices[j] = temp
    }
    // Prevent consecutive repetition with last item across cycle resets
    if (pool && pool.lastIndex !== undefined && indices.length > 1 && indices[0] === pool.lastIndex) {
      const swapIdx = indices.length - 1
      const temp = indices[0]
      indices[0] = indices[swapIdx]
      indices[swapIdx] = temp
    }
    pool = {
      remainingIndices: indices,
      lastIndex: pool ? pool.lastIndex : -1,
    }
    state.pools[poolKey] = pool
  }

  const nextIndex = pool.remainingIndices.shift()
  pool.lastIndex = nextIndex
  return itemsList[nextIndex]
}

// ================= NATIVE INDEXEDDB STORAGE (PERSISTENT & SURVIVES CLOSURES) =================
const IDB_NAME = 'sanad_sw_db_v2'
const IDB_STORE = 'sw_state_store'
const IDB_KEY = 'sw_state'

function openSwDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in SW'))
    }
    try {
      const request = indexedDB.open(IDB_NAME, 2)
      request.onupgradeneeded = (e) => {
        try {
          const db = e.target.result
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE)
          }
        } catch (err) {
          console.warn('[Sanad SW] onupgradeneeded error:', err)
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error || new Error('Failed to open SW IDB'))
    } catch (err) {
      reject(err)
    }
  })
}

async function getStoredState() {
  // 1. Try reading from native IndexedDB
  try {
    const db = await openSwDb()
    if (db && db.objectStoreNames && db.objectStoreNames.contains(IDB_STORE)) {
      const state = await new Promise((resolve) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readonly')
          const store = tx.objectStore(IDB_STORE)
          const req = store.get(IDB_KEY)
          req.onsuccess = () => resolve(req.result || null)
          req.onerror = () => resolve(null)
          tx.onerror = () => resolve(null)
        } catch {
          resolve(null)
        }
      })
      if (state && typeof state === 'object' && state.settings) {
        if (!state.lockedTriggers) state.lockedTriggers = {}
        if (!state.pools) state.pools = {}
        if (!state.userProfile) state.userProfile = { name: '', gender: 'female', onboarded: false }
        return state
      }
    }
  } catch (err) {}

  // 2. Fallback to Cache Storage
  try {
    const cache = await caches.open(STATE_CACHE_NAME)
    const match = await cache.match(STATE_URL)
    if (match) {
      const parsed = await match.json()
      if (parsed && typeof parsed === 'object') {
        if (!parsed.lockedTriggers) parsed.lockedTriggers = {}
        if (!parsed.pools) parsed.pools = {}
        if (!parsed.userProfile) parsed.userProfile = { name: '', gender: 'female', onboarded: false }
        return parsed
      }
    }
  } catch (err) {
    console.warn('[Sanad SW] Error reading state from cache:', err)
  }

  // 3. Fallback to resilient default state
  return {
    settings: {
      prayerAlerts: true,
      preAdhanAlerts: true,
      dailyTips: true,
      periodicDhikr: true,
      dhikrIntervalMinutes: 60,
      soundEnabled: true,
      salawatAudioEnabled: true,
      salawatIntervalMinutes: 15,
      waqarMessagesEnabled: true,
      waqarSoundEnabled: true,
      waqarIntervalMinutes: 10,
      peaceRemindersEnabled: true,
      eveningAdhkarEnabled: true,
      challengeAlertsEnabled: true,
      adhanAudioOption: 'cairo_refaat',
    },
    userProfile: {
      name: '',
      gender: 'female',
      onboarded: false,
    },
    prayerTimes: null,
    prayerCalendar: {},
    offsets: {},
    lang: 'ar',
    lastAnyNotificationTime: 0,
    lastSalawatTime: 0,
    lastWaqarTime: 0,
    lastPeaceTime: 0,
    lastDhikrTime: 0,
    lastPrayerTime: 0,
    scheduledSalawatTimes: [],
    scheduledWaqarTimes: [],
    scheduledEvents: {},
    notifiedPrayers: {},
    lockedTriggers: {},
    pools: {},
  }
}

async function saveStoredState(state) {
  // 1. Save to native IndexedDB
  try {
    const db = await openSwDb()
    if (db && db.objectStoreNames && db.objectStoreNames.contains(IDB_STORE)) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite')
          const store = tx.objectStore(IDB_STORE)
          const req = store.put(state, IDB_KEY)
          req.onsuccess = () => resolve(true)
          req.onerror = () => resolve(false)
          tx.onerror = () => resolve(false)
        } catch {
          resolve(false)
        }
      })
    }
  } catch (err) {
    console.warn('[Sanad SW] Error saving state to IDB:', err)
  }

  // 2. Mirror in Cache Storage for redundancy
  try {
    const cache = await caches.open(STATE_CACHE_NAME)
    await cache.put(
      STATE_URL,
      new Response(JSON.stringify(state), {
        headers: { 'Content-Type': 'application/json' },
      })
    )
  } catch (err) {
    console.warn('[Sanad SW] Error saving state to Cache:', err)
  }
}

// ================= BACKGROUND REMINDERS LOGIC (SMART TEMPORAL SCHEDULER) =================
let isCheckingReminders = false
let lastGlobalNotificationTime = 0
let lastHeartbeatTimestamp = Date.now()
let nextWakeupTimer = null

function updateScheduledTimestamps(state, now = Date.now()) {
  const salawatMins = Number(state.settings?.salawatIntervalMinutes) || 15
  const salawatIntervalMs = salawatMins * 60 * 1000
  const lastSalawat = Number(state.lastSalawatTime) || now

  const nextSalawatList = []
  let sTime = lastSalawat + salawatIntervalMs
  while (sTime <= now + 24 * 60 * 60 * 1000) {
    if (sTime > now) nextSalawatList.push(sTime)
    sTime += salawatIntervalMs
  }
  state.scheduledSalawatTimes = nextSalawatList.slice(0, 24)
}

function scheduleNextWakeup(state) {
  if (nextWakeupTimer) {
    clearTimeout(nextWakeupTimer)
    nextWakeupTimer = null
  }

  const now = Date.now()
  const candidates = []

  if (state.scheduledSalawatTimes && state.scheduledSalawatTimes.length > 0) {
    const nextS = state.scheduledSalawatTimes.find((t) => t > now)
    if (nextS) candidates.push(nextS)
  } else {
    const salawatMins = Number(state.settings?.salawatIntervalMinutes) || 15
    candidates.push((Number(state.lastSalawatTime) || now) + salawatMins * 60 * 1000)
  }

  const validCandidates = candidates.filter((t) => t > now)
  if (validCandidates.length > 0) {
    const earliest = Math.min(...validCandidates)
    const delay = Math.max(1000, earliest - now)

    nextWakeupTimer = setTimeout(() => {
      checkAndDispatchBackgroundReminders('scheduled_wakeup').catch(() => {})
    }, delay)
  }
}

async function checkAndDispatchBackgroundReminders(wakeReason = 'heartbeat') {
  lastHeartbeatTimestamp = Date.now()
  if (isCheckingReminders) return
  isCheckingReminders = true

  try {
    const state = await getStoredState()
    const now = Date.now()
    const nowDate = new Date(now)
    const y = nowDate.getFullYear()
    const m = String(nowDate.getMonth() + 1).padStart(2, '0')
    const d = String(nowDate.getDate()).padStart(2, '0')
    const today = `${y}-${m}-${d}`
    const currentHour = nowDate.getHours()
    const currentMinute = nowDate.getMinutes()
    const isAr = state.lang !== 'en'
    const userName = (state.userProfile?.name || '').trim()
    const userGender = state.userProfile?.gender || 'female'
    const isMale = userGender === 'male'

    if (!state.lockedTriggers) state.lockedTriggers = {}
    if (!state.pools) state.pools = {}
    if (!state.notifiedPrayers) state.notifiedPrayers = {}

    // Initialize baseline timestamps if missing
    if (!state.lastSalawatTime || state.lastSalawatTime <= 0) {
      state.lastSalawatTime = now
    }
    if (!state.lastWaqarTime || state.lastWaqarTime <= 0) {
      state.lastWaqarTime = now
    }
    if (!state.lastPeaceTime || state.lastPeaceTime <= 0) {
      state.lastPeaceTime = now
    }
    if (!state.lastDhikrTime || state.lastDhikrTime <= 0) {
      state.lastDhikrTime = now
    }

    const broadcastToClients = async (title, body, type, extra = {}) => {
      try {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        for (const client of clients) {
          client.postMessage({
            type: 'SANAD_NOTIFICATION_TRIGGERED',
            toast: {
              id: `${type}-${now}`,
              title,
              body,
              type,
              timestamp: now,
            },
            ...extra,
          })
        }
      } catch (e) {}
    }

    // Resolve today's prayer times: 60-day calendar > state.prayerTimes > astronomical formula
    let todayPrayers = state.prayerCalendar?.[today] || state.prayerTimes
    if (!todayPrayers || !todayPrayers.fajr) {
      todayPrayers = calculateCairoPrayerTimes(nowDate, state.offsets || {})
    }

    // Exact Adhan window check (suppress non-prayer notifications within 2 mins of Adhan)
    const TWO_MINS_MS = 2 * 60 * 1000
    const isAdhanExactMoment = (timestamp, prayersMap) => {
      if (!prayersMap) return false
      for (const pKey of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']) {
        const p = prayersMap[pKey]
        if (p && Math.abs(timestamp - p) <= TWO_MINS_MS) {
          return true
        }
      }
      return false
    }

    // -------------------------------------------------------------
    // 1. PRAYER TIMES & ADHAN (HIGHEST PRIORITY - STRICTLY ONCE)
    // -------------------------------------------------------------
    if (state.settings?.prayerAlerts && todayPrayers) {
      for (const key of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']) {
        const pTime = todayPrayers[key]
        if (!pTime) continue

        // 1.A Pre-Adhan Reminder (5 Minutes Before Prayer)
        const preAdhanLockKey = `pre_adhan_locked_${today}_${key}`
        const preAdhanTime = pTime - 5 * 60 * 1000
        if (
          state.settings?.preAdhanAlerts !== false &&
          now >= preAdhanTime &&
          now < pTime &&
          !state.lockedTriggers[preAdhanLockKey]
        ) {
          state.lockedTriggers[preAdhanLockKey] = now
          const prayerName = PRAYER_NAMES[key] || { ar: key, en: key }
          const title = isAr
            ? (userName ? `اقتراب صلاة ${prayerName.ar} • يا ${userName}` : `اقتراب صلاة ${prayerName.ar} • متبقي 5 دقائق`)
            : `${prayerName.en} Prayer Approaching • 5 Minutes Left`
          let body = isAr
            ? `حان وقت الاستعداد لصلاة ${prayerName.ar}؛ أسبغ الوضوء وأرح بدنك وروحك بالصلاة.`
            : `Prepare for ${prayerName.en} prayer. Perform ablution and find serene peace in prayer.`
          if (userName && isAr) {
            body = `يا ${userName}، حان وقت الاستعداد لصلاة ${prayerName.ar}؛ أسبغ الوضوء وأرح بدنك وروحك بالصلاة.`
          }

          try {
            await self.registration.showNotification(title, {
              body,
              icon: APP_ICON_URL,
              sound: '/audio/waqar-chime.wav',
              vibrate: [250, 100, 250],
              tag: `sanad-pre-adhan-${key}`,
              renotify: true,
              requireInteraction: false,
              data: { url: APP_ORIGIN + '/', type: 'pre_adhan', prayerKey: key },
            })
          } catch (err) {
            console.warn('[Sanad SW] Error showing Pre-Adhan notification:', err)
          }

          state.lastAnyNotificationTime = now
          lastGlobalNotificationTime = now
          await broadcastToClients(title, body, 'pre_adhan')
          await saveStoredState(state)
          return
        }

        // 1.B Exact Adhan Moment (Strictly ONCE per prayer)
        const adhanLockKey = `adhan_locked_${today}_${key}`
        const diffMs = now - pTime
        if (
          diffMs >= 0 &&
          diffMs <= 15 * 60 * 1000 &&
          !state.lockedTriggers[adhanLockKey] &&
          !state.notifiedPrayers[`${today}_${key}`]
        ) {
          state.lockedTriggers[adhanLockKey] = now
          state.notifiedPrayers[`${today}_${key}`] = true

          const pData = PRAYER_NOTIFICATIONS[key]
          if (pData) {
            const title = isAr ? pData.titleAr : pData.titleEn
            const body = isAr ? pData.bodyAr : pData.bodyEn
            const adhanOpt = state.settings?.adhanAudioOption || 'cairo_refaat'
            const soundFile = ADHAN_AUDIO_MAP[adhanOpt] || '/audio/cairo-adhan.mp3'

            try {
              await self.registration.showNotification(title, {
                body,
                icon: APP_ICON_URL,
                sound: soundFile,
                vibrate: [500, 200, 500, 200, 500],
                tag: `sanad-prayer-${key}`,
                renotify: true,
                requireInteraction: true,
                silent: false,
                data: {
                  url: `/?playAdhan=${adhanOpt}`,
                  type: 'prayer',
                  prayerKey: key,
                  adhanOption: adhanOpt,
                  soundFile,
                },
              })
            } catch (err) {
              console.warn('[Sanad SW] Error showing Prayer notification:', err)
            }

            state.lastAnyNotificationTime = now
            state.lastPrayerTime = now
            lastGlobalNotificationTime = now
            await broadcastToClients(title, body, 'prayer', {
              playAdhan: true,
              sound: soundFile,
              adhanOption: adhanOpt,
            })
            updateScheduledTimestamps(state, now)
            await saveStoredState(state)
            scheduleNextWakeup(state)
            return
          }
        }
      }
    }

    // Suppress non-prayer notifications during the exact 2-minute Adhan window
    if (isAdhanExactMoment(now, todayPrayers)) {
      updateScheduledTimestamps(state, now)
      await saveStoredState(state)
      scheduleNextWakeup(state)
      return
    }

    // Spacing safeguard: Avoid firing non-prayer alerts if another notification was sent less than 45 seconds ago
    if (now - state.lastAnyNotificationTime < 45000) {
      scheduleNextWakeup(state)
      return
    }

    // ---------------------------------------------------------------------------------
    // 2. الصلاة على النبي ﷺ • STANDALONE TIMER (DEFAULT EVERY 15 MINUTES, NEVER LOOPS)
    // ---------------------------------------------------------------------------------
    const chosenSalawatMins = Number(state.settings?.salawatIntervalMinutes) || 15
    const salawatIntervalMs = chosenSalawatMins * 60 * 1000
    const lastSalawat = Number(state.lastSalawatTime) || 0

    if (state.settings?.salawatAudioEnabled !== false && now - lastSalawat >= salawatIntervalMs) {
      const item = getNextNonRepeatingItem('salawat', SALAWAT_LIST, state)
      if (item) {
        const title = isAr ? item.titleAr : item.titleEn
        const body = isAr ? item.bodyAr : item.bodyEn

        state.lastSalawatTime = now
        state.lastAnyNotificationTime = now
        lastGlobalNotificationTime = now

        try {
          await self.registration.showNotification(title, {
            body,
            icon: APP_ICON_URL,
            sound: '/audio/salawat.mp3',
            vibrate: [300, 150, 300, 150, 300],
            tag: 'sanad-salawat',
            renotify: true,
            requireInteraction: false,
            data: { url: APP_ORIGIN + '/', type: 'salawat' },
          })
        } catch (err) {
          console.warn('[Sanad SW] Error showing Salawat notification:', err)
        }

        await broadcastToClients(title, body, 'salawat')
        updateScheduledTimestamps(state, now)
        await saveStoredState(state)
        scheduleNextWakeup(state)
        return
      }
    }

    // ---------------------------------------------------------------------------------
    // 3. رسائل وَقار • GENDER-AWARE (FEMALE: HIJAB & MODESTY / MALE: LOWERING GAZE & CHIVALRY)
    // ---------------------------------------------------------------------------------
    if (state.settings?.waqarMessagesEnabled !== false) {
      const isSlot1 = currentHour === 11 && currentMinute >= 30
      const isSlot2 = currentHour === 15 && currentMinute >= 45
      const isSlot3 = currentHour === 20 && currentMinute >= 45

      let targetWaqarSlot = null
      if (isSlot1 && !state.lockedTriggers[`waqar_locked_${today}_slot1`]) {
        targetWaqarSlot = 'slot1'
      } else if (isSlot2 && !state.lockedTriggers[`waqar_locked_${today}_slot2`]) {
        targetWaqarSlot = 'slot2'
      } else if (isSlot3 && !state.lockedTriggers[`waqar_locked_${today}_slot3`]) {
        targetWaqarSlot = 'slot3'
      }

      if (targetWaqarSlot) {
        state.lockedTriggers[`waqar_locked_${today}_${targetWaqarSlot}`] = now
        const waqarList = isMale ? WAQAR_MALE_MESSAGES : WAQAR_FEMALE_MESSAGES
        const poolKey = isMale ? 'waqar_male' : 'waqar_female'
        const item = getNextNonRepeatingItem(poolKey, waqarList, state)

        if (item) {
          let title = isAr ? item.titleAr : item.titleEn
          let body = isAr ? item.bodyAr : item.bodyEn

          if (userName && isAr) {
            title = isMale ? `وَقار ورجولة • يا ${userName}` : `وَقار وحياء • يا ${userName}`
            body = personalizeNotification(body, userName)
          }

          state.lastWaqarTime = now
          state.lastAnyNotificationTime = now
          lastGlobalNotificationTime = now

          try {
            await self.registration.showNotification(title, {
              body,
              icon: APP_ICON_URL,
              sound: '/audio/waqar-chime.wav',
              vibrate: [200, 100, 200],
              tag: 'sanad-waqar',
              renotify: true,
              requireInteraction: false,
              data: { url: APP_ORIGIN + '/', type: 'waqar' },
            })
          } catch (err) {
            console.warn('[Sanad SW] Error showing Waqar notification:', err)
          }

          await broadcastToClients(title, body, 'waqar')
          await saveStoredState(state)
          scheduleNextWakeup(state)
          return
        }
      }
    }

    // ---------------------------------------------------------------------------------
    // 4. رسائل السكينة والبشرى • 3 DEDICATED SLOTS DAILY (9:00 AM, 2:15 PM, 10:15 PM)
    // ---------------------------------------------------------------------------------
    if (state.settings?.peaceRemindersEnabled !== false) {
      const isPeaceSlot1 = currentHour === 9
      const isPeaceSlot2 = currentHour === 14 && currentMinute >= 15
      const isPeaceSlot3 = currentHour === 22 && currentMinute >= 15

      let targetPeaceSlot = null
      if (isPeaceSlot1 && !state.lockedTriggers[`peace_locked_${today}_slot1`]) {
        targetPeaceSlot = 'slot1'
      } else if (isPeaceSlot2 && !state.lockedTriggers[`peace_locked_${today}_slot2`]) {
        targetPeaceSlot = 'slot2'
      } else if (isPeaceSlot3 && !state.lockedTriggers[`peace_locked_${today}_slot3`]) {
        targetPeaceSlot = 'slot3'
      }

      if (targetPeaceSlot) {
        state.lockedTriggers[`peace_locked_${today}_${targetPeaceSlot}`] = now
        const item = getNextNonRepeatingItem('peace', PEACE_MOTIVATION_MESSAGES, state)
        if (item) {
          let title = isAr ? item.titleAr : item.titleEn
          let body = isAr ? item.bodyAr : item.bodyEn

          if (userName && isAr) {
            title = `سكينة وبُشرى • يا ${userName}`
            body = personalizeNotification(body, userName)
          }

          state.lastPeaceTime = now
          state.lastAnyNotificationTime = now
          lastGlobalNotificationTime = now

          try {
            await self.registration.showNotification(title, {
              body,
              icon: APP_ICON_URL,
              sound: '/audio/waqar-chime.wav',
              vibrate: [250, 100, 250],
              tag: 'sanad-peace',
              renotify: true,
              requireInteraction: false,
              data: { url: APP_ORIGIN + '/', type: 'peace' },
            })
          } catch (err) {
            console.warn('[Sanad SW] Error showing Peace notification:', err)
          }

          await broadcastToClients(title, body, 'peace')
          await saveStoredState(state)
          scheduleNextWakeup(state)
          return
        }
      }
    }

    // -------------------------------------------------------------
    // 5. إشراقة سَنَد • EARLY MORNING WINDOW (7:00 AM - 8:30 AM)
    // -------------------------------------------------------------
    const ishraqaLockKey = `ishraqa_locked_${today}`
    if (
      currentHour >= 7 &&
      (currentHour === 7 || (currentHour === 8 && currentMinute <= 30)) &&
      !state.lockedTriggers[ishraqaLockKey] &&
      state.settings?.dailyTips !== false
    ) {
      const item = getNextNonRepeatingItem('ishraqa', SANAD_ISHRAQA_LIST, state)
      if (item) {
        state.lockedTriggers[ishraqaLockKey] = now
        let title = isAr ? item.titleAr : item.titleEn
        let body = isAr
          ? `${item.bodyAr} — ${item.referenceAr}`
          : `${item.bodyEn} — ${item.referenceEn}`

        if (userName && isAr) {
          title = `إشراقة سَنَد • يا ${userName}`
          body = personalizeNotification(body, userName)
        }

        state.lastAnyNotificationTime = now
        lastGlobalNotificationTime = now

        try {
          await self.registration.showNotification(title, {
            body,
            icon: APP_ICON_URL,
            vibrate: [250, 100, 250, 100, 250],
            tag: 'sanad-ishraqa',
            renotify: false,
            requireInteraction: false,
            data: { url: APP_ORIGIN + '/', type: 'tip' },
          })
        } catch (err) {
          console.warn('[Sanad SW] Error showing Ishraqa notification:', err)
        }

        await broadcastToClients(title, body, 'tip')
        await saveStoredState(state)
        scheduleNextWakeup(state)
        return
      }
    }

    // -------------------------------------------------------------
    // 6. أذكار المساء • POST-ASR TO SUNSET
    // -------------------------------------------------------------
    const eveningAdhkarLockKey = `evening_adhkar_locked_${today}`
    if (state.settings?.eveningAdhkarEnabled !== false && !state.lockedTriggers[eveningAdhkarLockKey]) {
      const asrTime = todayPrayers?.asr
      const maghribTime = todayPrayers?.maghrib
      const hasAsrPassed = asrTime && now >= asrTime + 12 * 60 * 1000
      const isBeforeMaghrib = maghribTime ? now < maghribTime - 20 * 60 * 1000 : currentHour < 17

      if (hasAsrPassed && isBeforeMaghrib) {
        const item = getNextNonRepeatingItem('evening_adhkar', EVENING_ADHKAR_LIST, state)
        if (item) {
          state.lockedTriggers[eveningAdhkarLockKey] = now
          const title = isAr ? item.titleAr : item.titleEn
          const body = isAr ? item.bodyAr : item.bodyEn

          state.lastAnyNotificationTime = now
          lastGlobalNotificationTime = now

          try {
            await self.registration.showNotification(title, {
              body,
              icon: APP_ICON_URL,
              vibrate: [200, 100, 200],
              tag: 'sanad-evening-adhkar',
              renotify: false,
              requireInteraction: false,
              data: { url: APP_ORIGIN + '/', type: 'evening_adhkar' },
            })
          } catch (err) {
            console.warn('[Sanad SW] Error showing Evening Adhkar notification:', err)
          }

          await broadcastToClients(title, body, 'evening_adhkar')
          await saveStoredState(state)
          scheduleNextWakeup(state)
          return
        }
      }
    }

    // -------------------------------------------------------------
    // 7. تحديات البرمجة اليومية • EVENING WINDOW (6:30 PM - 8:00 PM)
    // -------------------------------------------------------------
    const challengeLockKey = `challenge_locked_${today}`
    if (state.settings?.challengeAlertsEnabled !== false && !state.lockedTriggers[challengeLockKey]) {
      const isChallengeWindow =
        (currentHour === 18 && currentMinute >= 30) || (currentHour === 19 && currentMinute <= 59)

      if (isChallengeWindow) {
        const item = getNextNonRepeatingItem('challenge', CHALLENGE_NOTIFICATIONS_LIST, state)
        if (item) {
          state.lockedTriggers[challengeLockKey] = now
          const title = isAr ? item.titleAr : item.titleEn
          const body = isAr ? item.bodyAr : item.bodyEn

          state.lastAnyNotificationTime = now
          lastGlobalNotificationTime = now

          try {
            await self.registration.showNotification(title, {
              body,
              icon: APP_ICON_URL,
              vibrate: [200, 100, 200],
              tag: 'sanad-challenge',
              renotify: false,
              requireInteraction: false,
              data: { url: APP_ORIGIN + '/', type: 'challenge' },
            })
          } catch (err) {
            console.warn('[Sanad SW] Error showing Challenge notification:', err)
          }

          await broadcastToClients(title, body, 'challenge')
          await saveStoredState(state)
          scheduleNextWakeup(state)
          return
        }
      }
    }

    // ---------------------------------------------------------------------------------
    // 8. أذكار التسبيح والاستغفار • (EVERY 60-120 MIN, 8 AM TO 10 PM)
    // ---------------------------------------------------------------------------------
    if (state.settings?.periodicDhikr && currentHour >= 8 && currentHour < 22) {
      const dhikrIntervalMs = (Number(state.settings?.dhikrIntervalMinutes) || 60) * 60 * 1000
      const lastDhikr = state.lastDhikrTime || 0

      if (now - lastDhikr >= dhikrIntervalMs) {
        const item = getNextNonRepeatingItem('dhikr', DHIKR_LIST, state)
        if (item) {
          const title = isAr ? item.titleAr : item.titleEn
          const body = isAr ? item.bodyAr : item.bodyEn

          state.lastDhikrTime = now
          state.lastAnyNotificationTime = now
          lastGlobalNotificationTime = now

          try {
            await self.registration.showNotification(title, {
              body,
              icon: APP_ICON_URL,
              vibrate: [200, 100, 200],
              tag: 'sanad-dhikr',
              renotify: false,
              requireInteraction: false,
              data: { url: APP_ORIGIN + '/', type: 'dhikr' },
            })
          } catch (err) {
            console.warn('[Sanad SW] Error showing Dhikr notification:', err)
          }

          await broadcastToClients(title, body, 'dhikr')
          await saveStoredState(state)
          scheduleNextWakeup(state)
          return
        }
      }
    }

    updateScheduledTimestamps(state, now)
    await saveStoredState(state)
    scheduleNextWakeup(state)
  } finally {
    isCheckingReminders = false
  }
}

// ================= SERVICE WORKER LIFECYCLE (OFFLINE-FIRST) =================
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of STATIC_ASSETS) {
        try {
          await cache.add(asset)
        } catch (err) {
          console.warn('[Sanad SW] Could not pre-cache asset:', asset, err)
        }
      }
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim()
      const keys = await caches.keys()
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== STATE_CACHE_NAME && key !== QURAN_AUDIO_CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )

      if ('periodicSync' in self.registration) {
        try {
          const tags = await self.registration.periodicSync.getTags()
          if (!tags.includes('sanad-periodic-check')) {
            await self.registration.periodicSync.register('sanad-periodic-check', {
              minInterval: 10 * 60 * 1000,
            })
            console.log('[Sanad SW] Registered periodicSync: sanad-periodic-check (10m)')
          }
          if (!tags.includes('sanad-reminders')) {
            await self.registration.periodicSync.register('sanad-reminders', {
              minInterval: 10 * 60 * 1000,
            })
          }
        } catch (e) {
          console.log('[Sanad SW] periodicSync registration note:', e)
        }
      }

      await checkAndDispatchBackgroundReminders('activate')
      ensureBackgroundInterval()
    })()
  )
})

// Fetch event: 100% Offline Support for Audio, Documents, and Assets
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.pathname === STATE_URL || url.protocol.startsWith('chrome-extension')) {
    return
  }

  if (Date.now() - lastHeartbeatTimestamp >= 5 * 60 * 1000) {
    lastHeartbeatTimestamp = Date.now()
    event.waitUntil(checkAndDispatchBackgroundReminders('fetch_wakeup'))
  }

  // 1. Audio files (.mp3, .wav, .ogg): Cache-first with network fallback
  if (
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.wav') ||
    url.pathname.endsWith('.ogg')
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached
        return fetch(req)
          .then((res) => {
            if (res && res.status === 200) {
              const clone = res.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
            }
            return res
          })
          .catch(() => cached || new Response('', { status: 408, statusText: 'Audio Offline' }))
      })
    )
    return
  }

  // 2. HTML navigation: Network first, fallback to cached /index.html for SPA offline boot
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('/index.html')))
    return
  }

  // 3. Static assets & API: Cache-first with network fallback and dynamic caching
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(req)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => {
          return cachedResponse || new Response('', { status: 408, statusText: 'Request Offline' })
        })
    })
  )
})

// Notification Click: Focus open window or open new window and trigger adhan audio
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const notifData = event.notification.data || {}
  const targetUrl = notifData.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          await client.focus()
          if (notifData.type === 'prayer') {
            client.postMessage({
              type: 'PLAY_ADHAN',
              prayerKey: notifData.prayerKey,
              adhanOption: notifData.adhanOption,
              soundFile: notifData.soundFile,
            })
          }
          return
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})

self.addEventListener('notificationclose', (event) => {
  console.log('[Sanad SW] Notification closed by user:', event.notification.tag)
})

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sanad-periodic-check' || event.tag === 'sanad-reminders') {
    event.waitUntil(checkAndDispatchBackgroundReminders('periodicsync:' + event.tag))
  }
})

self.addEventListener('sync', (event) => {
  event.waitUntil(checkAndDispatchBackgroundReminders('sync:' + event.tag))
})

// Active Background Interval
let backgroundTimer = null

function ensureBackgroundInterval() {
  lastHeartbeatTimestamp = Date.now()
  if (backgroundTimer) {
    clearInterval(backgroundTimer)
    backgroundTimer = null
  }
  checkAndDispatchBackgroundReminders('interval_init').catch(() => {})

  backgroundTimer = setInterval(() => {
    lastHeartbeatTimestamp = Date.now()
    checkAndDispatchBackgroundReminders('interval_tick').catch((err) => {
      console.warn('[Sanad SW] Background interval tick error:', err)
    })
  }, 60000)
}
ensureBackgroundInterval()

// ================= MESSAGE LISTENER (SYNC, DIAGNOSTICS & TRIGGERS) =================
self.addEventListener('message', (event) => {
  const data = event.data
  if (!data || !data.type) return

  if (data.type === 'SYNC_CONFIG') {
    event.waitUntil(
      (async () => {
        const state = await getStoredState()
        if (data.payload?.settings) {
          state.settings = { ...state.settings, ...data.payload.settings }
        }
        if (data.payload?.userProfile) {
          state.userProfile = { ...state.userProfile, ...data.payload.userProfile }
        }
        if (data.payload?.prayerTimes) {
          state.prayerTimes = data.payload.prayerTimes
        }
        if (data.payload?.prayerCalendar) {
          state.prayerCalendar = { ...state.prayerCalendar, ...data.payload.prayerCalendar }
        }
        if (data.payload?.offsets) {
          state.offsets = { ...state.offsets, ...data.payload.offsets }
        }
        if (data.payload?.lang) {
          state.lang = data.payload.lang
        }
        if (!state.lastSalawatTime || state.lastSalawatTime <= 0) {
          state.lastSalawatTime = Date.now()
        }
        if (!state.lastWaqarTime || state.lastWaqarTime <= 0) {
          state.lastWaqarTime = Date.now()
        }
        if (!state.lastPeaceTime || state.lastPeaceTime <= 0) {
          state.lastPeaceTime = Date.now()
        }
        if (!state.lastDhikrTime || state.lastDhikrTime <= 0) {
          state.lastDhikrTime = Date.now()
        }
        if (!state.lastAnyNotificationTime) {
          state.lastAnyNotificationTime = Date.now()
        }
        if (Array.isArray(data.payload?.scheduledSalawatTimes) && data.payload.scheduledSalawatTimes.length > 0) {
          state.scheduledSalawatTimes = data.payload.scheduledSalawatTimes
        }

        updateScheduledTimestamps(state, Date.now())
        await saveStoredState(state)
        scheduleNextWakeup(state)
        ensureBackgroundInterval()
      })()
    )
  } else if (data.type === 'GET_SW_STATUS') {
    event.waitUntil(
      (async () => {
        const state = await getStoredState()
        const chosenSalawatMins = Number(state.settings?.salawatIntervalMinutes) || 15
        const salawatIntervalMs = chosenSalawatMins * 60 * 1000
        const now = Date.now()

        const lastSalawat = Number(state.lastSalawatTime) || 0
        const elapsedSinceSalawat = now - lastSalawat
        const nextSalawatInMs = Math.max(0, salawatIntervalMs - elapsedSinceSalawat)

        const statusPayload = {
          isAlive: true,
          version: CACHE_NAME,
          timerRunning: Boolean(backgroundTimer),
          lastHeartbeat: lastHeartbeatTimestamp,
          currentTime: now,
          salawatIntervalMinutes: chosenSalawatMins,
          salawatAudioEnabled: state.settings?.salawatAudioEnabled !== false,
          lastSalawatTime: lastSalawat,
          nextSalawatInMs,
          scheduledSalawatTimes: state.scheduledSalawatTimes || [],
          indexedDbActive: true,
          cacheName: CACHE_NAME,
          settings: state.settings,
          userProfile: state.userProfile,
        }

        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({
            type: 'SW_STATUS_RESPONSE',
            payload: statusPayload,
          })
        } else if (event.source && typeof event.source.postMessage === 'function') {
          event.source.postMessage({
            type: 'SW_STATUS_RESPONSE',
            payload: statusPayload,
          })
        }
      })()
    )
  } else if (data.type === 'TRIGGER_SALAWAT_NOW') {
    event.waitUntil(
      (async () => {
        const state = await getStoredState()
        const isAr = state.lang !== 'en'
        const item = getNextNonRepeatingItem('salawat', SALAWAT_LIST, state)
        if (!item) return

        const title = isAr ? item.titleAr : item.titleEn
        const body = isAr ? item.bodyAr : item.bodyEn

        state.lastSalawatTime = Date.now()
        state.lastAnyNotificationTime = Date.now()
        lastGlobalNotificationTime = Date.now()
        updateScheduledTimestamps(state, Date.now())
        await saveStoredState(state)
        scheduleNextWakeup(state)

        await self.registration.showNotification(title, {
          body,
          icon: APP_ICON_URL,
          sound: '/audio/salawat.mp3',
          vibrate: [300, 150, 300, 150, 300],
          tag: 'sanad-salawat',
          renotify: true,
          requireInteraction: false,
          data: { url: APP_ORIGIN + '/', type: 'salawat' },
        })

        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        for (const client of clients) {
          client.postMessage({
            type: 'SANAD_NOTIFICATION_TRIGGERED',
            toast: {
              id: `salawat-test-${Date.now()}`,
              title,
              body,
              type: 'salawat',
              timestamp: Date.now(),
            },
          })
        }
      })()
    )
  } else if (data.type === 'TRIGGER_WAQAR_NOW') {
    event.waitUntil(
      (async () => {
        const state = await getStoredState()
        const isAr = state.lang !== 'en'
        const isMale = state.userProfile?.gender === 'male'
        const list = isMale ? WAQAR_MALE_MESSAGES : WAQAR_FEMALE_MESSAGES
        const poolKey = isMale ? 'waqar_male' : 'waqar_female'
        const item = getNextNonRepeatingItem(poolKey, list, state)
        if (!item) return

        const userName = (state.userProfile?.name || '').trim()
        let title = isAr ? item.titleAr : item.titleEn
        let body = isAr ? item.bodyAr : item.bodyEn
        if (userName && isAr) {
          title = isMale ? `وَقار ورجولة • يا ${userName}` : `وَقار وحياء • يا ${userName}`
          body = personalizeNotification(body, userName)
        }

        state.lastWaqarTime = Date.now()
        state.lastAnyNotificationTime = Date.now()
        lastGlobalNotificationTime = Date.now()
        await saveStoredState(state)
        scheduleNextWakeup(state)

        await self.registration.showNotification(title, {
          body,
          icon: APP_ICON_URL,
          sound: '/audio/waqar-chime.wav',
          vibrate: [250, 100, 250],
          tag: 'sanad-waqar',
          renotify: true,
          requireInteraction: false,
          data: { url: APP_ORIGIN + '/', type: 'waqar' },
        })

        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        for (const client of clients) {
          client.postMessage({
            type: 'SANAD_NOTIFICATION_TRIGGERED',
            toast: {
              id: `waqar-test-${Date.now()}`,
              title,
              body,
              type: 'waqar',
              timestamp: Date.now(),
            },
          })
        }
      })()
    )
  } else if (data.type === 'TRIGGER_PEACE_NOW') {
    event.waitUntil(
      (async () => {
        const state = await getStoredState()
        const isAr = state.lang !== 'en'
        const item = getNextNonRepeatingItem('peace', PEACE_MOTIVATION_MESSAGES, state)
        if (!item) return

        const userName = (state.userProfile?.name || '').trim()
        let title = isAr ? item.titleAr : item.titleEn
        let body = isAr ? item.bodyAr : item.bodyEn
        if (userName && isAr) {
          title = `سكينة وبُشرى • يا ${userName}`
          body = personalizeNotification(body, userName)
        }

        state.lastPeaceTime = Date.now()
        state.lastAnyNotificationTime = Date.now()
        lastGlobalNotificationTime = Date.now()
        await saveStoredState(state)

        await self.registration.showNotification(title, {
          body,
          icon: APP_ICON_URL,
          sound: '/audio/waqar-chime.wav',
          vibrate: [250, 100, 250],
          tag: 'sanad-peace',
          renotify: true,
          requireInteraction: false,
          data: { url: APP_ORIGIN + '/', type: 'peace' },
        })

        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        for (const client of clients) {
          client.postMessage({
            type: 'SANAD_NOTIFICATION_TRIGGERED',
            toast: {
              id: `peace-test-${Date.now()}`,
              title,
              body,
              type: 'peace',
              timestamp: Date.now(),
            },
          })
        }
      })()
    )
  } else if (data.type === 'KEEP_ALIVE') {
    event.waitUntil(
      (async () => {
        ensureBackgroundInterval()
        await checkAndDispatchBackgroundReminders('keep_alive')
      })()
    )
  } else if (data.type === 'SCHEDULE_TEST_NOTIFICATION') {
    const delayMs = data.delayMs || 5000
    const title = data.title || 'سند المُبرمج • اختبار الإشعار الخارجي'
    const body = data.body || 'تم استلام الإشعار بنجاح في شريط النظام والتطبيق مغلق تماماً!'
    const notificationType = data.notificationType || 'test'

    const testPromise = new Promise((resolve) => {
      setTimeout(async () => {
        try {
          await self.registration.showNotification(title, {
            body,
            icon: APP_ICON_URL,
            vibrate: [300, 150, 300, 150, 400],
            tag: 'sanad-test-notification',
            renotify: true,
            requireInteraction: false,
            data: { url: APP_ORIGIN + '/', type: notificationType },
          })

          const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
          for (const client of clients) {
            client.postMessage({
              type: 'SANAD_NOTIFICATION_TRIGGERED',
              toast: {
                id: `test-toast-${Date.now()}`,
                title,
                body,
                type: notificationType,
                timestamp: Date.now(),
              },
            })
          }
        } catch (err) {
          console.error('[Sanad SW] Error executing scheduled test notification:', err)
        }
        resolve()
      }, delayMs)
    })

    event.waitUntil(testPromise)
  } else if (data.type === 'TRIGGER_ISHRAQA_NOTIFICATION') {
    event.waitUntil(
      (async () => {
        const state = await getStoredState()
        const isAr = state.lang !== 'en'
        const item = data.item || getNextNonRepeatingItem('ishraqa', SANAD_ISHRAQA_LIST, state)
        if (!item) return

        state.lastAnyNotificationTime = Date.now()
        lastGlobalNotificationTime = Date.now()
        await saveStoredState(state)

        const userName = (state.userProfile?.name || '').trim()
        let title = isAr
          ? (item.titleAr.startsWith('إشراقة') ? item.titleAr : `إشراقة سَنَد • ${item.titleAr}`)
          : (item.titleEn.startsWith('Sanad') ? item.titleEn : `Sanad Ishraqa • ${item.titleEn}`)
        let body = isAr
          ? `${item.bodyAr}${item.referenceAr ? ' — ' + item.referenceAr : ''}`
          : `${item.bodyEn}${item.referenceEn ? ' — ' + item.referenceEn : ''}`

        if (userName && isAr) {
          title = `إشراقة سَنَد • يا ${userName}`
          body = personalizeNotification(body, userName)
        }

        await self.registration.showNotification(title, {
          body,
          icon: APP_ICON_URL,
          vibrate: [250, 100, 250, 100, 250],
          tag: 'sanad-ishraqa',
          renotify: false,
          requireInteraction: false,
          data: { url: APP_ORIGIN + '/', type: 'tip' },
        })

        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        for (const client of clients) {
          client.postMessage({
            type: 'SANAD_NOTIFICATION_TRIGGERED',
            toast: {
              id: `ishraqa-${Date.now()}`,
              title,
              body,
              type: 'tip',
              timestamp: Date.now(),
            },
          })
        }
      })()
    )
  } else if (data.type === 'DISPATCH_IMMEDIATE_NOTIFICATION') {
    const title = data.title || 'سند المُبرمج'
    const body = data.body || ''
    const notificationType = data.notificationType || 'system'
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: APP_ICON_URL,
        vibrate: [200, 100, 200],
        tag: 'sanad-system',
        renotify: false,
        data: { url: APP_ORIGIN + '/', type: notificationType },
      })
    )
  }
})
