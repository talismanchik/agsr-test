'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/config/store';
import { Container, Box, Typography, IconButton } from '@mui/material';
import { Button } from '@/shared/ui';
import { TaskCard } from '@/entities/task/ui/TaskCard';
import { TaskModal } from '@/features/task-management/ui/TaskModal';
import { useTaskManagement } from '@/features/task-management/model/useTaskManagement';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ListTasksPage() {
  const { listId } = useParams<{ listId: string }>();
  const router = useRouter();
  const list = useAppSelector((state) => state.lists.lists.find((l) => l.id === listId));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
  } = useTaskManagement(listId);

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleSubmit = (data: any) => {
    if (selectedTask) {
      updateTask(selectedTask, data);
    } else {
      createTask(data);
    }
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

  const task = selectedTask ? tasks.find(t => t.id === selectedTask) || null : null;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => router.push('/lists')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {list.title}
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleCreateClick}>
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
              onClick={handleTaskClick}
            />
          ))
        )}
      </Box>

      <TaskModal
        task={task}
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={deleteTask}
        isLoading={isLoading}
      />
    </Container>
  );
} 