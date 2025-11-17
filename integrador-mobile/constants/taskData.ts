// Define o "molde" de como é uma Tarefa
export type TarefaType = {
  id: string;
  status: 'PENDENTE' | 'EM ANDAMENTO' | 'CONCLUÍDO';
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: 'Alta' | 'Media' | 'Baixa';
  criacao: string;
};

// Chave do "banco de dados" local
export const TASKS_STORAGE_KEY = 'my-app-tasks';

// Dados iniciais para popular a lista na primeira vez (com os 10 nomes)
export const initialTaskData: TarefaType[] = [
  { id: '1', status: 'PENDENTE', titulo: 'Criar módulo backend', descricao: '', responsavel: 'David Francisco', prioridade: 'Alta', criacao: '2025-10-27' },
  { id: '2', status: 'EM ANDAMENTO', titulo: 'Atualizar módulo backend', descricao: '', responsavel: 'Ana Clara', prioridade: 'Alta', criacao: '2025-10-26' },
  { id: '3', status: 'EM ANDAMENTO', titulo: 'Testar deploy', descricao: '', responsavel: 'Lucas Souza', prioridade: 'Media', criacao: '2025-10-25' },
  { id: '4', status: 'PENDENTE', titulo: 'Documentar API', descricao: '', responsavel: 'Mariana Costa', prioridade: 'Baixa', criacao: '2025-10-27' },
  { id: '5', status: 'PENDENTE', titulo: 'Revisar PR #112', descricao: '', responsavel: 'Pedro Henrique', prioridade: 'Media', criacao: '2025-10-28' },
  { id: '6', status: 'EM ANDAMENTO', titulo: 'Design da tela de login', descricao: '', responsavel: 'Juliana Silva', prioridade: 'Media', criacao: '2025-10-24' },
  { id: '7', status: 'PENDENTE', titulo: 'Configurar CI/CD', descricao: '', responsavel: 'Gabriel Alves', prioridade: 'Alta', criacao: '2025-10-28' },
  { id: '8', status: 'PENDENTE', titulo: 'Testes unitários do Auth', descricao: '', responsavel: 'Beatriz Lima', prioridade: 'Baixa', criacao: '2025-10-27' },
  { id: '9', status: 'EM ANDAMENTO', titulo: 'Corrigir bug #404', descricao: '', responsavel: 'Matheus Pereira', prioridade: 'Alta', criacao: '2025-10-28' },
  { id: '10', status: 'PENDENTE', titulo: 'Migrar banco de dados', descricao: '', responsavel: 'Laura Mendes', prioridade: 'Baixa', criacao: '2025-10-26' },
];