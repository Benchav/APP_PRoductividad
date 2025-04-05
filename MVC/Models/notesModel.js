//let noteData = { text: "", image: null, document: null };
let noteData = { text: "", image: null};

const notesModel = {
  getNote: () => {
    return noteData;
  },
  saveNote: (text) => {
    noteData.text = text;
  },
  saveImage: (imageUri) => {
    noteData.image = imageUri;
  },
 /* saveDocument: (docUri) => {
    noteData.document = docUri;
  },*/
};

export default notesModel;