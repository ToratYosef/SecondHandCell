import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCAKyd6m_WtEed7_9gHf9ohjipgYMh6lw",
  authDomain: "secondhandwholecell.firebaseapp.com",
  projectId: "secondhandwholecell",
  storageBucket: "secondhandwholecell.firebasestorage.app",
  messagingSenderId: "369710406833",
  appId: "1:369710406833:web:b894a72425edbf1650d690",
  measurementId: "G-74W4XFGXFK",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle() {
  await signInWithPopup(auth, googleProvider);
}

export async function signInAsGuest() {
  await signInAnonymously(auth);
}

export { app };
