// Views/TasksView.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  Text,
  Card,
  ProgressBar,
  FAB,
  Portal,
  Modal,
  Button as PaperButton,
} from 'react-native-paper';
import tasksController from '../Controllers/taskController';
import TaskItem from '../../Components/TaskItem';
import TaskForm from '../../Components/TaskForm';

const BACKGROUND_URL = 'https://www.todofondos.net/wp-content/uploads/1080x1920-Top-15-fondo-de-pantalla-minimalista-para-iPhone-y-iPad-576x1024.jpg';

const getTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function TasksView() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    const all = await tasksController.getTasks();
    setTasks(all);
    applyFilters(all, search, filter);
  };

  const applyFilters = (allTasks, searchText, statusFilter) => {
    let filtered = allTasks;
    if (searchText) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (statusFilter !== 'Todas') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    setFilteredTasks(filtered);
  };

  const handleDeleteTask = id => {
    Alert.alert('Eliminar tarea', '¿Seguro?', [{
      text: 'Cancelar', style: 'cancel'
    }, {
      text: 'Eliminar', style: 'destructive', onPress: async () => {
        await tasksController.deleteTask(id);
        refresh();
      }
    }]);
  };

  const handleToggle = async id => {
    await tasksController.toggleTask(id);
    refresh();
  };

  const openForm = (task = null) => {
    setEditingTask(task);
    setFormVisible(true);
  };

  const closeForm = () => {
    setEditingTask(null);
    setFormVisible(false);
  };

  const handleSubmit = async data => {
    const payload = {
      ...data,
      fecha: editingTask ? editingTask.fecha : getTodayDate(),
    };

    if (editingTask) {
      await tasksController.updateTask(editingTask.id, payload);
    } else {
      await tasksController.createTask(payload);
    }
    closeForm();
    refresh();
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const inProg = tasks.filter(t => t.status === 'En progreso').length;
  const pending = tasks.filter(t => t.status === 'Pendiente').length;
  const ratio = total ? completed / total : 0;

  return (
    <ImageBackground
      source={{ uri: BACKGROUND_URL }}
      style={styles.imageBackground}
      blurRadius={0}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Administrador de Tareas</Text>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statRow}>
                <Text style={styles.statLabel}>Totales:</Text>
                <Text style={styles.statValue}>{total}</Text>
              </Card.Content>
              <Card.Content style={styles.subStats}>
                <Text style={styles.subStatText}>Pendientes: {pending}</Text>
                <Text style={styles.subStatText}>En progreso: {inProg}</Text>
                <Text style={styles.subStatText}>Completadas: {completed}</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statRow}>
                <Text style={styles.statLabel}>Progreso:</Text>
                <Text style={styles.statValue}>{Math.round(ratio * 100)}%</Text>
              </Card.Content>
              <Card.Content>
                <ProgressBar progress={ratio} style={styles.progress} />
                <Text style={styles.progressText}>
                  {completed} de {total}
                </Text>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Buscar tareas..."
              value={search}
              onChangeText={txt => {
                setSearch(txt);
                applyFilters(tasks, txt, filter);
              }}
              style={styles.searchInput}
            />
            <View style={styles.filterRow}>
              {['Todas', 'Pendiente', 'En progreso', 'Completada'].map(s => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.filterButton,
                    filter === s && styles.filterButtonActive
                  ]}
                  onPress={() => {
                    setFilter(s);
                    applyFilters(tasks, search, s);
                  }}
                >
                  <Text style={filter === s
                    ? styles.filterButtonTextActive
                    : styles.filterButtonText
                  }>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {filteredTasks.map(task => (
            <TouchableOpacity
              key={task.id}
              activeOpacity={0.8}
              onPress={() => openForm(task)}
            >
              <TaskItem
                task={task}
                onToggle={handleToggle}
                onDelete={handleDeleteTask}
              />
            </TouchableOpacity>
          ))}
          {filteredTasks.length === 0 && (
            <Text style={styles.emptyText}>
              No hay tareas que coincidan
            </Text>
          )}
        </ScrollView>

        <TaskForm
          visible={formVisible}
          onDismiss={closeForm}
          onSubmit={handleSubmit}
          initialValues={editingTask}
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => openForm()}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 20,
  },
  headerContainer: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 25,
    color: '#1E293B',
    paddingVertical: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    marginHorizontal: -10,
    elevation: 6,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    letterSpacing: 0.5,
  },
  statCard: {
    marginVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(241, 245, 249, 0.6)',
  },
  statLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
  },
  subStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  subStatText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  progress: {
    height: 14,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748B',
    fontWeight: '600',
    marginTop: 6,
  },
  searchContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    elevation: 2,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 10,
    justifyContent: 'center',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1.8,
    borderColor: '#E2E8F0',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  filterButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94A3B8',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 35,
    backgroundColor: '#3B82F6',
    borderRadius: 30,
    width: 64,
    height: 64,
    elevation: 8,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});