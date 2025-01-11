import { Task, Tasks, TaskToEdit } from '@/types/index';

type useCalendarCellProps = {
  formattedDate: string;
  setTasks: React.Dispatch<React.SetStateAction<Tasks>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
  setTaskToEdit: React.Dispatch<React.SetStateAction<TaskToEdit | null>>;
};

export default function useCalendarCell({
  formattedDate,
  setTasks,
  setSelectedDate,
  setIsModalOpen,
  setNewTask,
  setTaskToEdit,
}: useCalendarCellProps) {
  const handleCellClick = () => {
    setSelectedDate(formattedDate);
    setIsModalOpen(true);
    setNewTask('');
    setTaskToEdit(null);
  };

  const handleTaskCardClick = (e: React.MouseEvent, task: Task, idx: number) => {
    e.stopPropagation();
    setSelectedDate(formattedDate);
    setIsModalOpen(true);
    setNewTask(task.msg);
    setTaskToEdit({ task, index: idx });
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ date: formattedDate, task }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();

    const { date, task } = JSON.parse(e.dataTransfer.getData('text/plain'));

    const cellHeight = e.currentTarget.clientHeight;
    const mouseY = e.clientY - e.currentTarget.getBoundingClientRect().top;

    const position = mouseY < cellHeight / 3 ? 'top' : mouseY > (2 * cellHeight) / 3 ? 'bottom' : 'center';

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };

      if (updatedTasks[date]) {
        updatedTasks[date] = updatedTasks[date].filter((t) => t._id !== task._id);
        if (updatedTasks[date].length === 0) {
          delete updatedTasks[date];
        }
      }

      if (!updatedTasks[targetDate]) {
        updatedTasks[targetDate] = [];
      }

      if (updatedTasks[targetDate].some((t) => t._id === task._id)) {
        return updatedTasks;
      }

      if (position === 'top') {
        updatedTasks[targetDate].unshift({ ...task, date: targetDate });
      } else if (position === 'bottom') {
        updatedTasks[targetDate].push({ ...task, date: targetDate });
      } else {
        const index = Math.floor(updatedTasks[targetDate].length / 2);
        updatedTasks[targetDate].splice(index, 0, { ...task, date: targetDate });
      }

      return updatedTasks;
    });

    try {
      const response = await fetch(`/api/tasks?id=${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate }),
      });

      if (!response.ok) throw new Error('Failed to update task date on backend');
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return { handleCellClick, handleDrop, handleDragOver, handleDragStart, handleTaskCardClick };
}
