// models/tasksModel.js
import api from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tasksModel = {
  /**
   * Obtiene todas las tareas (sin filtrar).
   * @returns {Promise<Array>}
   */
  getAllTasks: async () => {
    try {
      const res = await api.get('/tasks');
      return res.data;
    } catch (err) {
      console.error('Error al obtener tareas:', err.message);
      throw err;
    }
  },

  /**
   * Obtiene las tareas de un usuario.
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  getTasksByUser: async (userId) => {
    try {
      const res = await api.get(`/tasks/user/${userId}`);
      return res.data;
    } catch (err) {
      console.error(`Error al obtener tareas de usuario ${userId}:`, err.message);
      throw err;
    }
  },

  /**
   * Obtiene una tarea por su ID.
   * @param {string} taskId
   * @returns {Promise<Object>}
   */
  getTaskById: async (taskId) => {
    try {
      const res = await api.get(`/tasks/${taskId}`);
      return res.data;
    } catch (err) {
      console.error(`Error al obtener tarea ${taskId}:`, err.message);
      throw err;
    }
  },

  /**
   * Crea una nueva tarea.
   * @param {{ title, description?, dueDate, status?, priority?, tags? }} fields
   */
  createTask: async ({
    title,
    description = '',
    dueDate,
    status = 'Pendiente',
    priority = 'Media',
    tags = [],
  }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuario no autenticado');

      const payload = {
        title,
        description,
        due_date: dueDate,
        completed: status === 'Completada',
        user_id: userId,
        status,
        priority,
        tags,
      };

      const res = await api.post('/tasks', payload);
      return res.data;
    } catch (err) {
      console.error('Error al crear tarea:', err.message);
      throw err;
    }
  },

  /**
   * Actualiza una tarea existente.
   * @param {string} taskId
   * @param {{ title?, description?, dueDate?, status?, priority?, tags? }} fields
   */
  updateTask: async (taskId, {
    title,
    description,
    dueDate,
    status,
    priority,
    tags,
  }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuario no autenticado');

      const payload = {
        ...(title       !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate     !== undefined && { due_date: dueDate }),
        ...(status      !== undefined && { status }),
        ...(priority    !== undefined && { priority }),
        ...(tags        !== undefined && { tags }),
        completed: status === 'Completada',
        user_id: userId,
      };

      const res = await api.put(`/tasks/${taskId}`, payload);
      return res.data;
    } catch (err) {
      console.error(`Error al actualizar tarea ${taskId}:`, err.message);
      throw err;
    }
  },

  /**
   * Elimina una tarea por su ID.
   * @param {string} taskId
   */
  deleteTask: async (taskId) => {
    try {
      const res = await api.delete(`/tasks/${taskId}`);
      return res.data;
    } catch (err) {
      console.error(`Error al eliminar tarea ${taskId}:`, err.message);
      throw err;
    }
  },
};

export default tasksModel;