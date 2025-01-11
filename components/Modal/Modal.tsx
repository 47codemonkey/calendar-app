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
        <h3>{taskToEdit ? `Edit Task for ${selectedDate}` : `Add Task for ${selectedDate}`}</h3>
        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        <StyledModalActions>
          <button onClick={taskToEdit ? () => editTask(taskToEdit.task._id, newTask) : addTask}>
            {taskToEdit ? 'Save Changes' : 'Add Task'}
          </button>
          {taskToEdit && <button onClick={() => deleteTask(taskToEdit.task._id)}>Delete Task</button>}
          <button onClick={() => setIsModalOpen(false)}>Close</button>
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
`;

const StyledModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  min-width: 300px;
`;

const StyledModalActions = styled.div`
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
