import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCxbCqk4X-ALAMptP6YDOFA1A-OWhPDdSg",
  authDomain: "seguimientopartido.firebaseapp.com",
  projectId: "seguimientopartido",
  storageBucket: "seguimientopartido.firebasestorage.app",
  messagingSenderId: "58770097357",
  appId: "1:58770097357:web:cff584fbb412660da71584",
  measurementId: "G-BWFP38F2BH"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
