// components/TaskItem.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Checkbox, Text, IconButton } from 'react-native-paper';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <Card style={[styles.card, task.completed && styles.completedCard]}>
      <Card.Content style={styles.row}>
        <Checkbox
          status={task.completed ? 'checked' : 'unchecked'}
          onPress={() => onToggle(task.id)}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, task.completed && styles.completedText]}>
            {task.title}
          </Text>
          <Text style={styles.subtitle}>
            {task.priority} · {task.status}
          </Text>
        </View>
        <IconButton
          icon="delete-outline"
          size={20}
          onPress={() => onDelete(task.id)}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card:           { marginVertical: 5, borderRadius: 8, elevation: 2 },
  completedCard:  { backgroundColor: '#e0f7fa' },
  row:            { flexDirection: 'row', alignItems: 'center' },
  textContainer:  { flex: 1, marginLeft: 8 },
  title:          { fontSize: 16, fontWeight: 'bold' },
  subtitle:       { fontSize: 12, color: '#666', marginTop: 2 },
  completedText:  { textDecorationLine: 'line-through', color: '#999' },
});