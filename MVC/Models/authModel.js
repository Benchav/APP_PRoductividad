// MVC/Models/authModel.js
import api from '../../config/api';

const authModel = {
  /**
   * Hace login contra tu API FastAPI en Vercel.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, data?: any, message?: string}>}
   */
  login: async (email, password) => {
    try {
      // Asegúrate de que tu endpoint de FastAPI responde en POST /login
      const res = await api.post('/login', { email, password });
      // res.data debería ser algo como: { status: "success", user_id: "..." }
      return { success: true, data: res.data };
  } catch (error) {
      // Verificamos si es un problema de CORS o de credenciales
      console.log('🚨 Error en authModel.login:', {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
        message: error.message,
      });

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message;

      return { success: false, message };
    }
  },

  /**
   * Registra un nuevo usuario en tu API FastAPI.
   * Ahora apunta a POST /users (tal como sale en tu Swagger).
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, data?: any, message?: string}>}
   */
  register: async (email, password) => {
    try {
      // Cambiamos la ruta a `/users` para crear un nuevo usuario
      const res = await api.post('/users', { email, password });
      // res.data debería ser algo como: { id: "...", email: "...", password: "..." }
      return { success: true, data: res.data };
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message;
      return { success: false, message };
    }
  },

  /**
   * Logout local (si guardas un token o user_id en AsyncStorage, bórralo aquí).
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  logout: async () => {
    try {
      // Ejemplo: si usas AsyncStorage para guardar userId
      // await AsyncStorage.removeItem('userId');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

export default authModel;