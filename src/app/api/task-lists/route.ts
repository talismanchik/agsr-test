import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

let taskLists: Array<{
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}> = [];

export async function GET() {
  return NextResponse.json({ taskLists });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: 'Название списка обязательно' },
        { status: 400 }
      );
    }

    const newTaskList = {
      id: uuidv4(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    taskLists.push(newTaskList);

    return NextResponse.json(
      { success: true, taskList: newTaskList },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title } = body;

    if (!id || !title) {
      return NextResponse.json(
        { success: false, message: 'ID и название списка обязательны' },
        { status: 400 }
      );
    }

    const taskListIndex = taskLists.findIndex(list => list.id === id);
    
    if (taskListIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Список задач не найден' },
        { status: 404 }
      );
    }

    taskLists[taskListIndex] = {
      ...taskLists[taskListIndex],
      title,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, taskList: taskLists[taskListIndex] }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID списка обязателен' },
        { status: 400 }
      );
    }

    const taskListIndex = taskLists.findIndex(list => list.id === id);
    
    if (taskListIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Список задач не найден' },
        { status: 404 }
      );
    }

    taskLists = taskLists.filter(list => list.id !== id);

    return NextResponse.json(
      { success: true, message: 'Список задач удален' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
} 