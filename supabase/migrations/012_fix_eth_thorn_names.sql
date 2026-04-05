-- 012_fix_eth_thorn_names.sql
-- Fixes names with unencoded &eth; (ð) and &thorn;/&THORN; (þ/Þ) HTML entities

UPDATE names_db SET name = replace(replace(name, '&eth;', 'ð'), '&thorn;', 'þ') WHERE name LIKE '%&eth;%' OR name LIKE '%&thorn;%';
UPDATE names_db SET name = replace(name, '&THORN;', 'Þ') WHERE name LIKE '%&THORN;%';
UPDATE names_db SET name = replace(name, '&ETH;', 'Ð') WHERE name LIKE '%&ETH;%';
