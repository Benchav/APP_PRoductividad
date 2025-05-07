// src/Models/profileModel.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../config/api";

const profileModel = {
  /**
   * Obtiene datos de perfil e incluye user_id para cálculos de progreso.
   */
  getProfile: async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró userId");

      const res = await api.get(`/users/${userId}`);
      // Aseguramos que el objeto incluya user_id
      const data = { user_id: userId, ...res.data };
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || error.message };
    }
  },

  /**
   * Actualiza email y/o password y retorna el perfil actualizado.
   */
  updateProfile: async (email, password) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró userId");

      const res = await api.put(`/users/${userId}`, { email, password });

      // Guardar nuevas credenciales localmente
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);

      const data = { user_id: userId, ...res.data };
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || error.message };
    }
  },
};

export default profileModel;