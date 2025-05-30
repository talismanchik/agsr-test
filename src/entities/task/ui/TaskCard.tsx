import { Typography } from '@mui/material';
import { Card } from '@/shared/ui';
import { Task, TASK_STATUS_OPTIONS } from '@/shared/types/task';
import { format } from 'date-fns';

type TaskCardProps = {
  task: Task;
  onClick: (taskId: string) => void;
};

const getStatusLabel = (status: Task['status']) => {
  const found = TASK_STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.label : status;
};

const getStatusBg = (status: Task['status']) => {
  const found = TASK_STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.bgColor : undefined;
};

const formatTimeLeftToDeadline = (dueDate?: string) => {
  if (!dueDate) return '—';
  const now = new Date();
  const deadline = new Date(dueDate);
  const diff = Math.floor((deadline.getTime() - now.getTime()) / 1000);
  if (diff <= 0) return 'Просрочено';
  const h = Math.floor(diff / 3600).toString().padStart(2, '0');
  const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
  const s = (diff % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  return (
    <Card
      title={task.title}
      sx={{ backgroundColor: getStatusBg(task.status), cursor: 'pointer' }}
      onClick={() => onClick(task.id)}
    >
      <Typography color="text.secondary">
        {task.description || 'Без описания'}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Статус: {getStatusLabel(task.status)}
      </Typography>
      {task.dueDate && (
        <>
          <Typography variant="caption" color="text.secondary">
            Дедлайн: {format(new Date(task.dueDate), 'dd.MM.yyyy HH:mm')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            До дедлайна: {formatTimeLeftToDeadline(task.dueDate)}
          </Typography>
        </>
      )}
    </Card>
  );
}; 