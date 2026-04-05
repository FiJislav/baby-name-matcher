// scripts/countries.js
// Master list of nationalities to scrape from behindthename.com
// btn: behindthename.com usage code
// code: 2-letter code used in our DB (country_code in name_popularity)
// label: display name
// flag: emoji flag
// locales: browser navigator.language prefixes that map to this nationality
// priority: 1=show first, 2=common, 3=rest (sorted alphabetically within group)

const COUNTRIES = [
  // ── ALREADY SCRAPED ──────────────────────────────────────────────────
  { btn: 'cze', code: 'CZ', label: 'Czech',       flag: '🇨🇿', locales: ['cs'],           priority: 1 },
  { btn: 'dut', code: 'NL', label: 'Dutch',        flag: '🇳🇱', locales: ['nl'],           priority: 1 },
  { btn: 'slk', code: 'SK', label: 'Slovak',       flag: '🇸🇰', locales: ['sk'],           priority: 1 },
  { btn: 'eng', code: 'GB', label: 'English',      flag: '🇬🇧', locales: ['en-GB'],        priority: 1 },
  { btn: 'ger', code: 'DE', label: 'German',       flag: '🇩🇪', locales: ['de'],           priority: 1 },
  { btn: 'usa', code: 'US', label: 'American',     flag: '🇺🇸', locales: ['en-US','en'],   priority: 1 },

  // ── EUROPEAN ─────────────────────────────────────────────────────────
  { btn: 'alb', code: 'AL', label: 'Albanian',     flag: '🇦🇱', locales: ['sq'],           priority: 2 },
  { btn: 'arm', code: 'AM', label: 'Armenian',     flag: '🇦🇲', locales: ['hy'],           priority: 3 },
  { btn: 'bel', code: 'BY', label: 'Belarusian',   flag: '🇧🇾', locales: ['be'],           priority: 3 },
  { btn: 'bos', code: 'BA', label: 'Bosnian',      flag: '🇧🇦', locales: ['bs'],           priority: 3 },
  { btn: 'bre', code: 'BR', label: 'Breton',       flag: '🏴󠁦󠁲󠁢󠁲󠁥󠁿', locales: [],             priority: 3 },
  { btn: 'bul', code: 'BG', label: 'Bulgarian',    flag: '🇧🇬', locales: ['bg'],           priority: 2 },
  { btn: 'cat', code: 'CAT',label: 'Catalan',      flag: '🏴󠁥󠁳󠁣󠁴󠁿', locales: ['ca'],          priority: 3 },
  { btn: 'cro', code: 'HR', label: 'Croatian',     flag: '🇭🇷', locales: ['hr'],           priority: 2 },
  { btn: 'dan', code: 'DK', label: 'Danish',       flag: '🇩🇰', locales: ['da'],           priority: 2 },
  { btn: 'est', code: 'EE', label: 'Estonian',     flag: '🇪🇪', locales: ['et'],           priority: 3 },
  { btn: 'fre', code: 'FR', label: 'French',       flag: '🇫🇷', locales: ['fr'],           priority: 1 },
  { btn: 'geo', code: 'GE', label: 'Georgian',     flag: '🇬🇪', locales: ['ka'],           priority: 3 },
  { btn: 'gre', code: 'GR', label: 'Greek',        flag: '🇬🇷', locales: ['el'],           priority: 2 },
  { btn: 'hun', code: 'HU', label: 'Hungarian',    flag: '🇭🇺', locales: ['hu'],           priority: 2 },
  { btn: 'ice', code: 'IS', label: 'Icelandic',    flag: '🇮🇸', locales: ['is'],           priority: 3 },
  { btn: 'iri', code: 'IE', label: 'Irish',        flag: '🇮🇪', locales: ['ga'],           priority: 3 },
  { btn: 'ita', code: 'IT', label: 'Italian',      flag: '🇮🇹', locales: ['it'],           priority: 1 },
  { btn: 'lat', code: 'LV', label: 'Latvian',      flag: '🇱🇻', locales: ['lv'],           priority: 3 },
  { btn: 'lth', code: 'LT', label: 'Lithuanian',   flag: '🇱🇹', locales: ['lt'],           priority: 3 },
  { btn: 'mac', code: 'MK', label: 'Macedonian',   flag: '🇲🇰', locales: ['mk'],           priority: 3 },
  { btn: 'mal', code: 'MT', label: 'Maltese',      flag: '🇲🇹', locales: ['mt'],           priority: 3 },
  { btn: 'nor', code: 'NO', label: 'Norwegian',    flag: '🇳🇴', locales: ['no','nb','nn'], priority: 2 },
  { btn: 'pol', code: 'PL', label: 'Polish',       flag: '🇵🇱', locales: ['pl'],           priority: 2 },
  { btn: 'por', code: 'PT', label: 'Portuguese',   flag: '🇵🇹', locales: ['pt'],           priority: 2 },
  { btn: 'rmn', code: 'RO', label: 'Romanian',     flag: '🇷🇴', locales: ['ro'],           priority: 2 },
  { btn: 'rus', code: 'RU', label: 'Russian',      flag: '🇷🇺', locales: ['ru'],           priority: 2 },
  { btn: 'sco', code: 'SCO',label: 'Scottish',     flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', locales: [],             priority: 3 },
  { btn: 'ser', code: 'RS', label: 'Serbian',      flag: '🇷🇸', locales: ['sr'],           priority: 2 },
  { btn: 'sln', code: 'SI', label: 'Slovene',      flag: '🇸🇮', locales: ['sl'],           priority: 3 },
  { btn: 'spa', code: 'ES', label: 'Spanish',      flag: '🇪🇸', locales: ['es'],           priority: 1 },
  { btn: 'swe', code: 'SE', label: 'Swedish',      flag: '🇸🇪', locales: ['sv'],           priority: 2 },
  { btn: 'ukr', code: 'UA', label: 'Ukrainian',    flag: '🇺🇦', locales: ['uk'],           priority: 2 },
  { btn: 'wel', code: 'WL', label: 'Welsh',        flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', locales: ['cy'],           priority: 3 },

  // ── MIDDLE EAST / CENTRAL ASIA ────────────────────────────────────────
  { btn: 'ara', code: 'SA', label: 'Arabic',       flag: '🇸🇦', locales: ['ar'],           priority: 2 },
  { btn: 'aze', code: 'AZ', label: 'Azerbaijani',  flag: '🇦🇿', locales: ['az'],           priority: 3 },
  { btn: 'heb', code: 'IL', label: 'Hebrew',       flag: '🇮🇱', locales: ['he'],           priority: 2 },
  { btn: 'kaz', code: 'KZ', label: 'Kazakh',       flag: '🇰🇿', locales: ['kk'],           priority: 3 },
  { btn: 'kyr', code: 'KG', label: 'Kyrgyz',       flag: '🇰🇬', locales: ['ky'],           priority: 3 },
  { btn: 'per', code: 'IR', label: 'Persian',      flag: '🇮🇷', locales: ['fa'],           priority: 2 },
  { btn: 'taj', code: 'TJ', label: 'Tajik',        flag: '🇹🇯', locales: ['tg'],           priority: 3 },
  { btn: 'tkm', code: 'TM', label: 'Turkmen',      flag: '🇹🇲', locales: ['tk'],           priority: 3 },
  { btn: 'tur', code: 'TR', label: 'Turkish',      flag: '🇹🇷', locales: ['tr'],           priority: 2 },
  { btn: 'urd', code: 'PK', label: 'Urdu',         flag: '🇵🇰', locales: ['ur'],           priority: 3 },
  { btn: 'uzb', code: 'UZ', label: 'Uzbek',        flag: '🇺🇿', locales: ['uz'],           priority: 3 },

  // ── SOUTH / EAST ASIA ─────────────────────────────────────────────────
  { btn: 'ben', code: 'BD', label: 'Bengali',      flag: '🇧🇩', locales: ['bn'],           priority: 3 },
  { btn: 'chi', code: 'CN', label: 'Chinese',      flag: '🇨🇳', locales: ['zh'],           priority: 2 },
  { btn: 'hin', code: 'IN', label: 'Hindi',        flag: '🇮🇳', locales: ['hi'],           priority: 2 },
  { btn: 'ins', code: 'ID', label: 'Indonesian',   flag: '🇮🇩', locales: ['id'],           priority: 3 },
  { btn: 'jap', code: 'JP', label: 'Japanese',     flag: '🇯🇵', locales: ['ja'],           priority: 2 },
  { btn: 'khm', code: 'KH', label: 'Khmer',        flag: '🇰🇭', locales: ['km'],           priority: 3 },
  { btn: 'kor', code: 'KR', label: 'Korean',       flag: '🇰🇷', locales: ['ko'],           priority: 2 },
  { btn: 'mly', code: 'MY', label: 'Malay',        flag: '🇲🇾', locales: ['ms'],           priority: 3 },
  { btn: 'mon', code: 'MN', label: 'Mongolian',    flag: '🇲🇳', locales: ['mn'],           priority: 3 },
  { btn: 'nep', code: 'NP', label: 'Nepali',       flag: '🇳🇵', locales: ['ne'],           priority: 3 },
  { btn: 'sin', code: 'LK', label: 'Sinhalese',    flag: '🇱🇰', locales: ['si'],           priority: 3 },
  { btn: 'tag', code: 'PH', label: 'Filipino',     flag: '🇵🇭', locales: ['tl','fil'],     priority: 3 },
  { btn: 'tha', code: 'TH', label: 'Thai',         flag: '🇹🇭', locales: ['th'],           priority: 3 },
  { btn: 'vie', code: 'VN', label: 'Vietnamese',   flag: '🇻🇳', locales: ['vi'],           priority: 3 },

  // ── AFRICA ────────────────────────────────────────────────────────────
  { btn: 'afk', code: 'ZA', label: 'Afrikaans',    flag: '🇿🇦', locales: ['af'],           priority: 3 },
  { btn: 'amh', code: 'ET', label: 'Amharic',      flag: '🇪🇹', locales: ['am'],           priority: 3 },
  { btn: 'hau', code: 'HA', label: 'Hausa',        flag: '🇳🇬', locales: ['ha'],           priority: 3 },
  { btn: 'som', code: 'SO', label: 'Somali',       flag: '🇸🇴', locales: ['so'],           priority: 3 },
  { btn: 'swa', code: 'KE', label: 'Swahili',      flag: '🇰🇪', locales: ['sw'],           priority: 3 },
  { btn: 'yor', code: 'YO', label: 'Yoruba',       flag: '🇳🇬', locales: ['yo'],           priority: 3 },
  { btn: 'zul', code: 'ZU', label: 'Zulu',         flag: '🇿🇦', locales: ['zu'],           priority: 3 },

  // ── AMERICAS / PACIFIC ────────────────────────────────────────────────
  { btn: 'haw', code: 'HW', label: 'Hawaiian',     flag: '🌺',  locales: [],               priority: 3 },
  { btn: 'mao', code: 'NZ', label: 'Māori',        flag: '🇳🇿', locales: ['mi'],           priority: 3 },
]

module.exports = COUNTRIES
