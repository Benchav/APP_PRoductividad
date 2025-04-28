import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <PaperProvider>
    <SafeAreaProvider>
  <AppNavigator />
  </SafeAreaProvider>
  </PaperProvider>
  );
}