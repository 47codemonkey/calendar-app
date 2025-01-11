import useModal from '@/components/Modal/useModal';

import { Tasks, TaskToEdit } from '@/types/index';

import styled from 'styled-components';

type ModalProps = {
  newTask: string;
  taskToEdit: TaskToEdit | null;
  selectedDate: string | null;
  setTasks: React.Dispatch<React.SetStateAction<Tasks>>;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  setTaskToEdit: React.Dispatch<React.SetStateAction<TaskToEdit | null>>;
};

export default function Modal({
  newTask,
  selectedDate,
  taskToEdit,
  setTasks,
  setNewTask,
  setIsModalOpen,
  setErrMsg,
  setTaskToEdit,
}: ModalProps) {
  const { addTask, editTask, deleteTask } = useModal({
    newTask,
    taskToEdit,
    selectedDate,
    setTasks,
    setNewTask,
    setIsModalOpen,
    setErrMsg,
    setTaskToEdit,
  });

  return (
    <StyledModal>
      <StyledModalContent>
        <StyledHeading>{taskToEdit ? `Edit task for ${selectedDate}` : `Add task for ${selectedDate}`}</StyledHeading>
        <StyledInput value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        <StyledModalActions>
          <StyledButton onClick={taskToEdit ? () => editTask(taskToEdit.task._id, newTask) : addTask}>
            {taskToEdit ? 'Save changes' : 'Add task'}
          </StyledButton>
          {taskToEdit && (
            <StyledButtonDelete onClick={() => deleteTask(taskToEdit.task._id)}>Delete Task</StyledButtonDelete>
          )}
          <StyledButtonClose onClick={() => setIsModalOpen(false)}>Close</StyledButtonClose>
        </StyledModalActions>
      </StyledModalContent>
    </StyledModal>
  );
}

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  min-width: 350px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: rgb(244, 244, 249);
`;

const StyledHeading = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const StyledModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const StyledButton = styled.div`
  padding: 12px 20px;
  background-color: rgb(76, 175, 80);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-align: center;
  display: inline-block;

  &:hover {
    background-color: rgb(69, 160, 73);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus {
    outline: none;
  }
`;

const StyledButtonDelete = styled(StyledButton)`
  background-color: rgb(229, 57, 53);
  &:hover {
    background-color: rgb(211, 47, 47);
  }
`;

const StyledButtonClose = styled(StyledButton)`
  background-color: rgb(85, 85, 85);
  &:hover {
    background-color: rgb(51, 51, 51);
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-top: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: rgb(249, 249, 249);

  &:focus {
    outline: none;
  }
`;
