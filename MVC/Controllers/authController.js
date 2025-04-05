import authModel from "../Models/authModel";

const authController = {
  handleLogin: async (email, password, navigation) => {
    const response = await authModel.login(email, password);
    if (response.success) {
      console.log("Inicio de sesión exitoso:", response.user);
      navigation.replace("Main");
    } else {
      console.log("Error de inicio de sesión:", response.message);
      // alert removido, el componente puede mostrar el error
    }

    return response; //  Retornamos la respuesta al componente
  },

  handleRegister: async (name, email, password, confirmPassword, navigation) => {
    if (password !== confirmPassword) {
      return { success: false, message: "Las contraseñas no coinciden" }; //  Devolvemos el error
    }

    const response = await authModel.register(email, password);
    if (response.success) {
      console.log("Registro exitoso:", response.user);
      navigation.replace("Main"); // o navigation.navigate("Login");
    } else {
      console.log("Error de registro:", response.message);
    }

    return response; //  También devolvemos el resultado al componente
  }
};

export default authController;