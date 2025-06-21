// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Import Realtime Database functions for your main DB

const firebaseConfig = {
  // Your MAIN Firebase project configuration (project-alcazar--admin)
  apiKey: "AIzaSyBH852WDX-8FLPTiHhDHwuA-SYIzPjadaA", // This should be for project-alcazar--admin
  authDomain: "project-alcazar--admin.firebaseapp.com",
  projectId: "project-alcazar--admin",
  storageBucket: "project-alcazar--admin.firebasestorage.app",
  messagingSenderId: "699760824052",
  appId: "1:699760824052:web:646797ef2442cdd7b458a1",
  // IMPORTANT: Add your Realtime Database URL for project-alcazar--admin here!
  databaseURL: "https://project-alcazar--admin-default-rtdb.firebaseio.com/" 
  // You MUST verify this URL in your Firebase Console -> Realtime Database for 'project-alcazar--admin'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Auth instance for project-alcazar--admin (admin login)
const db = getDatabase(app); // Realtime Database instance for project-alcazar--admin (admin profiles)

export { auth, db, app };