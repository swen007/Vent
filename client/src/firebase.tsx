import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBYnvki-wpT_aNlrGU6uV4Ja3w8xqCVw9w",
    authDomain: "vent-sign.firebaseapp.com",
    projectId: "vent-sign",
    storageBucket: "vent-sign.appspot.com",
    messagingSenderId: "611855589593",
    appId: "1:611855589593:web:a4877ef285ce16a78c1ec8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
