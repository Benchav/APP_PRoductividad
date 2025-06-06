// Controllers/taskController.js
import tasksModel from '../Models/taskModel';
import { addDeletedTask } from '../../Components/deletedTasksStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const taskController = {
  /** Obtiene todas las tareas. */
  getTasks: async () => {
    return await tasksModel.getAllTasks();
  },

  /** Obtiene tareas de un usuario. */
  getTasksByUserId: async (userId) => {
    return await tasksModel.getTasksByUser(userId);
  },

  /** Obtiene una tarea por ID. */
  getTaskById: async (taskId) => {
    return await tasksModel.getTaskById(taskId);
  },

  /** Crea una nueva tarea. */
  createTask: async (taskData) => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('Usuario no autenticado');

    const payload = {
      title:         taskData.title,
      description:   taskData.description || '',
      due_date:      taskData.due_date || taskData.dueDate,
      completed:     taskData.completed || false,
      user_id:       userId,
      status:        taskData.status,
      priority:      taskData.priority,
      tags:          taskData.tags || [],
      steps:         taskData.steps || [],
      justification: taskData.justification || ''
    };

    return await tasksModel.createTask(payload);
  },

  /** Actualiza una tarea existente. */
  updateTask: async (taskId, fields) => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('Usuario no autenticado');

    const payload = {
      ...(fields.title         !== undefined && { title: fields.title }),
      ...(fields.description   !== undefined && { description: fields.description }),
      ...(fields.due_date      !== undefined && { due_date: fields.due_date }),
      ...(fields.dueDate       !== undefined && { due_date: fields.dueDate }),
      ...(fields.status        !== undefined && { status: fields.status }),
      ...(fields.priority      !== undefined && { priority: fields.priority }),
      ...(fields.tags          !== undefined && { tags: fields.tags }),
      ...(fields.steps         !== undefined && { steps: fields.steps }),
      ...(fields.justification !== undefined && { justification: fields.justification }),
      completed: fields.completed !== undefined ? fields.completed : undefined,
      user_id:   userId
    };

    return await tasksModel.updateTask(taskId, payload);
  },

  /** Alterna el estado "completado". */
  toggleTask: async (taskId) => {
    const task = await tasksModel.getTaskById(taskId);
    const newCompleted = !task.completed;
    const newStatus    = newCompleted ? 'Completada' : 'Pendiente';

    const updateFields = {
      status:        newStatus,
      completed:     newCompleted,
      due_date:      task.due_date,
      title:         task.title,
      description:   task.description,
      priority:      task.priority,
      tags:          task.tags,
      steps:         task.steps,
      justification: task.justification
    };

    return await tasksModel.updateTask(taskId, updateFields);
  },

  /** Elimina una tarea y guarda historial. */
  deleteTask: async (taskId) => {
    const task = await tasksModel.getTaskById(taskId);
    await addDeletedTask(task);
    return await tasksModel.deleteTask(taskId);
  }
};

export default taskController;