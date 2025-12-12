-- Script para inserir dados de teste de pontos (clock_entries)
-- Este script cria registros de ponto dos últimos 30 dias para os usuários existentes

-- Primeiro, vamos verificar os IDs dos usuários
-- SELECT id, username, full_name FROM users;

-- Inserir pontos para o usuário com ID 1 (últimos 7 dias)
-- Dia 1 - Segunda-feira (2 dias atrás)
INSERT INTO clock_entries (user_id, tipo, timestamp, latitude, longitude, precisao, fonte, device_id, ip, created_at)
VALUES 
(1, 'ENTRY', NOW() - INTERVAL '2 days' + INTERVAL '8 hours', -23.550520, -46.633308, 10.5, 'WEB', 'web-device-001', '192.168.1.100', NOW() - INTERVAL '2 days' + INTERVAL '8 hours'),
(1, 'LUNCH_START', NOW() - INTERVAL '2 days' + INTERVAL '12 hours', -23.550520, -46.633308, 8.2, 'WEB', 'web-device-001', '192.168.1.100', NOW() - INTERVAL '2 days' + INTERVAL '12 hours'),
(1, 'LUNCH_END', NOW() - INTERVAL '2 days' + INTERVAL '13 hours', -23.550520, -46.633308, 9.1, 'WEB', 'web-device-001', '192.168.1.100', NOW() - INTERVAL '2 days' + INTERVAL '13 hours'),
(1, 'EXIT', NOW() - INTERVAL '2 days' + INTERVAL '17 hours', -23.550520, -46.633308, 11.3, 'WEB', 'web-device-001', '192.168.1.100', NOW() - INTERVAL '2 days' + INTERVAL '17 hours');

-- Dia 2 - Terça-feira (1 dia atrás)
INSERT INTO clock_entries (user_id, tipo, timestamp, latitude, longitude, precisao, fonte, device_id, ip, created_at)
VALUES 
(1, 'ENTRY', NOW() - INTERVAL '1 day' + INTERVAL '8 hours' + INTERVAL '15 minutes', -23.550520, -46.633308, 12.1, 'MOBILE_ANDROID', 'android-device-001', '192.168.1.101', NOW() - INTERVAL '1 day' + INTERVAL '8 hours' + INTERVAL '15 minutes'),
(1, 'LUNCH_START', NOW() - INTERVAL '1 day' + INTERVAL '12 hours', -23.550520, -46.633308, 7.5, 'MOBILE_ANDROID', 'android-device-001', '192.168.1.101', NOW() - INTERVAL '1 day' + INTERVAL '12 hours'),
(1, 'LUNCH_END', NOW() - INTERVAL '1 day' + INTERVAL '13 hours' + INTERVAL '5 minutes', -23.550520, -46.633308, 8.9, 'MOBILE_ANDROID', 'android-device-001', '192.168.1.101', NOW() - INTERVAL '1 day' + INTERVAL '13 hours' + INTERVAL '5 minutes'),
(1, 'EXIT', NOW() - INTERVAL '1 day' + INTERVAL '17 hours' + INTERVAL '30 minutes', -23.550520, -46.633308, 10.2, 'MOBILE_ANDROID', 'android-device-001', '192.168.1.101', NOW() - INTERVAL '1 day' + INTERVAL '17 hours' + INTERVAL '30 minutes');

-- Dia 3 - Hoje
INSERT INTO clock_entries (user_id, tipo, timestamp, latitude, longitude, precisao, fonte, device_id, ip, created_at)
VALUES 
(1, 'ENTRY', NOW() - INTERVAL '2 hours', -23.550520, -46.633308, 9.8, 'WEB', 'web-device-001', '192.168.1.100', NOW() - INTERVAL '2 hours');

-- Inserir pontos para usuário ID 2 (últimos 7 dias)
INSERT INTO clock_entries (user_id, tipo, timestamp, latitude, longitude, precisao, fonte, device_id, ip, created_at)
VALUES 
-- Dia 1
(2, 'ENTRY', NOW() - INTERVAL '2 days' + INTERVAL '8 hours' + INTERVAL '5 minutes', -23.550520, -46.633308, 11.2, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '2 days' + INTERVAL '8 hours' + INTERVAL '5 minutes'),
(2, 'LUNCH_START', NOW() - INTERVAL '2 days' + INTERVAL '12 hours' + INTERVAL '10 minutes', -23.550520, -46.633308, 8.7, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '2 days' + INTERVAL '12 hours' + INTERVAL '10 minutes'),
(2, 'LUNCH_END', NOW() - INTERVAL '2 days' + INTERVAL '13 hours', -23.550520, -46.633308, 9.5, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '2 days' + INTERVAL '13 hours'),
(2, 'EXIT', NOW() - INTERVAL '2 days' + INTERVAL '17 hours' + INTERVAL '15 minutes', -23.550520, -46.633308, 10.8, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '2 days' + INTERVAL '17 hours' + INTERVAL '15 minutes'),
-- Dia 2
(2, 'ENTRY', NOW() - INTERVAL '1 day' + INTERVAL '8 hours' + INTERVAL '10 minutes', -23.550520, -46.633308, 12.5, 'WEB', 'web-device-002', '192.168.1.102', NOW() - INTERVAL '1 day' + INTERVAL '8 hours' + INTERVAL '10 minutes'),
(2, 'LUNCH_START', NOW() - INTERVAL '1 day' + INTERVAL '12 hours' + INTERVAL '5 minutes', -23.550520, -46.633308, 7.8, 'WEB', 'web-device-002', '192.168.1.102', NOW() - INTERVAL '1 day' + INTERVAL '12 hours' + INTERVAL '5 minutes'),
(2, 'LUNCH_END', NOW() - INTERVAL '1 day' + INTERVAL '13 hours' + INTERVAL '2 minutes', -23.550520, -46.633308, 8.3, 'WEB', 'web-device-002', '192.168.1.102', NOW() - INTERVAL '1 day' + INTERVAL '13 hours' + INTERVAL '2 minutes'),
(2, 'EXIT', NOW() - INTERVAL '1 day' + INTERVAL '18 hours', -23.550520, -46.633308, 11.1, 'WEB', 'web-device-002', '192.168.1.102', NOW() - INTERVAL '1 day' + INTERVAL '18 hours'),
-- Dia 3 - Hoje
(2, 'ENTRY', NOW() - INTERVAL '3 hours', -23.550520, -46.633308, 10.1, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '3 hours'),
(2, 'LUNCH_START', NOW() - INTERVAL '30 minutes', -23.550520, -46.633308, 9.2, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '30 minutes');

-- Inserir pontos para usuário ID 3 (últimos 7 dias - padrão irregular)
INSERT INTO clock_entries (user_id, tipo, timestamp, latitude, longitude, precisao, fonte, device_id, ip, created_at)
VALUES 
-- Dia 1 - Faltou
-- Dia 2 - Chegou tarde
(3, 'ENTRY', NOW() - INTERVAL '1 day' + INTERVAL '9 hours' + INTERVAL '30 minutes', -23.550520, -46.633308, 15.2, 'MOBILE_ANDROID', 'android-device-002', '192.168.1.103', NOW() - INTERVAL '1 day' + INTERVAL '9 hours' + INTERVAL '30 minutes'),
(3, 'EXIT', NOW() - INTERVAL '1 day' + INTERVAL '17 hours', -23.550520, -46.633308, 13.8, 'MOBILE_ANDROID', 'android-device-002', '192.168.1.103', NOW() - INTERVAL '1 day' + INTERVAL '17 hours'),
-- Dia 3 - Hoje (apenas entrada)
(3, 'ENTRY', NOW() - INTERVAL '4 hours' + INTERVAL '20 minutes', -23.550520, -46.633308, 11.7, 'WEB', 'web-device-003', '192.168.1.103', NOW() - INTERVAL '4 hours' + INTERVAL '20 minutes');

-- Inserir pontos mais antigos para estatísticas (últimos 30 dias)
-- Usuário 1 - 15 dias atrás
INSERT INTO clock_entries (user_id, tipo, timestamp, latitude, longitude, precisao, fonte, device_id, ip, created_at)
VALUES 
(1, 'ENTRY', NOW() - INTERVAL '15 days' + INTERVAL '8 hours', -23.550520, -46.633308, 10.0, 'WEB', 'web-device-001', '192.168.1.100', NOW() - INTERVAL '15 days' + INTERVAL '8 hours'),
(1, 'LUNCH_START', NOW() - INTERVAL '15 days' + INTERVAL '12 hours', -23.550520, -46.633308, 9.0, 'WEB', 'web-device-001', '192.168.1.100', NOW() - INTERVAL '15 days' + INTERVAL '12 hours'),
(1, 'LUNCH_END', NOW() - INTERVAL '15 days' + INTERVAL '13 hours', -23.550520, -46.633308, 8.5, 'WEB', 'web-device-001', '192.168.1.100', NOW() - INTERVAL '15 days' + INTERVAL '13 hours'),
(1, 'EXIT', NOW() - INTERVAL '15 days' + INTERVAL '17 hours', -23.550520, -46.633308, 10.5, 'WEB', 'web-device-001', '192.168.1.100', NOW() - INTERVAL '15 days' + INTERVAL '17 hours');

-- Usuário 2 - 20 dias atrás
INSERT INTO clock_entries (user_id, tipo, timestamp, latitude, longitude, precisao, fonte, device_id, ip, created_at)
VALUES 
(2, 'ENTRY', NOW() - INTERVAL '20 days' + INTERVAL '8 hours' + INTERVAL '10 minutes', -23.550520, -46.633308, 11.0, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '20 days' + INTERVAL '8 hours' + INTERVAL '10 minutes'),
(2, 'LUNCH_START', NOW() - INTERVAL '20 days' + INTERVAL '12 hours', -23.550520, -46.633308, 9.5, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '20 days' + INTERVAL '12 hours'),
(2, 'LUNCH_END', NOW() - INTERVAL '20 days' + INTERVAL '13 hours', -23.550520, -46.633308, 8.8, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '20 days' + INTERVAL '13 hours'),
(2, 'EXIT', NOW() - INTERVAL '20 days' + INTERVAL '17 hours' + INTERVAL '30 minutes', -23.550520, -46.633308, 10.2, 'MOBILE_IOS', 'ios-device-001', '192.168.1.102', NOW() - INTERVAL '20 days' + INTERVAL '17 hours' + INTERVAL '30 minutes');

-- Verificar os registros inseridos
SELECT 
    ce.id,
    u.username,
    ce.tipo,
    ce.timestamp,
    ce.fonte,
    ce.created_at
FROM clock_entries ce
JOIN users u ON ce.user_id = u.id
ORDER BY ce.timestamp DESC
LIMIT 20;

-- Verificar frequência por usuário
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT DATE(ce.timestamp)) as dias_trabalhados,
    COUNT(ce.id) as total_registros
FROM users u
LEFT JOIN clock_entries ce ON u.id = ce.user_id
WHERE ce.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.username
ORDER BY u.id;
