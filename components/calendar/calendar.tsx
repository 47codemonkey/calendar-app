'use client';

import { useState, useEffect, JSX } from 'react';
import styled from 'styled-components';

type Task = { _id: string; msg: string; date: string };
type Tasks = Record<string, Task[]>;

interface Holiday {
  date: string;
  name: string;
}

interface TaskToEdit {
  task: Task;
  index: number;
}

type TasksObject = {
  [key: string]: Task[];
};

export default function Calendar() {
  const [tasks, setTasks] = useState<Tasks>({});
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>('');
  const [taskToEdit, setTaskToEdit] = useState<TaskToEdit | null>(null);
  const [errMsg, setErrMsg] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const year = currentYear;

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/UA`)
      .then((res) => res.json())
      .then((data: Holiday[]) => {
        setHolidays(
          data.map((holiday) => {
            const date = new Date(holiday.date);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
              .getDate()
              .toString()
              .padStart(2, '0')}`;
            return {
              date: formattedDate,
              name: holiday.name,
            };
          }),
        );
      });
  }, [year]);

  const getDaysInMonth = (month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number) => new Date(year, month, 1).getDay();

  const handleDragStart = (e: React.DragEvent, date: string, task: Task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ date, task }));
  };

  const handleDrop = async (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();

    const { date, task } = JSON.parse(e.dataTransfer.getData('text/plain'));

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

      if (!updatedTasks[targetDate].some((t) => t._id === task._id)) {
        updatedTasks[targetDate].push({ ...task, date: targetDate });
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderMonth = (month: number) => {
    const firstDay = getFirstDayOfMonth(month);
    const daysInMonth = getDaysInMonth(month);
    const previousMonthDays = getDaysInMonth(month - 1);
    const totalCells = firstDay + daysInMonth <= 35 ? 35 : 42;

    const daysArray: JSX.Element[] = [];

    const currentMonthHolidays = holidays.filter((holiday) => {
      const [year, m] = holiday.date.split('-');
      return parseInt(m) === month + 1 && parseInt(year) === currentYear;
    });

    const today = new Date();
    const currentDateFormatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    for (let i = 0; i < totalCells; i += 1) {
      const isPrevMonth = i < firstDay;
      const isNextMonth = i >= firstDay + daysInMonth;
      const day =
        i < firstDay
          ? previousMonthDays - firstDay + i + 1
          : i < firstDay + daysInMonth
          ? i - firstDay + 1
          : i - (firstDay + daysInMonth) + 1;

      const displayMonth = isPrevMonth ? month - 1 : isNextMonth ? month + 1 : month;
      const formattedDate = `${year}-${(displayMonth + 1).toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      const holiday = currentMonthHolidays.find((h) => h.date === formattedDate);
      const currentTasks = tasks[formattedDate] || [];

      const isCurrentDay = formattedDate === currentDateFormatted;
      const isActiveDay = !isPrevMonth && !isNextMonth;

      daysArray.push(
        <CalendarCell
          key={i}
          $isPrevMonth={isPrevMonth}
          $isNextMonth={isNextMonth}
          $isCurrentDay={isCurrentDay}
          onClick={() => isActiveDay && handleCellClick(formattedDate)}
          onDragOver={(e) => isActiveDay && handleDragOver(e)}
          onDrop={(e) => isActiveDay && handleDrop(e, formattedDate)}
          style={{ cursor: isActiveDay ? 'pointer' : 'not-allowed' }}
        >
          <CalendarDay $isCurrentDay={isCurrentDay}>{day}</CalendarDay>
          {!isPrevMonth && !isNextMonth && (
            <>
              {holiday && <Tasks>{holiday.name}</Tasks>}
              {currentTasks
                .filter((task) => task.msg.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((task, idx) => (
                  <TaskCard
                    key={idx}
                    draggable={isActiveDay}
                    onDragStart={(e) => isActiveDay && handleDragStart(e, formattedDate, task)}
                    onClick={(e) => isActiveDay && handleTaskCardClick(e, formattedDate, task, idx)}
                  >
                    {task.msg}
                  </TaskCard>
                ))}
            </>
          )}
        </CalendarCell>,
      );
    }

    return daysArray;
  };

  const handleCellClick = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
    setNewTask('');
    setTaskToEdit(null);
  };

  const handleTaskCardClick = (e: React.MouseEvent, date: string, task: Task, index: number) => {
    e.stopPropagation();
    setSelectedDate(date);
    setIsModalOpen(true);
    setNewTask(task.msg);
    setTaskToEdit({ task, index });
  };

  async function fetchTasks() {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const tasksArray = await response.json();

      const tasksObject = tasksArray.reduce((acc: TasksObject, task: Task) => {
        const date = task.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(task);
        return acc;
      }, {});

      setTasks(tasksObject);
    } catch (error) {
      setErrMsg((error as Error).message);
    }
  }

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

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const nextMonth = (prev + 1) % 12;
      return nextMonth;
    });
    setCurrentYear((prevYear) => {
      if (currentMonth === 11) {
        return prevYear + 1;
      }
      return prevYear;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const prevMonth = (prev - 1 + 12) % 12;
      return prevMonth;
    });
    setCurrentYear((prevYear) => {
      if (currentMonth === 0) {
        return prevYear - 1;
      }
      return prevYear;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePreviousYear = () => setCurrentYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setCurrentYear((prevYear) => prevYear + 1);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarButton onClick={handlePreviousMonth}>Previous Month</CalendarButton>
        <h2>
          {new Date(year, currentMonth).toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <CalendarButton onClick={handleNextMonth}>Next Month</CalendarButton>
      </CalendarHeader>
      <YearNavigation>
        <CalendarButton onClick={handlePreviousYear}>Prev Year</CalendarButton>
        <CalendarButton onClick={handleNextYear}>Next Year</CalendarButton>
      </YearNavigation>
      <Weekdays>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <Weekday key={index}>{day}</Weekday>
        ))}
      </Weekdays>
      <CalendarGrid>{renderMonth(currentMonth)}</CalendarGrid>
      <SearchInput type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search tasks" />
      {isModalOpen && selectedDate && (
        <Modal>
          <ModalContent>
            <h3>{taskToEdit ? `Edit Task for ${selectedDate}` : `Add Task for ${selectedDate}`}</h3>
            <input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
            <ModalActions>
              <button onClick={taskToEdit ? () => editTask(taskToEdit.task._id, newTask) : addTask}>
                {taskToEdit ? 'Save Changes' : 'Add Task'}
              </button>
              {taskToEdit && <button onClick={() => deleteTask(taskToEdit.task._id)}>Delete Task</button>}
              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
      {errMsg && <ErrorMessage>{errMsg}</ErrorMessage>}
    </CalendarContainer>
  );
}

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
`;

const SearchInput = styled.input`
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const CalendarContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f4f9;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h2 {
    font-size: 24px;
    font-weight: 600;
    text-transform: capitalize;
  }
`;

const CalendarButton = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }
`;

const YearNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 10px;
`;

const Weekday = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #777;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-auto-rows: minmax(calc((100vh - 30px) / 7), auto);
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const CalendarCell = styled.div<{ $isPrevMonth?: boolean; $isNextMonth?: boolean; $isCurrentDay: boolean }>`
  background-color: ${({ $isPrevMonth, $isNextMonth }) => ($isPrevMonth || $isNextMonth ? '#ddd' : 'white')};
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border: ${({ $isCurrentDay }) => ($isCurrentDay ? '2px solid red' : 'none')};
`;

const CalendarDay = styled.div<{ $isCurrentDay: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ $isCurrentDay }) => ($isCurrentDay ? 'red' : '#333')};
  margin-bottom: 10px;
`;

const Tasks = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #333;
  background-color: #eef;
  padding: 5px;
  border-radius: 5px;
  margin-top: 5px;
  text-align: center;
`;

const TaskCard = styled.div`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 5px;
  cursor: pointer;
  text-align: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  min-width: 300px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  button {
    padding: 10px 15px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;
