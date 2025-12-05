DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'eliezer');
DELETE FROM users WHERE username = 'eliezer';

INSERT INTO users (username, email, password, account_expired, account_locked, credentials_expired, enabled, created_at, updated_at)
VALUES ('eliezer', 'eliezer@sge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/IVI9EsVBz4t6jF8qGYKkd6LoSvYB0m', false, false, false, true, NOW(), NOW());

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'eliezer' AND r.name = 'ROLE_ADMIN';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'eliezer' AND r.name = 'ROLE_USER';
