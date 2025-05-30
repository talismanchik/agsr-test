'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Alert, Link, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/shared/config/store';
import { loginStart, loginSuccess, loginFailure } from '@/features/auth/model/authSlice';
import { Form } from '@/shared/ui';
import { TEST_CREDENTIALS, TEST_USER } from '@/shared/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный email';
    }
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(loginStart());
    try {
      if (
        formData.email === TEST_CREDENTIALS.email &&
        formData.password === TEST_CREDENTIALS.password
      ) {
        dispatch(loginSuccess(TEST_USER));
        if (typeof window !== 'undefined') {
          localStorage.setItem('isLoggedIn', 'true');
        }
        router.push('/lists');
        return;
      }

      if (typeof window !== 'undefined') {
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
          const { email, password } = JSON.parse(savedUserData);
          if (formData.email === email && formData.password === password) {
            const user = {
              id: crypto.randomUUID(),
              name: email.split('@')[0],
              email: email,
            };
            dispatch(loginSuccess(user));
            localStorage.setItem('isLoggedIn', 'true');
            router.push('/lists');
            return;
          }
        }
      }

      throw new Error('Неверный email или пароль');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при входе';
      dispatch(loginFailure(errorMessage));
      setFormErrors({
        email: 'Неверный email или пароль',
        password: 'Неверный email или пароль',
      });
    }
  };

  const formFields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'password',
      label: 'Пароль',
      type: 'password',
      required: true,
    },
  ];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: 'calc(100vh - var(--header-total-height))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Вход в систему
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Form
            fields={formFields}
            values={formData}
            onChange={handleChange}
            errors={formErrors}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center">
          Нет аккаунта?{' '}
          <Link href="/register" underline="hover">
            Зарегистрироваться
          </Link>
        </Typography>
      </Box>
    </Container>
  );
} 