// components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, TextInput, Button, Menu, Text } from 'react-native-paper';

const priorities = ['Baja', 'Media', 'Alta'];
const statuses   = ['Pendiente', 'En progreso', 'Completada'];

// Colores adaptados de TasksView
const palette = {
  background: '#FFFFFF',         // blanco
  primary: '#5DADE2',            // azul medio
  primaryContainer: '#87CEEB',   // celeste claro
  surface: '#FFFFFF',            // blanco puro
  outline: '#7F8C8D',            // gris neutro
  onSurface: '#000000',          // texto oscuro
  onPrimary: '#FFFFFF',          // texto sobre primary
};

// Utilidad para obtener fecha actual en formato dd-mm-YYYY
const getTodayFormatted = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function TaskForm({ visible, onDismiss, onSubmit, initialValues }) {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority]       = useState('Media');
  const [status, setStatus]           = useState('Pendiente');
  const [tags, setTags]               = useState('');
  const [menuVisible, setMenuVisible] = useState({ priority:false, status:false });

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description);
      setPriority(initialValues.priority);
      setStatus(initialValues.status);
      setTags(initialValues.tags.join(','));
    }
  }, [initialValues]);

  const reset = () => {
    setTitle('');
    setDescription('');
    setPriority('Media');
    setStatus('Pendiente');
    setTags('');
  };

  const handleSave = () => {
    const payload = {
      title,
      description,
      dueDate: initialValues?.due_date || getTodayFormatted(),
      priority,
      status,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    onSubmit(payload);
    reset();
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => { reset(); onDismiss(); }}
        contentContainerStyle={styles.modal}
      >
        <Text style={[styles.header, { color: palette.onSurface }]}>  
          {initialValues ? 'Editar Tarea' : 'Nueva Tarea'}
        </Text>

        <TextInput
          label="Título"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
          outlineColor={palette.outline}
          activeOutlineColor={palette.primary}
          placeholderTextColor={palette.outline}
        />
        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          outlineColor={palette.outline}
          activeOutlineColor={palette.primary}
          placeholderTextColor={palette.outline}
        />

        <View style={styles.row}>
          <Menu
            visible={menuVisible.priority}
            onDismiss={() => setMenuVisible(v => ({ ...v, priority: false }))}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(v => ({ ...v, priority: true }))}
                style={{ borderColor: palette.outline }}
                labelStyle={{ color: palette.onSurface }}
              >
                {priority}
              </Button>
            }
          >
            {priorities.map(p => (
              <Menu.Item
                key={p}
                title={p}
                titleStyle={{ color: palette.onSurface }}
                onPress={() => {
                  setPriority(p);
                  setMenuVisible(v => ({ ...v, priority: false }));
                }}
              />
            ))}
          </Menu>

          <Menu
            visible={menuVisible.status}
            onDismiss={() => setMenuVisible(v => ({ ...v, status: false }))}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(v => ({ ...v, status: true }))}
                style={{ borderColor: palette.outline }}
                labelStyle={{ color: palette.onSurface }}
              >
                {status}
              </Button>
            }
          >
            {statuses.map(s => (
              <Menu.Item
                key={s}
                title={s}
                titleStyle={{ color: palette.onSurface }}
                onPress={() => {
                  setStatus(s);
                  setMenuVisible(v => ({ ...v, status: false }));
                }}
              />
            ))}
          </Menu>
        </View>

        <TextInput
          label="Etiquetas (separadas por coma)"
          value={tags}
          onChangeText={setTags}
          style={styles.input}
          mode="outlined"
          outlineColor={palette.outline}
          activeOutlineColor={palette.primary}
          placeholderTextColor={palette.outline}
        />

        <View style={styles.actions}>
          <Button
            onPress={() => { reset(); onDismiss(); }}
            labelStyle={{ color: palette.primary }}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={{ backgroundColor: palette.primary }}
            labelStyle={{ color: palette.onPrimary }}
          >
            Guardar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal:   { backgroundColor: palette.surface, margin:20, padding:20, borderRadius:8 },
  header:  { fontSize:20, fontWeight:'bold', marginBottom:15, textAlign:'center' },
  input:   { marginBottom:15, backgroundColor: palette.surface },
  row:     { flexDirection:'row', justifyContent:'space-between', marginBottom:15 },
  actions: { flexDirection:'row', justifyContent:'flex-end', marginTop:10 }
});

