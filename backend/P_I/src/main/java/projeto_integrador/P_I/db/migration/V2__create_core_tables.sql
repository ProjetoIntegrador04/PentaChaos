-- 2) Tabelas núcleo

-- Usuários
CREATE TABLE app_user (
  id           BIGSERIAL PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(320) NOT NULL, -- unicidade case-insensitive vem no V5 via índice funcional
  role         app_role     NOT NULL,
  active       BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Squads
CREATE TABLE squad (
  id           BIGSERIAL PRIMARY KEY,
  name         VARCHAR(120) NOT NULL UNIQUE,
  description  TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Relação N:N usuários em squads
CREATE TABLE squad_member (
  user_id      BIGINT      NOT NULL,
  squad_id     BIGINT      NOT NULL,
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, squad_id),
  CONSTRAINT fk_squad_member_user  FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE,
  CONSTRAINT fk_squad_member_squad FOREIGN KEY (squad_id) REFERENCES squad    (id) ON DELETE CASCADE
);

-- Tasks
CREATE TABLE task (
  id           BIGSERIAL    PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  status       task_status  NOT NULL DEFAULT 'ABERTA',
  priority     task_priority NOT NULL DEFAULT 'MEDIA',
  due_date     DATE,
  squad_id     BIGINT,
  created_by   BIGINT       NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_task_squad     FOREIGN KEY (squad_id)  REFERENCES squad    (id) ON DELETE SET NULL,
  CONSTRAINT fk_task_createdby FOREIGN KEY (created_by) REFERENCES app_user (id) ON DELETE RESTRICT
);

-- Atribuídos à task (N:N)
CREATE TABLE task_assignee (
  task_id      BIGINT  NOT NULL,
  user_id      BIGINT  NOT NULL,
  assigned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (task_id, user_id),
  CONSTRAINT fk_task_assignee_task FOREIGN KEY (task_id) REFERENCES task     (id) ON DELETE CASCADE,
  CONSTRAINT fk_task_assignee_user FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE
);

-- Itens (subtarefas) da task
CREATE TABLE task_item (
  id           BIGSERIAL    PRIMARY KEY,
  task_id      BIGINT       NOT NULL,
  title        VARCHAR(200) NOT NULL,
  done         BOOLEAN      NOT NULL DEFAULT FALSE,
  sort_order   INT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_task_item_task FOREIGN KEY (task_id) REFERENCES task (id) ON DELETE CASCADE
);

-- Comentários da task
CREATE TABLE task_comment (
  id           BIGSERIAL   PRIMARY KEY,
  task_id      BIGINT      NOT NULL,
  author_id    BIGINT      NOT NULL,
  content      TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_task_comment_task   FOREIGN KEY (task_id)  REFERENCES task     (id) ON DELETE CASCADE,
  CONSTRAINT fk_task_comment_author FOREIGN KEY (author_id) REFERENCES app_user (id) ON DELETE SET NULL
);

-- Ponto (clock-in/out)
CREATE TABLE clock_entry (
  id           BIGSERIAL   PRIMARY KEY,
  user_id      BIGINT      NOT NULL,
  entry_type   clock_type  NOT NULL,
  latitude     NUMERIC(9,6)  NOT NULL,
  longitude    NUMERIC(9,6)  NOT NULL,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_clock_entry_user FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE
);