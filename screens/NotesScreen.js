import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const NotesScreen = ({ navigation }) => {
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);

  // Función para seleccionar una imagen
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Función para seleccionar un archivo
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

    if (result.type !== "cancel") {
      setDocument(result.uri);
    }
  };

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
        numberOfLines={6} // Aumentando el tamaño de la caja de texto
      />

      <Button icon="camera" mode="contained" onPress={pickImage} style={styles.button}>
        Agregar Imagen
      </Button>

      {image && (
        <Card style={styles.card}>
          <Image source={{ uri: image }} style={styles.image} />
        </Card>
      )}

      <Button icon="file" mode="contained" onPress={pickDocument} style={styles.button}>
        Agregar Archivo
      </Button>

      {document && (
        <Text style={styles.fileText}>Archivo seleccionado: {document.split("/").pop()}</Text>
      )}

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
    backgroundColor: "#FAFAFA", // Color de fondo más suave
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
    height: 180, // Haciendo la caja de texto más grande y espaciosa
    borderRadius: 12, // Bordes redondeados
    padding: 15,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    elevation: 3, // Añadiendo sombra sutil
  },
  button: {
    marginVertical: 12,
    backgroundColor: "#4A90E2", // Celeste
    borderRadius: 8, // Bordes redondeados para los botones
  },
  buttonBack: {
    marginTop: 30,
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 10,
  },
  card: {
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Sombra suave alrededor de la tarjeta
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
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

export default NotesScreen;
