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

      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.buttonBack}>
        Volver al Inicio
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    marginVertical: 10,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  fileText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  buttonBack: {
    marginTop: 20,
  },
});

export default NotesScreen;