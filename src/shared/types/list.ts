export interface TaskList {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
}

export interface CreateListDto {
  title: string;
}

export interface UpdateListDto {
  title?: string;
} 