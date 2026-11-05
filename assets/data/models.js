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
 *   comingSoon – optional: true shows a "בקרוב" badge (model not in Israel yet). Also allowed on a trim or a color.
 *   trims    – one or more trims. A model with a single trim shows no trim selector.
 *     name   – trim name as it appears in the price list. Empty ('') = the standard version.
 *     price  – price in ₪, before licensing costs (number, no commas).
 *     image  – optional studio image for a trim that has no color list.
 *     colors – colors available for this trim. Empty list = the color selector is hidden.
 *       name   – color name in Hebrew (as shown to the customer and sent in WhatsApp).
 *       swatch – one or two hex colors for the color circle, e.g. ['#8a1c1c'] or ['#c0c0c0', '#2b2b2b'].
 *       image  – studio image for this exact trim + color, e.g. 'assets/images/models/meteor-350/stellar-red.webp'.
 *       price  – optional: price in ₪ for this color only, when it differs from the trim price.
 *
 * Colors and images are intentionally empty: they must come from the importer's official data
 * (https://motosport.co.il/brand/royal-enfield) and were not invented.
 */

window.RE_CONFIG = {
  // WhatsApp number that receives every lead, international format without "+".
  whatsappNumber: '972524502150',
  // Phone shown in the form ("לתיאום רכיבת מבחן התקשרו ...").
  testRidePhone: '073-2799258',
  importerUrl: 'https://motosport.co.il/brand/royal-enfield',
  importerLabel: 'www.motosport.co.il',
  // Google Tag Manager container ID (e.g. 'GTM-XXXXXXX'). Loaded only after the visitor accepts
  // the cookie banner. Empty = GTM is never loaded.
  gtmId: ''
};

window.RE_MODELS = [
  {
    id: 'hunter-350',
    name: 'Hunter 350',
    phrases: ['קומפקטי וקל לתמרון', 'סטייל אורבני עם אופי רויאל אנפילד', 'מושלם לקצב של העיר'],
    video: '',
    thumb: 'assets/images/models/hunter-350/rio-white/HUNTER%20350%20RioWhite.thumb.webp',
    trims: [
      { name: '', price: 28347, colors: [
        { name: 'Rio White', swatch: ['#efeeeb', '#0db74f'], image: 'assets/images/models/hunter-350/rio-white/HUNTER%20350%20RioWhite.webp' },
        { name: 'Graphite Grey', swatch: ['#17181a', '#a7b33e'], image: 'assets/images/models/hunter-350/graphite-grey/HUNTER%20350%20Graphite%20Grey.webp' },
        { name: 'London Red', swatch: ['#921112', '#121214'], image: 'assets/images/models/hunter-350/london-red/HUNTER%20350%20LondonRed.webp' }
      ] }
    ]
  },
  {
    id: 'classic-350',
    name: 'Classic 350',
    phrases: ['עיצוב קלאסי שלא יוצא מהאופנה', 'תנוחת רכיבה נינוחה', 'האופי של רויאל אנפילד בכל פרט'],
    video: '',
    thumb: 'assets/images/models/classic-350/emerald/classic%20350%20emerald.thumb.webp',
    trims: [
      { name: '', price: 31347, colors: [
        { name: 'Emerald', swatch: ['#193134', '#111718'], image: 'assets/images/models/classic-350/emerald/classic%20350%20emerald.webp' },
        { name: 'Jodhpur Blue', swatch: ['#015882'], image: 'assets/images/models/classic-350/jodhpur-blue/CALSSIC%20350%20jodhpur-blue.webp' },
        { name: 'Stealth Black', swatch: ['#1b1b1b'], image: 'assets/images/models/classic-350/stealth-black/CLASSIC%20350%20Stealth%20Black.webp' },
        { name: 'Medallion Bronze', swatch: ['#583a29', '#eeebe5'], image: 'assets/images/models/classic-350/medallion-bronze/CLASSIC%20350%20medallion-bronze.webp' }
      ] }
    ]
  },
  {
    id: 'classic-350-goan',
    name: 'Classic 350 Goan',
    phrases: ['סגנון בובר עם נוכחות ייחודית', 'מראה צבעוני ונועז', 'קלאסיקה עם טוויסט חופשי'],
    video: '',
    // Purple Haze is on its way to Israel: shown with a "בקרוב" badge.
    comingSoon: true,
    thumb: 'assets/images/models/classic-350-goan/purple-haze/CLASSIC%20350%20PurpleHaze.thumb.webp',
    trims: [
      { name: 'Purple Haze', price: 32347, image: 'assets/images/models/classic-350-goan/purple-haze/CLASSIC%20350%20PurpleHaze.webp', colors: [] }
    ]
  },
  {
    id: 'meteor-350',
    name: 'Meteor 350',
    phrases: ['קרוזר נינוח לרכיבות ארוכות', 'תנוחת ישיבה נוחה ורגועה', 'עיצוב קלאסי עם נוכחות'],
    video: '',
    thumb: 'assets/images/models/meteor-350/fireball-red/Meteor%20350%20fireball-red.thumb.webp',
    trims: [
      { name: 'Fireball', price: 27347, colors: [
        { name: 'Fireball Red', swatch: ['#a21e1e'], image: 'assets/images/models/meteor-350/fireball-red/Meteor%20350%20fireball-red.webp' },
        { name: 'Fireball Orange', swatch: ['#db9029'], image: 'assets/images/models/meteor-350/fireball-orange/Meteor%20350%20fireball-orange.webp' }
      ] },
      { name: 'Stellar', price: 28347, colors: [
        { name: 'Stellar Black', swatch: ['#1d1c1c'], image: 'assets/images/models/meteor-350/stellar-black/Meteor%20350%20stellar-black.webp' },
        { name: 'Stellar Grey', swatch: ['#8c8c8a'], image: 'assets/images/models/meteor-350/stellar-grey/Meteor%20350%20stellar-grey.webp' }
      ] },
      { name: 'Aurora', price: 29347, colors: [
        { name: 'Aurora Green', swatch: ['#2e5e6f', '#dddbd9'], image: 'assets/images/models/meteor-350/aurora-green/meteor%20350%20aurora-green.webp' }
      ] },
      { name: 'Supernova', price: 29347, colors: [
        { name: 'Supernova Black', swatch: ['#131315'], image: 'assets/images/models/meteor-350/supernova-black/Meteor%20350%20supernova-black.webp' }
      ] }
    ]
  },
  {
    id: 'bullet-350',
    name: 'Bullet 350',
    phrases: ['עיצוב קלאסי שלא יוצא מהאופנה', 'מנוע 350 סמ״ק עם אופי ונוכחות ייחודית', 'חוויית רכיבה אותנטית בכל יציאה לכביש'],
    video: '',
    thumb: 'assets/images/models/bullet-350/black-gold/BULLET%20350%20BLACK%20GOLD.thumb.webp',
    trims: [
      { name: '', price: 31347, colors: [
        { name: 'Black Gold', swatch: ['#0b0e10', '#ea9d3b'], image: 'assets/images/models/bullet-350/black-gold/BULLET%20350%20BLACK%20GOLD.webp' }
      ] }
    ]
  },
  {
    id: 'guerrilla-450',
    name: 'Guerrilla 450',
    phrases: ['רודסטר עם אופי שובב', 'זריזות שמרגישים בכל פנייה', 'מראה מינימליסטי ובולט'],
    video: '',
    thumb: 'assets/images/models/guerrilla-450/apex-red-black/GUERRILLA%20450%20APEX%20RED%20.thumb.webp',
    trims: [
      { name: '', price: 35347, colors: [
        { name: 'Apex Red', swatch: ['#be0b0e', '#111214'], image: 'assets/images/models/guerrilla-450/apex-red-black/GUERRILLA%20450%20APEX%20RED%20.webp' },
        { name: 'Shadow Ash', swatch: ['#555857'], image: 'assets/images/models/guerrilla-450/shadow-ash/GUERRILLA%20450%20Shadow%20Ash.webp' },
        { name: 'Twilight Blue', swatch: ['#1e3b61', '#0f1219'], image: 'assets/images/models/guerrilla-450/twilight-blue/GUERRILLA%20450%20Twilight%20Blue.webp' },
        { name: 'Smoke Silver', swatch: ['#abadaf'], image: 'assets/images/models/guerrilla-450/smoke-silver/GUERRILLA%20450%20Smoke%20SILVER.webp' }
      ] }
    ]
  },
  {
    id: 'himalayan-450',
    name: 'Himalayan 450',
    phrases: ['נבנה להרפתקאות מעבר לאספלט', 'תנוחת רכיבה זקופה ושליטה נוחה', 'מוכן לכביש ולשבילים'],
    video: '',
    thumb: 'assets/images/models/himalayan-450/kamet-white/Himalayan%20450%20Kamet%20white.thumb.webp',
    trims: [
      { name: '', price: 37347, colors: [
        { name: 'Kamet White', price: 39347, swatch: ['#dddfdf', '#767a7b'], image: 'assets/images/models/himalayan-450/kamet-white/Himalayan%20450%20Kamet%20white.webp' },
        { name: 'Hanle Black', price: 39347, swatch: ['#131414', '#805026'], image: 'assets/images/models/himalayan-450/hanle-black/Himalayan%20450%20hanle-black.webp' },
        { name: 'Kaza Brown', swatch: ['#cdc9c0'], image: 'assets/images/models/himalayan-450/kaza-brown/Himalayan%20450%20Kaza%20brown.webp' }
      ] },
      { name: 'Mana Black', price: 40347, colors: [
        { name: 'Mana Black', swatch: ['#191a1c', '#656a70'], image: 'assets/images/models/himalayan-450/mana-black/Himalayan%20450%20mana-black.webp' }
      ] }
    ]
  },
  {
    id: 'super-meteor-650',
    name: 'Super Meteor 650',
    phrases: ['קרוזר שמזמין לצאת לדרך', 'מנוע טווין 650 עם אופי חלק', 'נוחות וסטייל למרחקים'],
    video: '',
    thumb: 'assets/images/models/super-meteor-650/astral-black/SUPER%20METEOR%20650%20astral-black.thumb.webp',
    trims: [
      { name: 'Astral', price: 46347, colors: [
        { name: 'Astral Black', swatch: ['#1b1d1f'], image: 'assets/images/models/super-meteor-650/astral-black/SUPER%20METEOR%20650%20astral-black.webp' }
      ] },
      { name: 'Interstellar', price: 47347, colors: [
        { name: 'Interstellar Green', swatch: ['#252c21', '#1b1d1e'], image: 'assets/images/models/super-meteor-650/interstellar-green/SUPER%20METEOR%20650%20interstellar-green.webp' }
      ] },
      { name: 'Celestial', price: 48347, colors: [
        { name: 'Celestial Blue', swatch: ['#1f2a3b', '#dadfe0'], image: 'assets/images/models/super-meteor-650/celestial-blue/SUPER%20METEOR%20650%20celestial-blue.webp' }
      ] }
    ]
  },
  {
    id: 'bullet-650',
    name: 'Bullet 650',
    phrases: ['המורשת של Bullet ממשיכה', 'עיצוב מסורתי עם מנוע טווין 650', 'נוכחות קלאסית בכל רכיבה'],
    video: '',
    thumb: 'assets/images/models/bullet-650/cannon-black/BULLET%20650%20CANNON%20BLACK.thumb.webp',
    trims: [
      { name: '', price: 48347, colors: [
        { name: 'Cannon Black', swatch: ['#111214', '#967d4f'], image: 'assets/images/models/bullet-650/cannon-black/BULLET%20650%20CANNON%20BLACK.webp' }
      ] }
    ]
  },
  {
    id: 'classic-650',
    name: 'Classic 650',
    phrases: ['הקלאסיקה האהובה בגרסת 650', 'קווים על־זמניים ונוכחות מרשימה', 'מנוע טווין עם אופי רגוע'],
    video: '',
    thumb: 'assets/images/models/classic-650/black-chrome/CLASSIC%20650%20Black%20Chrome.thumb.webp',
    trims: [
      { name: '', price: 48347, colors: [
        { name: 'Black Chrome', swatch: ['#0d0e10', '#d0d5d8'], image: 'assets/images/models/classic-650/black-chrome/CLASSIC%20650%20Black%20Chrome.webp' },
        { name: 'Vallam Red', swatch: ['#6e1f31', '#e3e5e9'], image: 'assets/images/models/classic-650/vallam-red/CLASSIC%20650%20Vallam%20Red.webp' },
        { name: 'Bruntingthorpe Blue', swatch: ['#3c548a', '#e8f0f8'], image: 'assets/images/models/classic-650/bruntingthorpe-blue/CLASSIC%20650%20Bruntingthorpe%20Blue.webp' }
      ] }
    ]
  },
  {
    id: 'bear-650',
    name: 'Bear 650',
    phrases: ['השראה מאופנועי סקרמבלר', 'מראה קשוח ומלא אופי', 'רוח חופשית על שני גלגלים'],
    video: '',
    thumb: 'assets/images/models/bear-650/wild-honey/BEAR%20650%20WildHoney.thumb.webp',
    trims: [
      { name: '', price: 49347, colors: [
        // swatch colors sampled from each photo (tank + accent)
        { name: 'Wild Honey', swatch: ['#c7aa00', '#001235'], image: 'assets/images/models/bear-650/wild-honey/BEAR%20650%20WildHoney.webp' },
        { name: 'Two Four Nine', swatch: ['#b5aea4', '#103e36'], image: 'assets/images/models/bear-650/two-four-nine/BEAR%20650%20Two%20four%20Nine.webp' },
        { name: 'Boardwalk White', swatch: ['#cacfd2', '#d65c2f'], image: 'assets/images/models/bear-650/boardwalk-white/BEAR%20650%20Boardwalk%20White.webp' },
        { name: 'Golden Shadow', swatch: ['#020202', '#b29108'], image: 'assets/images/models/bear-650/golden-shadow/BEAR%20650%20GOLDEN%20SHADOW.webp' }
      ] }
    ]
  }
];
