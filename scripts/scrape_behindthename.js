// scripts/scrape_behindthename.js
// Scrapes behindthename.com for names by usage code and generates a SQL migration.
// Usage: node scripts/scrape_behindthename.js <usage_code> <country_code> <migration_number>
// Example: node scripts/scrape_behindthename.js czech CZ 008
//          node scripts/scrape_behindthename.js dutch NL 009

const https = require('https')
const fs = require('fs')

const USAGE    = process.argv[2] || 'czech'
const COUNTRY  = process.argv[3] || 'CZ'
const MIG_NUM  = process.argv[4] || '008'
const OUT_FILE = `supabase/migrations/${MIG_NUM}_${USAGE}_names_scraped.sql`

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: HEADERS }, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout ' + url)) })
  })
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

// Decode common HTML entities to proper Unicode characters
function decodeHtml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // named entities for accented chars
    .replace(/&([a-zA-Z]+acute|[a-zA-Z]+grave|[a-zA-Z]+circ|[a-zA-Z]+uml|[a-zA-Z]+tilde|[a-zA-Z]+cedil|[a-zA-Z]+ring|[a-zA-Z]+slash|[a-zA-Z]+lig|[a-zA-Z]+caron|[a-zA-Z]+breve|[a-zA-Z]+macr|[a-zA-Z]+ogon|[a-zA-Z]+strok|[a-zA-Z]+aelig|[a-zA-Z]+aring|[a-zA-Z]+szlig|[a-zA-Z]+eth|[a-zA-Z]+thorn|ntilde|Ntilde);/g, (match, name) => {
      const map = {
        'aacute':'á','Aacute':'Á','agrave':'à','Agrave':'À','acirc':'â','Acirc':'Â',
        'auml':'ä','Auml':'Ä','atilde':'ã','Atilde':'Ã','aring':'å','Aring':'Å',
        'aelig':'æ','AElig':'Æ','aogon':'ą','Aogon':'Ą','amacr':'ā','Amacr':'Ā',
        'eacute':'é','Eacute':'É','egrave':'è','Egrave':'È','ecirc':'ê','Ecirc':'Ê',
        'euml':'ë','Euml':'Ë','ecaron':'ě','Ecaron':'Ě','eogon':'ę','Eogon':'Ę',
        'iacute':'í','Iacute':'Í','igrave':'ì','Igrave':'Ì','icirc':'î','Icirc':'Î',
        'iuml':'ï','Iuml':'Ï',
        'oacute':'ó','Oacute':'Ó','ograve':'ò','Ograve':'Ò','ocirc':'ô','Ocirc':'Ô',
        'ouml':'ö','Ouml':'Ö','otilde':'õ','Otilde':'Õ','oslash':'ø','Oslash':'Ø',
        'uacute':'ú','Uacute':'Ú','ugrave':'ù','Ugrave':'Ù','ucirc':'û','Ucirc':'Û',
        'uuml':'ü','Uuml':'Ü','uring':'ů','Uring':'Ů',
        'yacute':'ý','Yacute':'Ý','yuml':'ÿ',
        'ntilde':'ñ','Ntilde':'Ñ',
        'ccedil':'ç','Ccedil':'Ç','cacute':'ć','Cacute':'Ć','ccaron':'č','Ccaron':'Č',
        'dcaron':'ď','Dcaron':'Ď','dstrok':'đ','Dstrok':'Đ',
        'lacute':'ĺ','Lacute':'Ĺ','lcaron':'ľ','Lcaron':'Ľ','lstrok':'ł','Lstrok':'Ł',
        'nacute':'ń','Nacute':'Ń','ncaron':'ň','Ncaron':'Ň',
        'racute':'ŕ','Racute':'Ŕ','rcaron':'ř','Rcaron':'Ř',
        'sacute':'ś','Sacute':'Ś','scaron':'š','Scaron':'Š',
        'tcaron':'ť','Tcaron':'Ť',
        'zacute':'ź','Zacute':'Ź','zcaron':'ž','Zcaron':'Ž','zdot':'ż','Zdot':'Ż',
        'szlig':'ß',
        'eth':'ð','ETH':'Ð','thorn':'þ','THORN':'Þ',
        'aeliglig':'æ',
      }
      return map[name] || match
    })
    // numeric entities &#NNN; or &#xHHH;
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseBrowseBlock(block) {
  // Name: from class="nll">NAME<
  const nameMatch = block.match(/class="nll"[^>]*>([^<]+)</)
  if (!nameMatch) return null
  const name = decodeHtml(nameMatch[1].trim())
  // Skip entries that have a disambiguating number (Jan 2, Jan 3) — keep Jan 1 / Jan
  if (/\d+$/.test(name) && parseInt(name.match(/\d+$/)[0]) > 1) return null
  // Remove trailing " 1" from "Jan 1" → "Jan"
  const cleanName = name.replace(/\s+1$/, '')

  // Gender
  const mascMatch = block.includes('class="masc"')
  const femMatch  = block.includes('class="fem"')
  let gender
  if (mascMatch && femMatch) gender = 'neutral'
  else if (mascMatch) gender = 'boy'
  else if (femMatch)  gender = 'girl'
  else return null

  // Meaning: first <span class="mng">"..."</span>
  const mngMatch = block.match(/class="mng">([^<]+)</)
  let meaning = mngMatch ? decodeHtml(mngMatch[1]).replace(/^["']|["']$/g, '').trim() : ''
  meaning = meaning.charAt(0).toUpperCase() + meaning.slice(1)

  // Origin: infer from plain text of the block
  const text = stripTags(block)
  let origin = 'Unknown'
  const originMap = [
    ['Hebrew',   /\bHebrew\b|\bBiblical\b/],
    ['Latin',    /\bLatin\b/],
    ['Greek',    /\bGreek\b/],
    ['Slavic',   /\bSlavic\b|\bOld Slavic\b/],
    ['Germanic', /\bGermanic\b|\bOld German\b|\bGerman\b/],
    ['Celtic',   /\bCeltic\b|\bGaelic\b/],
    ['Persian',  /\bPersian\b/],
    ['Arabic',   /\bArabic\b/],
    ['French',   /\bFrench\b|\bOld French\b/],
    ['English',  /\bEnglish\b|\bOld English\b/],
    ['Norse',    /\bOld Norse\b|\bNorse\b/],
    ['Czech',    /\bCzech\b|\bSlavic\b/],
  ]
  for (const [label, re] of originMap) {
    if (re.test(text)) { origin = label; break }
  }

  return { name: cleanName, gender, meaning, origin }
}

async function scrapeUsagePage(pageNum) {
  const url = pageNum === 1
    ? `https://www.behindthename.com/names/usage/${USAGE}`
    : `https://www.behindthename.com/names/usage/${USAGE}/${pageNum}`
  console.log(`  Fetching page ${pageNum}: ${url}`)
  const html = await fetch(url)
  if (!html || html.length < 1000) {
    console.log(`  Page ${pageNum} empty — stopping`)
    return []
  }
  const blocks = html.split('<div class="browsename">').slice(1)
  console.log(`  Found ${blocks.length} name blocks`)
  return blocks.map(parseBrowseBlock).filter(Boolean)
}

function escapeSql(str) {
  return (str || '').replace(/'/g, "''")
}

async function main() {
  console.log(`\nScraping behindthename.com usage="${USAGE}" → country="${COUNTRY}"`)
  console.log(`Output: ${OUT_FILE}\n`)

  const allNames = []
  for (let page = 1; page <= 10; page++) {
    const names = await scrapeUsagePage(page)
    if (names.length === 0) break
    allNames.push(...names)
    await sleep(1200)
  }

  // Deduplicate by (name, gender)
  const seen = new Set()
  const unique = allNames.filter(n => {
    const key = `${n.name}|${n.gender}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const boys    = unique.filter(n => n.gender === 'boy')
  const girls   = unique.filter(n => n.gender === 'girl')
  const neutral = unique.filter(n => n.gender === 'neutral')

  console.log(`\nTotal names scraped: ${unique.length}`)
  console.log(`  Boys:    ${boys.length}`)
  console.log(`  Girls:   ${girls.length}`)
  console.log(`  Neutral: ${neutral.length}`)
  console.log(`\nSample boys:  ${boys.slice(0,5).map(n=>n.name).join(', ')}`)
  console.log(`Sample girls: ${girls.slice(0,5).map(n=>n.name).join(', ')}`)

  // Generate SQL
  const lines = []
  lines.push(`-- ${MIG_NUM}_${USAGE}_names_scraped.sql`)
  lines.push(`-- Auto-generated by scripts/scrape_behindthename.js`)
  lines.push(`-- Source: https://www.behindthename.com/names/usage/${USAGE}`)
  lines.push(`-- ${unique.length} names (${boys.length} boys, ${girls.length} girls, ${neutral.length} neutral)`)
  lines.push(`-- Safe to re-run: ON CONFLICT DO NOTHING throughout\n`)

  lines.push(`-- ─────────────────────────────────────────────────────────────`)
  lines.push(`-- NAMES`)
  lines.push(`-- ─────────────────────────────────────────────────────────────`)
  lines.push(`INSERT INTO names_db (name, gender, meaning, origin) VALUES`)
  const nameRows = unique.map(n =>
    `  ('${escapeSql(n.name)}', '${n.gender}', '${escapeSql(n.meaning)}', '${escapeSql(n.origin)}')`
  )
  lines.push(nameRows.join(',\n') + '\nON CONFLICT (name, gender) DO NOTHING;\n')

  // Popularity entries — start at rank 500 to not clash with existing ranks 1-216
  function popBlock(subset, genderClause) {
    if (subset.length === 0) return ''
    const vals = subset.map((n, i) => `  ('${escapeSql(n.name)}','${COUNTRY}',${500 + i})`).join(',\n')
    return [
      `WITH n AS (SELECT id, name FROM names_db WHERE gender ${genderClause})`,
      `INSERT INTO name_popularity (name_id, country_code, popularity_rank, year)`,
      `SELECT n.id, p.country_code, p.rank, 2024`,
      `FROM n JOIN (VALUES`,
      vals,
      `) AS p(name, country_code, rank) ON n.name = p.name`,
      `ON CONFLICT (name_id, country_code) DO NOTHING;\n`,
    ].join('\n')
  }

  lines.push(`-- ─────────────────────────────────────────────────────────────`)
  lines.push(`-- POPULARITY — links all names to ${COUNTRY} so they appear in country filter`)
  lines.push(`-- ─────────────────────────────────────────────────────────────`)
  if (boys.length)    lines.push(popBlock(boys,    `= 'boy'`))
  if (girls.length)   lines.push(popBlock(girls,   `= 'girl'`))
  if (neutral.length) lines.push(popBlock(neutral, `= 'neutral'`))

  fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8')
  console.log(`\nWritten to ${OUT_FILE}`)
  console.log(`\nNext: supabase db push`)
}

main().catch(err => { console.error(err); process.exit(1) })
