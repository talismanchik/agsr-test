export type TaskList = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
};

export type CreateListDto = {
  title: string;
};

export type UpdateListDto = {
  title: string;
}; 