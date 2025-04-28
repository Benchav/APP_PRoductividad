import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationRef } from "./NavigationRef";

import HomeViews from "../MVC/Views/HomeViews";
import TasksViews from "../MVC/Views/TasksViews";
//import CalendarViews from "../MVC/Views/CalendarViews";
import NotesViews from "../MVC/Views/NotesViews";
import LoginViews from "../MVC/Views/LoginViews";
import RegisterViews from "../MVC/Views/RegisterViews";
import FocusModeViews from "../MVC/Views/FocusModeViews";


// Navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Tasks":
              iconName = "checkmark-done";
              break;
            case "Notes":
              iconName = "document-text";
              break;
            case "Focus":
              iconName = "timer";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4A90E2",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#f8f8f8", paddingBottom: 5, height: 60 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeViews} options={{ title: "Inicio" }} />
      <Tab.Screen name="Tasks" component={TasksViews} options={{ title: "Tareas" }} />
      <Tab.Screen name="Notes" component={NotesViews} options={{ title: "Notas" }} />
      <Tab.Screen name="Focus" component={FocusModeViews} options={{ title: "Enfoque" }} />
    </Tab.Navigator>
  );
};

// Componente principal de navegación
const AppNavigator = () => {
  return (
    <NavigationContainer ref={NavigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginViews} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterViews} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;