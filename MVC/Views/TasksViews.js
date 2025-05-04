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

const BACKGROUND_URL = 'https://i.pinimg.com/736x/1a/fd/32/1afd327ffc36ac66429d3ac175fe5ae4.jpg'; 

export default function TasksView() {
  const [tasks, setTasks]                 = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [formVisible, setFormVisible]     = useState(false);
  const [editingTask, setEditingTask]     = useState(null);
  const [search, setSearch]               = useState('');
  const [filter, setFilter]               = useState('Todas');

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
    Alert.alert('Eliminar tarea','¿Seguro?',[{
      text: 'Cancelar', style: 'cancel'
    },{
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
    if (editingTask) {
      await tasksController.updateTask(editingTask.id, data);
    } else {
      await tasksController.createTask(data);
    }
    closeForm();
    refresh();
  };

  // Estadísticas
  const total      = tasks.length;
  const completed  = tasks.filter(t => t.completed).length;
  const inProg     = tasks.filter(t => t.status === 'En progreso').length;
  const pending    = tasks.filter(t => t.status === 'Pendiente').length;
  const ratio      = total ? completed / total : 0;

  return (
    <ImageBackground
      source={{ uri: BACKGROUND_URL }}
      style={styles.imageBackground}
      blurRadius={0}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HEADER */}
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
                <ProgressBar progress={ratio} style={styles.progress}/>
                <Text style={styles.progressText}>
                  {completed} de {total}
                </Text>
              </Card.Content>
            </Card>
          </View>

          {/* BUSCADOR */}
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
              {['Todas','Pendiente','En progreso','Completada'].map(s => (
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
                  <Text style={ filter===s
                    ? styles.filterButtonTextActive
                    : styles.filterButtonText
                  }>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* LISTA */}
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

        {/* FORMULARIO */}
        <TaskForm
          visible={formVisible}
          onDismiss={closeForm}
          onSubmit={handleSubmit}
          initialValues={editingTask}
        />

        {/* FAB */}
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
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.85)',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 16,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1E293B',
    letterSpacing: -0.5,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: -16,
    elevation: 3,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  statCard: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 0.2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    letterSpacing: -0.3,
  },
  subStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingVertical: 12,
  },
  subStatText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  progress: {
    height: 12,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  progressText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
  },
  searchContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  fab: {
    position: 'absolute',
    right: 28,
    bottom: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});