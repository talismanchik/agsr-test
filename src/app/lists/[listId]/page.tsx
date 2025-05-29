'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/shared/config/store';
import { Container, Box, Typography, IconButton, MenuItem } from '@mui/material';
import { Button, Card, Form, Modal } from '@/shared/ui';
import { createTaskStart, createTaskSuccess, deleteTaskStart, deleteTaskSuccess, updateTaskStart, updateTaskSuccess } from '@/features/task-management/model/taskSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Ожидает' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'completed', label: 'Завершена' },
];

function getStatusLabel(status: string) {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.label : status;
}

function getStatusBg(status: string) {
  switch (status) {
    case 'pending':
      return '#fffde7';
    case 'in_progress':
      return '#e3f2fd';
    case 'completed':
      return '#e8f5e9';
    default:
      return undefined;
  }
}

function formatTimeLeftToDeadline(dueDate?: string) {
  if (!dueDate) return '—';
  const now = new Date();
  const deadline = new Date(dueDate);
  const diff = Math.floor((deadline.getTime() - now.getTime()) / 1000);
  if (diff <= 0) return 'Просрочено';
  const h = Math.floor(diff / 3600).toString().padStart(2, '0');
  const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
  const s = (diff % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function ListTasksPage() {
  const { listId } = useParams<{ listId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const list = useAppSelector((state) => state.lists.lists.find((l) => l.id === listId));
  const tasks = useAppSelector((state) => state.tasks.tasks.filter((t) => t.listId === listId));
  const isLoading = useAppSelector((state) => state.tasks.isLoading);

  // Состояния для создания задачи (модалка)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({ title: '', description: '', status: 'pending', dueDate: '' });
  const [createFormErrors, setCreateFormErrors] = useState<Record<string, string>>({});

  // Состояния для просмотра/редактирования задачи
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', status: 'pending', dueDate: '' });
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
  const [timer, setTimer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  useEffect(() => {
    if (selectedTask && selectedTask.dueDate && !editMode) {
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
  }, [selectedTaskId, editMode]);

  if (!list) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h5">Список не найден</Typography>
        <Button variant="outlined" onClick={() => router.push('/lists')}>Назад к спискам</Button>
      </Container>
    );
  }

  // --- Создание задачи ---
  const handleCreateChange = (name: string, value: string) => {
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
    if (createFormErrors[name]) {
      setCreateFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateCreateForm = () => {
    const errors: Record<string, string> = {};
    if (!createFormData.title) errors.title = 'Название обязательно';
    setCreateFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreateForm()) return;
    dispatch(createTaskStart());
    dispatch(createTaskSuccess({
      id: uuidv4(),
      title: createFormData.title,
      description: createFormData.description,
      status: createFormData.status as any,
      listId: list.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: createFormData.dueDate || undefined,
    }));
    setCreateModalOpen(false);
    setCreateFormData({ title: '', description: '', status: 'pending', dueDate: '' });
  };

  // --- Просмотр/редактирование/удаление задачи ---
  const openTaskModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setEditMode(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const closeTaskModal = () => {
    setSelectedTaskId(null);
    setEditMode(false);
    setEditFormData({ title: '', description: '', status: 'pending', dueDate: '' });
    setEditFormErrors({});
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleEditClick = () => {
    if (selectedTask) {
      setEditFormData({
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        dueDate: selectedTask.dueDate || '',
      });
      setEditMode(true);
    }
  };

  const handleEditChange = (name: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (editFormErrors[name]) {
      setEditFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEditForm = () => {
    const errors: Record<string, string> = {};
    if (!editFormData.title) errors.title = 'Название обязательно';
    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEditForm() || !selectedTask) return;
    dispatch(updateTaskStart());
    dispatch(updateTaskSuccess({
      id: selectedTask.id,
      title: editFormData.title,
      description: editFormData.description,
      status: editFormData.status as any,
      listId: list.id,
      createdAt: selectedTask.createdAt,
      updatedAt: new Date().toISOString(),
      dueDate: editFormData.dueDate || undefined,
    }));
    setEditMode(false);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      dispatch(deleteTaskStart());
      dispatch(deleteTaskSuccess(selectedTask.id));
      closeTaskModal();
    }
  };

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
            <Card
              key={task.id}
              title={task.title}
              sx={{ backgroundColor: getStatusBg(task.status), cursor: 'pointer' }}
              onClick={() => openTaskModal(task.id)}
            >
              <Typography color="text.secondary">
                {task.description || 'Без описания'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Статус: {getStatusLabel(task.status)}
              </Typography>
              {task.dueDate && (
                <Typography variant="caption" color="text.secondary">
                  Дедлайн: {format(new Date(task.dueDate), 'dd.MM.yyyy HH:mm')}
                </Typography>
              )}
              {task.dueDate && (
                <Typography variant="caption" color="text.secondary">
                  До дедлайна: {formatTimeLeftToDeadline(task.dueDate)}
                </Typography>
              )}
            </Card>
          ))
        )}
      </Box>
      {/* Модалка создания задачи */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Создать задачу"
        actions={null}
      >
        <Form
          fields={[
            { name: 'title', label: 'Название', required: true },
            { name: 'description', label: 'Описание', required: false },
            {
              name: 'status',
              label: 'Статус',
              select: true,
              required: true,
              children: STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              )),
            },
            {
              name: 'dueDate',
              label: 'Дедлайн',
              type: 'datetime-local',
              required: false,
            },
          ]}
          values={createFormData}
          onChange={handleCreateChange}
          errors={createFormErrors}
        />
        <Box mt={2} display="flex" gap={2}>
          <Button variant="contained" onClick={handleCreateSubmit}>
            Создать
          </Button>
          <Button variant="outlined" onClick={() => setCreateModalOpen(false)}>
            Отмена
          </Button>
        </Box>
      </Modal>
      {/* Модалка просмотра/редактирования/удаления задачи */}
      <Modal
        open={!!selectedTaskId}
        onClose={closeTaskModal}
        title={editMode ? 'Редактировать задачу' : 'Информация о задаче'}
        actions={null}
        maxWidth="sm"
      >
        {selectedTask && !editMode && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">{selectedTask.title}</Typography>
            <Typography color="text.secondary">{selectedTask.description || 'Без описания'}</Typography>
            <Typography>Статус: {getStatusLabel(selectedTask.status)}</Typography>
            {selectedTask.dueDate && (
              <Typography>Дедлайн: {format(new Date(selectedTask.dueDate), 'dd.MM.yyyy HH:mm')}</Typography>
            )}
            {selectedTask.dueDate && (
              <Typography>До дедлайна: {formatTimeLeftToDeadline(selectedTask.dueDate)}</Typography>
            )}
            <Box display="flex" gap={2} mt={2}>
              <Button variant="contained" onClick={handleEditClick}>
                Редактировать
              </Button>
              <Button variant="outlined" color="error" onClick={handleDeleteTask}>
                Удалить задачу
              </Button>
            </Box>
          </Box>
        )}
        {selectedTask && editMode && (
          <form onSubmit={handleEditSubmit}>
            <Form
              fields={[
                { name: 'title', label: 'Название', required: true },
                { name: 'description', label: 'Описание', required: false },
                {
                  name: 'status',
                  label: 'Статус',
                  select: true,
                  required: true,
                  children: STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  )),
                },
                {
                  name: 'dueDate',
                  label: 'Дедлайн',
                  type: 'datetime-local',
                  required: false,
                },
              ]}
              values={editFormData}
              onChange={handleEditChange}
              errors={editFormErrors}
            />
            <Box mt={2} display="flex" gap={2}>
              <Button variant="contained" type="submit">
                Сохранить
              </Button>
              <Button variant="outlined" onClick={() => setEditMode(false)}>
                Отмена
              </Button>
            </Box>
          </form>
        )}
      </Modal>
    </Container>
  );
} 