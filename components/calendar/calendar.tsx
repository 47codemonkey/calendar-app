'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function Calendar() {
  const [tasks, setTasks] = useState<any>({});
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState<any[]>([]);

  const year = currentYear;

  useEffect(() => {
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/UA`)
      .then((res) => res.json())
      .then((data) => {
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

  const handleTaskAdd = (date: any) => {
    const task = prompt('Enter task:');
    if (task) {
      setTasks((prevTasks: any) => ({
        ...prevTasks,
        [date]: [...(prevTasks[date] || []), task],
      }));
    }
  };

  const renderMonth = (month: number) => {
    const firstDay = getFirstDayOfMonth(month);
    const daysInMonth = getDaysInMonth(month);
    const previousMonthDays = getDaysInMonth(month - 1);
    const totalCells = firstDay + daysInMonth <= 35 ? 35 : 42;

    const daysArray = [];

    const currentMonthHolidays = holidays.filter((holiday) => {
      const [year, m, day] = holiday.date.split('-');
      return parseInt(m) === month + 1 && parseInt(year) === currentYear;
    });

    for (let i = 0; i < totalCells; i += 1) {
      const isPrevMonth = i < firstDay;
      const isNextMonth = i >= firstDay + daysInMonth;
      let day =
        i < firstDay
          ? previousMonthDays - firstDay + i + 1
          : i < firstDay + daysInMonth
          ? i - firstDay + 1
          : i - (firstDay + daysInMonth) + 1;

      const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      const holiday = currentMonthHolidays.find((h) => h.date === formattedDate);

      daysArray.push(
        <CalendarCell
          key={i}
          $isPrevMonth={isPrevMonth}
          $isNextMonth={isNextMonth}
          onClick={() => handleTaskAdd(formattedDate)}
        >
          <CalendarDay>{day}</CalendarDay>

          {!isPrevMonth && !isNextMonth && holiday && <Tasks>{holiday.name}</Tasks>}

          <Tasks>{tasks[formattedDate]?.join(', ')}</Tasks>
        </CalendarCell>,
      );
    }

    return daysArray;
  };

  const handleNextMonth = () => currentMonth < 11 && setCurrentMonth((prev) => prev + 1);
  const handlePreviousMonth = () => currentMonth > 0 && setCurrentMonth((prev) => prev - 1);

  const handleNextYear = () => setCurrentYear((prevYear) => prevYear + 1);
  const handlePreviousYear = () => setCurrentYear((prevYear) => prevYear - 1);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarButton onClick={handlePreviousMonth} disabled={currentMonth === 0}>
          Previous Month
        </CalendarButton>
        <h2>
          {new Date(year, currentMonth).toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <CalendarButton onClick={handleNextMonth} disabled={currentMonth === 11}>
          Next Month
        </CalendarButton>
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
    </CalendarContainer>
  );
}

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

const CalendarCell = styled.div<{ $isPrevMonth: boolean; $isNextMonth: boolean }>`
  position: relative;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  text-align: center;
  color: ${({ $isPrevMonth, $isNextMonth }) => ($isPrevMonth || $isNextMonth ? '#aaa' : 'inherit')};

  &:hover {
    background-color: #e0e0e0;
  }
`;

const CalendarDay = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Holiday = styled.div`
  font-size: 12px;
  color: red;
  font-weight: 600;
  margin-top: 5px;
`;

const Tasks = styled.div`
  font-size: 14px;
  color: #666;
`;

const YearNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px; /* Отступ сверху */
`;
