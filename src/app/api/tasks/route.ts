import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

type TaskStatus = 'pending' | 'in_progress' | 'completed';

let tasks: Array<{
  id: string;
  taskListId: string;
  title: string;
  description: string;
  status: TaskStatus;
  estimatedTime: number; 
  createdAt: string;
  updatedAt: string;
}> = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskListId = searchParams.get('taskListId');

  const filteredTasks = taskListId 
    ? tasks.filter(task => task.taskListId === taskListId)
    : tasks;

  return NextResponse.json({ tasks: filteredTasks });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskListId, title, description, estimatedTime } = body;

    if (!taskListId || !title) {
      return NextResponse.json(
        { success: false, message: 'ID списка и название задачи обязательны' },
        { status: 400 }
      );
    }

    const newTask: typeof tasks[0] = {
      id: uuidv4(),
      taskListId: String(taskListId),
      title: String(title),
      description: description ? String(description) : '',
      status: 'pending',
      estimatedTime: Number(estimatedTime) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    return NextResponse.json(
      { success: true, task: newTask },
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
    const { id, title, description, status, estimatedTime } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID задачи обязателен' },
        { status: 400 }
      );
    }

    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Задача не найдена' },
        { status: 404 }
      );
    }

    const validStatus = status && ['pending', 'in_progress', 'completed'].includes(status)
      ? status as TaskStatus
      : tasks[taskIndex].status;

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description || tasks[taskIndex].description,
      status: validStatus,
      estimatedTime: estimatedTime || tasks[taskIndex].estimatedTime,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, task: tasks[taskIndex] }
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
        { success: false, message: 'ID задачи обязателен' },
        { status: 400 }
      );
    }

    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Задача не найдена' },
        { status: 404 }
      );
    }

    tasks = tasks.filter(task => task.id !== id);

    return NextResponse.json(
      { success: true, message: 'Задача удалена' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
} 