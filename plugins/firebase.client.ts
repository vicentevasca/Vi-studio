import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin((nuxtApp) => {
    // Aquí pones las credenciales de tu proyecto original
    const firebaseConfig = {
        apiKey: "AIzaSyAoUXKgCVTVeapOIhFAx_tQSyp9etT4M34",
        authDomain: "vi-studio-core.firebaseapp.com",
        projectId: "vi-studio-core",
        storageBucket: "vi-studio-core.firebasestorage.app",
        messagingSenderId: "567597957944",
        appId: "1:567597957944:web:69959b423bca709a2db7cd",
        measurementId: "G-W6C0BCYES1"
    };

    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
    const analytics = getAnalytics(app);

    // Esto hace que Firebase esté disponible globalmente como $auth y $db
    return {
        provide: {
            auth,
            db
        }
    }
})