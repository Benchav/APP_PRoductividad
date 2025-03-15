import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Importamos las pantallas
import HomeScreen from "../screens/HomeScreen";
import TasksScreen from "../screens/TasksScreen";
import CalendarScreen from "../screens/CalendarScreen";
import NotesScreen from "../screens/NotesScreen";
import FocusModeScreen from "../screens/FocusModeScreen";

// Creamos los navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Función para la navegación por pestañas
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Tasks") {
            iconName = "checkmark-done";
          } else if (route.name === "Calendar") {
            iconName = "calendar";
          } else if (route.name === "Notes") {
            iconName = "document-text";
          } else if (route.name === "Focus") {
            iconName = "timer";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4A90E2",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#f8f8f8", paddingBottom: 5, height: 60 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: "Tareas" }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: "Calendario" }} />
      <Tab.Screen name="Notes" component={NotesScreen} options={{ title: "Notas" }} />
      <Tab.Screen name="Focus" component={FocusModeScreen} options={{ title: "Enfoque" }} />
    </Tab.Navigator>
  );
};

// Componente principal de navegación
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
