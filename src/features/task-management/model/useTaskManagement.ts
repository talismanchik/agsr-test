import { useCallback, useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/config/store';
import { createTaskStart, createTaskSuccess, deleteTaskStart, deleteTaskSuccess, updateTaskStart, updateTaskSuccess } from './taskSlice';
import { Task, CreateTaskDto, UpdateTaskDto } from '@/shared/types/task';
import { v4 as uuidv4 } from 'uuid';

export const useTaskManagement = (listId: string) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks.filter((t) => t.listId === listId));
  const isLoading = useAppSelector((state) => state.tasks.isLoading);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  useEffect(() => {
    if (selectedTask?.dueDate) {
      const updateTimer = () => {
        const now = new Date();
        const deadline = new Date(selectedTask.dueDate!);
        const diff = Math.floor((deadline.getTime() - now.getTime()) / 1000);
        setTimer(diff > 0 ? diff : 0);
      };
      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    } else {
      setTimer(null);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedTaskId, selectedTask?.dueDate]);

  const createTask = useCallback((data: CreateTaskDto) => {
    dispatch(createTaskStart());
    dispatch(createTaskSuccess({
      id: uuidv4(),
      ...data,
      listId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }, [dispatch, listId]);

  const updateTask = useCallback((taskId: string, data: UpdateTaskDto) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    dispatch(updateTaskStart());
    dispatch(updateTaskSuccess({
      ...task,
      ...data,
      updatedAt: new Date().toISOString(),
    }));
  }, [dispatch, tasks]);

  const deleteTask = useCallback((taskId: string) => {
    dispatch(deleteTaskStart());
    dispatch(deleteTaskSuccess(taskId));
  }, [dispatch]);

  const selectTask = useCallback((taskId: string | null) => {
    setSelectedTaskId(taskId);
    if (!taskId && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  return {
    tasks,
    isLoading,
    selectedTask,
    timer,
    createTask,
    updateTask,
    deleteTask,
    selectTask,
  };
}; 