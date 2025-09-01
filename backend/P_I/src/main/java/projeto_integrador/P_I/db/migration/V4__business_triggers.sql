-- 4) Triggers de regras de negócio

-- Atualização automática de updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_updated_at
BEFORE UPDATE ON app_user
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_squad_updated_at
BEFORE UPDATE ON squad
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_task_updated_at
BEFORE UPDATE ON task
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_task_item_updated_at
BEFORE UPDATE ON task_item
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Regras de ponto: alternância e papel do usuário
CREATE OR REPLACE FUNCTION enforce_clock_rules()
RETURNS TRIGGER AS $$
DECLARE
  v_role   app_role;
  v_active BOOLEAN;
  v_last   clock_type;
BEGIN
  -- Usuário existe e está ativo?
  SELECT role, active INTO v_role, v_active
  FROM app_user
  WHERE id = NEW.user_id;

  IF v_role IS NULL THEN
    RAISE EXCEPTION 'USER % not found', NEW.user_id USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF NOT v_active THEN
    RAISE EXCEPTION 'User % is inactive and cannot clock', NEW.user_id USING ERRCODE = 'check_violation';
  END IF;

  -- Apenas ESTAGIARIO pode bater ponto (ajuste se desejar)
  IF v_role <> 'ESTAGIARIO' THEN
    RAISE EXCEPTION 'Only ESTAGIARIO can clock. User % has role %', NEW.user_id, v_role USING ERRCODE = 'check_violation';
  END IF;

  -- Alternância: não pode repetir o mesmo tipo consecutivo
  SELECT entry_type INTO v_last
  FROM clock_entry
  WHERE user_id = NEW.user_id
  ORDER BY occurred_at DESC, id DESC
  LIMIT 1;

  IF v_last IS NOT NULL AND v_last = NEW.entry_type THEN
    RAISE EXCEPTION 'Clock entries must alternate. Last=% , New=%', v_last, NEW.entry_type USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clock_entry_rules
BEFORE INSERT ON clock_entry
FOR EACH ROW EXECUTE FUNCTION enforce_clock_rules();