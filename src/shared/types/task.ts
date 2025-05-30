export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  listId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
};

export type CreateTaskDto = {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
};

export type UpdateTaskDto = CreateTaskDto;

export const TASK_STATUS_OPTIONS = [
  { value: 'pending' as const, label: 'Ожидает', bgColor: '#fffde7' },
  { value: 'in_progress' as const, label: 'В работе', bgColor: '#e3f2fd' },
  { value: 'completed' as const, label: 'Завершена', bgColor: '#e8f5e9' },
] as const; 