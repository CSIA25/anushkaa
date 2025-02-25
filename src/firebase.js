// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA2LOE9xz87N9HJYwyePhRDWE9Xm1r8Pxs", // Web API Key
  authDomain: "habit-tracker-7a6c7.firebaseapp.com", // Derived from Project ID
  projectId: "habit-tracker-7a6c7", // Project ID
  storageBucket: "habit-tracker-7a6c7.appspot.com", // Derived from Project ID
  messagingSenderId: "308951097106", // Project number
  appId: "1:308951097106:web:your-app-id" // You need to generate this from Firebase Console
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);