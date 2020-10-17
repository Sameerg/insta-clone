import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

// Initialize Firebase with a second Firebase project
const firebaseApp = firebase.initializeApp({
  // insert your config
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

//export {db, auth, storage} ;
export { db, auth, storage };
