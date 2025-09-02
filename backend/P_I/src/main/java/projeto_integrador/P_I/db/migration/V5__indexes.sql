-- 5) Índices e unicidades úteis

-- Unicidade de email (case-insensitive)
CREATE UNIQUE INDEX ux_app_user_email_lower ON app_user (LOWER(email));

-- Chaves estrangeiras e filtros comuns
CREATE INDEX ix_squad_member_user   ON squad_member (user_id);
CREATE INDEX ix_squad_member_squad  ON squad_member (squad_id);

CREATE INDEX ix_task_squad          ON task (squad_id);
CREATE INDEX ix_task_status         ON task (status);
CREATE INDEX ix_task_priority       ON task (priority);
CREATE INDEX ix_task_created_by     ON task (created_by);

CREATE INDEX ix_task_assignee_user  ON task_assignee (user_id);
CREATE INDEX ix_task_assignee_task  ON task_assignee (task_id);

CREATE INDEX ix_task_item_task      ON task_item (task_id);

CREATE INDEX ix_task_comment_task   ON task_comment (task_id);
CREATE INDEX ix_task_comment_author ON task_comment (author_id);

-- Relatórios de ponto (busca por usuário e mais recentes primeiro)
CREATE INDEX ix_clock_entry_user_time ON clock_entry (user_id, occurred_at DESC);