-- 1) Tipos ENUM para manter integridade sem strings soltas
CREATE TYPE app_role AS ENUM ('COORDENADOR', 'ESTAGIARIO');
CREATE TYPE task_status AS ENUM ('ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');
CREATE TYPE task_priority AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');
CREATE TYPE clock_type AS ENUM ('CLOCK_IN', 'CLOCK_OUT');