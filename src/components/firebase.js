import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
    apiKey: "AIzaSyBvYesg7q0LtaHpLcMjWXVGws3_v7axZgA",
    authDomain: "memebase-a6b9e.firebaseapp.com",
    databaseURL: "https://memebase-a6b9e.firebaseio.com",
    projectId: "memebase-a6b9e",
    storageBucket: "memebase-a6b9e.appspot.com",
    messagingSenderId: "291815216399"
};

const app = initializeApp(config);

const db = getFirestore(app);

const auth = getAuth(app);

export {db, auth};

