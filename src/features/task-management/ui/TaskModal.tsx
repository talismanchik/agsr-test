import React from 'react';
import { MenuItem, Box, Button } from '@mui/material';
import { BaseModal, Form } from '@/shared/ui';
import { useForm } from '@/shared/lib/hooks/useForm';
import { Task, CreateTaskDto, UpdateTaskDto, TASK_STATUS_OPTIONS } from '@/shared/types/task';

type TaskModalProps = {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto | UpdateTaskDto) => void;
  onDelete?: (taskId: string) => void;
  isLoading: boolean;
};

const validationRules = {
  title: (value: string) => !value ? 'Название обязательно' : undefined,
};

export const TaskModal = ({
  task,
  open,
  onClose,
  onSubmit,
  onDelete,
  isLoading,
}: TaskModalProps) => {
  const isEditMode = Boolean(task);

  const {
    values,
    errors,
    handleChange: formHandleChange,
    handleSubmit,
    reset,
    setValues,
  } = useForm<CreateTaskDto | UpdateTaskDto>({
    initialValues: {
      title: '',
      description: '',
      status: 'pending',
      dueDate: '',
    },
    validationRules,
    onSubmit: (data) => {
      onSubmit(data);
      reset();
      onClose();
    },
  });

  const handleChange = (name: string, value: string) => {
    formHandleChange(name as keyof (CreateTaskDto | UpdateTaskDto), value);
  };

  React.useEffect(() => {
    if (task) {
      setValues({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate || '',
      });
    }
  }, [task, setValues]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={isEditMode ? 'Редактировать задачу' : 'Создать задачу'}
      onSubmit={handleSubmit}
      submitText={isEditMode ? 'Сохранить' : 'Создать'}
      isLoading={isLoading}
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
            InputLabelProps: {
              shrink: true,
            },
          },
        ]}
        values={values}
        onChange={handleChange}
        errors={errors}
      />
      {isEditMode && onDelete && (
        <Box mt={2}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleDelete}
          >
            Удалить задачу
          </Button>
        </Box>
      )}
    </BaseModal>
  );
}; 