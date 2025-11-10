import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfMDq_nWLaKwRYTsRdED-RI-KcEtOtX4k",
  authDomain: "web-noticias-f1f43.firebaseapp.com",
  projectId: "web-noticias-f1f43",
  storageBucket: "web-noticias-f1f43.firebasestorage.app",
  messagingSenderId: "1029516851499",
  appId: "1:1029516851499:web:42cbb1b2446d96a5432d6e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
