export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  listId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string; // ISO-строка
}

export interface CreateTaskDto {
  title: string;
  description: string;
  listId: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
} 