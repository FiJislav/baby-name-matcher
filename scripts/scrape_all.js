// scripts/scrape_all.js
// Scrapes all nationalities in lib/countries.ts and generates one combined migration.
// Usage: node scripts/scrape_all.js [migration_number]

const https = require('https')
const fs = require('fs')

const MIG_NUM  = process.argv[2] || '011'
const OUT_FILE = `supabase/migrations/${MIG_NUM}_all_languages_scraped.sql`

// Already-scraped country codes — skip to avoid duplicate data
const ALREADY_DONE = new Set(['CZ', 'NL', 'SK'])

// Full language list (btn = behindthename slug, code = our DB code)
const LANGUAGES = [
  { btn: 'eng', code: 'GB', label: 'English',      flag: '🇬🇧' },
  { btn: 'ger', code: 'DE', label: 'German',        flag: '🇩🇪' },
  { btn: 'usa', code: 'US', label: 'American',      flag: '🇺🇸' },
  { btn: 'fre', code: 'FR', label: 'French',        flag: '🇫🇷' },
  { btn: 'ita', code: 'IT', label: 'Italian',       flag: '🇮🇹' },
  { btn: 'spa', code: 'ES', label: 'Spanish',       flag: '🇪🇸' },
  { btn: 'nor', code: 'NO', label: 'Norwegian',     flag: '🇳🇴' },
  { btn: 'swe', code: 'SE', label: 'Swedish',       flag: '🇸🇪' },
  { btn: 'dan', code: 'DK', label: 'Danish',        flag: '🇩🇰' },
  { btn: 'pol', code: 'PL', label: 'Polish',        flag: '🇵🇱' },
  { btn: 'rus', code: 'RU', label: 'Russian',       flag: '🇷🇺' },
  { btn: 'ukr', code: 'UA', label: 'Ukrainian',     flag: '🇺🇦' },
  { btn: 'por', code: 'PT', label: 'Portuguese',    flag: '🇵🇹' },
  { btn: 'gre', code: 'GR', label: 'Greek',         flag: '🇬🇷' },
  { btn: 'hun', code: 'HU', label: 'Hungarian',     flag: '🇭🇺' },
  { btn: 'rmn', code: 'RO', label: 'Romanian',      flag: '🇷🇴' },
  { btn: 'bul', code: 'BG', label: 'Bulgarian',     flag: '🇧🇬' },
  { btn: 'ser', code: 'RS', label: 'Serbian',       flag: '🇷🇸' },
  { btn: 'cro', code: 'HR', label: 'Croatian',      flag: '🇭🇷' },
  { btn: 'sln', code: 'SI', label: 'Slovene',       flag: '🇸🇮' },
  { btn: 'mac', code: 'MK', label: 'Macedonian',    flag: '🇲🇰' },
  { btn: 'bos', code: 'BA', label: 'Bosnian',       flag: '🇧🇦' },
  { btn: 'alb', code: 'AL', label: 'Albanian',      flag: '🇦🇱' },
  { btn: 'lat', code: 'LV', label: 'Latvian',       flag: '🇱🇻' },
  { btn: 'lth', code: 'LT', label: 'Lithuanian',    flag: '🇱🇹' },
  { btn: 'est', code: 'EE', label: 'Estonian',      flag: '🇪🇪' },
  { btn: 'fin', code: 'FI', label: 'Finnish',       flag: '🇫🇮' },
  { btn: 'ice', code: 'IS', label: 'Icelandic',     flag: '🇮🇸' },
  { btn: 'iri', code: 'IE', label: 'Irish',         flag: '🇮🇪' },
  { btn: 'sco', code: 'SCO',label: 'Scottish',      flag: '🏴' },
  { btn: 'wel', code: 'WL', label: 'Welsh',         flag: '🏴' },
  { btn: 'bre', code: 'BR', label: 'Breton',        flag: '🏴' },
  { btn: 'cat', code: 'CAT',label: 'Catalan',       flag: '🏴' },
  { btn: 'mal', code: 'MT', label: 'Maltese',       flag: '🇲🇹' },
  { btn: 'geo', code: 'GE', label: 'Georgian',      flag: '🇬🇪' },
  { btn: 'arm', code: 'AM', label: 'Armenian',      flag: '🇦🇲' },
  { btn: 'bel', code: 'BY', label: 'Belarusian',    flag: '🇧🇾' },
  { btn: 'ara', code: 'SA', label: 'Arabic',        flag: '🇸🇦' },
  { btn: 'heb', code: 'IL', label: 'Hebrew',        flag: '🇮🇱' },
  { btn: 'per', code: 'IR', label: 'Persian',       flag: '🇮🇷' },
  { btn: 'tur', code: 'TR', label: 'Turkish',       flag: '🇹🇷' },
  { btn: 'aze', code: 'AZ', label: 'Azerbaijani',   flag: '🇦🇿' },
  { btn: 'kaz', code: 'KZ', label: 'Kazakh',        flag: '🇰🇿' },
  { btn: 'uzb', code: 'UZ', label: 'Uzbek',         flag: '🇺🇿' },
  { btn: 'tkm', code: 'TM', label: 'Turkmen',       flag: '🇹🇲' },
  { btn: 'kyr', code: 'KG', label: 'Kyrgyz',        flag: '🇰🇬' },
  { btn: 'taj', code: 'TJ', label: 'Tajik',         flag: '🇹🇯' },
  { btn: 'urd', code: 'PK', label: 'Urdu',          flag: '🇵🇰' },
  { btn: 'hin', code: 'IN', label: 'Hindi',         flag: '🇮🇳' },
  { btn: 'ben', code: 'BD', label: 'Bengali',       flag: '🇧🇩' },
  { btn: 'chi', code: 'CN', label: 'Chinese',       flag: '🇨🇳' },
  { btn: 'jap', code: 'JP', label: 'Japanese',      flag: '🇯🇵' },
  { btn: 'kor', code: 'KR', label: 'Korean',        flag: '🇰🇷' },
  { btn: 'vie', code: 'VN', label: 'Vietnamese',    flag: '🇻🇳' },
  { btn: 'tha', code: 'TH', label: 'Thai',          flag: '🇹🇭' },
  { btn: 'ins', code: 'ID', label: 'Indonesian',    flag: '🇮🇩' },
  { btn: 'mly', code: 'MY', label: 'Malay',         flag: '🇲🇾' },
  { btn: 'tag', code: 'PH', label: 'Filipino',      flag: '🇵🇭' },
  { btn: 'mon', code: 'MN', label: 'Mongolian',     flag: '🇲🇳' },
  { btn: 'nep', code: 'NP', label: 'Nepali',        flag: '🇳🇵' },
  { btn: 'khm', code: 'KH', label: 'Khmer',         flag: '🇰🇭' },
  { btn: 'sin', code: 'LK', label: 'Sinhalese',     flag: '🇱🇰' },
  { btn: 'afk', code: 'ZA', label: 'Afrikaans',     flag: '🇿🇦' },
  { btn: 'amh', code: 'ET', label: 'Amharic',       flag: '🇪🇹' },
  { btn: 'swa', code: 'KE', label: 'Swahili',       flag: '🇰🇪' },
  { btn: 'yor', code: 'YO', label: 'Yoruba',        flag: '🇳🇬' },
  { btn: 'hau', code: 'HA', label: 'Hausa',         flag: '🇳🇬' },
  { btn: 'som', code: 'SO', label: 'Somali',        flag: '🇸🇴' },
  { btn: 'zul', code: 'ZU', label: 'Zulu',          flag: '🇿🇦' },
  { btn: 'haw', code: 'HW', label: 'Hawaiian',      flag: '🌺'  },
  { btn: 'mao', code: 'NZ', label: 'Māori',         flag: '🇳🇿' },
]

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: HEADERS }, res => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout: ' + url)) })
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function decodeHtml(str) {
  return (str || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&aacute;/g,'á').replace(/&Aacute;/g,'Á').replace(/&agrave;/g,'à').replace(/&acirc;/g,'â')
    .replace(/&auml;/g,'ä').replace(/&Auml;/g,'Ä').replace(/&atilde;/g,'ã').replace(/&aring;/g,'å')
    .replace(/&aelig;/g,'æ').replace(/&AElig;/g,'Æ')
    .replace(/&eacute;/g,'é').replace(/&Eacute;/g,'É').replace(/&egrave;/g,'è').replace(/&ecirc;/g,'ê')
    .replace(/&euml;/g,'ë').replace(/&Euml;/g,'Ë').replace(/&ecaron;/g,'ě').replace(/&Ecaron;/g,'Ě')
    .replace(/&iacute;/g,'í').replace(/&Iacute;/g,'Í').replace(/&icirc;/g,'î').replace(/&iuml;/g,'ï')
    .replace(/&oacute;/g,'ó').replace(/&Oacute;/g,'Ó').replace(/&ograve;/g,'ò').replace(/&ocirc;/g,'ô')
    .replace(/&ouml;/g,'ö').replace(/&Ouml;/g,'Ö').replace(/&otilde;/g,'õ').replace(/&oslash;/g,'ø')
    .replace(/&uacute;/g,'ú').replace(/&Uacute;/g,'Ú').replace(/&ugrave;/g,'ù').replace(/&ucirc;/g,'û')
    .replace(/&uuml;/g,'ü').replace(/&Uuml;/g,'Ü').replace(/&uring;/g,'ů')
    .replace(/&yacute;/g,'ý').replace(/&Yacute;/g,'Ý')
    .replace(/&ntilde;/g,'ñ').replace(/&Ntilde;/g,'Ñ')
    .replace(/&ccedil;/g,'ç').replace(/&Ccedil;/g,'Ç').replace(/&ccaron;/g,'č').replace(/&Ccaron;/g,'Č')
    .replace(/&cacute;/g,'ć').replace(/&dcaron;/g,'ď').replace(/&Dcaron;/g,'Ď')
    .replace(/&ncaron;/g,'ň').replace(/&Ncaron;/g,'Ň').replace(/&nacute;/g,'ń')
    .replace(/&rcaron;/g,'ř').replace(/&Rcaron;/g,'Ř').replace(/&racute;/g,'ŕ')
    .replace(/&scaron;/g,'š').replace(/&Scaron;/g,'Š').replace(/&sacute;/g,'ś')
    .replace(/&tcaron;/g,'ť').replace(/&Tcaron;/g,'Ť')
    .replace(/&zcaron;/g,'ž').replace(/&Zcaron;/g,'Ž').replace(/&zacute;/g,'ź').replace(/&zdot;/g,'ż')
    .replace(/&lstrok;/g,'ł').replace(/&lacute;/g,'ĺ').replace(/&lcaron;/g,'ľ')
    .replace(/&szlig;/g,'ß')
}

function parseBrowseBlock(block) {
  const nameMatch = block.match(/class="nll"[^>]*>([^<]+)</)
  if (!nameMatch) return null
  const rawName = decodeHtml(nameMatch[1].trim())
  if (/\s+[2-9]\d*$/.test(rawName)) return null
  const name = rawName.replace(/\s+1$/, '')

  const mascMatch = block.includes('class="masc"')
  const femMatch  = block.includes('class="fem"')
  let gender
  if (mascMatch && femMatch) gender = 'neutral'
  else if (mascMatch) gender = 'boy'
  else if (femMatch)  gender = 'girl'
  else return null

  const mngMatch = block.match(/class="mng">([^<]+)</)
  let meaning = mngMatch ? decodeHtml(mngMatch[1]).replace(/^["']|["']$/g, '').trim() : ''
  meaning = meaning.charAt(0).toUpperCase() + meaning.slice(1)

  const text = block.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  let origin = 'Unknown'
  for (const [label, re] of [
    ['Hebrew',   /\bHebrew\b|\bBiblical\b/],
    ['Latin',    /\bLatin\b/],
    ['Greek',    /\bGreek\b/],
    ['Slavic',   /\bSlavic\b/],
    ['Germanic', /\bGermanic\b|\bOld German\b/],
    ['Celtic',   /\bCeltic\b/],
    ['Persian',  /\bPersian\b/],
    ['Arabic',   /\bArabic\b/],
    ['French',   /\bFrench\b/],
    ['English',  /\bEnglish\b/],
    ['Norse',    /\bOld Norse\b|\bNorse\b/],
  ]) {
    if (re.test(text)) { origin = label; break }
  }

  return { name, gender, meaning, origin }
}

async function scrapeLanguage(btn) {
  const allNames = []
  for (let page = 1; page <= 15; page++) {
    const url = page === 1
      ? `https://www.behindthename.com/names/usage/${btn}`
      : `https://www.behindthename.com/names/usage/${btn}/${page}`
    let html
    try {
      html = await fetch(url)
      if (!html || html.length < 500) break
    } catch (e) {
      process.stdout.write(` [err:${e.message}]`)
      break
    }
    const blocks = html.split('<div class="browsename">').slice(1)
    if (blocks.length === 0) break
    allNames.push(...blocks.map(parseBrowseBlock).filter(Boolean))
    if (blocks.length < 100) break
    await sleep(1500) // between pages of same language
  }
  const seen = new Set()
  return allNames.filter(n => {
    const key = `${n.name}|${n.gender}`
    if (seen.has(key)) return false
    seen.add(key); return true
  })
}

function escapeSql(s) { return (s || '').replace(/'/g, "''") }

function popBlock(subset, code, genderClause) {
  if (!subset.length) return ''
  const vals = subset.map((n, i) => `  ('${escapeSql(n.name)}','${code}',${500 + i})`).join(',\n')
  return [
    `WITH n AS (SELECT id, name FROM names_db WHERE gender ${genderClause})`,
    `INSERT INTO name_popularity (name_id, country_code, popularity_rank, year)`,
    `SELECT n.id, p.country_code, p.rank, 2024`,
    `FROM n JOIN (VALUES`,
    vals,
    `) AS p(name, country_code, rank) ON n.name = p.name`,
    `ON CONFLICT (name_id, country_code) DO NOTHING;`,
  ].join('\n')
}

async function main() {
  const todo = LANGUAGES.filter(l => !ALREADY_DONE.has(l.code))
  console.log(`\nScraping ${todo.length} languages...\n`)

  const sqlParts = [
    `-- ${MIG_NUM}_all_languages_scraped.sql`,
    `-- Auto-generated by scripts/scrape_all.js`,
    `-- ${todo.length} languages from behindthename.com`,
    `-- Safe to re-run: ON CONFLICT DO NOTHING throughout\n`,
  ]

  let totalNames = 0

  for (let i = 0; i < todo.length; i++) {
    const lang = todo[i]
    process.stdout.write(`[${i+1}/${todo.length}] ${lang.flag} ${lang.label}... `)

    // Longer delay between languages to avoid rate limiting
    if (i > 0) await sleep(3000)

    const names = await scrapeLanguage(lang.btn)
    totalNames += names.length

    const boys    = names.filter(n => n.gender === 'boy')
    const girls   = names.filter(n => n.gender === 'girl')
    const neutral = names.filter(n => n.gender === 'neutral')
    console.log(`${names.length} (${boys.length}m ${girls.length}f ${neutral.length}n)`)

    if (!names.length) continue

    sqlParts.push(`\n-- ═══ ${lang.flag} ${lang.label.toUpperCase()} (${lang.code}) ═══`)
    const nameRows = names.map(n =>
      `  ('${escapeSql(n.name)}', '${n.gender}', '${escapeSql(n.meaning)}', '${escapeSql(n.origin)}')`
    )
    sqlParts.push(`INSERT INTO names_db (name, gender, meaning, origin) VALUES`)
    sqlParts.push(nameRows.join(',\n') + '\nON CONFLICT (name, gender) DO NOTHING;\n')
    if (boys.length)    sqlParts.push(popBlock(boys,    lang.code, `= 'boy'`))
    if (girls.length)   sqlParts.push(popBlock(girls,   lang.code, `= 'girl'`))
    if (neutral.length) sqlParts.push(popBlock(neutral, lang.code, `= 'neutral'`))
  }

  fs.writeFileSync(OUT_FILE, sqlParts.join('\n'), 'utf8')
  console.log(`\n✓ Total: ${totalNames} names → ${OUT_FILE}`)
  console.log(`Next: supabase db push`)
}

main().catch(err => { console.error(err); process.exit(1) })
