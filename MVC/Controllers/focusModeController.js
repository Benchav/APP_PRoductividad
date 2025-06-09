// ../Controllers/focusModeController.js
import { Audio } from "expo-av";
import { Alert } from "react-native";
import focusModeModel from "../Models/focusModeModel.js";

const focusModeController = {
  playSound: async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: focusModeModel.alarmUrl });
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir sonido:", error);
    }
  },

  formatTime: (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  },

  handleSetTime: (userTime, setTimeLeft, setInitialSeconds) => {
    const timeInSeconds = userTime * 60;
    if (userTime <= 0) {
      Alert.alert("Error", "Por favor ingresa un tiempo válido mayor a 0 minutos.");
    } else {
      setInitialSeconds(timeInSeconds);
      setTimeLeft(timeInSeconds);
    }
  },

  /**
   * Publica un nuevo registro de FocusTime en tu API
   * @param {string} taskId 
   * @param {number} minutesSpent 
   */
  postFocusTime: (taskId, minutesSpent) => {
    // Delegamos la llamada HTTP al modelo
    return focusModeModel.createFocusTime(taskId, minutesSpent);
  },

  /**
   * Obtiene todos los registros de FocusTime para una tarea
   * @param {string} taskId 
   */
  getFocusTimesByTask: async (taskId) => {
    try {
      const res = await fetch(`${focusModeModel.apiBaseUrl}/tasks/${taskId}/focus-times`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error("Error obteniendo FocusTimes:", e);
      return [];
    }
  }
};

export default focusModeController;