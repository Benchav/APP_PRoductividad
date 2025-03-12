import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Importamos las pantallas
import HomeScreen from "../screens/HomeScreen";
import TasksScreen from "../screens/TasksScreen";
import CalendarScreen from "../screens/CalendarScreen";
import NotesScreen from "../screens/NotesScreen";
import FocusModeScreen from "../screens/FocusModeScreen";

// Creamos el stack de navegación
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
        <Stack.Screen name="Tasks" component={TasksScreen} options={{ title: "Tareas" }} />
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: "Calendario" }} />
        <Stack.Screen name="Notes" component={NotesScreen} options={{ title: "Notas" }} />
        <Stack.Screen name="FocusMode" component={FocusModeScreen} options={{ title: "Modo Enfoque" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
