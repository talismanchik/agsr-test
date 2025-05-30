import { Box, Typography } from '@mui/material';
import { Card } from '@/shared/ui';
import { Task } from '@/shared/types/task';
import { formatDateTime, formatTimeLeft, getTimeLeftToDeadline, getStatusLabel, getStatusBg } from '@/shared/lib/format';

type TaskCardProps = {
  task: Task;
  onClick: (taskId: string) => void;
};

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const timeLeft = task.dueDate ? formatTimeLeft(getTimeLeftToDeadline(task.dueDate)) : '—';

  return (
    <Box onClick={() => onClick(task.id)} sx={{ cursor: 'pointer' }}>
      <Card sx={{ backgroundColor: getStatusBg(task.status) }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {task.title}
          </Typography>
          <Typography color="text.secondary" paragraph>
            {task.description || 'Без описания'}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Статус: {getStatusLabel(task.status)}
          </Typography>
          {task.dueDate && (
            <>
              <Typography variant="caption" color="text.secondary" display="block">
                Дедлайн: {formatDateTime(task.dueDate)}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                До дедлайна: {timeLeft}
              </Typography>
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
}; 