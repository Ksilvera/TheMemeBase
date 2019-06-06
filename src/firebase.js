const firebase = require('firebase/app');
require('firebase/auth');
require("firebase/firestore");

const config = {
//paste config here
    apiKey: "AIzaSyBvYesg7q0LtaHpLcMjWXVGws3_v7axZgA",
    authDomain: "memebase-a6b9e.firebaseapp.com",
    databaseURL: "https://memebase-a6b9e.firebaseio.com",
    projectId: "memebase-a6b9e",
    storageBucket: "memebase-a6b9e.appspot.com",
    messagingSenderId: "291815216399"
};



firebase.initializeApp(config);
let db = firebase.firestore();
db.settings({timestampsInSnapshots: true})
let auth = firebase.auth();
export default {
    firestore: db,
    auth: auth
};
