'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, IconButton } from '@mui/material';
import { Button, Card, Modal, Form } from '@/shared/ui';
import { useAppSelector, useAppDispatch } from '@/shared/config/store';
import { createListStart, createListSuccess, deleteListStart, deleteListSuccess } from '@/features/list-management/model/listSlice';
import { deleteTaskStart, deleteTaskSuccess } from '@/features/task-management/model/taskSlice';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ListsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lists = useAppSelector((state) => state.lists.lists);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const isLoading = useAppSelector((state) => state.lists.isLoading);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenModal = () => {
    setFormData({ title: '' });
    setFormErrors({});
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

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
    dispatch(createListStart());
    dispatch(createListSuccess({
      id: uuidv4(),
      title: formData.title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taskCount: 0,
    }));
    setModalOpen(false);
  };

  const handleCardClick = (listId: string) => {
    router.push(`/lists/${listId}`);
  };

  const handleDeleteList = (listId: string) => {
    dispatch(deleteListStart());
    dispatch(deleteListSuccess(listId));
    // Удаляем все задачи этого списка
    const tasksToDelete = tasks.filter((t) => t.listId === listId);
    tasksToDelete.forEach((task) => {
      dispatch(deleteTaskStart());
      dispatch(deleteTaskSuccess(task.id));
    });
  };

  const getTaskCount = (listId: string) => tasks.filter((t) => t.listId === listId).length;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4" component="h1">
          Ваши списки задач
        </Typography>
        <Button variant="contained" size="medium" onClick={handleOpenModal} disabled={isLoading}>
          Создать список
        </Button>
      </Box>

      {lists.length === 0 ? (
        <Card>
          <Typography color="text.secondary" align="center">
            Пока нет ни одного списка. Нажмите «Создать список», чтобы добавить первый.
          </Typography>
        </Card>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {lists.map((list) => (
            <Box key={list.id} sx={{ position: 'relative' }}>
              <Box onClick={() => handleCardClick(list.id)} sx={{ cursor: 'pointer' }}>
                <Card title={
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <span>{list.title}</span>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }>
                  <Typography variant="caption" color="text.secondary">
                    Задач: {getTaskCount(list.id)}
                  </Typography>
                </Card>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title="Создать новый список"
        actions={null}
      >
        <Form
          fields={[
            { name: 'title', label: 'Название', required: true },
          ]}
          values={formData}
          onChange={handleChange}
          errors={formErrors}
        />
        <Box mt={2} display="flex" gap={2}>
          <Button variant="contained" onClick={handleSubmit}>
            Создать
          </Button>
          <Button variant="outlined" onClick={handleCloseModal}>
            Отмена
          </Button>
        </Box>
      </Modal>
    </Container>
  );
} 