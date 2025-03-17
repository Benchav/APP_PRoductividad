import React, { useState } from "react";
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    console.log("Registro con:", { name, email, password });
    navigation.replace("Main");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#87CEEB", "#5DADE2"]}
        style={styles.background}
      >
        <View style={styles.content}>
          <Image
            source={{
              uri: "https://th.bing.com/th/id/R.8e20650d2688f56c3415a6635e19946d?rik=1nDNqHffFfpDpg&pid=ImgRaw&r=0",
            }}
            style={styles.logo}
          />
          
          <Text style={styles.title}>Crea tu cuenta en Tasko</Text>
          <Text style={styles.subtitle}>Organiza tus tareas eficientemente</Text>

          <View style={styles.formContainer}>
            <TextInput
              label="Nombre completo"
              value={name}
              onChangeText={setName}
              mode="flat"
              autoCapitalize="words"
              style={styles.input}
              left={<TextInput.Icon icon="account" color="#5DADE2" />}
              theme={{ colors: { primary: "#5DADE2", background: "#fff" } }}
            />

            <TextInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              mode="flat"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="email" color="#5DADE2" />}
              theme={{ colors: { primary: "#5DADE2", background: "#fff" } }}
            />

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="flat"
              secureTextEntry={!showPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock" color="#5DADE2" />}
              right={<TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
              />}
              theme={{ colors: { primary: "#5DADE2", background: "#fff" } }}
            />

            <TextInput
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="flat"
              secureTextEntry={!showPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock-check" color="#5DADE2" />}
              theme={{ colors: { primary: "#5DADE2", background: "#fff" } }}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              Registrarse
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

// Reutilizamos los mismos estilos del LoginScreen
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
  input: {
    marginBottom: 20,
    backgroundColor: "#F8FBFF",
    borderRadius: 10,
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
});

export default RegisterScreen;