import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";

const FocusModeScreen = ({ navigation }) => {
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 5 minutos en segundos
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState(null);

  // URL del sonido de alarma (CAMBIA ESTA URL POR LA TUYA)
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

  // Función para reproducir sonido desde una URL
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: alarmUrl } // Se usa la URL en lugar de un archivo local
      );
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modo Enfoque</Text>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

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
          setTimeLeft(1 * 60);
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
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
  },
  button: {
    width: 150,
    padding: 15,
    borderRadius: 10,
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
    backgroundColor: "#3498DB",
    width: 150,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonBack: {
    backgroundColor: "#7F8C8D",
    width: 150,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FocusModeScreen;