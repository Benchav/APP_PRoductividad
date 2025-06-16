// Views/DeletedTasksStoreViews.js
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  FAB,
  Divider,
} from 'react-native-paper';
import {
  getDeletedTasks,
  removeDeletedTask,
} from '../../Components/deletedTasksStore';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

// Paleta suavizada compartida
const palette = {
  background: '#FFFFFF',      // blanco puro
  primary: '#74B9E8',         // azul más suave
  primaryContainer: '#AEDFF7',// contenedor azul claro
  surface: '#FFFFFF',
  outline: '#95A5A6',         // gris suave
  onSurface: '#000000',
  onPrimary: '#FFFFFF',
  error: '#FF6B6B',           // rojo para errores
};

export default function DeletedTasksStoreViews({ navigation }) {
  const [deleted, setDeleted] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDeleted = async () => {
    const arr = await getDeletedTasks();
    setDeleted(arr);
  };

  useEffect(() => {
    loadDeleted();
    const unsub = navigation.addListener('focus', loadDeleted);
    return unsub;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeleted();
    setRefreshing(false);
  };

  const handleRemove = id => {
    Alert.alert(
      'Eliminar permanentemente',
      'Esta acción no se puede deshacer y se perderán todos los datos de la tarea',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          textStyle: { color: palette.onSurface },
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await removeDeletedTask(id);
            await loadDeleted();
          },
          textStyle: { color: palette.error },
        },
      ],
      { cancelable: true, userInterfaceStyle: 'light' }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}> 
      <View style={styles.spacer} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={palette.primary}
            colors={[palette.primary]}
          />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: palette.onSurface }]}>Tareas Eliminadas</Text>
          <Text style={[styles.headerSubtitle, { color: palette.outline }]}> 
            {deleted.length} elemento{deleted.length !== 1 ? 's' : ''} en el historial
          </Text>
          <Divider style={[styles.divider, { backgroundColor: palette.outline }]} />
        </View>

        {deleted.length === 0 ? (
          <View style={styles.emptyState}>
            <IconButton
              icon="delete-off-outline"
              size={40}
              color={palette.outline}
            />
            <Text style={[styles.emptyText, { color: palette.outline }]}>No hay elementos eliminados</Text>
          </View>
        ) : (
          deleted.map(task => (
            <Surface
              key={task.id}
              style={[styles.taskCard, { backgroundColor: palette.surface }]}
              elevation={1}
            >
              <View style={styles.taskContent}>
                <View style={styles.taskInfo}>
                  <Text
                    style={[styles.taskTitle, { color: palette.onSurface }]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>

                  <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                      <IconButton
                        icon={task.priority === 'Alta' ? 'alert-circle' : 'circle-outline'}
                        size={14}
                        iconColor={task.priority === 'Alta' ? palette.error : palette.outline}
                        style={styles.metaIcon}
                      />
                      <Text style={{ color: palette.outline, fontSize: 12 }}>{task.priority}</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <IconButton
                        icon="calendar-blank"
                        size={14}
                        iconColor={palette.outline}
                        style={styles.metaIcon}
                      />
                      <Text style={{ color: palette.outline, fontSize: 12 }}>
                        {moment(task.due_date, "DD-MM-YYYY").format("LL")}
                      </Text>
                    </View>
                  </View>

                  <Surface
                    style={[styles.statusBadge, { backgroundColor: palette.primaryContainer }]}
                    elevation={0}
                  >
                    <Text style={{ color: palette.primary, fontSize: 10 }}>{task.status}</Text>
                  </Surface>
                </View>

                <IconButton
                  icon="delete-forever-outline"
                  size={24}
                  color={palette.error}
                  onPress={() => handleRemove(task.id)}
                  style={styles.deleteButton}
                />
              </View>
            </Surface>
          ))
        )}
      </ScrollView>

      <FAB
        icon="refresh"
        label="Actualizar"
        style={[styles.fab, { backgroundColor: palette.primaryContainer }]}
        color={palette.onPrimary}
        onPress={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  spacer: { height: Platform.OS === 'android' ? StatusBar.currentHeight : 20 },
  scroll: { padding: 16, paddingBottom: 100, gap: 12 },
  headerContainer: { marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  headerSubtitle: { fontSize: 14, marginBottom: 8 },
  divider: { height: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 16 },
  emptyText: { textAlign: 'center', fontSize: 16 },
  taskCard: { borderRadius: 12, padding: 12 },
  taskContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskInfo: { flex: 1, gap: 8 },
  taskTitle: { fontWeight: '500', fontSize: 16 },
  metaContainer: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaIcon: { margin: 0, padding: 0, width: 20, height: 20 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginTop: 8 },
  deleteButton: { margin: -8 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
});