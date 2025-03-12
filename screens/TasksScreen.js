import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Checkbox, Button, TextInput, Card } from "react-native-paper";

const TasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Completar informe semanal", completed: false },
    { id: "2", title: "Revisar correos pendientes", completed: false },
    { id: "3", title: "Preparar presentación", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now().toString(), title: newTask, completed: false }]);
      setNewTask("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Tareas</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.taskCard}>
            <Card.Content style={styles.taskItem}>
              <Checkbox
                status={item.completed ? "checked" : "unchecked"}
                onPress={() => toggleTaskCompletion(item.id)}
              />
              <Text style={[styles.taskText, item.completed && styles.completedTask]}>
                {item.title}
              </Text>
            </Card.Content>
          </Card>
        )}
      />

      <TextInput
        label="Nueva tarea"
        value={newTask}
        onChangeText={setNewTask}
        style={styles.input}
      />
      <Button mode="contained" onPress={addTask} style={styles.button}>
        Agregar Tarea
      </Button>

      <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton}>
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
  taskCard: {
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
    borderRadius: 8,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  input: {
    marginTop: 10,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
  },
  backButton: {
    marginTop: 10,
  },
});

export default TasksScreen;
