import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text, Button } from "react-native-paper";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Configuración del idioma del calendario
LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ],
  monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy"
};
LocaleConfig.defaultLocale = "es";

const CalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación de texto

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario</Text>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#4A90E2", selectedTextColor: "#fff" },
          }}
          theme={{
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
          }}
        />
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        {selectedDate ? (
          <Text style={styles.selectedDate}>Fecha seleccionada: {selectedDate}</Text>
        ) : (
          <Text style={styles.selectedDate}>Selecciona una fecha</Text>
        )}
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

export default CalendarScreen;