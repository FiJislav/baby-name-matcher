-- 007_fix_missing_cz_popularity.sql
-- Adds CZ popularity entries for Czech names that are in names_db
-- but were accidentally omitted from migration 006's popularity inserts.
-- These get high rank numbers (146+) so they appear in the CZ filter
-- but sort after the well-known names.
-- Safe to re-run: ON CONFLICT DO NOTHING throughout.

-- ─────────────────────────────────────────────────────────────
-- MISSING CZ POPULARITY — BOYS (ranks 146–194)
-- ─────────────────────────────────────────────────────────────
WITH n AS (SELECT id, name FROM names_db WHERE gender = 'boy')
INSERT INTO name_popularity (name_id, country_code, popularity_rank, year)
SELECT n.id, p.country_code, p.rank, 2024
FROM n JOIN (VALUES
  ('Bořek',      'CZ', 146),
  ('Dezider',    'CZ', 147),
  ('Edvard',     'CZ', 148),
  ('Florián',    'CZ', 149),
  ('Gejza',      'CZ', 150),
  ('Jákob',      'CZ', 151),
  ('Janek',      'CZ', 152),
  ('Jára',       'CZ', 153),
  ('Jarek',      'CZ', 154),
  ('Jarmil',     'CZ', 155),
  ('Jindra',     'CZ', 156),
  ('Kvido',      'CZ', 157),
  ('Luboš',      'CZ', 158),
  ('Lubomír',    'CZ', 159),
  ('Mečislav',   'CZ', 160),
  ('Mikoláš',    'CZ', 161),
  ('Otmar',      'CZ', 162),
  ('Oto',        'CZ', 163),
  ('Otokar',     'CZ', 164),
  ('Pravoslav',  'CZ', 165),
  ('Quido',      'CZ', 166),
  ('Radko',      'CZ', 167),
  ('Sergej',     'CZ', 168),
  ('Soběslav',   'CZ', 169),
  ('Teodor',     'CZ', 170),
  ('Theodor',    'CZ', 171),
  ('Valentýn',   'CZ', 172),
  ('Vendelín',   'CZ', 173),
  ('Věroslav',   'CZ', 174),
  ('Vítek',      'CZ', 175),
  ('Vladan',     'CZ', 176),
  ('Vlastimír',  'CZ', 177),
  ('Vlastislav', 'CZ', 178),
  ('Záviš',      'CZ', 179),
  ('Zbyhněv',    'CZ', 180),
  ('Zbyšek',     'CZ', 181),
  ('Zdislav',    'CZ', 182),
  ('Alexandr',   'CZ', 183),
  ('Adolf',      'CZ', 184),
  ('Alfréd',     'CZ', 185),
  ('Alex',       'CZ', 186),
  ('Albín',      'CZ', 187),
  ('Augustin',   'CZ', 188),
  ('Barnabáš',   'CZ', 189),
  ('Bernard',    'CZ', 190),
  ('Benjamín',   'CZ', 191),
  ('Bonifác',    'CZ', 192),
  ('Damián',     'CZ', 193),
  ('Michael',    'CZ', 194)
) AS p(name, country_code, rank) ON n.name = p.name
ON CONFLICT (name_id, country_code) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- MISSING CZ POPULARITY — GIRLS (ranks 151–216)
-- ─────────────────────────────────────────────────────────────
WITH n AS (SELECT id, name FROM names_db WHERE gender = 'girl')
INSERT INTO name_popularity (name_id, country_code, popularity_rank, year)
SELECT n.id, p.country_code, p.rank, 2024
FROM n JOIN (VALUES
  ('Aloisie',    'CZ', 151),
  ('Berta',      'CZ', 152),
  ('Bohuslava',  'CZ', 153),
  ('Bohunka',    'CZ', 154),
  ('Boleslava',  'CZ', 155),
  ('Danuška',    'CZ', 156),
  ('Dáša',       'CZ', 157),
  ('Draha',      'CZ', 158),
  ('Drahoslava', 'CZ', 159),
  ('Evženie',    'CZ', 160),
  ('Gita',       'CZ', 161),
  ('Gizela',     'CZ', 162),
  ('Helenka',    'CZ', 163),
  ('Helga',      'CZ', 164),
  ('Hermína',    'CZ', 165),
  ('Hildegarda', 'CZ', 166),
  ('Ivanka',     'CZ', 167),
  ('Ivka',       'CZ', 168),
  ('Ivona',      'CZ', 169),
  ('Janička',    'CZ', 170),
  ('Janka',      'CZ', 171),
  ('Jarka',      'CZ', 172),
  ('Jaruška',    'CZ', 173),
  ('Johanka',    'CZ', 174),
  ('Kája',       'CZ', 175),
  ('Katka',      'CZ', 176),
  ('Klotylda',   'CZ', 177),
  ('Kornélie',   'CZ', 178),
  ('Květoslava', 'CZ', 179),
  ('Květuše',    'CZ', 180),
  ('Lea',        'CZ', 181),
  ('Leontýna',   'CZ', 182),
  ('Miluška',    'CZ', 183),
  ('Miriam',     'CZ', 184),
  ('Míša',       'CZ', 185),
  ('Oldřiška',   'CZ', 186),
  ('Petruška',   'CZ', 187),
  ('Radomila',   'CZ', 188),
  ('Radoslava',  'CZ', 189),
  ('Radovana',   'CZ', 190),
  ('Šarlota',    'CZ', 191),
  ('Slávka',     'CZ', 192),
  ('Stáňa',      'CZ', 193),
  ('Svatoslava', 'CZ', 194),
  ('Táňa',       'CZ', 195),
  ('Vendulka',   'CZ', 196),
  ('Venuše',     'CZ', 197),
  ('Věroslava',  'CZ', 198),
  ('Vítězslava', 'CZ', 199),
  ('Vladana',    'CZ', 200),
  ('Vladěna',    'CZ', 201),
  ('Vlastislava','CZ', 202),
  ('Vratislava', 'CZ', 203),
  ('Yvetta',     'CZ', 204),
  ('Yvona',      'CZ', 205),
  ('Zuzanka',    'CZ', 206),
  ('Zuzka',      'CZ', 207),
  ('Jaromíra',   'CZ', 208),
  ('Jitka',      'CZ', 209),
  ('Soňa',       'CZ', 210),
  ('Taťána',     'CZ', 211),
  ('Apolena',    'CZ', 212),
  ('Bedřiška',   'CZ', 213),
  ('Olívie',     'CZ', 214),
  ('Nora',       'CZ', 215),
  ('Darina',     'CZ', 216)
) AS p(name, country_code, rank) ON n.name = p.name
ON CONFLICT (name_id, country_code) DO NOTHING;
