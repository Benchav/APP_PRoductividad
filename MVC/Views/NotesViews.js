import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import {
  Text,
  Card,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Chip,
  IconButton,
} from 'react-native-paper';
import notesController from '../Controllers/notesController';

const backgroundImage = { uri: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1080&q=80' };


export default function NotesViews() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

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
      const all = await notesController.getAllNotes();
      setNotes(all);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar las notas');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (note = null) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title || '');
      setTexto(note.texto || '');
      setTags(Array.isArray(note.tags) ? note.tags.join(',') : '');
    }
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingNote(null);
    setTitle('');
    setTexto('');
    setTags('');
    setError('');
  };

  const handleSave = async () => {
    if (!title.trim() || !texto.trim()) {
      setError('Título y texto son obligatorios');
      return;
    }

    const payload = {
      title: title.trim(),
      texto: texto.trim(),
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingNote) {
        await notesController.updateNote(editingNote.id, payload);
      } else {
        await notesController.createNote(payload);
      }
      closeForm();
      fetchNotes();
    } catch (e) {
      console.error(e);
      setError('Error al guardar la nota');
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar nota',
      '¿Seguro que quieres eliminar esta nota?',
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
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.pageTitle}>Notas:</Text>
          {notes.map(note => (
            <Card key={note.id} style={styles.card}>
              <Card.Title
                title={note.title || 'Sin título'}
                right={() => (
                  <IconButton
                    icon="delete-outline"
                    onPress={() => handleDelete(note.id)}
                  />
                )}
              />
              <Card.Content>
                <Text style={styles.texto}>{note.texto || 'Sin contenido'}</Text>
                <View style={styles.tagsRow}>
                  {(Array.isArray(note.tags) ? note.tags : []).map(tag => (
                    <Chip key={tag} style={styles.chip}>{tag}</Chip>
                  ))}
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => openForm(note)}>Editar</Button>
              </Card.Actions>
            </Card>
          ))}
          {notes.length === 0 && !loading && (
            <Text style={styles.empty}>No hay notas aún</Text>
          )}
        </ScrollView>

        <FAB icon="plus" style={styles.fab} onPress={() => openForm()} />

        <Portal>
          <Modal
            visible={formVisible}
            onDismiss={closeForm}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.formHeader}>
              {editingNote ? 'Editar Nota' : 'Nueva Nota'}
            </Text>
            <TextInput
              label="Título"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Texto"
              value={texto}
              onChangeText={setTexto}
              style={[styles.input, { height: 120 }]}
              mode="outlined"
              multiline
            />
            <TextInput
              label="Etiquetas (coma)"
              value={tags}
              onChangeText={setTags}
              style={styles.input}
              mode="outlined"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.actions}>
              <Button onPress={closeForm}>
                <Text>Cancelar</Text>
              </Button>
              <Button mode="contained" onPress={handleSave}>
                <Text style={{ color: 'white' }}>Guardar</Text>
              </Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(249, 251, 253, 0.92)',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2D3748',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    elevation: 2,
    shadowColor: '#1A202C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 16,
  },
  card: {
    marginVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1A202C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  texto: {
    marginBottom: 12,
    color: '#4A5568',
    lineHeight: 24,
    fontSize: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: '#EBF4FF',
    borderRadius: 20,
    height: 34,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 28,
    bottom: 28,
    backgroundColor: '#4C6FFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#4C6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 80,
    color: '#A0AEC0',
    fontSize: 18,
    marginHorizontal: 40,
    lineHeight: 28,
    fontWeight: '500',
  },
  modal: {
    backgroundColor: 'white',
    margin: 28,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1A202C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  formHeader: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 28,
    color: '#2D3748',
    textAlign: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  input: {
    marginBottom: 18,
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 16,
    borderColor: '#E2E8F0',
  },
  error: {
    color: '#F56565',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 16,
  },
});