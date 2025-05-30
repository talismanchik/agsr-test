'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/config/store';
import { Container, Box, Typography, IconButton } from '@mui/material';
import { Button } from '@/shared/ui';
import { TaskCard } from '@/entities/task/ui/TaskCard';
import { CreateTaskModal } from '@/features/task-management/ui/CreateTaskModal';
import { TaskDetailsModal } from '@/features/task-management/ui/TaskDetailsModal';
import { useTaskManagement } from '@/features/task-management/model/useTaskManagement';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ListTasksPage() {
  const { listId } = useParams<{ listId: string }>();
  const router = useRouter();
  const list = useAppSelector((state) => state.lists.lists.find((l) => l.id === listId));
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const {
    tasks,
    isLoading,
    selectedTask,
    timer,
    createTask,
    updateTask,
    deleteTask,
    selectTask,
  } = useTaskManagement(listId);

  const formatTimeLeft = (seconds: number | null) => {
    if (seconds === null) return undefined;
    if (seconds <= 0) return 'Просрочено';
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (!list) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h5">Список не найден</Typography>
        <Button variant="outlined" onClick={() => router.push('/lists')}>
          Назад к спискам
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <IconButton onClick={() => router.push('/lists')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {list.title}
        </Typography>
        <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
          Создать задачу
        </Button>
      </Box>

      <Box mt={4} display="flex" flexDirection="column" gap={2}>
        {tasks.length === 0 ? (
          <Typography color="text.secondary" align="center">
            В этом списке пока нет задач.
          </Typography>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={selectTask}
            />
          ))
        )}
      </Box>

      <CreateTaskModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createTask}
        isLoading={isLoading}
      />

      <TaskDetailsModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => selectTask(null)}
        onEdit={updateTask}
        onDelete={deleteTask}
        isLoading={isLoading}
        timeLeft={formatTimeLeft(timer)}
      />
    </Container>
  );
} 