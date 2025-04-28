import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_lKy0q1rTigILxYn74M52C_uFJf2SpGE",
  authDomain: "taskoapp-a649e.firebaseapp.com",
  projectId: "taskoapp-a649e",
  storageBucket: "taskoapp-a649e.appspot.com",
  messagingSenderId: "395148546027",
  appId: "1:395148546027:web:xxxxxx" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };