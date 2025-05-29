import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/shared/types/task';

type TaskState = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action: PayloadAction<Task[]>) => {
      state.isLoading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    createTaskStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createTaskSuccess: (state, action: PayloadAction<Task>) => {
      state.isLoading = false;
      state.tasks.push(action.payload);
    },
    createTaskFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateTaskStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateTaskSuccess: (state, action: PayloadAction<Task>) => {
      state.isLoading = false;
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    updateTaskFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteTaskStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteTaskSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    deleteTaskFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  createTaskStart,
  createTaskSuccess,
  createTaskFailure,
  updateTaskStart,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskStart,
  deleteTaskSuccess,
  deleteTaskFailure,
} = taskSlice.actions;

export default taskSlice.reducer; 