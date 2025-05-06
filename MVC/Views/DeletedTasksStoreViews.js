// Views/DeletedTasksStoreViews.js
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  IconButton,
  FAB,
} from 'react-native-paper';
import {
  getDeletedTasks,
  removeDeletedTask,  // <-- Asegúrate de exportar esto en deletedTasksStore.js
} from '../../Components/deletedTasksStore';

export default function DeletedTasksStoreViews({ navigation }) {
  const [deleted, setDeleted] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Carga inicial y cada vez que la pantalla gana foco
  const loadDeleted = async () => {
    const arr = await getDeletedTasks();
    setDeleted(arr);
  };

  useEffect(() => {
    loadDeleted();
    const unsubscribe = navigation.addListener('focus', loadDeleted);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeleted();
    setRefreshing(false);
  };

  const handleRemove = (id) => {
    Alert.alert(
      'Borrar del historial',
      '¿Seguro que quieres eliminar esta tarea del historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await removeDeletedTask(id);
            await loadDeleted();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.header}>Historial de Tareas Borradas</Text>

        {deleted.length === 0 ? (
          <Text style={styles.empty}>No hay tareas eliminadas aún</Text>
        ) : (
          deleted.map(task => (
            <Card key={task.id} style={styles.card}>
              <Card.Content style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.title}>{task.title}</Text>
                  {task.due_date && (
                    <Text style={styles.date}>Creada: {task.due_date}</Text>
                  )}
                  <Text style={styles.subtitle}>
                    {task.priority} · {task.status}
                  </Text>
                </View>
                <IconButton
                  icon="trash-can-outline"
                  size={20}
                  onPress={() => handleRemove(task.id)}
                />
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        small
        icon="refresh"
        style={styles.fab}
        onPress={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFD',
  },
  scroll: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#A0AEC0',
    fontSize: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#3B82F6',
  },
});