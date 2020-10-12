import firebase from "firebase";
require('firebase/auth');
require('firebase/database');


// Initialize Firebase with a second Firebase project
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCKpo8-SAGdRJic3lQY8SNXbKCcth22kJo",
    authDomain: "instagram-clone-react-863d5.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-863d5.firebaseio.com",
    projectId: "instagram-clone-react-863d5",
    storageBucket: "instagram-clone-react-863d5.appspot.com",
    messagingSenderId: "788366915895",
    appId: "1:788366915895:web:4aa656ac0f0c63176302b2",
    measurementId: "G-6MXDL4M36G"
});



const db = firebaseApp.firestore();
//const auth = firebase.auth();
const storage = firebase.storage();

//export {db, auth, storage} ;
export {db, storage} ;