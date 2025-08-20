import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "ordervista-admin",
  appId: "1:242038837877:web:41f2a16cb0ab2aa2fa1e3c",
  storageBucket: "ordervista-admin.firebasestorage.app",
  apiKey: "AIzaSyBychZngKAxxYB_X5SxnSSCkHvyLN2823c",
  authDomain: "ordervista-admin.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "242038837877",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
