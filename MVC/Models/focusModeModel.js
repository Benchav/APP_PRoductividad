// models/focusModeModel.js
import api from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const focusModeModel = {
  /**
   * Registra un nuevo FocusTime para una tarea
   * @param {string} taskId 
   * @param {number} minutes 
   * @returns {Promise<Object>}
   */
  createFocusTime: async (taskId, minutes) => {
    try {
      // Si en el futuro necesitas userId, puedes usar AsyncStorage:
      // const userId = await AsyncStorage.getItem('userId');
      const payload = { task_id: taskId, minutes };
      // Nota el prefijo '/api'
      const res = await api.post('/focus-times', payload);
      return res.data;
    } catch (error) {
      console.error('Error al crear FocusTime:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Obtiene todos los registros de FocusTime asociados a una tarea
   * @param {string} taskId 
   * @returns {Promise<Array>}
   */
  getFocusTimesByTask: async (taskId) => {
    try {
      const res = await api.get(`/tasks/${taskId}/focus-times`);
      return res.data;
    } catch (error) {
      console.error(`Error al obtener FocusTimes de tarea ${taskId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Actualiza un registro de FocusTime existente
   * @param {string} focusId 
   * @param {number} minutes 
   * @returns {Promise<Object>}
   */
  updateFocusTime: async (focusId, minutes) => {
    try {
      const res = await api.put(`/focus-times/${focusId}`, { minutes });
      return res.data;
    } catch (error) {
      console.error(`Error al actualizar FocusTime ${focusId}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default focusModeModel;