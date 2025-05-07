// Controllers/taskController.js
import tasksModel from '../Models/taskModel';
import { addDeletedTask } from '../../Components/deletedTasksStore';

const taskController = {
  /**
   * Obtiene todas las tareas.
   * @returns {Promise<Array>}
   */
  getTasks: async () => {
    return await tasksModel.getAllTasks();
  },

  /**
   * Obtiene las tareas de un usuario.
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  getTasksByUserId: async (userId) => {
    return await tasksModel.getTasksByUser(userId);
  },

  /**
   * Obtiene una tarea por ID.
   * @param {string} taskId
   * @returns {Promise<Object>}
   */
  getTaskById: async (taskId) => {
    return await tasksModel.getTaskById(taskId);
  },

  /**
   * Crea una nueva tarea.
   * @param {{ title, description, dueDate, status, priority, tags }} taskData
   * @returns {Promise<Object>}
   */
  createTask: async (taskData) => {
    return await tasksModel.createTask(taskData);
  },

  /**
   * Actualiza una tarea existente.
   * @param {string} taskId
   * @param {{ title?, description?, dueDate?, status?, priority?, tags? }} fields
   * @returns {Promise<Object>}
   */
  updateTask: async (taskId, fields) => {
    return await tasksModel.updateTask(taskId, fields);
  },

  /**
   * Alterna el estado completado de una tarea enviando
   * el objeto completo que el backend espera.
   * @param {string} taskId
   * @returns {Promise<Object>}
   */
  toggleTask: async (taskId) => {
    const task = await tasksModel.getTaskById(taskId);
    const newCompleted = !task.completed;
    const newStatus    = newCompleted ? 'Completada' : 'Pendiente';

    const payload = {
      title:       task.title,
      description: task.description,
      dueDate:     task.due_date,
      status:      newStatus,
      priority:    task.priority,
      tags:        task.tags,
    };

    return await tasksModel.updateTask(taskId, {
      ...payload,
      completed: newCompleted,
    });
  },

  /**
   * Elimina una tarea por ID.
   * Antes guarda un registro en el historial de eliminadas.
   * @param {string} taskId
   * @returns {Promise<Object>}
   */
  deleteTask: async (taskId) => {
    const task = await tasksModel.getTaskById(taskId);
    await addDeletedTask(task);
    return await tasksModel.deleteTask(taskId);
  },
};

export default taskController;