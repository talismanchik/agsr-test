import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskList, CreateListDto, UpdateListDto } from '@/shared/types/list';

interface ListState {
  lists: TaskList[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ListState = {
  lists: [
    {
      id: 'default-list',
      title: 'Мой первый список',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taskCount: 0,
    },
  ],
  isLoading: false,
  error: null,
};

const listSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    // Загрузка списков
    fetchListsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchListsSuccess: (state, action: PayloadAction<TaskList[]>) => {
      state.isLoading = false;
      state.lists = action.payload;
    },
    fetchListsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Создание списка
    createListStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createListSuccess: (state, action: PayloadAction<TaskList>) => {
      state.isLoading = false;
      state.lists.push(action.payload);
    },
    createListFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Обновление списка
    updateListStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateListSuccess: (state, action: PayloadAction<TaskList>) => {
      state.isLoading = false;
      const index = state.lists.findIndex((list) => list.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },
    updateListFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Удаление списка
    deleteListStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteListSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.lists = state.lists.filter((list) => list.id !== action.payload);
    },
    deleteListFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Обновление количества задач в списке
    updateListTaskCount: (state, action: PayloadAction<{ listId: string; count: number }>) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        list.taskCount = action.payload.count;
      }
    },
  },
});

export const {
  fetchListsStart,
  fetchListsSuccess,
  fetchListsFailure,
  createListStart,
  createListSuccess,
  createListFailure,
  updateListStart,
  updateListSuccess,
  updateListFailure,
  deleteListStart,
  deleteListSuccess,
  deleteListFailure,
  updateListTaskCount,
} = listSlice.actions;

export default listSlice.reducer; 