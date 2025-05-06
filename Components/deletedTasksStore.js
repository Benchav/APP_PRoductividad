// components/deletedTasksStore.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'deletedTasks';

/**
 * Añade una tarea al historial de eliminadas.
 * Guarda al principio del array.
 */
export async function addDeletedTask(task) {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(task);
    await AsyncStorage.setItem(KEY, JSON.stringify(arr));
  } catch (e) {
    console.error('Error guardando tarea eliminada:', e);
  }
}

/**
 * Recupera todas las tareas eliminadas.
 * @returns {Promise<Array>}
 */
export async function getDeletedTasks() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error leyendo historial de eliminadas:', e);
    return [];
  }
}

/**
 * Elimina una tarea del historial de eliminadas por su ID.
 * @param {string} id
 */
export async function removeDeletedTask(id) {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const filtered = arr.filter(task => task.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error borrando del historial:', e);
  }
}