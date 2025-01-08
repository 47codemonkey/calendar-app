import TaskModel from '@/models/taskModel';
import connectDB from '@/lib/mongodb';

export async function GET(): Promise<Response> {
  try {
    await connectDB();
    const tasks = await TaskModel.find();
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    await connectDB();
    const taskData = await req.json();
    const task = new TaskModel(taskData);
    await task.save();
    return new Response(JSON.stringify(task), { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function PUT(req: Request): Promise<Response> {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
    const id = searchParams.get('id');
    const updates = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ errMsg: 'ID is missing' }), { status: 400 });
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTask) {
      return new Response(JSON.stringify({ errMsg: 'Task not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ errMsg: errorMessage }), { status: 500 });
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }

    const deletedTask = await TaskModel.findByIdAndDelete(id);
    if (!deletedTask) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(deletedTask), { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
