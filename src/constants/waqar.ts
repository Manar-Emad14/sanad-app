export interface WaqarMessage {
  id: string
  titleAr: string
  titleEn: string
  bodyAr: string
  bodyEn: string
  themeTagAr: string
  themeTagEn: string
  targetGender?: 'female' | 'male' | 'both'
}

export const WAQAR_FEMALE_MESSAGES: WaqarMessage[] = [
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

export const WAQAR_MALE_MESSAGES: WaqarMessage[] = [
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

export function getWaqarMessages(gender: 'female' | 'male' = 'female'): WaqarMessage[] {
  return gender === 'male' ? WAQAR_MALE_MESSAGES : WAQAR_FEMALE_MESSAGES
}

// Default export for backward compatibility
export const WAQAR_MESSAGES: WaqarMessage[] = WAQAR_FEMALE_MESSAGES
