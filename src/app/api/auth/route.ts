import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === TEST_USER.email && password === TEST_USER.password) {
      return NextResponse.json(
        { 
          success: true, 
          user: { email: TEST_USER.email },
          token: 'demo-token-' + Date.now()
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Неверные учетные данные' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
} 