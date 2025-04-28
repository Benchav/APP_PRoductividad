// components/TaskForm.js  — versión sin DateTimePicker
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, TextInput, Button, Menu, Text } from 'react-native-paper';

const priorities = ['Baja','Media','Alta'];
const statuses   = ['Pendiente','En progreso','Completada'];

export default function TaskForm({ visible, onDismiss, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Media');
  const [status, setStatus] = useState('Pendiente');
  const [dueDate, setDueDate] = useState('');      // ahora string
  const [tags, setTags] = useState('');
  const [menuVisible, setMenuVisible] = useState({ priority:false, status:false });

  const reset = () => {
    setTitle(''); setDescription(''); setPriority('Media');
    setStatus('Pendiente'); setDueDate(''); setTags('');
  };

  const handleSave = () => {
    onSubmit({ title, description, priority, status, dueDate, tags: tags.split(',').map(t=>t.trim()).filter(Boolean) });
    reset(); onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={()=>{ reset(); onDismiss(); }} contentContainerStyle={styles.modal}>
        <Text style={styles.header}>Nueva Tarea</Text>
        <TextInput label="Título" value={title} onChangeText={setTitle} style={styles.input} mode="outlined" />
        <TextInput label="Descripción" value={description} onChangeText={setDescription} style={styles.input} mode="outlined" multiline />

        <View style={styles.row}>
          <Menu
            visible={menuVisible.priority}
            onDismiss={()=>setMenuVisible(v=>({...v,priority:false}))}
            anchor={<Button mode="outlined" onPress={()=>setMenuVisible(v=>({...v,priority:true}))}>{priority}</Button>}
          >
            {priorities.map(p=>(
              <Menu.Item key={p} onPress={()=>{setPriority(p);setMenuVisible(v=>({...v,priority:false}));}} title={p}/>
            ))}
          </Menu>
          <Menu
            visible={menuVisible.status}
            onDismiss={()=>setMenuVisible(v=>({...v,status:false}))}
            anchor={<Button mode="outlined" onPress={()=>setMenuVisible(v=>({...v,status:true}))}>{status}</Button>}
          >
            {statuses.map(s=>(
              <Menu.Item key={s} onPress={()=>{setStatus(s);setMenuVisible(v=>({...v,status:false}));}} title={s}/>
            ))}
          </Menu>
        </View>

        <TextInput
          label="Fecha (YYYY-MM-DD)"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Etiquetas (coma-sep)"
          value={tags}
          onChangeText={setTags}
          style={styles.input}
          mode="outlined"
        />

        <View style={styles.actions}>
          <Button onPress={()=>{ reset(); onDismiss(); }}>Cancelar</Button>
          <Button mode="contained" onPress={handleSave}>Guardar</Button>
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