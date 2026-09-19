import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfpUBcsWIt3P2WS_iwrtaTsNXqvFZGyhM",
  authDomain: "transit-together.firebaseapp.com",
  projectId: "transit-together",
  storageBucket: "transit-together.firebasestorage.app",
  messagingSenderId: "612658479472",
  appId: "1:612658479472:web:33b71f49a16669a32f0fb5",
  measurementId: "G-TFHHB2QJC9"
};

// Initialize Firebase safely (avoid duplicate app initialization)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Safe analytics initialization for web/native
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics unsupported error in non-browser/dev environments
  });
}