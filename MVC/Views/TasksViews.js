// Views/TasksView.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Text,
  Card,
  ProgressBar,
  FAB,
  Button,
} from 'react-native-paper';
import tasksController from '../Controllers/taskController';
import TaskItem from '../../Components/TaskItem';
import TaskForm from '../../Components/TaskForm';

const palette = {
  background: '#FFFFFF',
  primary: '#5DADE2',
  primaryContainer: '#87CEEB',
  surface: '#FFFFFF',
  outline: '#7F8C8D',
  onSurface: '#000000',
  onPrimary: '#FFFFFF',
};

export default function TasksView({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { load(); }, []);
  useEffect(() => { apply(tasks, search, filter); }, [tasks, search, filter]);

  const load = async () => {
    const all = await tasksController.getTasks();
    const parsed = all.map(t => {
      if ((t.justification === undefined || t.justification === '') &&
          t.title.includes(' - Justificación: ')) {
        const parts = t.title.split(' - Justificación: ');
        return { ...t, title: parts[0], justification: parts[1] || '' };
      }
      return t;
    });
    setTasks(parsed || []);
  };

  const apply = (all, txt, st) => {
    let list = all;
    if (txt) {
      list = list.filter(t =>
        t.title.toLowerCase().includes(txt.toLowerCase())
      );
    }
    if (st !== 'Todas') {
      list = list.filter(t => t.status === st);
    }
    setFiltered(list);
  };

  const openForm = t => {
    setEditing(t);
    setFormVisible(true);
  };
  const closeForm = () => {
    setEditing(null);
    setFormVisible(false);
  };

  const save = async data => {
    if (editing) {
      await tasksController.updateTask(editing.id, data);
    } else {
      await tasksController.createTask(data);
    }
    closeForm();
    load();
  };

  const del = id => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => { await tasksController.deleteTask(id); load(); }
        }
      ]
    );
  };

  const toggle = async id => { await tasksController.toggleTask(id); load(); };

  const total = tasks.length;
  const pend = tasks.filter(t => t.status === 'Pendiente').length;
  const prog = tasks.filter(t => t.status === 'En progreso').length;
  const comp = tasks.filter(t => t.status === 'Completada').length;
  const pct = total ? comp / total : 0;

  const sortByStatus = list => {
    const order = { 'Pendiente': 0, 'En progreso': 1, 'Completada': 2 };
    return [...list].sort((a, b) => order[a.status] - order[b.status]);
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.safeSpacer} />
      <View style={styles.searchSpacer} />

      <TextInput
        placeholder="Buscar tareas..."
        placeholderTextColor={palette.outline}
        value={search}
        onChangeText={setSearch}
        style={[
          styles.search,
          { backgroundColor: palette.surface, borderColor: palette.outline }
        ]}
      />

      <View style={styles.filterRow}>
        {['Todas','Pendiente','En progreso','Completada'].map(s => (
          <TouchableOpacity
            key={s}
            style={[
              styles.filterBtn,
              {
                borderColor: palette.outline,
                backgroundColor: filter === s ? palette.primaryContainer : palette.surface
              }
            ]}
            onPress={() => setFilter(s)}
          >
            <Text style={{ color: filter === s ? palette.primary : palette.onSurface, fontSize: 12 }}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={[styles.statsCard, { backgroundColor: palette.surface }]} elevation={2}>
        <View style={styles.statsRow}>
          {[
            { label: 'Total', value: total },
            { label: 'Pend', value: pend },
            { label: 'Prog', value: prog },
            { label: 'Comp', value: comp },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statsCol}>
              <Text style={[styles.statValue, { color: palette.onSurface }]}>{value}</Text>
              <Text style={[styles.statLabel, { color: palette.outline }]}>{label}</Text>
            </View>
          ))}
        </View>
        <ProgressBar
          progress={pct}
          color={palette.primary}
          style={[styles.bar, { backgroundColor: palette.outline }]}
        />
      </Card>

      <ScrollView contentContainerStyle={styles.list}>
        {sortByStatus(filtered).map(t => (
          <Card
            key={t.id}
            style={[styles.taskCard, { backgroundColor: palette.surface }]}
            elevation={2}
          >
            <TouchableOpacity onPress={() => openForm(t)} activeOpacity={0.7}>
              <TaskItem task={t} onToggle={toggle} onDelete={del} />
            </TouchableOpacity>
            <Card.Actions style={styles.cardActions}>
              <Button
                mode="text"
                compact
                onPress={() => navigation.navigate('FocusModeViews', { taskId: t.id })}
                textColor={palette.primary}
              >
                Enfocar
              </Button>
            </Card.Actions>
          </Card>
        ))}
        {!filtered.length && (
          <Text style={[styles.empty, { color: palette.outline }]}>No hay tareas</Text>
        )}
      </ScrollView>

      <TaskForm
        visible={formVisible}
        onDismiss={closeForm}
        onSubmit={save}
        initialValues={editing}
        showJustification={formVisible && editing !== null}
      />

      <FAB
        icon="plus"
        label="Nueva tarea"
        style={[styles.fab, { backgroundColor: palette.primary }]}
        color={palette.onPrimary}
        onPress={() => openForm(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeSpacer: { height: Platform.OS === 'android' ? StatusBar.currentHeight : 20 },
  searchSpacer: { height: 16 },

  search: {
    marginHorizontal: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 8,
    borderWidth: 1,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },

  statsCard: {
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statsCol: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 16, fontWeight: '600' },
  statLabel: { fontSize: 12 },
  bar: { height: 6, borderRadius: 4 },

  list: { paddingHorizontal: 8, paddingBottom: 100 },

  // Estilos para las tarjetas de tarea con botón integrado
  taskCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  empty: { textAlign: 'center', marginTop: 20 },

  fab: { position: 'absolute', right: 24, bottom: 30 },
});