// models/tasksModel.js
import api from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tasksModel = {
  /** Obtiene todas las tareas. */
  getAllTasks: async () => {
    try {
      const res = await api.get('/tasks');
      return res.data;
    } catch (err) {
      console.error('Error al obtener tareas:', err.message);
      throw err;
    }
  },

  /** Obtiene tareas de un usuario. */
  getTasksByUser: async (userId) => {
    try {
      const res = await api.get(`/tasks/user/${userId}`);
      return res.data;
    } catch (err) {
      console.error(`Error al obtener tareas de usuario ${userId}:`, err.message);
      throw err;
    }
  },

  /** Obtiene una tarea por ID. */
  getTaskById: async (taskId) => {
    try {
      const res = await api.get(`/tasks/${taskId}`);
      return res.data;
    } catch (err) {
      console.error(`Error al obtener tarea ${taskId}:`, err.message);
      throw err;
    }
  },

  /** Crea una nueva tarea. */
  createTask: async ({
    title,
    description = '',
    due_date,
    status = 'Pendiente',
    priority = 'Media',
    tags = [],
    steps = [],
    justification = ''
  }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuario no autenticado');

      const payload = {
        title,
        description,
        due_date,
        completed: status === 'Completada',
        user_id: userId,
        status,
        priority,
        tags,
        steps,
        justification
      };

      const res = await api.post('/tasks', payload);
      return res.data;
    } catch (err) {
      console.error('Error al crear tarea:', err.message);
      throw err;
    }
  },

  /** Actualiza una tarea existente. */
  updateTask: async (taskId, {
    title,
    description,
    due_date,
    status,
    priority,
    tags,
    steps,
    justification
  }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuario no autenticado');

      const payload = {
        ...(title         !== undefined && { title }),
        ...(description   !== undefined && { description }),
        ...(due_date      !== undefined && { due_date }),
        ...(status        !== undefined && { status }),
        ...(priority      !== undefined && { priority }),
        ...(tags          !== undefined && { tags }),
        ...(steps         !== undefined && { steps }),
        ...(justification !== undefined && { justification }),
        completed: status === 'Completada',
        user_id: userId
      };

      const res = await api.put(`/tasks/${taskId}`, payload);
      return res.data;
    } catch (err) {
      console.error(`Error al actualizar tarea ${taskId}:`, err.message);
      throw err;
    }
  },

  /** Elimina una tarea. */
  deleteTask: async (taskId) => {
    try {
      const res = await api.delete(`/tasks/${taskId}`);
      return res.data;
    } catch (err) {
      console.error(`Error al eliminar tarea ${taskId}:`, err.message);
      throw err;
    }
  }
};

export default tasksModel;