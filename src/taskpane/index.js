import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBg1aeDrQJwvI178tUo4cYrXB2T4LhZN8U",
  authDomain: "dijisecpro.firebaseapp.com",
  databaseURL: "https://dijisecpro-default-rtdb.firebaseio.com",
  projectId: "dijisecpro",
  storageBucket: "dijisecpro.appspot.com",
  messagingSenderId: "165428794518",
  appId: "1:165428794518:web:87692def8085eaf2bc5eb7",
  measurementId: "G-3KBSJ8PGBN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

try {
  const docRef = await addDoc(collection(db, "users"), {
    first: "Ada",
    last: "Lovelace",
    born: 1815,
  });
  // eslint-disable-next-line no-undef
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  // eslint-disable-next-line no-undef
  console.error("Error adding document: ", e);
}
