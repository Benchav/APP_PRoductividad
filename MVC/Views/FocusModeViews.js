import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import focusModeController from "../Controllers/focusModeController";

const FocusModeViews = ({ navigation }) => {
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 1 minuto por defecto
  const [isRunning, setIsRunning] = useState(false);
  const [userTime, setUserTime] = useState(1); // Tiempo inicial de 1 minuto

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      focusModeController.playSound();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleSetTime = () => {
    const timeInSeconds = userTime * 60; // Convertir minutos a segundos
    if (userTime <= 0) {
      Alert.alert("Error", "Por favor ingresa un tiempo válido mayor a 0 minutos.");
    } else {
      setTimeLeft(timeInSeconds);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modo Enfoque</Text>
      <Text style={styles.timer}>{focusModeController.formatTime(timeLeft)}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(userTime)}
          onChangeText={(text) => setUserTime(Number(text))}
          placeholder="Minutos"
        />
        <TouchableOpacity style={styles.buttonSetTime} onPress={handleSetTime}>
          <Text style={styles.buttonText}>Establecer Tiempo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isRunning ? styles.buttonStop : styles.buttonStart]}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={styles.buttonText}>{isRunning ? "Pausar" : "Iniciar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonReset}
        onPress={() => {
          setIsRunning(false);
          setTimeLeft(userTime * 60);
        }}
      >
        <Text style={styles.buttonText}>Reiniciar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#333",
    marginBottom: 40,
  },
  timer: {
    fontSize: 72,
    fontWeight: "500",
    color: "#333",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    height: 45,
    width: 120,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    color: "#333",
    textAlign: "center",
    marginRight: 10,
    fontSize: 18,
  },
  buttonSetTime: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  button: {
    width: 200,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonStart: {
    backgroundColor: "#4CAF50",
  },
  buttonStop: {
    backgroundColor: "#E74C3C",
  },
  buttonReset: {
    backgroundColor: "#F39C12",
    width: 200,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonBack: {
    backgroundColor: "#BDC3C7",
    width: 200,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default FocusModeViews;