import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import notesController from "../Controllers/notesController";
import ImagePreview from "../../Components/ImagePreview";


const NotesViews = ({ navigation }) => {
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
 // const [document, setDocument] = useState(null);

  useEffect(() => {
    const savedNote = notesController.getNote();
    if (savedNote) setNote(savedNote.text);
  }, []);

  const pickImage = async () => {
    const selectedImage = await notesController.pickImage();
    if (selectedImage) setImage(selectedImage);
  };

 /* const pickDocument = async () => {
    const selectedDocument = await notesController.pickDocument();
    if (selectedDocument) setDocument(selectedDocument);
  };*/

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notas Rápidas</Text>

      <TextInput
        label="Escribe tu nota aquí..."
        value={note}
        onChangeText={setNote}
        mode="outlined"
        multiline
        style={styles.input}
        numberOfLines={6}
      />

      <Button icon="camera" mode="contained" onPress={pickImage} style={styles.button}>
        Agregar Imagen
      </Button>

      {image && <ImagePreview uri={image} />}

 {/*
     <Button icon="file" mode="contained" onPress={pickDocument} style={styles.button}>
        Agregar Archivo
      </Button>

      {document && (
        <Text style={styles.fileText}>Archivo seleccionado: {document.split("/").pop()}</Text>
      )}

      */}
      

      <Button mode="contained" onPress={() => navigation.goBack()} style={[styles.button, styles.buttonBack]}>
        Volver al Inicio
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "#fff",
    height: 180,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    marginVertical: 12,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
  },
  buttonBack: {
    marginTop: 30,
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 10,
  },
  fileText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    fontStyle: "italic",
  },
});

export default NotesViews;