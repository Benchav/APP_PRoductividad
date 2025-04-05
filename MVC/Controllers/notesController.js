import notesModel from "../Models/notesModel";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const notesController = {
  getNote: () => {
    return notesModel.getNote();
  },

  pickImage: async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    return !result.canceled ? result.assets[0].uri : null;
  },

  pickDocument: async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

    return result.type !== "cancel" ? result.uri : null;
  },
};

export default notesController;