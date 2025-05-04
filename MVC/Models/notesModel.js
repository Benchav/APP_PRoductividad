// models/notesModel.js
import api from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const notesModel = {
  /**
   * Obtiene todas las notas.
   * @returns {Promise<Array>}
   */
  getAllNotes: async () => {
    try {
      const res = await api.get('/notes');
      return res.data;  // Array de notas
    } catch (error) {
      console.error('Error al obtener notas:', error.message);
      throw error;
    }
  },

  /**
   * Obtiene una nota por su ID.
   * @param {string} noteId
   * @returns {Promise<Object>}
   */
  getNoteById: async (noteId) => {
    try {
      const res = await api.get(`/notes/${noteId}`);
      return res.data;
    } catch (error) {
      console.error(`Error al obtener nota ${noteId}:`, error.message);
      throw error;
    }
  },

  /**
   * Crea una nueva nota.
   * @param {{ title: string, texto: string, tags?: string[] }} fields
   * @returns {Promise<Object>}
   */
  createNote: async ({ title, texto, tags = [] }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuario no autenticado');

      const payload = {
        user_id: userId,
        title,
        texto,
        tags
      };

      const res = await api.post('/notes', payload);
      return res.data;
    } catch (error) {
      console.error('Error al crear nota:', error.message);
      throw error;
    }
  },

  /**
   * Actualiza una nota existente.
   * @param {string} noteId
   * @param {{ title: string, texto: string, tags?: string[] }} fields
   * @returns {Promise<Object>}
   */
  updateNote: async (noteId, { title, texto, tags = [] }) => {
    try {
      const res = await api.put(`/notes/${noteId}`, {
        user_id: await AsyncStorage.getItem('userId'),
        title,
        texto,
        tags
      });
      return res.data;
    } catch (error) {
      console.error(`Error al actualizar nota ${noteId}:`, error.message);
      throw error;
    }
  },

  /**
   * Elimina una nota por su ID.
   * @param {string} noteId
   * @returns {Promise<Object>}
   */
  deleteNote: async (noteId) => {
    try {
      const res = await api.delete(`/notes/${noteId}`);
      return res.data;
    } catch (error) {
      console.error(`Error al eliminar nota ${noteId}:`, error.message);
      throw error;
    }
  },
};

export default notesModel;