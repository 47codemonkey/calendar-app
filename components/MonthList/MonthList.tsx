import { useMemo, JSX } from 'react';
import CalendarCell from '@/components/CalendarCell/CalendarCell';
import { Tasks, Holiday, TaskToEdit } from '@/types/index';

type MonthListProps = {
  month: number;
  year: number;
  holidays: Holiday[];
  tasks: Tasks;
  currentYear: number;
  searchTerm: string;
  setTasks: React.Dispatch<React.SetStateAction<Tasks>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
  setTaskToEdit: React.Dispatch<React.SetStateAction<TaskToEdit | null>>;
};

export default function MonthList({
  month,
  year,
  holidays,
  tasks,
  currentYear,
  searchTerm,
  setTasks,
  setSelectedDate,
  setIsModalOpen,
  setNewTask,
  setTaskToEdit,
}: MonthListProps) {
  const firstDay = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const previousMonthDays = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const totalCells = useMemo(() => (firstDay + daysInMonth <= 35 ? 35 : 42), [firstDay, daysInMonth]);

  const currentMonthHolidays = useMemo(() => {
    return holidays.filter((holiday) => {
      const [holidayYear, holidayMonth] = holiday.date.split('-').map(Number);
      return holidayMonth === month + 1 && holidayYear === currentYear;
    });
  }, [holidays, month, currentYear]);

  const currentDateFormatted = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }, []);

  const daysArray = useMemo(() => {
    const array: JSX.Element[] = [];

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

      array.push(
        <CalendarCell
          key={i}
          day={day}
          formattedDate={formattedDate}
          isPrevMonth={isPrevMonth}
          isNextMonth={isNextMonth}
          isCurrentDay={isCurrentDay}
          holiday={holiday}
          tasks={currentTasks}
          searchTerm={searchTerm}
          isActiveDay={isActiveDay}
          setTasks={setTasks}
          setSelectedDate={setSelectedDate}
          setIsModalOpen={setIsModalOpen}
          setNewTask={setNewTask}
          setTaskToEdit={setTaskToEdit}
        />,
      );
    }

    return array;
  }, [
    firstDay,
    daysInMonth,
    previousMonthDays,
    totalCells,
    currentMonthHolidays,
    tasks,
    currentDateFormatted,
    month,
    year,
    searchTerm,
    setTasks,
    setSelectedDate,
    setIsModalOpen,
    setNewTask,
    setTaskToEdit,
  ]);

  return daysArray;
}
