import { Schema, models, model } from 'mongoose';

const taskSchema = new Schema(
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

const TaskModel = models.task || model('task', taskSchema);

export default TaskModel;
