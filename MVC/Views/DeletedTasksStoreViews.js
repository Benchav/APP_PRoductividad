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
  useTheme,
} from 'react-native-paper';
import {
  getDeletedTasks,
  removeDeletedTask,
} from '../../Components/deletedTasksStore';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export default function DeletedTasksStoreViews({ navigation }) {
  const { colors } = useTheme();
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

  const handleRemove = (id) => {
    Alert.alert(
      'Eliminar permanentemente',
      'Esta acción no se puede deshacer y se perderán todos los datos de la tarea',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          textStyle: { color: colors.onSurface },
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await removeDeletedTask(id);
            await loadDeleted();
          },
          textStyle: { color: colors.error },
        },
      ],
      { cancelable: true, userInterfaceStyle: 'light' }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Safe status bar spacer */}
      <View style={styles.spacer} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.headerContainer}>
          <Text variant="titleLarge" style={styles.headerTitle}>
            Tareas Eliminadas
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.headerSubtitle, { color: colors.outline }]}
          >
            {deleted.length} elemento{deleted.length !== 1 ? 's' : ''} en el historial
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.outline }]} />
        </View>

        {deleted.length === 0 ? (
          <View style={styles.emptyState}>
            <IconButton
              icon="delete-off-outline"
              size={40}
              color={colors.outline}
            />
            <Text variant="bodyLarge" style={[styles.emptyText, { color: colors.outline }]}>
              No hay elementos eliminados
            </Text>
          </View>
        ) : (
          deleted.map((task) => (
            <Surface
              key={task.id}
              style={[styles.taskCard, { backgroundColor: colors.surface }]}
              elevation={1}
            >
              <View style={styles.taskContent}>
                <View style={styles.taskInfo}>
                  <Text
                    variant="titleSmall"
                    style={[styles.taskTitle, { color: colors.onSurface }]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>

                  <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                      <IconButton
                        icon={task.priority === 'Alta' ? 'alert-circle' : 'circle-outline'}
                        size={14}
                        iconColor={task.priority === 'Alta' ? colors.error : colors.outline}
                        style={styles.metaIcon}
                      />
                      <Text variant="labelSmall" style={{ color: colors.outline }}>
                        {task.priority}
                      </Text>
                    </View>

                    <View style={styles.metaItem}>
                      <IconButton
                        icon="calendar-blank"
                        size={14}
                        iconColor={colors.outline}
                        style={styles.metaIcon}
                      />
                      <Text variant="labelSmall" style={{ color: colors.outline }}>
                        {moment(task.due_date).format('LL')}
                      </Text>
                    </View>
                  </View>

                  <Surface
                    style={[styles.statusBadge, { backgroundColor: colors.surfaceVariant }]}
                    elevation={0}
                  >
                    <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
                      {task.status}
                    </Text>
                  </Surface>
                </View>

                <IconButton
                  icon="delete-forever-outline"
                  size={24}
                  iconColor={colors.error}
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
        style={[styles.fab, { backgroundColor: colors.primaryContainer }]}
        color={colors.onPrimaryContainer}
        onPress={onRefresh}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  headerSubtitle: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyText: {
    textAlign: 'center',
  },
  taskCard: {
    borderRadius: 12,
    padding: 12,
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    gap: 8,
  },
  taskTitle: {
    fontWeight: '500',
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    margin: 0,
    padding: 0,
    width: 20,
    height: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  deleteButton: {
    margin: -8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 16,
  },
});