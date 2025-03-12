import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#6200ea" },
        }}
        theme={{
          selectedDayBackgroundColor: "#6200ea",
          todayTextColor: "#ff4081",
          arrowColor: "#6200ea",
        }}
      />

      {selectedDate ? (
        <Text style={styles.selectedDate}>Fecha seleccionada: {selectedDate}</Text>
      ) : (
        <Text style={styles.selectedDate}>Selecciona una fecha</Text>
      )}

      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  button: {
    marginTop: 20,
  },
});

export default CalendarScreen;