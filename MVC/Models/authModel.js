import api from '../../config/api';

const authModel = {
  /**
   * Hace login contra tu API FastAPI.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, data?: any, message?: string}>}
   */
  login: async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      // res.data = { status: "success", user_id: "..." }
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
   * Registra un nuevo usuario en tu API FastAPI.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, data?: any, message?: string}>}
   */
  register: async (email, password) => {
    try {
      const res = await api.post('/users', { email, password });
      // res.data = { id: "...", email: "...", password: "..." }
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
   * Por ejemplo, podrías hacer AsyncStorage.removeItem('userId').
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