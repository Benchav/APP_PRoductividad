import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Bienvenido a tu App de Productividad</Text>
          <Text style={styles.subtitle}>Organiza tus tareas, calendario y hábitos fácilmente.</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("Tasks")}
      >
        Ir a Tareas
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("Calendar")}
      >
        Ir al Calendario
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("Notes")}
      >
        Ir a Notas
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("FocusMode")}
      >
        Modo Enfoque
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  button: {
    width: "100%",
    marginBottom: 10,
  },
});

export default HomeScreen;