import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/config/store';
import { createListStart, createListSuccess, deleteListStart, deleteListSuccess } from './listSlice';
import { deleteTaskStart, deleteTaskSuccess } from '@/features/task-management/model/taskSlice';
import { v4 as uuidv4 } from 'uuid';
import { TaskList } from '@/shared/types/list';

export const useListManagement = () => {
  const dispatch = useAppDispatch();
  const lists = useAppSelector((state) => state.lists.lists as TaskList[]);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const isLoading = useAppSelector((state) => state.lists.isLoading);

  const createList = useCallback((title: string) => {
    dispatch(createListStart());
    dispatch(createListSuccess({
      id: uuidv4(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taskCount: 0,
    }));
  }, [dispatch]);

  const deleteList = useCallback((listId: string) => {
    dispatch(deleteListStart());
    dispatch(deleteListSuccess(listId));
    
    const tasksToDelete = tasks.filter((t) => t.listId === listId);
    tasksToDelete.forEach((task) => {
      dispatch(deleteTaskStart());
      dispatch(deleteTaskSuccess(task.id));
    });
  }, [dispatch, tasks]);

  const getTaskCount = useCallback((listId: string) => {
    return tasks.filter((t) => t.listId === listId).length;
  }, [tasks]);

  return {
    lists,
    isLoading,
    createList,
    deleteList,
    getTaskCount,
  };
}; 