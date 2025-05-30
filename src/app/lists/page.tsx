'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography } from '@mui/material';
import { Button, Card } from '@/shared/ui';
import { ListCard } from '@/entities/list/ui/ListCard';
import { CreateListModal } from '@/features/list-management/ui/CreateListModal';
import { useListManagement } from '@/features/list-management/model/useListManagement';

export default function ListsPage() {
  const router = useRouter();
  const { lists, isLoading, createList, deleteList, getTaskCount } = useListManagement();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleCreateList = (title: string) => {
    createList(title);
    setModalOpen(false);
  };

  const handleCardClick = (listId: string) => {
    router.push(`/lists/${listId}`);
  };

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
            <ListCard
              key={list.id}
              list={list}
              taskCount={getTaskCount(list.id)}
              onDelete={deleteList}
              onClick={handleCardClick}
            />
          ))}
        </Box>
      )}

      <CreateListModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateList}
        isLoading={isLoading}
      />
    </Container>
  );
} 