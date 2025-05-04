// controllers/notesController.js
import notesModel from '../Models/notesModel';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const notesController = {
  /**
   * Obtiene todas las notas del usuario autenticado.
   * @returns {Promise<Array>}
   */
  getAllNotes: async () => {
    return await notesModel.getAllNotes();
  },

  /**
   * Obtiene una nota por su ID.
   * @param {string} noteId
   * @returns {Promise<Object>}
   */
  getNoteById: async (noteId) => {
    return await notesModel.getNoteById(noteId);
  },

  /**
   * Crea una nueva nota.
   * @param {{ title: string, texto: string, tags?: string[] }} fields
   * @returns {Promise<Object>}
   */
  createNote: async ({ title, texto, tags = [] }) => {
    return await notesModel.createNote({ title, texto, tags });
  },

  /**
   * Actualiza una nota existente.
   * @param {string} noteId
   * @param {{ title: string, texto: string, tags?: string[] }} fields
   * @returns {Promise<Object>}
   */
  updateNote: async (noteId, { title, texto, tags = [] }) => {
    return await notesModel.updateNote(noteId, { title, texto, tags });
  },

  /**
   * Elimina una nota por su ID.
   * @param {string} noteId
   * @returns {Promise<Object>}
   */
  deleteNote: async (noteId) => {
    return await notesModel.deleteNote(noteId);
  },

  /**
   * Abre el picker de imágenes.
   * @returns {Promise<string|null>} URI de la imagen o null si canceló.
   */
  pickImage: async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    return !result.canceled ? result.assets[0].uri : null;
  },

  /**
   * Abre el picker de documentos.
   * @returns {Promise<string|null>} URI del documento o null si canceló.
   */
  pickDocument: async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    return result.type !== 'cancel' ? result.uri : null;
  },
};

export default notesController;