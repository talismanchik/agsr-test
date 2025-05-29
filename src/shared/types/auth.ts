export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const TEST_USER: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
};

export const TEST_CREDENTIALS: LoginDto = {
  email: 'test@example.com',
  password: 'password123',
}; 