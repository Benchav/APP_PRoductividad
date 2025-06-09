// navigation/AppNavigator.js
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation, useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  Provider as PaperProvider,
  Menu,
  Divider,
  List
} from "react-native-paper";
import { NavigationRef } from "./NavigationRef";

import HomeViews from "../MVC/Views/HomeViews";
import TasksViews from "../MVC/Views/TasksViews";
import NotesViews from "../MVC/Views/NotesViews";
import FocusModeViews from "../MVC/Views/FocusModeViews";
import ProfileViews from "../MVC/Views/ProfileViews";
import TaskStatsViews from "../MVC/Views/TaskStatsViews";
import DeletedTasksStoreViews from "../MVC/Views/DeletedTasksStoreViews";
import LoginViews from "../MVC/Views/LoginViews";
import RegisterViews from "../MVC/Views/RegisterViews";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/** Componente dropdown para el tab "Más" */
function MoreMenuButton({ color, size }) {
  const navigation = useNavigation();
  const { colors: themeColors } = useTheme();
  const [visible, setVisible] = React.useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Ionicons
          name="menu-outline"
          size={size}
          color={color}
          onPress={() => setVisible(true)}
        />
      }
      contentStyle={styles.menuContent}
    >
      <List.Item
        title="Perfil"
        description="Administra tu cuenta"
        left={props => <List.Icon {...props} icon="person-circle-outline" color={themeColors.primary} />}
        onPress={() => { setVisible(false); navigation.navigate("Perfil"); }}
      />
      <Divider />
      <List.Item
        title="Progreso"
        description="Estadísticas de productividad"
        left={props => <List.Icon {...props} icon="bar-chart-outline" color={themeColors.primary} />}
        onPress={() => { setVisible(false); navigation.navigate("Progreso"); }}
      />
      <Divider />
      <List.Item
        title="Historial"
        description="Tareas eliminadas"
        left={props => <List.Icon {...props} icon="trash-outline" color={themeColors.primary} />}
        onPress={() => { setVisible(false); navigation.navigate("Historial"); }}
      />
      <Divider />
      <List.Item
        title="Enfoque"
        description="Modo concentración"
        left={props => <List.Icon {...props} icon="timer-outline" color={themeColors.primary} />}
        onPress={() => { setVisible(false); navigation.navigate("FocusModeViews"); }}
      />
    </Menu>
  );
}

function BottomTabNavigator() {
  const { colors } = useTheme();
  const icons = {
    Home:    ["home-outline",          "home"],
    Tasks:   ["checkbox-outline",      "checkbox"],
    Notes:   ["document-text-outline", "document-text"],
    More:    ["menu-outline",          "menu"],
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, size, focused }) => {
          const [outline, filled] = icons[route.name];
          const iconName = focused ? filled : outline;
          if (route.name === "More") {
            return <MoreMenuButton color={color} size={size} />;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#a1a1a1",
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home"  component={HomeViews}  options={{ title: "Inicio" }} />
      <Tab.Screen name="Tasks" component={TasksViews} options={{ title: "Tareas" }} />
      <Tab.Screen name="Notes" component={NotesViews} options={{ title: "Notas" }} />
      <Tab.Screen name="More"  component={View}      options={{ title: "Más" }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <PaperProvider>
      <NavigationContainer ref={NavigationRef}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login"    component={LoginViews}   options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterViews} options={{ headerShown: false }} />
          <Stack.Screen name="Main"     component={BottomTabNavigator} options={{ headerShown: false }} />
          {/* Rutas “Más” */}
          <Stack.Screen name="Perfil"            component={ProfileViews}           options={{ title: "Perfil" }} />
          <Stack.Screen name="Progreso"          component={TaskStatsViews}         options={{ title: "Progreso" }} />
          <Stack.Screen name="Historial"         component={DeletedTasksStoreViews} options={{ title: "Historial" }} />
          <Stack.Screen name="FocusModeViews"    component={FocusModeViews}         options={{ title: "Enfoque" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    height: Platform.OS === "ios" ? 80 : 65,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 12,
  },
  label: {
    fontSize: 11,
    marginTop: -4,
  },
  menuContent: {
    backgroundColor: "#fff",
    elevation: 5,
    paddingVertical: 4,
    minWidth: 180,
  },
});
