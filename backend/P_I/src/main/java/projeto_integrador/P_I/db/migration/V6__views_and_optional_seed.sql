-- 6) Views para consultas comuns

-- Último status de ponto por usuário
CREATE OR REPLACE VIEW vw_user_last_clock AS
SELECT u.id AS user_id,
       u.name,
       u.email,
       u.role,
       ce.entry_type AS last_entry_type,
       ce.occurred_at AS last_occurred_at
FROM app_user u
LEFT JOIN LATERAL (
  SELECT entry_type, occurred_at
  FROM clock_entry
  WHERE user_id = u.id
  ORDER BY occurred_at DESC, id DESC
  LIMIT 1
) ce ON TRUE;

-- Tasks abertas por squad, com contagem de atribuídos
CREATE OR REPLACE VIEW vw_open_tasks_by_squad AS
SELECT s.id AS squad_id,
       s.name AS squad_name,
       t.id AS task_id,
       t.title,
       t.priority,
       t.due_date,
       COUNT(ta.user_id) AS assignees_count
FROM squad s
JOIN task t ON t.squad_id = s.id
LEFT JOIN task_assignee ta ON ta.task_id = t.id
WHERE t.status IN ('ABERTA', 'EM_ANDAMENTO')
GROUP BY s.id, s.name, t.id, t.title, t.priority, t.due_date
ORDER BY s.name, t.priority DESC, t.due_date NULLS LAST;
