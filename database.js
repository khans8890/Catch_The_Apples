// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getDatabase, onValue, ref, set } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATsmQF9ywbgDRAZDqABBD7HYk95lBbRek",
  authDomain: "catch-the-apples-c581a.firebaseapp.com",
  databaseURL: "https://catch-the-apples-c581a-default-rtdb.firebaseio.com",
  projectId: "catch-the-apples-c581a",
  storageBucket: "catch-the-apples-c581a.appspot.com",
  messagingSenderId: "1064166235686",
  appId: "1:1064166235686:web:f9113d6d44bd1ebbb950e7",
  measurementId: "G-HDPDF6MC21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let ptag = document.getElementById('test')
const db = getDatabase()
const reference = ref(db, 'jmfSLwU5/')

export default db;