import { Box, MenuItem, Typography } from '@mui/material';
import { Button, Modal, Form } from '@/shared/ui';
import { useState } from 'react';
import { Task, UpdateTaskDto, TASK_STATUS_OPTIONS } from '@/shared/types/task';
import { format } from 'date-fns';

type TaskDetailsModalProps = {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onEdit: (taskId: string, data: UpdateTaskDto) => void;
  onDelete: (taskId: string) => void;
  isLoading: boolean;
  timeLeft?: string;
};

export const TaskDetailsModal = ({
  task,
  open,
  onClose,
  onEdit,
  onDelete,
  isLoading,
  timeLeft,
}: TaskDetailsModalProps) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateTaskDto>({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleEditClick = () => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate || '',
      });
      setEditMode(true);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title) errors.title = 'Название обязательно';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !task) return;
    onEdit(task.id, formData);
    setEditMode(false);
  };

  const handleClose = () => {
    setEditMode(false);
    setFormData({ title: '', description: '', status: 'pending', dueDate: '' });
    setFormErrors({});
    onClose();
  };

  const getStatusLabel = (status: Task['status']) => {
    const found = TASK_STATUS_OPTIONS.find((s) => s.value === status);
    return found ? found.label : status;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={editMode ? 'Редактировать задачу' : 'Информация о задаче'}
      actions={null}
      maxWidth="sm"
    >
      {task && !editMode && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6">{task.title}</Typography>
          <Typography color="text.secondary">
            {task.description || 'Без описания'}
          </Typography>
          <Typography>Статус: {getStatusLabel(task.status)}</Typography>
          {task.dueDate && (
            <>
              <Typography>
                Дедлайн: {format(new Date(task.dueDate), 'dd.MM.yyyy HH:mm')}
              </Typography>
              {timeLeft && (
                <Typography>До дедлайна: {timeLeft}</Typography>
              )}
            </>
          )}
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" onClick={handleEditClick}>
              Редактировать
            </Button>
            <Button variant="outlined" color="error" onClick={() => onDelete(task.id)}>
              Удалить задачу
            </Button>
          </Box>
        </Box>
      )}
      {task && editMode && (
        <form onSubmit={handleSubmit}>
          <Form
            fields={[
              { name: 'title', label: 'Название', required: true },
              { name: 'description', label: 'Описание', required: false },
              {
                name: 'status',
                label: 'Статус',
                select: true,
                required: true,
                children: TASK_STATUS_OPTIONS.map((option) => (
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
            values={formData}
            onChange={handleChange}
            errors={formErrors}
          />
          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" type="submit" disabled={isLoading}>
              Сохранить
            </Button>
            <Button variant="outlined" onClick={() => setEditMode(false)}>
              Отмена
            </Button>
          </Box>
        </form>
      )}
    </Modal>
  );
}; 