import React from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import homeController from "../Controllers/homeController";

const HomeViews = () => {
  return (
    <ImageBackground
      source={{
        uri: "https://static.vecteezy.com/system/resources/previews/009/362/398/non_2x/blue-dynamic-shape-abstract-background-suitable-for-web-and-mobile-app-backgrounds-eps-10-vector.jpg",
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="checkmark-done-circle" size={60} color="#4A90E2" />
          <Text style={styles.appTitle}>Tasko</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Tu app de productividad</Text>
            <Text style={styles.subtitle}>
              Administra tus tareas y hábitos de manera eficiente.
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://blogimage.vantagecircle.com/content/images/2022/07/productividad-de-los-empleados-en-el-lugar-de-trabajo.png",
            }}
            style={styles.image}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={homeController.goToTasks} style={styles.button}>
            Ver Tareas
          </Button>
          <Button mode="contained" onPress={homeController.logout} style={[styles.button, styles.focusButton]}>
            Salir
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
  },
  focusButton: {
    backgroundColor: "#F2994A",
  },
});

export default HomeViews;