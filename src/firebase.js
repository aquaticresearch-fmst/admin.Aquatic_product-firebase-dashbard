import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBEDoYtoM1YXQnvCORY66Khpf2rKQLQM_U",
  authDomain: "project-algazeya.firebaseapp.com",
  databaseURL: "https://project-algazeya-default-rtdb.firebaseio.com",
  projectId: "project-algazeya",
  storageBucket: "project-algazeya.appspot.com",
  messagingSenderId: "154081783522",
  appId: "1:154081783522:web:aef31af390e6c2ae6b78bb"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue };