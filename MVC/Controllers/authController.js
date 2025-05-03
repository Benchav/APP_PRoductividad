// MVC/Controllers/authController.js
import authModel from "../Models/authModel";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authController = {
  /**
   * Maneja el login llamando al modelo y guardando el user_id en AsyncStorage.
   * Navega a la pantalla "Main" (tu BottomTabNavigator) si es exitoso.
   */
  handleLogin: async (email, password, navigation) => {
    try {
      const response = await authModel.login(email, password);
      if (response.success) {
        const { user_id } = response.data; // data: { status, user_id }
        console.log("Inicio de sesión exitoso:", user_id);

        // Guardar user_id localmente para futuras consultas
        await AsyncStorage.setItem("userId", user_id);

        // Reemplaza la pila y navega a Main
        navigation.replace("Main");
      } else {
        console.log("Error de inicio de sesión:", response.message);
      }
      return response;
    } catch (error) {
      console.log("Error inesperado en login:", error.message);
      return { success: false, message: "Error de conexión. Inténtalo de nuevo." };
    }
  },

  /**
   * Maneja el registro de un nuevo usuario.
   * Si es exitoso, guarda el userId y navega directamente a Main.
   */
  handleRegister: async (email, password, confirmPassword, navigation) => {
    if (password !== confirmPassword) {
      const message = "Las contraseñas no coinciden";
      console.log("Error de registro:", message);
      return { success: false, message };
    }

    try {
      const response = await authModel.register(email, password);
      if (response.success) {
        const { id: userId, email: userEmail } = response.data;
        console.log("Registro exitoso:", userId, userEmail);

        // Guardar user_id y navegar a Main
        await AsyncStorage.setItem("userId", userId);
        navigation.replace("Main");
      } else {
        console.log("Error de registro:", response.message);
      }
      return response;
    } catch (error) {
      console.log("Error inesperado en registro:", error.message);
      return { success: false, message: "Error de conexión. Inténtalo de nuevo." };
    }
  },

  /**
   * Maneja el logout borrando el user_id de AsyncStorage y navegando a Login.
   */
  handleLogout: async (navigation) => {
    try {
      await AsyncStorage.removeItem("userId");
      navigation.replace("Login");
      return { success: true };
    } catch (error) {
      console.log("Error al cerrar sesión:", error.message);
      return { success: false, message: error.message };
    }
  },
};

export default authController;