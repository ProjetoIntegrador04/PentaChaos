-- 3) Constraints adicionais e CHECKs

-- Email com formato básico
ALTER TABLE app_user
  ADD CONSTRAINT chk_app_user_email_format
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Títulos não vazios
ALTER TABLE task
  ADD CONSTRAINT chk_task_title_len CHECK (char_length(title) BETWEEN 1 AND 200);

ALTER TABLE task_item
  ADD CONSTRAINT chk_task_item_title_len CHECK (char_length(title) BETWEEN 1 AND 200);

-- sort_order não-negativo se preenchido
ALTER TABLE task_item
  ADD CONSTRAINT chk_task_item_sort_nonneg CHECK (sort_order IS NULL OR sort_order >= 0);

-- Latitude/Longitude válidos
ALTER TABLE clock_entry
  ADD CONSTRAINT chk_clock_entry_lat CHECK (latitude  BETWEEN -90.0  AND 90.0);

ALTER TABLE clock_entry
  ADD CONSTRAINT chk_clock_entry_lon CHECK (longitude BETWEEN -180.0 AND 180.0);

