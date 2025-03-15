import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";

const FocusModeScreen = ({ navigation }) => {
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 1 minuto por defecto
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState(null);
  const [userTime, setUserTime] = useState(1); // Tiempo inicial de 1 minuto

  // URL del sonido de alarma
  const alarmUrl = "https://www.epidemicsound.com/es/sound-effects/tracks/69357bdc-9bc6-4ba4-934f-a0ae95f87d35/";

  // Función para manejar el temporizador
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      playSound();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Función para reproducir sonido
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: alarmUrl });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir sonido:", error);
    }
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  // Convertir segundos a formato mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Función para manejar el cambio de tiempo
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
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

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
    backgroundColor: "#F2F2F2", // Fondo claro y neutro
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#333", // Título con color más oscuro
    marginBottom: 40,
  },
  timer: {
    fontSize: 72,
    fontWeight: "500",
    color: "#333", // Color del temporizador más sobrio
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
    borderColor: "#ddd", // Borde más suave
    borderWidth: 1,
    borderRadius: 8,
    color: "#333",
    textAlign: "center",
    marginRight: 10,
    fontSize: 18,
  },
  buttonSetTime: {
    backgroundColor: "#4A90E2", // Azul suave
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
    backgroundColor: "#4CAF50", // Verde suave
  },
  buttonStop: {
    backgroundColor: "#E74C3C", // Rojo suave
  },
  buttonReset: {
    backgroundColor: "#F39C12", // Naranja suave
    width: 200,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonBack: {
    backgroundColor: "#BDC3C7", // Gris suave
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

export default FocusModeScreen;
