// components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Portal, Modal, TextInput, Button, Menu, Text, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const priorities = ['Baja', 'Media', 'Alta'];
const statuses   = ['Pendiente', 'En progreso', 'Completada'];

const palette = {
  surface: '#FFFFFF',
  primary: '#5DADE2',
  outline: '#7F8C8D',
  onSurface: '#000000',
  onPrimary: '#FFFFFF',
};

const getTodayFormatted = date => {
  const now = date || new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function TaskForm({ visible, onDismiss, onSubmit, initialValues }) {
  const iv = initialValues || {};
  const [title, setTitle] = useState(iv.title || '');
  const [description, setDescription] = useState(iv.description || '');
  const [priority, setPriority] = useState(iv.priority || 'Media');
  const [status, setStatus] = useState(iv.status || 'Pendiente');
  const [tags, setTags] = useState((iv.tags || []).join(','));
  const [dueDate, setDueDate] = useState(
    iv.due_date ? new Date(iv.due_date.split('-').reverse().join('-')) : new Date()
  );
  const [showDate, setShowDate] = useState(false);
  const [steps, setSteps] = useState(iv.steps?.map(s => ({ ...s })) || []);
  const [newStep, setNewStep] = useState('');
  const [menuVisible, setMenuVisible] = useState({ p: false, s: false });

  useEffect(() => {
    setTitle(iv.title || '');
    setDescription(iv.description || '');
    setPriority(iv.priority || 'Media');
    setStatus(iv.status || 'Pendiente');
    setTags((iv.tags || []).join(','));
    setSteps(iv.steps?.map(s => ({ ...s })) || []);
    setDueDate(
      iv.due_date ? new Date(iv.due_date.split('-').reverse().join('-')) : new Date()
    );
  }, [initialValues]);

  const addStep = () => {
    if (!newStep.trim()) return;
    setSteps(s => [...s, { description: newStep, completed: false }]);
    setNewStep('');
  };

  const toggleStep = index =>
    setSteps(s =>
      s.map((st, i) => (i === index ? { ...st, completed: !st.completed } : st))
    );

  const removeStep = index => setSteps(s => s.filter((_, i) => i !== index));

  const onChangeDate = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const handleSave = () => {
    const formatted = getTodayFormatted(dueDate);
    const payload = {
      title,
      description,
      due_date: formatted,
      completed: iv.completed || false,
      user_id: iv.user_id || '',
      status,
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      steps,
    };
    onSubmit(payload);
    onDismiss();
  };

  return (
    <Portal>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.center}
      >
        <Modal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.header}>{iv.id ? 'Editar Tarea' : 'Nueva Tarea'}</Text>

          <TextInput
            label="Título"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            outlineColor={palette.outline}
            activeOutlineColor={palette.primary}
            style={styles.input}
          />

          <TextInput
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            outlineColor={palette.outline}
            activeOutlineColor={palette.primary}
            style={styles.input}
          />

          <Text style={styles.subHeader}>Fecha de entrega</Text>
          <Button
            mode="outlined"
            onPress={() => setShowDate(true)}
            style={styles.input}
          >
            {getTodayFormatted(dueDate)}
          </Button>
          {showDate && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <View style={styles.row}>
            <Menu
              visible={menuVisible.p}
              onDismiss={() => setMenuVisible({ p: false })}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible({ p: true })}
                  style={styles.input}
                >
                  {priority}
                </Button>
              }
            >
              {priorities.map(p => (
                <Menu.Item
                  key={p}
                  title={p}
                  onPress={() => {
                    setPriority(p);
                    setMenuVisible({ p: false });
                  }}
                />
              ))}
            </Menu>

            <Menu
              visible={menuVisible.s}
              onDismiss={() => setMenuVisible({ s: false })}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible({ s: true })}
                  style={styles.input}
                >
                  {status}
                </Button>
              }
            >
              {statuses.map(s => (
                <Menu.Item
                  key={s}
                  title={s}
                  onPress={() => {
                    setStatus(s);
                    setMenuVisible({ s: false });
                  }}
                />
              ))}
            </Menu>
          </View>

          <TextInput
            label="Etiquetas (separadas por coma)"
            value={tags}
            onChangeText={setTags}
            mode="outlined"
            outlineColor={palette.outline}
            activeOutlineColor={palette.primary}
            style={styles.input}
          />

          <Text style={styles.subHeader}>Pasos / Subtareas</Text>
          <View style={styles.stepInputRow}>
            <TextInput
              placeholder="Nuevo paso"
              value={newStep}
              onChangeText={setNewStep}
              mode="outlined"
              outlineColor={palette.outline}
              activeOutlineColor={palette.primary}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}  
            />
            <IconButton icon="plus" onPress={addStep} />
          </View>
          <FlatList
            data={steps}
            keyExtractor={(_, i) => String(i)}
            style={{ maxHeight: 100 }}
            renderItem={({ item, index }) => (
              <View style={styles.stepRow}>
                <IconButton
                  icon={item.completed ? 'check' : 'checkbox-blank-outline'}
                  onPress={() => toggleStep(index)}
                />
                <Text style={item.completed ? styles.done : styles.step}>
                  {item.description}
                </Text>
                <IconButton icon="delete" onPress={() => removeStep(index)} />
              </View>
            )}
          />

          <View style={styles.actions}>
            <Button onPress={onDismiss} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={{ backgroundColor: palette.primary }}
            >
              Guardar
            </Button>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Portal>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 40,           // ajustado para centrar mejor
  },
 modal: {
  backgroundColor: palette.surface,
  padding: 20,
  borderRadius: 8,
  alignSelf: 'flex-end', // Lo alinea a la derecha
  marginRight: 20,       // Separación del borde derecho
  width: '90%',          // Asegura que no ocupe toda la pantalla
},

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  stepInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  step: {
    flex: 1,
    fontSize: 14,
  },
  done: {
    flex: 1,
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});