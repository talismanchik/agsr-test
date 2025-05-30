'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Alert, Link, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/shared/config/store';
import { loginSuccess } from '@/features/auth/model/authSlice';
import { Form } from '@/shared/ui';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) {
      errors.name = 'Имя обязательно';
    }
    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный email';
    }
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен быть не менее 6 символов';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser = {
        id: crypto.randomUUID(), 
        name: formData.name,
        email: formData.email,
      };

      dispatch(loginSuccess(newUser));
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify({
          email: formData.email,
          password: formData.password,
        }));
      }
      
      router.push('/lists');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при регистрации';
      setError(errorMessage);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      required: true,
    },
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
    {
      name: 'confirmPassword',
      label: 'Подтверждение пароля',
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
          Регистрация
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
            sx={{ mt: 2 }}
          >
            Зарегистрироваться
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center">
          Уже есть аккаунт?{' '}
          <Link href="/login" underline="hover">
            Войти
          </Link>
        </Typography>
      </Box>
    </Container>
  );
} 