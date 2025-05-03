// MVC/Views/RegisterViews.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { z } from "zod";
import authController from "../Controllers/authController";
import InputField from "../../Components/InputField";

// Esquema de validación con Zod
const registerSchema = z
  .object({
    email: z
      .string()
      .min(5, "El correo debe tener al menos 5 caracteres")
      .email("Formato de correo no válido"),
    password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
    confirmPassword: z.string().min(4, "La confirmación debe tener al menos 4 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const RegisterViews = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setValidationErrors([]);

    // Validación local con Zod
    const result = registerSchema.safeParse({
      email: email.trim(),
      password,
      confirmPassword,
    });
    if (!result.success) {
      const issues = result.error.issues.map((err) => err.message);
      setValidationErrors(issues);
      setIsLoading(false);
      return;
    }

    // Si pasó Zod, seguimos al controller
    try {
      const response = await authController.handleRegister(
        email.trim(),
        password,
        confirmPassword,
        navigation
      );

      if (!response.success) {
        setErrorMessage(response.message || "Error desconocido");
      }
    } catch (err) {
      setErrorMessage("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={["#87CEEB", "#5DADE2"]} style={styles.background}>
        <View style={styles.content}>
          <Image
            source={{
              uri:
                "https://th.bing.com/th/id/R.8e20650d2688f56c3415a6635e19946d?rik=1nDNqHffFfpDpg&pid=ImgRaw&r=0",
            }}
            style={styles.logo}
          />

          <Text style={styles.title}>Crea tu cuenta en Tasko</Text>
          <Text style={styles.subtitle}>Organiza tus tareas eficientemente</Text>

          <View style={styles.formContainer}>
            <InputField
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              icon="email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InputField
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              icon="lock"
              secureTextEntry={!showPassword}
            />
            <InputField
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon="lock-check"
              secureTextEntry={!showPassword}
            />

            {/* Mensajes de validación de Zod */}
            {validationErrors.map((msg, idx) => (
              <Text key={idx} style={styles.errorText}>
                {msg}
              </Text>
            ))}

            {/* Error general del controller */}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                "Registrarse"
              )}
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.replace("Login")}>
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
  container: { flex: 1 },
  background: { flex: 1, justifyContent: "center" },
  content: { paddingHorizontal: 30, alignItems: "center" },
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
  buttonLabel: { color: "#fff", fontSize: 16, fontWeight: "600" },
  buttonContent: { height: "100%" },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: { color: "#7F8C8D" },
  loginLink: { color: "#5DADE2", fontWeight: "600" },
  errorText: { color: "red", textAlign: "center", marginTop: 10 },
});

export default RegisterViews;