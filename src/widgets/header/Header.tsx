'use client';
import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/shared/config/store';
import { logout } from '@/features/auth/model/authSlice';
import { Button } from '@/shared/ui/button/Button';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
    router.push('/login');
  };

  return (
    <header style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      marginBottom: 'var(--header-margin-bottom)',
      minHeight: 'var(--header-height)',
      zIndex: 100,
    }}>
      <Link href="/lists" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 700, fontSize: 24 }}>
        Task Manager
      </Link>
      {isAuthenticated && (
        <Button onClick={handleLogout} variant="outlined" color="primary">
          Выйти
        </Button>
      )}
    </header>
  );
};

export default Header; 