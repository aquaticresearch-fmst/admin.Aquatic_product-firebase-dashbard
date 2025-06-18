// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

export { auth };
