/*
 * Royal Enfield Israel – site settings and model list.
 * This is the only file that needs editing to update models, trims, prices, colors and images.
 * Full editing guide: README.md.
 *
 * Model fields:
 *   id       – short English id, used in the page address (e.g. #meteor-350). Do not change once published.
 *   name     – model name in English, as shown on the page.
 *   phrases  – exactly three short marketing phrases (shown in the bar under the bike).
 *   video    – optional link to a video (YouTube etc.). Empty = the "לצפייה בסרטון" link is hidden.
 *   thumb    – optional small image for the side list. Empty = the first color image is used.
 *   trims    – one or more trims. A model with a single trim shows no trim selector.
 *     name   – trim name as it appears in the price list. Empty ('') = the standard version.
 *     price  – price in ₪, before licensing costs (number, no commas).
 *     colors – colors available for this trim. Empty list = the color selector is hidden.
 *       name   – color name in Hebrew (as shown to the customer and sent in WhatsApp).
 *       swatch – one or two hex colors for the color circle, e.g. ['#8a1c1c'] or ['#c0c0c0', '#2b2b2b'].
 *       image  – studio image for this exact trim + color, e.g. 'assets/images/models/meteor-350/stellar-red.webp'.
 *
 * Colors and images are intentionally empty: they must come from the importer's official data
 * (https://motosport.co.il/brand/royal-enfield) and were not invented.
 */

window.RE_CONFIG = {
  // WhatsApp number that receives every lead, international format without "+".
  whatsappNumber: '972524502150',
  // Phone shown in the form ("לתיאום רכיבת מבחן התקשרו ...").
  testRidePhone: '073-2799258',
  // Links shown in the form consent text and in the footer. Empty = shown as plain text.
  termsUrl: '',
  accessibilityUrl: '',
  importerUrl: 'https://motosport.co.il/brand/royal-enfield',
  importerLabel: 'www.motosport.co.il',
  // Air-pollution grade shown in the footer. A model can override it with its own `pollutionGrade`.
  pollutionGrade: 2,
  // Google Tag Manager container ID (e.g. 'GTM-XXXXXXX'). Empty = GTM is not loaded.
  gtmId: ''
};

window.RE_MODELS = [
  {
    id: 'hunter-350',
    name: 'Hunter 350',
    phrases: ['קומפקטי וקל לתמרון', 'סטייל אורבני עם אופי רויאל אנפילד', 'מושלם לקצב של העיר'],
    video: '',
    thumb: '',
    trims: [
      { name: '', price: 28338, colors: [] }
    ]
  },
  {
    id: 'classic-350',
    name: 'Classic 350',
    phrases: ['עיצוב קלאסי שלא יוצא מהאופנה', 'תנוחת רכיבה נינוחה', 'האופי של רויאל אנפילד בכל פרט'],
    video: '',
    thumb: '',
    trims: [
      { name: '', price: 31338, colors: [] }
    ]
  },
  {
    id: 'classic-350-goan',
    name: 'Classic 350 Goan',
    phrases: ['סגנון בובר עם נוכחות ייחודית', 'מראה צבעוני ונועז', 'קלאסיקה עם טוויסט חופשי'],
    video: '',
    thumb: '',
    trims: [
      { name: 'Rave Red', price: 32338, colors: [] }
    ]
  },
  {
    id: 'meteor-350',
    name: 'Meteor 350',
    phrases: ['קרוזר נינוח לרכיבות ארוכות', 'תנוחת ישיבה נוחה ורגועה', 'עיצוב קלאסי עם נוכחות'],
    video: '',
    thumb: '',
    trims: [
      { name: 'Fireball', price: 27338, colors: [] },
      { name: 'Stellar', price: 28338, colors: [] },
      { name: 'Aurora', price: 29338, colors: [] },
      { name: 'Supernova', price: 29338, colors: [] }
    ]
  },
  {
    id: 'guerrilla-450',
    name: 'Guerrilla 450',
    phrases: ['רודסטר עם אופי שובב', 'זריזות שמרגישים בכל פנייה', 'מראה מינימליסטי ובולט'],
    video: '',
    thumb: '',
    trims: [
      { name: '', price: 35338, colors: [] }
    ]
  },
  {
    id: 'himalayan-450',
    name: 'Himalayan 450',
    phrases: ['נבנה להרפתקאות מעבר לאספלט', 'תנוחת רכיבה זקופה ושליטה נוחה', 'מוכן לכביש ולשבילים'],
    video: '',
    thumb: '',
    trims: [
      { name: '', price: 37338, colors: [] },
      { name: 'Mana Black Rally', price: 40338, colors: [] }
    ]
  },
  {
    id: 'continental-gt-650',
    name: 'Continental GT 650',
    phrases: ['השראה מעולם הקפה רייסר', 'תנוחת רכיבה ספורטיבית', 'עיצוב רטרו עם אופי חד'],
    video: '',
    thumb: '',
    trims: [
      { name: '', price: 46338, colors: [] }
    ]
  },
  {
    id: 'super-meteor-650',
    name: 'Super Meteor 650',
    phrases: ['קרוזר שמזמין לצאת לדרך', 'מנוע טווין 650 עם אופי חלק', 'נוחות וסטייל למרחקים'],
    video: '',
    thumb: '',
    trims: [
      { name: 'Astral', price: 46338, colors: [] },
      { name: 'Interstellar', price: 47338, colors: [] },
      { name: 'Celestial', price: 48338, colors: [] }
    ]
  },
  {
    id: 'bullet-650',
    name: 'Bullet 650',
    phrases: ['המורשת של Bullet ממשיכה', 'עיצוב מסורתי עם מנוע טווין 650', 'נוכחות קלאסית בכל רכיבה'],
    video: '',
    thumb: '',
    trims: [
      { name: '', price: 48338, colors: [] }
    ]
  },
  {
    id: 'shotgun-650',
    name: 'Shotgun 650',
    phrases: ['עיצוב נועז שלא מתנצל', 'אופי אישי עם אינסוף סטייל', 'קרוזר עם גישה אחרת'],
    video: '',
    thumb: '',
    trims: [
      { name: '', price: 48338, colors: [] }
    ]
  },
  {
    id: 'classic-650',
    name: 'Classic 650',
    phrases: ['הקלאסיקה האהובה בגרסת 650', 'קווים על־זמניים ונוכחות מרשימה', 'מנוע טווין עם אופי רגוע'],
    video: '',
    thumb: '',
    trims: [
      { name: '', price: 48338, colors: [] }
    ]
  },
  {
    id: 'bear-650',
    name: 'Bear 650',
    phrases: ['השראה מאופנועי סקרמבלר', 'מראה קשוח ומלא אופי', 'רוח חופשית על שני גלגלים'],
    video: '',
    thumb: '',
    trims: [
      { name: '', price: 49338, colors: [] }
    ]
  }
];
