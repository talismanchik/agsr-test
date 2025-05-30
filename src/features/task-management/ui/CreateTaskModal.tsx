import { Box, MenuItem } from '@mui/material';
import { Button, Modal, Form } from '@/shared/ui';
import { useState } from 'react';
import { CreateTaskDto, TASK_STATUS_OPTIONS } from '@/shared/types/task';

type CreateTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto) => void;
  isLoading: boolean;
};

export const CreateTaskModal = ({ open, onClose, onSubmit, isLoading }: CreateTaskModalProps) => {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    if (!validateForm()) return;
    onSubmit(formData);
    setFormData({ title: '', description: '', status: 'pending', dueDate: '' });
    setFormErrors({});
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          Создать
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Отмена
        </Button>
      </Box>
    </Modal>
  );
}; 