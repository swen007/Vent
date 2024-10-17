import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import path from "path";

const serviceAccount = require(path.join(
    __dirname,
    "..",
    "..",
    "credentials.json"
));

const firebaseConfig = {
    apiKey: "AIzaSyBYnvki-wpT_aNlrGU6uV4Ja3w8xqCVw9w",
    authDomain: "vent-sign.firebaseapp.com",
    projectId: "vent-sign",
    storageBucket: "vent-sign.appspot.com",
    messagingSenderId: "611855589593",
    appId: "1:611855589593:web:a4877ef285ce16a78c1ec8",
};

const adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const clientApp = initializeApp(firebaseConfig);

export const adminAuth = admin.auth(adminApp);
export const clientAuth = getAuth(clientApp);
export const adminDb = admin.firestore(adminApp);

adminDb.settings({ ignoreUndefinedProperties: true });
