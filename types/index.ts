export type Task = { _id: string; msg: string; date: string };
export type Tasks = Record<string, Task[]>;

export type Holiday = {
  date: string;
  name: string;
};

export type TaskToEdit = {
  task: Task;
  index: number;
};

export type TasksObject = {
  [key: string]: Task[];
};
