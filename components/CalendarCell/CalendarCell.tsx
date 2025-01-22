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

  const filteredTasks = tasks.filter((task) => task.msg.toLowerCase().includes(searchTerm.toLowerCase()));
  const taskCount = filteredTasks.length;

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
      <StyledCalendarDayContainer>
        <StyledCalendarDay $isCurrentDay={isCurrentDay}>{day}</StyledCalendarDay>
        {taskCount > 0 && (
          <StyledTaskCount>
            {taskCount} {taskCount > 1 ? 'cards' : 'card'}
          </StyledTaskCount>
        )}
      </StyledCalendarDayContainer>
      {!isPrevMonth && !isNextMonth && (
        <StyledTaskCardContainer>
          {holiday && <StyledHoliday>{holiday.name}</StyledHoliday>}
          {filteredTasks.map((task, idx) => (
            <StyledTaskCard
              key={idx}
              draggable={isActiveDay}
              onDragStart={(e) => isActiveDay && handleDragStart(e, task)}
              onClick={(e) => isActiveDay && handleTaskCardClick(e, task, idx)}
            >
              {task.msg}
            </StyledTaskCard>
          ))}
        </StyledTaskCardContainer>
      )}
    </StyledCalendarCell>
  );
}

const StyledCalendarDayContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledTaskCount = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: grey;
`;

const StyledCalendarCell = styled.div<{ $isPrevMonth?: boolean; $isNextMonth?: boolean; $isCurrentDay: boolean }>`
  background-color: ${({ $isPrevMonth, $isNextMonth }) => ($isPrevMonth || $isNextMonth ? '#f9f9f9' : 'white')};
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: flex-start;
  border: ${({ $isPrevMonth, $isNextMonth, $isCurrentDay }) =>
    $isPrevMonth || $isNextMonth ? 'none' : $isCurrentDay ? '2px solid #FF0000' : '1px solid #222222'};
`;

const StyledCalendarDay = styled.div<{ $isCurrentDay: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ $isCurrentDay }) => ($isCurrentDay ? '#FF0000' : '#333')};
`;

const StyledHoliday = styled.div`
  font-size: 12px;
  font-weight: 600;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
`;

const StyledTaskCard = styled.div`
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  overflow-wrap: break-word;
  max-width: 100%;
  border: 1px solid transparent;
  background-color: rgb(221, 221, 221);
`;

const StyledTaskCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
