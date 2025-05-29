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
  listId: string;
  dueDate?: string;
};

export type UpdateTaskDto = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}; 