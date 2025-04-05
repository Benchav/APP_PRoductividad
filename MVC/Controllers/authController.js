import authModel from "../Models/authModel";

const authController = {
  handleLogin: async (email, password, navigation) => {
    const response = await authModel.login(email, password);
    if (response.success) {
      console.log("Inicio de sesión exitoso:", response.user);
      navigation.replace("Main");
    } else {
      console.log(response.message);
      alert(response.message);
    }
  },
};

export default authController;