import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Animated } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import tasksController from "../Controllers/taskController";
import TaskItem from "../../Components/TaskItem";
//import TaskItem from "../Components/TaskItem";

const TasksViews = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    setTasks(tasksController.getTasks());
  }, []);

  const toggleTaskCompletion = (id) => {
    setTasks(tasksController.toggleTaskCompletion(id));

    // Animación al completar tarea
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks(tasksController.addTask(newTask));
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
            <TaskItem task={item} toggleTaskCompletion={toggleTaskCompletion} />
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

export default TasksViews;