-- ==============================================
-- 🎯 PentaChaos - Sistema de Gestão de Estágios
-- Script de População de Dados
-- Senha padrão: Penta@2025
-- ==============================================

-- Limpar dados existentes (exceto roles)
DELETE FROM user_roles;
DELETE FROM clock_entries;
DELETE FROM tasks;
DELETE FROM users WHERE username NOT IN ('eliezer', 'pedro.santos');

-- Inserir roles
INSERT INTO roles (name, created_at, updated_at) VALUES ('ROLE_USER', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, created_at, updated_at) VALUES ('ROLE_ADMIN', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;

-- ========================================
-- 👥 COORDENADORES (ADMIN)
-- ========================================

-- ADMIN 1: Eliezer (mantido)
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'eliezer', 'eliezer@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Eliezer Silva', '100001', 'CASE', '(11) 98765-0001',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO UPDATE SET
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    full_name = EXCLUDED.full_name,
    ra = EXCLUDED.ra,
    squad = EXCLUDED.squad,
    phone_number = EXCLUDED.phone_number;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'eliezer' AND r.name IN ('ROLE_ADMIN', 'ROLE_USER')
ON CONFLICT DO NOTHING;

-- ADMIN 2: Ana Carolina (Coordenadora)
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'ana.carolina', 'ana.carolina@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Ana Carolina Oliveira', '100002', 'LSD', '(11) 98765-0002',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'ana.carolina' AND r.name IN ('ROLE_ADMIN', 'ROLE_USER')
ON CONFLICT DO NOTHING;

-- ========================================
-- 👨‍💼 ESTAGIÁRIOS (USER)
-- ========================================

-- ESTAGIÁRIO 1: Pedro Santos (mantido)
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'pedro.santos', 'pedro.santos@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Pedro Santos', '200001', 'CASE', '(11) 97654-1001',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO UPDATE SET
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    full_name = EXCLUDED.full_name,
    ra = EXCLUDED.ra,
    squad = EXCLUDED.squad,
    phone_number = EXCLUDED.phone_number;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'pedro.santos' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- ESTAGIÁRIO 2: Julia Mendes
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'julia.mendes', 'julia.mendes@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Julia Mendes', '200002', 'CASE', '(11) 97654-1002',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'julia.mendes' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- ESTAGIÁRIO 3: Lucas Ferreira
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'lucas.ferreira', 'lucas.ferreira@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Lucas Ferreira', '200003', 'LSD', '(11) 97654-1003',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'lucas.ferreira' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- ESTAGIÁRIO 4: Mariana Costa
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'mariana.costa', 'mariana.costa@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Mariana Costa', '200004', 'LSD', '(11) 97654-1004',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'mariana.costa' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- ESTAGIÁRIO 5: Rafael Lima
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'rafael.lima', 'rafael.lima@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Rafael Lima', '200005', 'CASE', '(11) 97654-1005',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'rafael.lima' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- ESTAGIÁRIO 6: Beatriz Alves
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'beatriz.alves', 'beatriz.alves@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Beatriz Alves', '200006', 'LSD', '(11) 97654-1006',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'beatriz.alves' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- ESTAGIÁRIO 7: Gabriel Souza
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'gabriel.souza', 'gabriel.souza@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Gabriel Souza', '200007', 'CASE', '(11) 97654-1007',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'gabriel.souza' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- ESTAGIÁRIO 8: Camila Rodrigues
INSERT INTO users (
    username, email, password, full_name, ra, squad, phone_number,
    account_expired, account_locked, credentials_expired, enabled,
    created_at, updated_at
) VALUES (
    'camila.rodrigues', 'camila.rodrigues@pentachaos.com.br', 
    '$2a$10$8EfqKlzFMQMl4x9xQGYkC.5JT6uQKF0p6H1gZxC8vYzK5.7rHJ5vO',
    'Camila Rodrigues', '200008', 'LSD', '(11) 97654-1008',
    false, false, false, true, NOW(), NOW()
) ON CONFLICT (username) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'camila.rodrigues' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- ========================================
-- ⏰ REGISTROS DE PONTO (Clock Entries)
-- Últimos 15 dias - Dados realistas
-- ========================================

-- Pedro Santos - 14 dias completos (95% frequência)
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '14 days' + TIME '08:00:00', 'MOB_PS_001', 'GPS', '192.168.1.10', -23.550520, -46.633308, 15.5, NOW() FROM users u WHERE u.username = 'pedro.santos';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '14 days' + TIME '17:00:00', 'MOB_PS_001', 'GPS', '192.168.1.10', -23.550520, -46.633308, 15.5, NOW() FROM users u WHERE u.username = 'pedro.santos';

INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '13 days' + TIME '08:05:00', 'MOB_PS_001', 'GPS', '192.168.1.10', -23.550520, -46.633308, 12.3, NOW() FROM users u WHERE u.username = 'pedro.santos';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '13 days' + TIME '17:10:00', 'MOB_PS_001', 'GPS', '192.168.1.10', -23.550520, -46.633308, 12.3, NOW() FROM users u WHERE u.username = 'pedro.santos';

INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '12 days' + TIME '07:55:00', 'MOB_PS_001', 'GPS', '192.168.1.10', -23.550520, -46.633308, 18.2, NOW() FROM users u WHERE u.username = 'pedro.santos';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '12 days' + TIME '17:05:00', 'MOB_PS_001', 'GPS', '192.168.1.10', -23.550520, -46.633308, 18.2, NOW() FROM users u WHERE u.username = 'pedro.santos';

-- Julia Mendes - 12 dias (88% frequência)
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '14 days' + TIME '08:15:00', 'MOB_JM_002', 'GPS', '192.168.1.11', -23.550520, -46.633308, 16.4, NOW() FROM users u WHERE u.username = 'julia.mendes';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '14 days' + TIME '17:20:00', 'MOB_JM_002', 'GPS', '192.168.1.11', -23.550520, -46.633308, 16.4, NOW() FROM users u WHERE u.username = 'julia.mendes';

INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '12 days' + TIME '08:20:00', 'MOB_JM_002', 'GPS', '192.168.1.11', -23.550520, -46.633308, 13.8, NOW() FROM users u WHERE u.username = 'julia.mendes';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '12 days' + TIME '17:25:00', 'MOB_JM_002', 'GPS', '192.168.1.11', -23.550520, -46.633308, 13.8, NOW() FROM users u WHERE u.username = 'julia.mendes';

-- Lucas Ferreira - 13 dias (92% frequência)
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '14 days' + TIME '07:58:00', 'MOB_LF_003', 'GPS', '192.168.1.12', -23.550520, -46.633308, 11.2, NOW() FROM users u WHERE u.username = 'lucas.ferreira';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '14 days' + TIME '17:02:00', 'MOB_LF_003', 'GPS', '192.168.1.12', -23.550520, -46.633308, 11.2, NOW() FROM users u WHERE u.username = 'lucas.ferreira';

INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '13 days' + TIME '08:02:00', 'MOB_LF_003', 'GPS', '192.168.1.12', -23.550520, -46.633308, 19.5, NOW() FROM users u WHERE u.username = 'lucas.ferreira';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '13 days' + TIME '17:08:00', 'MOB_LF_003', 'GPS', '192.168.1.12', -23.550520, -46.633308, 19.5, NOW() FROM users u WHERE u.username = 'lucas.ferreira';

-- Mariana Costa - 11 dias (85% frequência)
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '14 days' + TIME '08:08:00', 'MOB_MC_004', 'GPS', '192.168.1.13', -23.550520, -46.633308, 17.6, NOW() FROM users u WHERE u.username = 'mariana.costa';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '14 days' + TIME '17:12:00', 'MOB_MC_004', 'GPS', '192.168.1.13', -23.550520, -46.633308, 17.6, NOW() FROM users u WHERE u.username = 'mariana.costa';

-- Rafael Lima - 10 dias (78% frequência - precisa melhorar)
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '14 days' + TIME '08:25:00', 'MOB_RL_005', 'GPS', '192.168.1.14', -23.550520, -46.633308, 20.1, NOW() FROM users u WHERE u.username = 'rafael.lima';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '14 days' + TIME '17:30:00', 'MOB_RL_005', 'GPS', '192.168.1.14', -23.550520, -46.633308, 20.1, NOW() FROM users u WHERE u.username = 'rafael.lima';

-- Beatriz Alves - 13 dias (90% frequência)
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '14 days' + TIME '08:03:00', 'MOB_BA_006', 'GPS', '192.168.1.15', -23.550520, -46.633308, 14.3, NOW() FROM users u WHERE u.username = 'beatriz.alves';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '14 days' + TIME '17:07:00', 'MOB_BA_006', 'GPS', '192.168.1.15', -23.550520, -46.633308, 14.3, NOW() FROM users u WHERE u.username = 'beatriz.alves';

-- Gabriel Souza - 11 dias (82% frequência)
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '13 days' + TIME '08:12:00', 'MOB_GS_007', 'GPS', '192.168.1.16', -23.550520, -46.633308, 16.9, NOW() FROM users u WHERE u.username = 'gabriel.souza';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '13 days' + TIME '17:18:00', 'MOB_GS_007', 'GPS', '192.168.1.16', -23.550520, -46.633308, 16.9, NOW() FROM users u WHERE u.username = 'gabriel.souza';

-- Camila Rodrigues - 12 dias (87% frequência)
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'ENTRADA', CURRENT_DATE - INTERVAL '14 days' + TIME '08:07:00', 'MOB_CR_008', 'GPS', '192.168.1.17', -23.550520, -46.633308, 15.8, NOW() FROM users u WHERE u.username = 'camila.rodrigues';
INSERT INTO clock_entries (user_id, tipo, timestamp, device_id, fonte, ip, latitude, longitude, precisao, created_at)
SELECT u.id, 'SAIDA', CURRENT_DATE - INTERVAL '14 days' + TIME '17:13:00', 'MOB_CR_008', 'GPS', '192.168.1.17', -23.550520, -46.633308, 15.8, NOW() FROM users u WHERE u.username = 'camila.rodrigues';

-- ========================================
-- 📋 TAREFAS (Tasks)
-- Mix realista de status e prioridades
-- ========================================

-- Tarefas CONCLUÍDAS
INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Implementar API de Autenticação', 'Desenvolver endpoints de login, logout e refresh token usando JWT. Incluir validações e tratamento de erros.', 'CONCLUIDA', 'ALTA', '2025-11-20', '2025-12-05',
(SELECT id FROM users WHERE username = 'pedro.santos'), (SELECT id FROM users WHERE username = 'eliezer');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Design do Sistema de Navegação', 'Criar wireframes e protótipo navegável da aplicação mobile no Figma.', 'CONCLUIDA', 'MEDIA', '2025-11-22', '2025-12-08',
(SELECT id FROM users WHERE username = 'julia.mendes'), (SELECT id FROM users WHERE username = 'eliezer');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Implementar Sistema de Notificações', 'Criar sistema de notificações push para mobile usando Firebase Cloud Messaging.', 'CONCLUIDA', 'MEDIA', '2025-11-28', '2025-12-10',
(SELECT id FROM users WHERE username = 'camila.rodrigues'), (SELECT id FROM users WHERE username = 'ana.carolina');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Criar Relatórios em PDF', 'Desenvolver sistema de geração de relatórios PDF com gráficos e estatísticas.', 'CONCLUIDA', 'MEDIA', '2025-12-01', '2025-12-11',
(SELECT id FROM users WHERE username = 'lucas.ferreira'), (SELECT id FROM users WHERE username = 'ana.carolina');

-- Tarefas EM ANDAMENTO
INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Configurar CI/CD Pipeline', 'Implementar pipeline de integração contínua com GitHub Actions. Incluir testes automatizados e deploy.', 'EM_ANDAMENTO', 'ALTA', '2025-12-01', NULL,
(SELECT id FROM users WHERE username = 'lucas.ferreira'), (SELECT id FROM users WHERE username = 'eliezer');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Otimizar Queries do Banco', 'Revisar e otimizar queries SQL lentas. Adicionar índices onde necessário.', 'EM_ANDAMENTO', 'ALTA', '2025-12-05', NULL,
(SELECT id FROM users WHERE username = 'rafael.lima'), (SELECT id FROM users WHERE username = 'eliezer');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Criar Dashboard de Métricas', 'Desenvolver dashboard com gráficos de desempenho e frequência dos estagiários.', 'EM_ANDAMENTO', 'ALTA', '2025-11-25', NULL,
(SELECT id FROM users WHERE username = 'gabriel.souza'), (SELECT id FROM users WHERE username = 'ana.carolina');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Implementar Geolocalização', 'Adicionar funcionalidade de registro de ponto por geolocalização com validação de raio.', 'EM_ANDAMENTO', 'ALTA', '2025-12-08', NULL,
(SELECT id FROM users WHERE username = 'julia.mendes'), (SELECT id FROM users WHERE username = 'ana.carolina');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Corrigir Bug de Autenticação', 'Investigar e corrigir problema de token expirado não sendo renovado automaticamente.', 'EM_ANDAMENTO', 'URGENTE', '2025-12-10', NULL,
(SELECT id FROM users WHERE username = 'rafael.lima'), (SELECT id FROM users WHERE username = 'ana.carolina');

-- Tarefas PENDENTES
INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Documentar API REST', 'Criar documentação completa da API usando Swagger/OpenAPI. Incluir exemplos de requisições.', 'PENDENTE', 'MEDIA', '2025-12-03', NULL,
(SELECT id FROM users WHERE username = 'mariana.costa'), (SELECT id FROM users WHERE username = 'eliezer');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Implementar Testes Unitários', 'Criar suite completa de testes unitários para camada de serviços. Coverage mínimo de 80%.', 'PENDENTE', 'MEDIA', '2025-12-06', NULL,
(SELECT id FROM users WHERE username = 'beatriz.alves'), (SELECT id FROM users WHERE username = 'eliezer');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Refatorar Componentes React', 'Aplicar padrões de design e melhorar reutilização de componentes.', 'PENDENTE', 'BAIXA', '2025-12-07', NULL,
(SELECT id FROM users WHERE username = 'pedro.santos'), (SELECT id FROM users WHERE username = 'ana.carolina');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Implementar Filtros Avançados', 'Adicionar filtros de busca e ordenação nas telas de listagem.', 'PENDENTE', 'BAIXA', '2025-12-09', NULL,
(SELECT id FROM users WHERE username = 'mariana.costa'), (SELECT id FROM users WHERE username = 'ana.carolina');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Adicionar Dark Mode', 'Implementar tema escuro em toda aplicação com persistência de preferência.', 'PENDENTE', 'BAIXA', '2025-12-11', NULL,
(SELECT id FROM users WHERE username = 'beatriz.alves'), (SELECT id FROM users WHERE username = 'ana.carolina');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Migrar para TypeScript', 'Converter código JavaScript legado para TypeScript com tipagem completa.', 'PENDENTE', 'MEDIA', '2025-12-12', NULL,
(SELECT id FROM users WHERE username = 'gabriel.souza'), (SELECT id FROM users WHERE username = 'ana.carolina');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Implementar Cache Redis', 'Adicionar camada de cache usando Redis para melhorar performance.', 'PENDENTE', 'MEDIA', '2025-12-13', NULL,
(SELECT id FROM users WHERE username = 'camila.rodrigues'), (SELECT id FROM users WHERE username = 'ana.carolina');

-- Tarefas de HOJE (urgentes)
INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Revisar Pull Request #245', 'Fazer code review do PR de implementação de websockets.', 'PENDENTE', 'ALTA', CURRENT_DATE, NULL,
(SELECT id FROM users WHERE username = 'pedro.santos'), (SELECT id FROM users WHERE username = 'eliezer');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Atualizar Dependências', 'Atualizar bibliotecas do projeto para últimas versões estáveis.', 'PENDENTE', 'MEDIA', CURRENT_DATE, NULL,
(SELECT id FROM users WHERE username = 'julia.mendes'), (SELECT id FROM users WHERE username = 'ana.carolina');

INSERT INTO task (titulo, descricao, status, prioridade, data_criacao, data_conclusao, responsavel_id, criado_por_id)
SELECT 'Corrigir Vulnerabilidades', 'Resolver 3 vulnerabilidades críticas reportadas pelo Snyk.', 'PENDENTE', 'URGENTE', CURRENT_DATE, NULL,
(SELECT id FROM users WHERE username = 'lucas.ferreira'), (SELECT id FROM users WHERE username = 'eliezer');
