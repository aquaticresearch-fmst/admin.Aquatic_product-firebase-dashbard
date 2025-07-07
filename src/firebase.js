// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Realtime Database imports එකතු කරන ලදි
import { getDatabase, ref, onValue, set } from 'firebase/database'; // <--- මේ line එක අලුතින් එකතු කරන්න / update කරන්න

const firebaseConfig = {
  apiKey: "AIzaSyBH852WDX-8FLPTiHhDHwuA-SYIzPjadaA",
  authDomain: "project-alcazar--admin.firebaseapp.com",
  projectId: "project-alcazar--admin",
  storageBucket: "project-alcazar--admin.firebasestorage.app",
  messagingSenderId: "699760824052",
  appId: "1:699760824052:web:646797ef2442cdd7b458a1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Database instance එක initialize කරන ලදි
const db = getDatabase(app); // <--- මේ line එක අලුතින් එකතු කරන්න

// auth සහ අලුත් Realtime Database functions export කරන ලදි
export { auth, db, ref, onValue, set }; // <--- මේ line එක update කරන්න