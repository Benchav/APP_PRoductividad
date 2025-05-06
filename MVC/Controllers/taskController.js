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
    // 1. Obtenemos la tarea actual
    const task = await tasksModel.getTaskById(taskId);

    // 2. Calculamos nuevos valores
    const newCompleted = !task.completed;
    const newStatus    = newCompleted ? 'Completada' : 'Pendiente';

    // 3. Montamos el payload completo
    const payload = {
      title:       task.title,
      description: task.description,
      dueDate:     task.due_date,   // camelCase; tasksModel lo convertirá a due_date
      status:      newStatus,
      priority:    task.priority,
      tags:        task.tags,
    };

    // 4. Llamamos a updateTask con el payload y el nuevo estado completed
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
    // 1) Obtenemos la tarea completa del backend
    const task = await tasksModel.getTaskById(taskId);
    // 2) Añadimos esa tarea al historial local
    await addDeletedTask(task);
    // 3) Eliminamos la tarea en el backend
    return await tasksModel.deleteTask(taskId);
  },
};

export default taskController;