// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";
import { firebaseConfig } from "./firebase-config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser: User | null = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    currentUser = null;
  }
});

const signIn = async () => {
    if (currentUser) return currentUser;
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
}

const getCurrentUser = async (): Promise<User | null> => {
    if (currentUser) return currentUser;
    await signIn();
    return currentUser;
}

export { db, auth, getCurrentUser };
