const authModel = {
    login: async (email, password) => {
      // Simulación de validación, a futuro implementarlo con firebase.
      if (email === "joshua@gmail.com" && password === "123456") {
        return { success: true, user: { email, name: "Usuario Demo" } };
      } else {
        return { success: false, message: "Credenciales incorrectas" };
      }
    },
  };
  
  export default authModel;