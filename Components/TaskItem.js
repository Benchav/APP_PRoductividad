// components/TaskItem.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Checkbox, Text, IconButton } from 'react-native-paper';

// Paleta suavizada
const palette = {
  surface: '#FDFEFE',           // blanco muy suave
  primary: '#AED6F1',           // azul claro suave
  primaryContainer: '#E8F6F3',  // verde agua suave para completadas
  outline: '#AEB6BF',           // gris claro suave
  onSurface: '#34495E',         // gris oscurito para texto
};

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <Card style={[
        styles.card,
        { backgroundColor: palette.surface },
        task.completed && { backgroundColor: palette.primaryContainer }
      ]}
    >
      <Card.Content style={styles.row}>
        <Checkbox
          status={task.completed ? 'checked' : 'unchecked'}
          onPress={() => onToggle(task.id)}
          color={palette.primary}
        />
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            { color: palette.onSurface },
            task.completed && styles.completedText
          ]}>
            {task.title}
          </Text>
          {task.due_date && (
            <Text style={[styles.date, { color: palette.outline }]}>  
              Creada: {task.due_date}
            </Text>
          )}
          <Text style={[styles.subtitle, { color: palette.outline }]}>   
            {task.priority} · {task.status}
          </Text>
        </View>
        <IconButton
          icon="delete-outline"
          size={20}
          onPress={() => onDelete(task.id)}
          color={palette.outline}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: palette.outline,
  },
});
