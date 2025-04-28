// TasksView.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Text, Card, ProgressBar, FAB } from 'react-native-paper';
import tasksController from '../Controllers/taskController';
import TaskItem from '../../Components/TaskItem';
import TaskForm from '../../Components/TaskForm';

export default function TasksView() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');

  useEffect(() => { refresh(); }, []);
  
  const refresh = () => {
    const allTasks = tasksController.getTasks();
    setTasks(allTasks);
    applyFilters(allTasks, search, filter);
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

  const handleDeleteTask = (id) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => {
            tasksController.deleteTask(id);
            refresh();
          }
        },
      ]
    );
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const inProgress = tasks.filter(t => t.status === 'En progreso').length;
  const pending = tasks.filter(t => t.status === 'Pendiente').length;
  const progressRatio = total ? completed / total : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Administrador de Tareas</Text>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statRow}>
              <Text style={styles.statLabel}>Tareas Totales:</Text>
              <Text style={styles.statValue}>{total}</Text>
            </Card.Content>
            <Card.Content style={styles.subStats}>
              <Text style={styles.subStatText}>Pendientes: {pending}</Text>
              <Text style={styles.subStatText}>En progreso: {inProgress}</Text>
              <Text style={styles.subStatText}>Completadas: {completed}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statRow}>
              <Text style={styles.statLabel}>Progreso Total:</Text>
              <Text style={styles.statValue}>{Math.round(progressRatio * 100)}%</Text>
            </Card.Content>
            <Card.Content>
              <ProgressBar progress={progressRatio} style={styles.progress} />
              <Text style={styles.progressText}>{completed} de {total} tareas completadas</Text>
            </Card.Content>
          </Card>
        </View>

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar tareas..."
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              applyFilters(tasks, text, filter);
            }}
          />
          <View style={styles.filterRow}>
            {['Todas', 'Pendiente', 'En progreso', 'Completada'].map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filter === status && styles.filterButtonActive
                ]}
                onPress={() => {
                  setFilter(status);
                  applyFilters(tasks, search, status);
                }}
              >
                <Text style={filter === status ? styles.filterButtonTextActive : styles.filterButtonText}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* LISTA DE TAREAS */}
        {filteredTasks.length > 0 ? (
          filteredTasks.map(item => (
            <TaskItem
              key={item.id}
              task={item}
              onToggle={id => { tasksController.toggleTask(id); refresh(); }}
              onDelete={handleDeleteTask}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No hay tareas que coincidan con tu búsqueda</Text>
        )}
      </ScrollView>

      {/* FORMULARIO */}
      <TaskForm
        visible={formVisible}
        onDismiss={() => setFormVisible(false)}
        onSubmit={data => { tasksController.addTask(data); refresh(); }}
      />

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setFormVisible(true)}
      />
    </View>
  );
}

// TasksView.js (cambios solo en el StyleSheet)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  headerContainer: { marginBottom: 24 },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    textAlign: 'center', 
    marginBottom: 20,
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  statCard: { 
    marginVertical: 8, 
    borderRadius: 12, 
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statLabel: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#374151',
    letterSpacing: 0.3,
  },
  statValue: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#3B82F6',
  },
  subStats: { 
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subStatText: { 
    fontSize: 14, 
    color: '#6B7280',
    fontWeight: '500',
  },
  progress: { 
    marginVertical: 8, 
    height: 10, 
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  progressText: { 
    marginTop: 8, 
    fontSize: 12, 
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  searchContainer: { 
    marginTop: 16,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderColor: '#E5E7EB',
    borderWidth: 2,
    color: '#1F2937',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  filterRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: { 
    color: '#6B7280', 
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: { 
    color: 'white', 
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 32, 
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});