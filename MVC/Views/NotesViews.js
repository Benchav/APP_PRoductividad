import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Surface,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Chip,
  IconButton,
  Divider,
  ProgressBar,
  TouchableRipple,
} from 'react-native-paper';
import notesController from '../Controllers/notesController';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Paleta suavizada compartida
const palette = {
  background: '#FDFEFE',
  surface: '#FFFFFF',
  primary: '#82C3F7',
  primaryContainer: '#E8F6F3',
  outline: '#AEB6BF',
  onSurface: '#34495E',
  onPrimary: '#FFFFFF',
  error: '#E74C3C',
};

export default function NotesViews() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [texto, setTexto] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      setNotes(await notesController.getAllNotes());
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las notas');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (n) => {
    if (n) {
      setEditing(n);
      setTitle(n.title || '');
      setTexto(n.texto || '');
      setTags(Array.isArray(n.tags) ? n.tags.join(', ') : '');
    }
    setFormVisible(true);
  };
  const closeForm = () => {
    setEditing(null);
    setTitle('');
    setTexto('');
    setTags('');
    setError('');
    setFormVisible(false);
  };
  const save = async () => {
    if (!title.trim() || !texto.trim()) {
      setError('Título y contenido son requeridos');
      return;
    }
    const payload = {
      title: title.trim(),
      texto: texto.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) await notesController.updateNote(editing.id, payload);
      else await notesController.createNote(payload);
      closeForm();
      fetchNotes();
    } catch {
      setError('Error al guardar la nota');
    }
  };
  const remove = (id) =>
    Alert.alert(
      'Eliminar nota',
      '¿Confirmas que deseas eliminar esta nota permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await notesController.deleteNote(id);
            fetchNotes();
          },
        },
      ]
    );

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.spacer} />

      {/* Header */}
      <View style={styles.header}>
        <Text
          variant="titleLarge"
          style={[styles.headerTitle, { color: palette.onSurface }]}>
          <MaterialCommunityIcons
            name="notebook"
            size={24}
            color={palette.primary}
          />{' '}
          Mis Notas
        </Text>
        <Text variant="bodySmall" style={{ color: palette.outline }}>
          {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
        </Text>
      </View>
      <Divider style={{ backgroundColor: palette.outline }} />

      {/* Loading */}
      {loading && <ProgressBar indeterminate color={palette.primary} />}

      {/* Notes List */}
      <ScrollView
        contentContainerStyle={styles.list}
        scrollEnabled={!formVisible}>
        {notes.map((n) => (
          <TouchableRipple
            key={n.id}
            style={styles.noteCard}
            rippleColor={palette.outline}
            onPress={() => openForm(n)}>
            <Surface
              style={[styles.noteCard, { backgroundColor: palette.surface }]}
              elevation={2}>
              <View style={styles.cardHeader}>
                <Text
                  variant="titleMedium"
                  style={[styles.noteTitle, { color: palette.onSurface }]}
                  numberOfLines={1}>
                  {n.title || 'Sin título'}
                </Text>
                <IconButton
                  icon="delete-outline"
                  size={20}
                  iconColor={palette.error}
                  onPress={() => remove(n.id)}
                />
              </View>
              <Text
                variant="bodyMedium"
                style={[styles.noteContent, { color: palette.onSurface }]}
                numberOfLines={3}>
                {n.texto || 'Sin contenido'}
              </Text>
              {!!n.tags?.length && (
                <View style={styles.tagsContainer}>
                  {n.tags.map((tag) => (
                    <Chip
                      key={tag}
                      compact
                      style={[styles.tag, { backgroundColor: palette.primaryContainer }]}
                      textStyle={{ color: palette.onSurface }}>
                      #{tag}
                    </Chip>
                  ))}
                </View>
              )}
            </Surface>
          </TouchableRipple>
        ))}
        {!loading && notes.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="note-off-outline"
              size={40}
              color={palette.outline}
            />
            <Text variant="bodyLarge" style={{ color: palette.outline }}>
              No hay notas creadas
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        label="Nueva nota"
        style={[styles.fab, { backgroundColor: palette.primary }]}
        color={palette.onPrimary}
        onPress={() => openForm()}
      />

      {/* Note Editor Modal */}
      <Portal>
        <Modal
          visible={formVisible}
          onDismiss={closeForm}
          contentContainerStyle={[styles.modal, { backgroundColor: palette.surface }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}>
            <Text
              variant="titleMedium"
              style={[styles.modalTitle, { color: palette.onSurface }]}>
              <MaterialCommunityIcons
                name={editing ? 'pencil' : 'plus'}
                size={20}
                color={palette.primary}
              />{' '}
              {editing ? 'Editar' : 'Nueva'} Nota
            </Text>

            <TextInput
              label="Título"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              dense
              style={styles.input}
              outlineColor={palette.outline}
              activeOutlineColor={palette.primary}
              placeholderTextColor={palette.outline}
              maxLength={60}
            />
            <TextInput
              label="Contenido"
              value={texto}
              onChangeText={setTexto}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
              outlineColor={palette.outline}
              activeOutlineColor={palette.primary}
            />
            <TextInput
              label="Etiquetas (separadas por comas)"
              value={tags}
              onChangeText={setTags}
              mode="outlined"
              dense
              style={styles.input}
              outlineColor={palette.outline}
              activeOutlineColor={palette.primary}
            />
            {error ? (
              <Text
                variant="bodySmall"
                style={[styles.error, { color: palette.error }]}>
                ⚠️ {error}
              </Text>
            ) : null}

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={closeForm}
                style={{ borderColor: palette.outline }}
                textColor={palette.onSurface}>
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={save}
                style={{ backgroundColor: palette.primary }}
                textColor={palette.onPrimary}>
                Guardar
              </Button>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  spacer: { height: Platform.OS === 'android' ? StatusBar.currentHeight : 20 },

  header: { padding: 16, paddingBottom: 8 },
  headerTitle: { fontWeight: '600', marginBottom: 4 },

  list: { padding: 16, gap: 12, paddingBottom: 100 },
  noteCard: { borderRadius: 12, padding: 16, gap: 8 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTitle: { flex: 1, fontWeight: '500' },
  noteContent: { lineHeight: 22 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { borderRadius: 6 },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 16,
  },

  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },

  modal: { margin: 20, borderRadius: 16, overflow: 'hidden' },
  modalContent: { padding: 24, gap: 16 },
  modalTitle: { fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: 'transparent' },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  error: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
});