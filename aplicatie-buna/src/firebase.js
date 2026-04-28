import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configurația ta Firebase verificată
const firebaseConfig = {
  apiKey: "AIzaSyC8vF_3uxION9SmUvlEnAc_zO3AjLLgtRc",
  authDomain: "practica-72c9f.firebaseapp.com",
  projectId: "practica-72c9f",
  storageBucket: "practica-72c9f.firebasestorage.app",
  messagingSenderId: "102836513706",
  appId: "1:102836513706:web:45f04e68cca2c9b1a159d3",
  measurementId: "G-6FVCCL75JB"
};

// Inițializează Firebase
const app = initializeApp(firebaseConfig);

// Inițializează serviciile și exportă-le
export const db = getFirestore(app); // Folosit pentru ContactForm (baza de date)
export const auth = getAuth(app);    // Folosit pentru Login și Register (autentificare)

export default app;