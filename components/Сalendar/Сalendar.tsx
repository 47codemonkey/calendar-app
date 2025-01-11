'use client';

import { useState, useEffect } from 'react';

import Navigation from '@/components/Navigation/Navigation';
import MonthList from '@/components/MonthList/MonthList';
import Search from '@/components/Search/Search';
import Modal from '@/components/Modal/Modal';

import { holidaysApi } from '@/api/holidaysApi';

import { Task, Tasks, Holiday, TaskToEdit, TasksObject } from '@/types/index';

import styled from 'styled-components';

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
    fetchTasks();
  }, []);

  useEffect(() => {
    fetch(`${holidaysApi}${year}/UA`)
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

  return (
    <StyledCalendarContainer>
      <StyledCalendarHeader>
        <Navigation
          year={year}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
      </StyledCalendarHeader>
      <StyledSearchContainer>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </StyledSearchContainer>
      <StyledWeekdays>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <StyledWeekday key={index}>{day}</StyledWeekday>
        ))}
      </StyledWeekdays>
      <StyledMonthContainer>
        <MonthList
          month={currentMonth}
          year={year}
          currentYear={currentYear}
          holidays={holidays}
          tasks={tasks}
          searchTerm={searchTerm}
          setTasks={setTasks}
          setSelectedDate={setSelectedDate}
          setIsModalOpen={setIsModalOpen}
          setNewTask={setNewTask}
          setTaskToEdit={setTaskToEdit}
        />
      </StyledMonthContainer>
      {isModalOpen && selectedDate && (
        <Modal
          newTask={newTask}
          selectedDate={selectedDate}
          setTasks={setTasks}
          setNewTask={setNewTask}
          setIsModalOpen={setIsModalOpen}
          setErrMsg={setErrMsg}
          setTaskToEdit={setTaskToEdit}
          taskToEdit={taskToEdit}
        />
      )}
      {errMsg && <StyledErrorMessage>{errMsg}</StyledErrorMessage>}
    </StyledCalendarContainer>
  );
}

const StyledErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
`;

const StyledCalendarContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-color: rgb(244, 244, 249);
`;

const StyledWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 10px;
`;

const StyledWeekday = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgb(119, 119, 119);
  text-align: center;
`;

const StyledMonthContainer = styled.div`
  display: grid;
  grid-auto-rows: minmax(calc((100vh - 30px) / 7), auto);
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const StyledSearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const StyledCalendarHeader = styled.div``;
