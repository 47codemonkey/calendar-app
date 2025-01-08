import { Schema, models, model, Document } from 'mongoose';

interface ITask extends Document {
  msg: string;
  date: string;
}

const taskSchema = new Schema<ITask>(
  {
    msg: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const TaskModel = models.task || model<ITask>('task', taskSchema);

export default TaskModel;
