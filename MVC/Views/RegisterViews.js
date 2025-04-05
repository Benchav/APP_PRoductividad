import React, { useState } from "react";
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import authController from "../Controllers/authController";
import InputField from "../../Components/InputField";

const RegisterViews = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const response = await authController.handleRegister(name, email, password, confirmPassword, navigation);
    
    setIsLoading(false);

    if (!response.success) {
      setErrorMessage(response.message);  // 🔥 Muestra error desde controller
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <LinearGradient colors={["#87CEEB", "#5DADE2"]} style={styles.background}>
        <View style={styles.content}>
          <Image
            source={{ uri: "https://th.bing.com/th/id/R.8e20650d2688f56c3415a6635e19946d?rik=1nDNqHffFfpDpg&pid=ImgRaw&r=0" }}
            style={styles.logo}
          />

          <Text style={styles.title}>Crea tu cuenta en Tasko</Text>
          <Text style={styles.subtitle}>Organiza tus tareas eficientemente</Text>

          <View style={styles.formContainer}>
            <InputField label="Nombre completo" value={name} onChangeText={setName} icon="account" />
            <InputField label="Correo electrónico" value={email} onChangeText={setEmail} icon="email" keyboardType="email-address" />
            <InputField label="Contraseña" value={password} onChangeText={setPassword} icon="lock" secureTextEntry={!showPassword} />
            <InputField label="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} icon="lock-check" secureTextEntry={!showPassword} />

            {/* Error */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : "Registrarse"}
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    tintColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: 16,
    color: "#E8F8FF",
    marginBottom: 40,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#5DADE2",
    height: 50,
    shadowColor: "#5DADE2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContent: {
    height: "100%",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: {
    color: "#7F8C8D",
  },
  loginLink: {
    color: "#5DADE2",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default RegisterViews;