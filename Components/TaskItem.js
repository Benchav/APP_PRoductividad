import React from "react";
import { StyleSheet } from "react-native";
import { Card, Checkbox, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const TaskItem = ({ task, toggleTaskCompletion }) => {
  return (
    <Card style={[styles.taskCard, task.completed && styles.completedCard]}>
      <Card.Content style={styles.taskItem}>
        <Checkbox
          status={task.completed ? "checked" : "unchecked"}
          onPress={() => toggleTaskCompletion(task.id)}
          color="#4A90E2"
        />
        <Text style={[styles.taskText, task.completed && styles.completedTask]}>
          {task.title}
        </Text>
        {task.completed && <Ionicons name="checkmark-circle" size={20} color="#4A90E2" />}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
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
});

export default TaskItem;