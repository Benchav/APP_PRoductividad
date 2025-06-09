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

export default function TaskItem({ task = {}, onToggle, onDelete }) {
  console.log('TaskItem → task:', task);

  const justificationText = task.justification || 'Sin justificación';
  const justificationColor = task.justification ? palette.outline : '#bbb';
  const justificationFontStyle = task.justification ? 'italic' : 'normal';

  return (
    <Card
      style={[
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
          <Text
            style={[
              styles.title,
              { color: palette.onSurface },
              task.completed && styles.completedText
            ]}
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text style={[styles.description, { color: palette.outline }]}>
              {task.description}
            </Text>
          ) : null}

          <Text
            style={[
              styles.justification,
              {
                color: justificationColor,
                fontStyle: justificationFontStyle
              }
            ]}
          >
            Justificación: {justificationText}
          </Text>

          {task.due_date ? (
            <Text style={[styles.date, { color: palette.outline }]}>
              Fecha: {task.due_date}
            </Text>
          ) : null}

          {/* Mostrar pasos si existen */}
          {task.steps && task.steps.length > 0 && (
            <View style={{ marginTop: 4 }}>
              <Text style={[styles.subtitle, { color: palette.outline }]}>
                Pasos:
              </Text>
              {task.steps.map((step, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.stepText,
                    { color: step.completed ? palette.primary : palette.outline },
                    step.completed && { textDecorationLine: 'line-through' }
                  ]}
                >
                  • {step.description}
                </Text>
              ))}
            </View>
          )}

          {/* Mostrar tags si existen */}
          {task.tags && task.tags.length > 0 && (
            <View style={{ marginTop: 4 }}>
              <Text style={[styles.subtitle, { color: palette.outline }]}>
                Etiquetas:
              </Text>
              <Text style={[styles.tags, { color: palette.outline }]}>
                {task.tags.join(', ')}
              </Text>
            </View>
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
  description: {
    fontSize: 14,
    marginTop: 2,
  },
  justification: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 12,
    marginLeft: 8,
    marginTop: 2,
  },
  tags: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: palette.outline,
  },
});