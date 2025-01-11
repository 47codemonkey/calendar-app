import { Task, Tasks, TaskToEdit } from '@/types/index';

type useModalProps = {
  newTask: string;
  taskToEdit: TaskToEdit | null;
  selectedDate: string | null;
  setTasks: React.Dispatch<React.SetStateAction<Tasks>>;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  setTaskToEdit: React.Dispatch<React.SetStateAction<TaskToEdit | null>>;
};

export default function useModal({
  newTask,
  selectedDate,
  setTasks,
  setNewTask,
  setIsModalOpen,
  setErrMsg,
  setTaskToEdit,
}: useModalProps) {
  async function addTask() {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: newTask, date: selectedDate }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      const addedTask = await response.json();

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[selectedDate as string] = [...(updatedTasks[selectedDate as string] || []), addedTask];

        return updatedTasks;
      });

      setNewTask('');
      setIsModalOpen(false);
    } catch (error) {
      setErrMsg((error as Error).message);
    }
  }

  async function editTask(id: string, updatedMsg: string) {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: updatedMsg }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[selectedDate as string] = updatedTasks[selectedDate as string].map((task: Task) =>
          task._id === id ? updatedTask : task,
        );
        return updatedTasks;
      });
      setTaskToEdit(null);
      setIsModalOpen(false);
    } catch (error) {
      setErrMsg((error as Error).message);
    }
  }

  async function deleteTask(id: string) {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete task');

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[selectedDate as string] = updatedTasks[selectedDate as string].filter(
          (task: Task) => task._id !== id,
        );
        return updatedTasks;
      });
      setIsModalOpen(false);
    } catch (error) {
      setErrMsg((error as Error).message);
    }
  }

  return { addTask, editTask, deleteTask };
}
