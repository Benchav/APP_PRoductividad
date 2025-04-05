import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text, Button } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import calendarController from "../Controllers/calendarController";
import "../../Components/localeConfig"; // Importando la configuración de idioma

const CalendarViews = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0)); 

  useEffect(() => {
    const lastSelected = calendarController.getSelectedDate();
    if (lastSelected) {
      setSelectedDate(lastSelected);
      fadeAnim.setValue(1);
    }
  }, []);

  const handleDayPress = (day) => {
    calendarController.handleDayPress(day.dateString, setSelectedDate, fadeAnim);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario</Text>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={calendarController.getMarkedDates(selectedDate)}
          theme={calendarController.getCalendarTheme()}
        />
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.selectedDate}>
          {selectedDate ? `Fecha seleccionada: ${selectedDate}` : "Selecciona una fecha"}
        </Text>
      </Animated.View>

      <Button mode="contained" onPress={() => navigation.goBack()} style={[styles.button, styles.buttonBack]}>
        Volver al Inicio
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  calendarContainer: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    backgroundColor: "#fff",
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 18,
    textAlign: "center",
    color: "#555",
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
  buttonBack: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CalendarViews;