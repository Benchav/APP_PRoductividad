// Views/NotesViews.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
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
  useTheme,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import notesController from '../Controllers/notesController';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const bgImage = { uri: 'https://www.master-mbaonline.com/wp-content/uploads/2020/10/tecnicas-para-mejorar-la-productividad-de-las-personas-en-el-trabajo.png' };

export default function NotesViews() {
  const { colors } = useTheme();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [texto, setTexto] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchNotes(); }, []);

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

  const openForm = n => {
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
    setTitle(''); setTexto(''); setTags(''); setError('');
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
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (editing) await notesController.updateNote(editing.id, payload);
      else await notesController.createNote(payload);
      closeForm(); fetchNotes();
    } catch {
      setError('Error al guardar la nota');
    }
  };
  const remove = id => Alert.alert('Eliminar nota', '¿Confirmas que deseas eliminar esta nota permanentemente?', [
    { text:'Cancelar', style:'cancel' },
    {
      text:'Eliminar',
      style:'destructive',
      onPress: async() => { await notesController.deleteNote(id); fetchNotes(); }
    }
  ]);

  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <View style={[styles.overlay, { backgroundColor: colors.background }]}>
        <View style={styles.spacer} />
        {/* Header */}
        <View style={styles.header}>
          <Text variant="titleLarge" style={[styles.headerTitle, { color: colors.onBackground }]}>
            <MaterialCommunityIcons name="notebook" size={24} /> Mis Notas
          </Text>
          <Text variant="bodySmall" style={{ color: colors.outline }}>
            {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
          </Text>
        </View>
        <Divider style={{ backgroundColor: colors.outline }} />

        {/* Loading */}
        {loading && <ProgressBar indeterminate color={colors.primary} />}

        {/* Notes List */}
        <ScrollView
          contentContainerStyle={styles.list}
          keyboardDismissMode="on-drag"
          scrollEnabled={!formVisible}
        >
          {notes.map(n => (
            <Surface
              key={n.id}
              style={[styles.noteCard, { backgroundColor: colors.surface }]}
              elevation={2}
              onTouchEnd={() => openForm(n)}
            >
              <View style={styles.cardHeader}>
                <Text
                  variant="titleMedium"
                  style={[styles.noteTitle, { color: colors.onSurface }]}
                  numberOfLines={1}
                >
                  {n.title || 'Sin título'}
                </Text>
                <IconButton
                  icon="delete-outline"
                  size={20}
                  iconColor={colors.error}
                  onPress={() => remove(n.id)}
                />
              </View>
              <Text
                variant="bodyMedium"
                style={[styles.noteContent, { color: colors.onSurfaceVariant }]}
                numberOfLines={3}
              >
                {n.texto || 'Sin contenido'}
              </Text>
              {Array.isArray(n.tags) && n.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {n.tags.map(tag => (
                    <Chip
                      key={tag}
                      compact
                      style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                      textStyle={{ color: colors.onSurfaceVariant }}
                    >
                      #{tag}
                    </Chip>
                  ))}
                </View>
              )}
            </Surface>
          ))}
          {!loading && notes.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="note-off-outline" size={40} color={colors.outline} />
              <Text variant="bodyLarge" style={{ color: colors.outline }}>
                No hay notas creadas
              </Text>
            </View>
          )}
        </ScrollView>

        {/* FAB */}
        <FAB
          icon="plus"
          label="Nueva nota"
          style={[styles.fab, { backgroundColor: colors.primary }]}
          color={colors.onPrimary}
          onPress={() => openForm()}
        />

        {/* Note Editor Modal */}
        <Portal>
          <Modal
            visible={formVisible}
            onDismiss={closeForm}
            contentContainerStyle={[styles.modal, { backgroundColor: colors.background }]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <Text variant="titleMedium" style={[styles.modalTitle, { color: colors.onBackground }]}>
                <MaterialCommunityIcons name={editing ? 'pencil' : 'plus'} size={20} />{' '}
                {editing ? 'Editar' : 'Nueva'} Nota
              </Text>

              <TextInput
                label="Título"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                dense
                style={styles.input}
                outlineColor={colors.outline}
                activeOutlineColor={colors.primary}
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
                outlineColor={colors.outline}
                activeOutlineColor={colors.primary}
              />
              <TextInput
                label="Etiquetas (separadas por comas)"
                value={tags}
                onChangeText={setTags}
                mode="outlined"
                dense
                style={styles.input}
                outlineColor={colors.outline}
                activeOutlineColor={colors.primary}
              />
              {error && (
                <Text variant="bodySmall" style={[styles.error, { color: colors.error }]}>
                  <MaterialCommunityIcons name="alert-circle" size={14} /> {error}
                </Text>
              )}

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={closeForm}
                  style={{ borderColor: colors.outline }}
                  textColor={colors.onSurface}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={save}
                  style={{ backgroundColor: colors.primary }}
                >
                  Guardar
                </Button>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </Portal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1 },
  spacer: { height: Platform.OS === 'android' ? StatusBar.currentHeight : 20 },

  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },

  list: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTitle: {
    flex: 1,
    fontWeight: '500',
  },
  noteContent: {
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    borderRadius: 6,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 16,
  },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 16,
  },

  modal: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
});