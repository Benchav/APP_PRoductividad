// models/focusModeModel.js
import api from '../../config/api';

const focusModeModel = {
  alarmUrl: require('../../assets/alarm.mp3'),
  // Publica un nuevo registro de FocusTime en tu API
  createFocusTime: async (taskId, minutes) => {
    try {
      const payload = { task_id: taskId, minutes };
      // Log para depurar la URL final y el payload
      console.log('📡 POST a:', api.defaults.baseURL + '/focus-times', 'payload:', payload);
      const res = await api.post('/focus-times', payload);
      console.log('✅ createFocusTime:', res.status, res.data);
      return res.data;
    } catch (error) {
      console.error('❌ Error al crear FocusTime:', {
        url: api.defaults.baseURL + '/focus-times',
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Obtiene todos los FocusTimes asociados a una tarea específica
  getFocusTimesByTask: async (taskId) => {
    try {
      console.log('📡 GET a:', api.defaults.baseURL + `/tasks/${taskId}/focus-times`);
      const res = await api.get(`/tasks/${taskId}/focus-times`);
      console.log('✅ getFocusTimesByTask:', res.status, res.data);
      return res.data;
    } catch (error) {
      console.error(`❌ Error al obtener FocusTimes de tarea ${taskId}:`, {
        url: api.defaults.baseURL + `/tasks/${taskId}/focus-times`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Actualiza un registro de FocusTime existente
  updateFocusTime: async (focusId, minutes) => {
    try {
      console.log('📡 PUT a:', api.defaults.baseURL + `/focus-times/${focusId}`, 'payload:', { minutes });
      const res = await api.put(`/focus-times/${focusId}`, { minutes });
      console.log('✅ updateFocusTime:', res.status, res.data);
      return res.data;
    } catch (error) {
      console.error(`❌ Error al actualizar FocusTime ${focusId}:`, {
        url: api.defaults.baseURL + `/focus-times/${focusId}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }
};

export default focusModeModel;