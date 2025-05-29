'use client';

import { Box, Container, Typography } from '@mui/material';
import { Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/config/store';

export default function WelcomePage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleStartClick = () => {
    router.push(isAuthenticated ? '/lists' : '/login');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Добро пожаловать в Task Manager
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Удобное приложение для управления вашими задачами и списками
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleStartClick}
          sx={{ minWidth: 200 }}
        >
          Начать работу
        </Button>
      </Box>
    </Container>
  );
} 