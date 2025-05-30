import { format } from 'date-fns';
import { Task, TASK_STATUS_OPTIONS } from '@/shared/types/task';

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm');
};

export const formatTimeLeft = (seconds: number | null) => {
  if (seconds === null) return '—';
  if (seconds <= 0) return 'Просрочено';
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const getTimeLeftToDeadline = (dueDate?: string) => {
  if (!dueDate) return null;
  const now = new Date();
  const deadline = new Date(dueDate);
  const diff = Math.floor((deadline.getTime() - now.getTime()) / 1000);
  return diff > 0 ? diff : 0;
};

export const getStatusLabel = (status: Task['status']) => {
  const found = TASK_STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.label : status;
};

export const getStatusBg = (status: Task['status']) => {
  const found = TASK_STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.bgColor : undefined;
}; 