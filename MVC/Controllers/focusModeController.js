// Controllers/focusModeController.js
import { Audio } from "expo-av";
import { Alert } from "react-native";
import focusModeModel from "../Models/focusModeModel";

const focusModeController = {
  /**
   * Reproduce el sonido de alarma y devuelve la instancia Audio.Sound.
   * Quien llame debe guardar la instancia para poder detenerla luego.
   * @returns {Promise<Audio.Sound | null>}
   */
  playSound: async () => {
    try {
      // Asegúrate de que alarmUrl esté definido en el modelo (asset local o URL directa .mp3)
      const { sound } = await Audio.Sound.createAsync(focusModeModel.alarmUrl);
      // Guarda la instancia antes de reproducir para poder detenerla externamente
      // Reproduce el sonido
      await sound.playAsync();
      return sound;
    } catch (error) {
      console.error("Error al reproducir sonido:", error);
      return null;
    }
  },

  /**
   * Dado un objeto Audio.Sound, lo detiene y descarga.
   * @param {Audio.Sound} soundInstance 
   * @returns {Promise<void>}
   */
  stopSound: async (soundInstance) => {
    try {
      if (!soundInstance) return;
      // Detener reproducción si está sonando
      // stopAsync detiene, luego unloadAsync libera recursos
      await soundInstance.stopAsync().catch(() => {});
      await soundInstance.unloadAsync().catch(() => {});
    } catch (error) {
      console.warn("Error al detener/destruir sonido:", error);
    }
  },

  /**
   * Formatea segundos a MM:SS
   * @param {number} seconds 
   * @returns {string}
   */
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
    return focusModeModel.createFocusTime(taskId, minutesSpent);
  },

  getFocusTimesByTask: (taskId) => {
    return focusModeModel.getFocusTimesByTask(taskId);
  },

  updateFocusTime: (focusId, minutes) => {
    return focusModeModel.updateFocusTime(focusId, minutes);
  },
};

export default focusModeController;