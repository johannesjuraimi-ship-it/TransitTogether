// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfpUBcsWIt3P2WS_iwrtaTsNXqvFZGyhM",
  authDomain: "transit-together.firebaseapp.com",
  projectId: "transit-together",
  storageBucket: "transit-together.firebasestorage.app",
  messagingSenderId: "612658479472",
  appId: "1:612658479472:web:33b71f49a16669a32f0fb5",
  measurementId: "G-TFHHB2QJC9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);