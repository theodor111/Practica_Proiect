import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configurația ta Firebase verificată
const firebaseConfig = {
  apiKey: "AIzaSyBVoMknUTvJs9sxdY2xOFeZTrhYn4br4yM",
  authDomain: "siteevenimente.firebaseapp.com",
  projectId: "siteevenimente",
  storageBucket: "siteevenimente.firebasestorage.app",
  messagingSenderId: "433120419486",
  appId: "1:433120419486:web:bf1a3c49a0bc44cb96a58f",
  measurementId: "G-7SKDE1SJ6N"
};

// Inițializează Firebase
const app = initializeApp(firebaseConfig);

// Inițializează serviciile și exportă-le
export const db = getFirestore(app); // Folosit pentru ContactForm (baza de date)
export const auth = getAuth(app);    // Folosit pentru Login și Register (autentificare)

export default app;