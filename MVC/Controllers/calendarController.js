import calendarModel from "../Models/calendarModel";
import { Animated } from "react-native";

const calendarController = {
  getSelectedDate: () => {
    return calendarModel.getSelectedDate();
  },

  handleDayPress: (date, setSelectedDate, fadeAnim) => {
    setSelectedDate(date);
    calendarModel.setSelectedDate(date);

    // Animación
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  },

  getMarkedDates: (selectedDate) => {
    if (!selectedDate) return {};
    return {
      [selectedDate]: { selected: true, selectedColor: "#4A90E2", selectedTextColor: "#fff" },
    };
  },

  getCalendarTheme: () => ({
    selectedDayBackgroundColor: "#4A90E2",
    todayTextColor: "#ff4081",
    arrowColor: "#4A90E2",
    monthTextColor: "#4A90E2",
    dayTextColor: "#333",
    todayBackgroundColor: "#FFF3F3",
    textDayFontSize: 16,
    textMonthFontSize: 20,
    textDayHeaderFontSize: 14,
    textDayFontWeight: "bold",
  }),
};

export default calendarController;