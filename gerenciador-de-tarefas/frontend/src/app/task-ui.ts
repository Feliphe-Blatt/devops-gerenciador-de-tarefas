export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskForm = {
  title: string;
  description: string;
  status: TaskStatus;
};

export const initialForm: TaskForm = {
  title: '',
  description: '',
  status: 'PENDING'
};

export const statusLabels: Record<TaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em andamento',
  DONE: 'Concluída'
};

export const statusClassName: Record<TaskStatus, string> = {
  PENDING: 'badge badge--pending',
  IN_PROGRESS: 'badge badge--progress',
  DONE: 'badge badge--done'
};

export function getSubmitLabel(editingId: number | null) {
  return editingId === null ? 'Criar tarefa' : 'Atualizar tarefa';
}