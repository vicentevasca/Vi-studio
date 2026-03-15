// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoUXKgCVTVeapOIhFAx_tQSyp9etT4M34",
  authDomain: "vi-studio-core.firebaseapp.com",
  projectId: "vi-studio-core",
  storageBucket: "vi-studio-core.firebasestorage.app",
  messagingSenderId: "567597957944",
  appId: "1:567597957944:web:69959b423bca709a2db7cd",
  measurementId: "G-W6C0BCYES1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics solo en el cliente — getAnalytics requiere APIs del navegador
// y lanza un error si se ejecuta en contexto SSR/SSG (Node.js)
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export const db = getFirestore(app);
export const auth = getAuth(app);