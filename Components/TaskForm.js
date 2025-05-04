// components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, TextInput, Button, Menu, Text } from 'react-native-paper';

const priorities = ['Baja', 'Media', 'Alta'];
const statuses   = ['Pendiente', 'En progreso', 'Completada'];

export default function TaskForm({ visible, onDismiss, onSubmit, initialValues }) {
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority]     = useState('Media');
  const [status, setStatus]         = useState('Pendiente');
  const [dueDate, setDueDate]       = useState('');
  const [tags, setTags]             = useState('');
  const [menuVisible, setMenuVisible] = useState({ priority:false, status:false });

  // Si vienen valores iniciales (editar), precargarlos
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description);
      setPriority(initialValues.priority);
      setStatus(initialValues.status);
      setDueDate(initialValues.due_date);
      setTags(initialValues.tags.join(','));
    }
  }, [initialValues]);

  const reset = () => {
    setTitle(''); setDescription(''); setPriority('Media');
    setStatus('Pendiente'); setDueDate(''); setTags('');
  };

  const handleSave = () => {
    const payload = {
      title,
      description,
      dueDate,
      priority,
      status,
      tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
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
        <Text style={styles.header}>
          {initialValues ? 'Editar Tarea' : 'Nueva Tarea'}
        </Text>

        <TextInput
          label="Título"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
        />

        <View style={styles.row}>
          <Menu
            visible={menuVisible.priority}
            onDismiss={()=>setMenuVisible(v=>({...v, priority: false}))}
            anchor={
              <Button
                mode="outlined"
                onPress={()=>setMenuVisible(v=>({...v, priority: true}))}
              >
                <Text>{priority}</Text>
              </Button>
            }
          >
            {priorities.map(p => (
              <Menu.Item
                key={p}
                title={p}
                onPress={() => {
                  setPriority(p);
                  setMenuVisible(v=>({...v, priority: false}));
                }}
              />
            ))}
          </Menu>

          <Menu
            visible={menuVisible.status}
            onDismiss={()=>setMenuVisible(v=>({...v, status: false}))}
            anchor={
              <Button
                mode="outlined"
                onPress={()=>setMenuVisible(v=>({...v, status: true}))}
              >
                <Text>{status}</Text>
              </Button>
            }
          >
            {statuses.map(s => (
              <Menu.Item
                key={s}
                title={s}
                onPress={() => {
                  setStatus(s);
                  setMenuVisible(v=>({...v, status: false}));
                }}
              />
            ))}
          </Menu>
        </View>

        <TextInput
          label="Fecha (dd-mm-YYYY)"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Etiquetas (comma-separated)"
          value={tags}
          onChangeText={setTags}
          style={styles.input}
          mode="outlined"
        />

        <View style={styles.actions}>
          <Button onPress={() => { reset(); onDismiss(); }}>
            <Text>Cancelar</Text>
          </Button>
          <Button mode="contained" onPress={handleSave}>
            <Text style={{ color: 'white' }}>Guardar</Text>
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal:   { backgroundColor:'white', margin:20, padding:20, borderRadius:8 },
  header:  { fontSize:20, fontWeight:'bold', marginBottom:15, textAlign:'center' },
  input:   { marginBottom:15 },
  row:     { flexDirection:'row', justifyContent:'space-between', marginBottom:15 },
  actions: { flexDirection:'row', justifyContent:'flex-end', marginTop:10 }
});