import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCmZ0hNd5BzujSIj9bH1xfB0bG-x5xuV4A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tiffintrail-c98c2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tiffintrail-c98c2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tiffintrail-c98c2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "515247991697",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:515247991697:web:8b84a40ab54d05bc9a4830",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BWD2YNHJHB",
};

const app = initializeApp(firebaseConfig);

// Analytics is optional and only works in browser environments supporting it
void analyticsIsSupported().then((supported) => {
  if (supported) {
    try {
      getAnalytics(app);
    } catch {
      // ignore analytics errors in dev
    }
  }
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


