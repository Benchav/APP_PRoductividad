import tasksModel from "../Models/taskModel";

const tasksController = {
  getTasks: () => {
    return tasksModel.getAllTasks();
  },
  toggleTaskCompletion: (id) => {
    return tasksModel.toggleTask(id);
  },
  addTask: (title) => {
    return tasksModel.addNewTask(title);
  },
};

export default tasksController;
