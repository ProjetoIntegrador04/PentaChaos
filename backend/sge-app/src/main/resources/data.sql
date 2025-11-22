-- Script de inicialização de dados
-- Executado automaticamente pelo Spring Boot na primeira vez

-- Inserir roles
INSERT INTO roles (name, created_at, updated_at) VALUES ('ROLE_USER', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, created_at, updated_at) VALUES ('ROLE_ADMIN', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;

-- Inserir usuário admin padrão (eliezer)
-- Senha: 123456 (hash BCrypt)
INSERT INTO users (
    username, 
    email, 
    password, 
    account_expired,
    account_locked,
    credentials_expired,
    enabled,
    created_at, 
    updated_at
) VALUES (
    'eliezer', 
    'eliezer@sge.com', 
    '$2b$10$Z6j9tgdOqw7eH7CJv7DJzOFzpOJHReou0i.1.3uvrYChmJjURq6AS',
    false,
    false,
    false,
    true,
    NOW(), 
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Associar roles ao usuário eliezer
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'eliezer' 
AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'eliezer' 
AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- Inserir usuário teste (johndoe)
-- Senha: 123456
INSERT INTO users (
    username, 
    email, 
    password, 
    account_expired,
    account_locked,
    credentials_expired,
    enabled,
    created_at, 
    updated_at
) VALUES (
    'johndoe', 
    'john@sge.com', 
    '$2b$10$Z6j9tgdOqw7eH7CJv7DJzOFzpOJHReou0i.1.3uvrYChmJjURq6AS',
    false,
    false,
    false,
    true,
    NOW(), 
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Associar role USER ao johndoe
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'johndoe' 
AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- Inserir usuário gabrieleliezer
-- Senha: 123456
INSERT INTO users (
    username, 
    email, 
    password, 
    account_expired,
    account_locked,
    credentials_expired,
    enabled,
    created_at, 
    updated_at
) VALUES (
    'gabrieleliezer', 
    'gabriel@sge.com', 
    '$2b$10$Z6j9tgdOqw7eH7CJv7DJzOFzpOJHReou0i.1.3uvrYChmJjURq6AS',
    false,
    false,
    false,
    true,
    NOW(), 
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Associar role USER ao gabrieleliezer
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'gabrieleliezer' 
AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;
