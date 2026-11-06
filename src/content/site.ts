// All visible copy lives here (Hebrew-only at launch; this dictionary makes a future /en page a translation job, not a rewrite).
// Facts here are verified or approved by Liem on 2026-11-06 — see research/decisions.md. Do not add claims without approval.

export const contact = {
  email: 'liem@feller.co.il',
  phoneDisplay: '052-9569659',
  phoneHref: 'tel:+972529569659',
  whatsappHref:
    'https://wa.me/972529569659?text=' +
    encodeURIComponent('היי ליאם, הגעתי מהאתר ואשמח לשמוע פרטים'),
  instagram: { label: 'Instagram', href: 'https://www.instagram.com/liem_feller/' },
  // LinkedIn profile URL not verified yet — add { label, href } here once confirmed.
  linkedin: null as null | { label: string; href: string },
};

export const nav = [
  { id: 'work', label: 'עבודות' },
  { id: 'services', label: 'שירותים' },
  { id: 'about', label: 'אודות' },
  { id: 'process', label: 'תהליך' },
] as const;

export const hero = {
  lineLight: 'עיצוב, פיתוח ושיווק.',
  title: 'אתרים שמבינים את העסק',
  sub: 'אני ליאם. אני מעצב ובונה אתרים לעסקים, ומחבר אליהם שיווק, אוטומציות וכלי AI, כדי שהנוכחות הדיגיטלית תעבוד בשבילכם.',
  primary: 'בואו נדבר',
  secondary: 'לעבודות',
  meta: 'Web design · Development · Marketing · AI',
};

export type Shot = { base: string; kind: 'desktop' | 'mobile'; alt: string };
export type Project = {
  id: string;
  name: string;
  status: string;
  desc: string;
  url: string;
  urlLabel: string;
  cta: string;
  shots: [Shot, Shot, Shot];
};

export const work = {
  title: 'ככה זה נראה כשמבינים את העסק קודם.',
  projects: [
    {
      id: 'kw5',
      name: 'KW5',
      status: 'פרויקט לקוח · מיתוג, עיצוב ובניית האתר',
      desc: 'אתר הבית של KW5, קהילת NBA 2K תחרותית: הרשמה, משחקים, טבלאות וסטטיסטיקות שחקנים במקום אחד.',
      url: 'https://kw5.eu',
      urlLabel: 'kw5.eu',
      cta: 'לאתר החי',
      shots: [
        { base: 'kw5-desktop-0', kind: 'desktop', alt: 'דף הבית של KW5 עם קריאה להרשמה לקהילה' },
        { base: 'kw5-desktop-2', kind: 'desktop', alt: 'לוח הליגות והאירועים באתר KW5' },
        { base: 'kw5-mobile-0', kind: 'mobile', alt: 'אתר KW5 בנייד' },
      ],
    },
    {
      id: 'gali',
      name: 'Gali',
      status: 'פרויקט קונספט · עיצוב מחדש לא רשמי',
      desc: 'קונספט לעיצוב מחדש של אתר רשת הנעליים גלי: דף בית, עמודי קטגוריה ומוצר עם מסננים, מידות ועגלה. זה לא האתר הרשמי של גלי, ואין לי קשר לחברה.',
      url: 'https://yellowsoul11.github.io/gali-redesign/',
      urlLabel: 'gali-redesign',
      cta: 'לצפייה בקונספט',
      shots: [
        { base: 'gali-desktop-0', kind: 'desktop', alt: 'דף הבית בקונספט העיצוב מחדש של גלי' },
        { base: 'gali-desktop-2', kind: 'desktop', alt: 'עמוד קטגוריית נשים בקונספט של גלי, עם מסננים' },
        { base: 'gali-mobile-3', kind: 'mobile', alt: 'עמוד מוצר בקונספט של גלי, בנייד' },
      ],
    },
    {
      id: 'noma',
      name: 'Noma Coffee',
      status: 'פרויקט קונספט · אתר מותג',
      desc: 'אתר תדמית וחנות לבית קלייה בוטיק, עם מנויי קפה חודשיים ומדריך חליטה אינטראקטיבי.',
      url: 'https://yellowsoul11.github.io/noma-coffee/',
      urlLabel: 'noma-coffee',
      cta: 'לצפייה בקונספט',
      shots: [
        { base: 'noma-coffee-desktop-0', kind: 'desktop', alt: 'דף הבית של Noma Coffee' },
        { base: 'noma-coffee-desktop-2', kind: 'desktop', alt: 'מסלולי מנוי הקפה של Noma Coffee' },
        { base: 'noma-coffee-mobile-1', kind: 'mobile', alt: 'Noma Coffee בנייד' },
      ],
    },
    {
      id: 'pulseband',
      name: 'PulseBand',
      status: 'פרויקט קונספט · דף מוצר',
      desc: 'דף מוצר לצמיד לביש שעוזר לזהות סטרס ולשפר ריכוז: סיפור מוצר בגלילה, מסלולים ושאלות נפוצות.',
      url: 'https://yellowsoul11.github.io/pulseband/',
      urlLabel: 'pulseband',
      cta: 'לצפייה בקונספט',
      shots: [
        { base: 'pulseband-desktop-0', kind: 'desktop', alt: 'דף המוצר של PulseBand' },
        { base: 'pulseband-desktop-2', kind: 'desktop', alt: 'סקשן הסבר המוצר של PulseBand' },
        { base: 'pulseband-mobile-0', kind: 'mobile', alt: 'PulseBand בנייד' },
      ],
    },
  ] satisfies Project[],
};

export const statement = {
  before: 'אתר יפה זה רק ההתחלה. מה שחשוב זה מה שקורה',
  accent: 'אחריו',
  after: ': מי מוצא אותו, מי פונה, ומה קורה עם הפנייה.',
};

export const services = {
  title: 'מה אני עושה',
  core: {
    name: 'עיצוב ובניית אתרים',
    desc: 'אתרי תדמית ודפי נחיתה בעיצוב אישי: מהירים, מותאמים לנייד ונוחים לניהול. כל אתר מתחיל בהבנה של העסק והקהל, ורק אחר כך עיצוב וקוד.',
    rapidName: 'חבילת אתר בזק',
    rapid: 'אתר פשוט במחיר נוח, עם התחייבות להשקה מהירה.',
  },
  extensionsTitle: 'ומה שמתחבר לאתר',
  extensions: [
    {
      name: 'שיווק ונראות',
      desc: 'קידום ממומן (PPC), SEO ונראות בכלי AI כמו ChatGPT ו-Perplexity (GEO), כדי שהלקוחות הנכונים ימצאו אתכם.',
    },
    {
      name: 'אוטומציות ו-AI',
      desc: 'חיבור הכלים והתהליכים של העסק: לידים, טפסים, מענה ראשוני וצ׳אטבוטים. פחות עבודה ידנית, פחות פניות שנופלות בין הכיסאות.',
    },
    { name: 'מיתוג', desc: 'שפה ויזואלית ומילולית שנותנת לעסק זהות ברורה ובידול מהמתחרים.' },
  ],
};

export const about = {
  big: 'נעים להכיר',
  title: 'היי, אני ליאם.',
  p1: 'אני עוזר לעסקים לבנות נוכחות דיגיטלית מדויקת ומבדלת, כזו שלא נגמרת באתר יפה אלא עובדת בשביל העסק.',
  p2: 'אני משלב עיצוב, פיתוח, שיווק, אוטומציות וכלי AI. אבל כל פרויקט מתחיל באותו מקום: היכרות עם העסק, המטרות והלקוחות שלו. רק אחר כך זה הופך לעיצוב, לאתר ולתהליך.',
  belief: 'בעידן של AI, הבידול מתחיל בהבנה אנושית.',
  cta: 'בואו נכיר',
  portraitAlt: 'ליאם פלר, מייסד Feller Marketing, בחליפה בהירה',
};

export const process = {
  title: 'איך זה עובד',
  steps: [
    { name: 'מבינים', desc: 'את העסק, הקהל, המטרות והבידול, לפני שמעצבים משהו.' },
    { name: 'מדייקים', desc: 'מסרים, מבנה וחוויית משתמש, כדי שהאתר ידבר נכון לקהל שלכם.' },
    { name: 'מעצבים', desc: 'שפה ויזואלית נקייה ואישית, עם דגש על חוויית משתמש.' },
    { name: 'בונים', desc: 'אתר מהיר, מותאם לנייד ונוח לניהול, עם תשתית לתוכן ולאוטומציות.' },
    { name: 'משפרים', desc: 'אחרי העלייה לאוויר אפשר להמשיך לדייק יחד, לפי נתונים ופידבק מהשטח.' },
  ],
};

export const cta = {
  lead: 'מוכנים להתקדם?',
  line: 'בואו נבין יחד מה העסק שלכם צריך',
  line2: 'בואו ניקח את העסק שלכם קדימה',
  primary: 'השאירו פרטים',
  whatsapp: 'WhatsApp',
};

export const drawer = {
  title: 'בואו נדבר',
  intro: 'ספרו לי קצת על העסק ועל מה שאתם צריכים, ואחזור אליכם.',
  name: 'שם',
  phone: 'טלפון',
  email: 'אימייל',
  message: 'ספרו לי על העסק',
  consent: 'אני מאשר/ת שמירת הפרטים לצורך חזרה אליי.',
  consentNote: 'הפרטים משמשים רק כדי לחזור אליכם.',
  submit: 'שליחה',
  sending: 'שולח…',
  close: 'סגירת הטופס',
  orDirect: 'או ישירות:',
  ok: 'קיבלתי. אחזור אליכם בהקדם.',
  okClose: 'סגירה',
  errors: {
    name: 'כתבו שם, כדי שאדע למי לחזור.',
    phone: 'כתבו מספר טלפון תקין (לפחות 9 ספרות).',
    email: 'כתובת האימייל לא תקינה. אפשר גם להשאיר ריק.',
    consent: 'צריך לאשר כדי שאוכל לחזור אליכם.',
  },
  notConnected:
    'הטופס עוד לא מחובר לשליחה, אז הפרטים לא נשלחו. אפשר לכתוב לי ישירות בוואטסאפ או במייל.',
  failed: 'השליחה לא הצליחה. נסו שוב, או כתבו לי ישירות בוואטסאפ או במייל.',
};

export const footer = {
  rights: 'Feller Marketing. כל הזכויות שמורות.',
  privacy: 'מדיניות פרטיות',
  accessibility: 'הצהרת נגישות',
};
