import { Audio } from "expo-av";
import { Alert } from "react-native";
import focusModeModel from "../Models/focusModeModel";

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

  handleSetTime: (userTime, setTimeLeft) => {
    const timeInSeconds = userTime * 60;
    if (userTime <= 0) {
      Alert.alert("Error", "Por favor ingresa un tiempo válido mayor a 0 minutos.");
    } else {
      setTimeLeft(timeInSeconds);
    }
  },
};

export default focusModeController;