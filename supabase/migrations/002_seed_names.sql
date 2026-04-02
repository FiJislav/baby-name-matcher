-- supabase/migrations/002_seed_names.sql

-- Girl names
INSERT INTO names_db (name, gender, meaning, origin) VALUES
  ('Emma',    'girl', 'Whole, universal',              'Germanic'),
  ('Sofia',   'girl', 'Wisdom',                        'Greek'),
  ('Anna',    'girl', 'Grace, favor',                  'Hebrew'),
  ('Olivia',  'girl', 'Olive tree (symbol of peace)',  'Latin'),
  ('Mia',     'girl', 'Mine, beloved',                 'Scandinavian'),
  ('Lucie',   'girl', 'Light',                         'Latin'),
  ('Tereza',  'girl', 'To harvest, to reap',           'Greek'),
  ('Marie',   'girl', 'Beloved, wished-for child',     'Hebrew'),
  ('Eva',     'girl', 'Life',                          'Hebrew'),
  ('Natalie', 'girl', 'Born on Christmas Day',         'Latin'),
  ('Ella',    'girl', 'Goddess, fairy maiden',         'Germanic'),
  ('Amelia',  'girl', 'Work, industrious',             'Germanic'),
  ('Ava',     'girl', 'Life, bird-like',               'Latin'),
  ('Isabella','girl', 'Devoted to God',                'Hebrew'),
  ('Zoe',     'girl', 'Life',                          'Greek');

-- Boy names
INSERT INTO names_db (name, gender, meaning, origin) VALUES
  ('Liam',   'boy', 'Strong-willed warrior',       'Irish'),
  ('Noah',   'boy', 'Rest, comfort',               'Hebrew'),
  ('Jan',    'boy', 'God is gracious',             'Hebrew'),
  ('Jakub',  'boy', 'Supplanter, may God protect', 'Hebrew'),
  ('Adam',   'boy', 'Son of the red earth',        'Hebrew'),
  ('Lukáš',  'boy', 'Light, illumination',         'Greek'),
  ('Matěj',  'boy', 'Gift of God',                 'Hebrew'),
  ('David',  'boy', 'Beloved',                     'Hebrew'),
  ('Martin', 'boy', 'Of Mars, warlike',            'Latin'),
  ('Tomáš',  'boy', 'Twin',                        'Aramaic'),
  ('Oliver', 'boy', 'Olive tree',                  'Latin'),
  ('Elijah', 'boy', 'My God is Yahweh',            'Hebrew'),
  ('James',  'boy', 'Supplanter',                  'Hebrew'),
  ('Lucas',  'boy', 'Light',                       'Greek'),
  ('Henry',  'boy', 'Ruler of the home',           'Germanic');

-- Popularity data: CZ = Czech Republic, DE = Germany, GB = United Kingdom, US = United States

-- Girls popularity
WITH n AS (SELECT id, name FROM names_db WHERE gender = 'girl')
INSERT INTO name_popularity (name_id, country_code, popularity_rank, year)
SELECT n.id, p.country_code, p.rank, 2024
FROM n JOIN (VALUES
  ('Emma',    'CZ', 3), ('Emma',    'DE', 1), ('Emma',    'GB', 5),  ('Emma',    'US', 2),
  ('Sofia',   'CZ', 2), ('Sofia',   'DE', 4), ('Sofia',   'GB', 8),  ('Sofia',   'US', 5),
  ('Anna',    'CZ', 5), ('Anna',    'DE', 7), ('Anna',    'GB', 12), ('Anna',    'US', 15),
  ('Olivia',  'CZ', 8), ('Olivia',  'DE', 6), ('Olivia',  'GB', 1),  ('Olivia',  'US', 1),
  ('Mia',     'CZ', 1), ('Mia',     'DE', 2), ('Mia',     'GB', 4),  ('Mia',     'US', 8),
  ('Lucie',   'CZ', 4), ('Lucie',   'DE', 20),
  ('Tereza',  'CZ', 6),
  ('Marie',   'CZ', 7), ('Marie',   'DE', 9),
  ('Eva',     'CZ', 9),
  ('Natalie', 'CZ', 10),('Natalie', 'US', 20),
  ('Ella',    'GB', 3), ('Ella',    'US', 10),
  ('Amelia',  'GB', 2), ('Amelia',  'US', 7),
  ('Ava',     'US', 3), ('Ava',     'GB', 6),
  ('Isabella','US', 4), ('Isabella','GB', 10),
  ('Zoe',     'US', 25),('Zoe',     'GB', 15)
) AS p(name, country_code, rank) ON n.name = p.name;

-- Boys popularity
WITH n AS (SELECT id, name FROM names_db WHERE gender = 'boy')
INSERT INTO name_popularity (name_id, country_code, popularity_rank, year)
SELECT n.id, p.country_code, p.rank, 2024
FROM n JOIN (VALUES
  ('Liam',   'US', 1), ('Liam',   'GB', 3),  ('Liam',   'DE', 8),
  ('Noah',   'US', 2), ('Noah',   'GB', 5),  ('Noah',   'DE', 6),
  ('Jan',    'CZ', 1), ('Jan',    'DE', 15),
  ('Jakub',  'CZ', 2),
  ('Adam',   'CZ', 5), ('Adam',   'GB', 10), ('Adam',   'US', 18),
  ('Lukáš',  'CZ', 3),
  ('Matěj',  'CZ', 4),
  ('David',  'CZ', 6), ('David',  'DE', 10), ('David',  'US', 12),
  ('Martin', 'CZ', 7), ('Martin', 'DE', 20),
  ('Tomáš',  'CZ', 8),
  ('Oliver', 'GB', 1), ('Oliver', 'DE', 1),  ('Oliver', 'US', 5),
  ('Elijah', 'US', 3),
  ('James',  'GB', 2), ('James',  'US', 7),
  ('Lucas',  'DE', 2), ('Lucas',  'US', 9),  ('Lucas',  'GB', 8),
  ('Henry',  'GB', 4), ('Henry',  'US', 10)
) AS p(name, country_code, rank) ON n.name = p.name;
