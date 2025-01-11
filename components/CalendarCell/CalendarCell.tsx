import useCalendarCell from '@/components/CalendarCell/useCalendarCell';

import { Task, Tasks, Holiday, TaskToEdit } from '@/types/index';

import styled from 'styled-components';

type CalendarCellProps = {
  day: number;
  formattedDate: string;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  isCurrentDay: boolean;
  holiday: Holiday | undefined;
  tasks: Task[];
  searchTerm: string;
  isActiveDay: boolean;
  setTasks: React.Dispatch<React.SetStateAction<Tasks>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
  setTaskToEdit: React.Dispatch<React.SetStateAction<TaskToEdit | null>>;
};

export default function CalendarCell({
  day,
  formattedDate,
  isPrevMonth,
  isNextMonth,
  isCurrentDay,
  holiday,
  tasks,
  searchTerm,
  isActiveDay,
  setTasks,
  setSelectedDate,
  setIsModalOpen,
  setNewTask,
  setTaskToEdit,
}: CalendarCellProps) {
  const { handleCellClick, handleDrop, handleDragOver, handleDragStart, handleTaskCardClick } = useCalendarCell({
    setTasks,
    setSelectedDate,
    setIsModalOpen,
    setNewTask,
    setTaskToEdit,
    formattedDate,
  });

  return (
    <StyledCalendarCell
      $isPrevMonth={isPrevMonth}
      $isNextMonth={isNextMonth}
      $isCurrentDay={isCurrentDay}
      onClick={isActiveDay ? handleCellClick : undefined}
      onDragOver={isActiveDay ? handleDragOver : undefined}
      onDrop={isActiveDay ? (e) => handleDrop(e, formattedDate) : undefined}
      style={{ cursor: isActiveDay ? 'pointer' : 'not-allowed' }}
    >
      <StyledCalendarDay $isCurrentDay={isCurrentDay}>{day}</StyledCalendarDay>
      {!isPrevMonth && !isNextMonth && (
        <>
          {holiday && <StyledTasks>{holiday.name}</StyledTasks>}
          {tasks
            .filter((task) => task.msg.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((task, idx) => (
              <StyledTaskCard
                key={idx}
                draggable={isActiveDay}
                onDragStart={(e) => isActiveDay && handleDragStart(e, task)}
                onClick={(e) => isActiveDay && handleTaskCardClick(e, task, idx)}
              >
                {task.msg}
              </StyledTaskCard>
            ))}
        </>
      )}
    </StyledCalendarCell>
  );
}

const StyledCalendarCell = styled.div<{ $isPrevMonth?: boolean; $isNextMonth?: boolean; $isCurrentDay: boolean }>`
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

const StyledCalendarDay = styled.div<{ $isCurrentDay: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ $isCurrentDay }) => ($isCurrentDay ? 'red' : '#333')};
  margin-bottom: 10px;
`;

const StyledTasks = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #333;
  background-color: #eef;
  padding: 5px;
  border-radius: 5px;
  margin-top: 5px;
  text-align: center;
`;

const StyledTaskCard = styled.div`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 5px;
  cursor: pointer;
  text-align: center;
`;
