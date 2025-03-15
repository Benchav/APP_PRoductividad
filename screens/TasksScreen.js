import React, { useState } from "react";
import { View, FlatList, StyleSheet, Animated } from "react-native";
import { Text, Checkbox, Button, TextInput, Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const TasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Completar informe semanal", completed: false },
    { id: "2", title: "Revisar correos pendientes", completed: false },
    { id: "3", title: "Preparar presentación", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1)); // Para animación de tareas completadas

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    // Efecto de animación al completar tarea
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now().toString(), title: newTask, completed: false }]);
      setNewTask("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Tareas Pendientes</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Card style={[styles.taskCard, item.completed && styles.completedCard]}>
              <Card.Content style={styles.taskItem}>
                <Checkbox
                  status={item.completed ? "checked" : "unchecked"}
                  onPress={() => toggleTaskCompletion(item.id)}
                  color="#4A90E2"
                />
                <Text style={[styles.taskText, item.completed && styles.completedTask]}>
                  {item.title}
                </Text>
                {item.completed && <Ionicons name="checkmark-circle" size={20} color="#4A90E2" />}
              </Card.Content>
            </Card>
          </Animated.View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          label="Nueva tarea"
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" onPress={addTask} style={styles.addButton}>
          + Agregar
        </Button>
      </View>

      <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton}>
        🔙 Volver al Inicio
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EEF2F5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  taskCard: {
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 4,
    borderRadius: 10,
    padding: 5,
  },
  completedCard: {
    backgroundColor: "#D4E6F1",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    color: "#333",
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#4A90E2",
  },
  backButton: {
    marginTop: 10,
  },
});

export default TasksScreen;

