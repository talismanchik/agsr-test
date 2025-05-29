export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type LoginDto = {
  email: string;
  password: string;
};

export const TEST_USER: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
};

export const TEST_CREDENTIALS: LoginDto = {
  email: 'test@example.com',
  password: 'password123',
}; 