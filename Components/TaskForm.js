// TaskForm.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Portal,
  Modal,
  TextInput,
  Button,
  Menu,
  Text,
  IconButton
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const priorities = ['Baja', 'Media', 'Alta'];
const statuses = ['Pendiente', 'En progreso', 'Completada'];

const palette = {
  surface: '#FFFFFF',
  primary: '#5DADE2',
  outline: '#7F8C8D',
  onSurface: '#000000',
  onPrimary: '#FFFFFF',
};

const getFormattedDate = date => {
  const now = date || new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function TaskForm({
  visible,
  onDismiss,
  onSubmit,
  initialValues,
  showJustification = false,  // <— Nuevo prop para controlar visibilidad
}) {
  const iv = initialValues || {};
  const [title, setTitle] = useState(iv.title || '');
  const [description, setDescription] = useState(iv.description || '');
  const [justification, setJustification] = useState(iv.justification || '');
  const [priority, setPriority] = useState(iv.priority || 'Media');
  const [status, setStatus] = useState(iv.status || 'Pendiente');
  const [tags, setTags] = useState((iv.tags || []).join(','));

  const [creationDate, setCreationDate] = useState(
    iv.created_date
      ? new Date(iv.created_date.split('-').reverse().join('-'))
      : new Date()
  );
  const [showCreationDate, setShowCreationDate] = useState(false);

  const [dueDate, setDueDate] = useState(
    iv.due_date
      ? new Date(iv.due_date.split('-').reverse().join('-'))
      : new Date()
  );
  const [showDueDate, setShowDueDate] = useState(false);

  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState('');
  const [menuPriorityVisible, setMenuPriorityVisible] = useState(false);
  const [menuStatusVisible, setMenuStatusVisible] = useState(false);

  // Reinicializar campos al abrir modal para NUEVA tarea
  useEffect(() => {
    if (visible && !iv.id) {
      setTitle('');
      setDescription('');
      setJustification('');
      setPriority('Media');
      setStatus('Pendiente');
      setTags('');
      setCreationDate(new Date());
      setDueDate(new Date());
      setSteps([]);
      setNewStep('');
      setMenuPriorityVisible(false);
      setMenuStatusVisible(false);
    }
  }, [visible, iv.id]);

  // Cargar pasos guardados o iniciales
  useEffect(() => {
    const loadSteps = async () => {
      if (iv.id) {
        const saved = await AsyncStorage.getItem(`task_steps_${iv.id}`);
        if (saved) {
          try {
            setSteps(JSON.parse(saved));
          } catch {
            setSteps([]);
          }
        } else {
          const defaultSteps = iv.steps?.map((s, i) => ({
            id: String(i),
            description: s.description,
            completed: s.completed
          })) || [];
          setSteps(defaultSteps);
        }
      } else {
        setSteps([]);
      }
    };
    loadSteps();
  }, [iv.id]);

  // Guardar pasos en AsyncStorage
  useEffect(() => {
    const saveSteps = async () => {
      if (iv.id) {
        await AsyncStorage.setItem(`task_steps_${iv.id}`, JSON.stringify(steps));
      }
    };
    saveSteps();
  }, [steps]);

  // Recargar valores al cambiar initialValues
  useEffect(() => {
    setTitle(iv.title || '');
    setDescription(iv.description || '');
    setJustification(iv.justification || '');
    setPriority(iv.priority || 'Media');
    setStatus(iv.status || 'Pendiente');
    setTags((iv.tags || []).join(','));
    setCreationDate(
      iv.created_date
        ? new Date(iv.created_date.split('-').reverse().join('-'))
        : new Date()
    );
    setDueDate(
      iv.due_date
        ? new Date(iv.due_date.split('-').reverse().join('-'))
        : new Date()
    );
  }, [initialValues]);

  const addStep = () => {
    if (!newStep.trim()) return;
    setSteps(prev => [
      ...prev,
      { id: Date.now().toString(), description: newStep, completed: false }
    ]);
    setNewStep('');
  };
  const toggleStep = index =>
    setSteps(s =>
      s.map((st, i) => (i === index ? { ...st, completed: !st.completed } : st))
    );
  const removeStep = index => setSteps(s => s.filter((_, i) => i !== index));

  const onChangeCreationDate = (e, sel) => {
    setShowCreationDate(false);
    if (sel) setCreationDate(sel);
  };
  const onChangeDueDate = (e, sel) => {
    setShowDueDate(false);
    if (sel) setDueDate(sel);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const payload = {
      title,                          // <— guardamos el título limpio
      description,
      justification,
      created_date: getFormattedDate(creationDate),
      due_date: getFormattedDate(dueDate),
      completed: iv.completed || false,
      user_id: iv.user_id || '',
      status,
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      steps,
    };
    if (iv.id) AsyncStorage.removeItem(`task_steps_${iv.id}`);
    onSubmit(payload);
    onDismiss();
  };

  const renderHeader = () => (
    <>
      <Text style={styles.header}>
        {iv.id ? 'Editar Tarea' : 'Nueva Tarea'}
      </Text>

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

      {showJustification && (
        <TextInput
          label="Justificación"
          value={justification}
          onChangeText={setJustification}
          mode="outlined"
          multiline
          outlineColor={palette.outline}
          activeOutlineColor={palette.primary}
          style={styles.input}
        />
      )}

      <Text style={styles.subHeader}>Fecha de creación</Text>
      <Button
        mode="outlined"
        onPress={() => setShowCreationDate(true)}
        style={styles.input}
      >
        {getFormattedDate(creationDate)}
      </Button>
      {showCreationDate && (
        <DateTimePicker
          value={creationDate}
          mode="date"
          display="default"
          onChange={onChangeCreationDate}
        />
      )}

      <Text style={styles.subHeader}>Fecha de entrega</Text>
      <Button
        mode="outlined"
        onPress={() => setShowDueDate(true)}
        style={styles.input}
      >
        {getFormattedDate(dueDate)}
      </Button>
      {showDueDate && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={onChangeDueDate}
        />
      )}

      <View style={styles.row}>
        <Menu
          visible={menuPriorityVisible}
          onDismiss={() => setMenuPriorityVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuPriorityVisible(true)}
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
                setMenuPriorityVisible(false);
              }}
            />
          ))}
        </Menu>

        <Menu
          visible={menuStatusVisible}
          onDismiss={() => setMenuStatusVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuStatusVisible(true)}
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
                setMenuStatusVisible(false);
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
    </>
  );

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
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            {renderHeader()}

            {steps.map((item, index) => (
              <View key={item.id} style={styles.stepRow}>
                <IconButton
                  icon={item.completed ? 'check' : 'checkbox-blank-outline'}
                  onPress={() => toggleStep(index)}
                />
                <Text style={item.completed ? styles.done : styles.step}>
                  {item.description}
                </Text>
                <IconButton icon="delete" onPress={() => removeStep(index)} />
              </View>
            ))}

            <View style={styles.actions}>
              <Button onPress={onDismiss} style={{ marginRight: 8 }}>
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={{ backgroundColor: palette.primary }}
                disabled={!title.trim()}
              >
                Guardar
              </Button>
            </View>
          </ScrollView>
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
    paddingLeft: 40,
  },
  modal: {
    backgroundColor: palette.surface,
    padding: 20,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: 20,
    width: '90%',
    maxHeight: '90%',
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
    marginTop: 20,
  },
});