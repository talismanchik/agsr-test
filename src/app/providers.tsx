'use client';

import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '@/shared/config/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/shared/config/store';
import { loginSuccess } from '@/features/auth/model/authSlice';
import { TEST_USER } from '@/shared/types/auth';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function AuthSync() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn) {
        dispatch(loginSuccess(TEST_USER));
      }
    }
  }, [dispatch]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthSync />
        {children}
      </ThemeProvider>
    </Provider>
  );
} 