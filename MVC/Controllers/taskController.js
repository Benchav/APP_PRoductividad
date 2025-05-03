// Controllers/taskController.js
import tasksModel from '../Models/taskModel';

const getTasks = () => {
  return tasksModel.getAllTasks();
};

const addTask = (taskData) => {
  // taskData es un objeto { title, description, priority, status, dueDate, tags }
  return tasksModel.addNewTask(taskData);
};

const toggleTask = (id) => {
  return tasksModel.toggleTask(id);
};

const deleteTask = (id) => {
  return tasksModel.deleteTask(id);
};

export default {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
};