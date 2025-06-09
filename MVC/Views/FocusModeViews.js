import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground
} from "react-native";
import focusModeController from "../Controllers/focusModeController";

export default function FocusModeViews({ route, navigation }) {
  const taskId = route?.params?.taskId;

  const [timeLeft, setTimeLeft] = useState(60);
  const [initialSeconds, setInitialSeconds] = useState(60);
  const [userTime, setUserTime] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!taskId) return; // No ejecutar lógica si no hay taskId

    if (isRunning && timerRef.current == null) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timeLeft === 0 && isRunning) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
      focusModeController.playSound();

      const minutesSpent = Math.ceil(initialSeconds / 60);

      focusModeController
        .postFocusTime(taskId, minutesSpent)
        .then(() => {
          Alert.alert("¡Listo!", `Registrado ${minutesSpent} min en modo enfoque.`);
        })
        .catch(() => {
          Alert.alert("Error", "No se pudo guardar el tiempo de enfoque.");
        });
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, timeLeft, initialSeconds]);

  const handleSetTime = () => {
    if (userTime <= 0) {
      Alert.alert("Error", "Por favor ingresa un tiempo válido mayor a 0 minutos.");
      return;
    }
    const secs = userTime * 60;
    setInitialSeconds(secs);
    setTimeLeft(secs);
  };

  if (!taskId) {
    return (
      <View style={[styles.overlay, { backgroundColor: "#000" }]}>
        <Text style={{ color: "red", fontSize: 18, textAlign: 'center' }}>
          ⚠️ No se recibió el ID de la tarea. No se puede registrar el tiempo de enfoque.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: "skyblue", fontSize: 16 }}>Volver atrás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/vector-premium/gente-esta-pensando-estilo-diseno-plano-simple_995281-10457.jpg' }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        {!isRunning && <Text style={styles.title}>Modo Enfoque</Text>}

        <Text style={styles.timer}>
          {focusModeController.formatTime(timeLeft)}
        </Text>

        {!isRunning && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(userTime)}
              onChangeText={text => setUserTime(Number(text))}
              placeholder="Minutos"
              placeholderTextColor="#DDD"
            />
            <TouchableOpacity style={styles.buttonSetTime} onPress={handleSetTime}>
              <Text style={styles.buttonText}>Establecer Tiempo</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isRunning ? styles.buttonStop : styles.buttonStart]}
          onPress={() => setIsRunning(r => !r)}
        >
          <Text style={styles.buttonText}>
            {isRunning ? "Pausar" : "Iniciar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonReset}
          onPress={() => {
            setIsRunning(false);
            const secs = userTime * 60;
            setInitialSeconds(secs);
            setTimeLeft(secs);
          }}
        >
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>

        {!isRunning && (
          <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center', padding: 20
  },
  title: {
    fontSize: 30, fontWeight: '600', color: '#FFF', marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 5
  },
  timer: {
    fontSize: 82, fontWeight: '700', color: '#FFF', marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 10
  },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: {
    height: 45, width: 120,
    borderColor: '#DDD', borderWidth: 1, borderRadius: 8,
    color: '#FFF', textAlign: 'center', marginRight: 10, fontSize: 18
  },
  buttonSetTime: {
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center'
  },
  button: {
    width: 200, paddingVertical: 15, borderRadius: 10, alignItems: 'center',
    marginVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3, elevation: 5
  },
  buttonStart: { backgroundColor: 'rgba(76, 175, 80, 0.9)' },
  buttonStop: { backgroundColor: 'rgba(231, 76, 60, 0.9)' },
  buttonReset: {
    backgroundColor: 'rgba(243, 156, 18, 0.9)',
    width: 200, paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10
  },
  buttonBack: {
    backgroundColor: 'rgba(189, 195, 199, 0.9)',
    width: 200, paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 20
  },
  buttonText: {
    color: '#FFF', fontSize: 18, fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2
  }
});
