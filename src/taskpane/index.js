/* eslint-disable no-undef */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, setDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLFSmyxhm_J-MkeLsr2BXpK3ffxdT30xY",
  authDomain: "e-stamppro.firebaseapp.com",
  projectId: "e-stamppro",
  storageBucket: "e-stamppro.appspot.com",
  messagingSenderId: "528522043004",
  appId: "1:528522043004:web:611ff87902fc2a56ca33f9",
  measurementId: "G-4TXSM066G4",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth();

function addmail(qrcode, sender, receiver, date) {
  const user = auth.currentUser;
  setDoc(doc(db, "emails", qrcode), {
    qrcode: qrcode,
    sender: sender,
    receiver: receiver,
    isread: 0,
    date: date,
    userid: user.uid,
  });
}

function addsecuremail(qrcode, sender, receiver, date, body, receiverid) {
  const user = auth.currentUser;
  setDoc(doc(db, "secureemails", qrcode), {
    qrcode: qrcode,
    sender: sender,
    receiver: receiver,
    isread: 0,
    date: date,
    body: body,
    issecret: body != "" ? 1 : 0,
    userid: user.uid,
    receiverid: receiverid,
  });
}

function signin(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      window.location = "taskpane.html";
    })
    .catch((error) => {
      var modal = document.getElementById("myModal");
      modal.style.display = "block";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorCode = error.code;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorMessage = error.message;
    });
}

function check() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
      window.location = "stamp.html";
    } else {
      window.location = "login.html";
    }
  });
}

function checkstamp() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location = "login.html";
    }
  });
}

function logout() {
  signOut(auth)
    .then(() => {
      window.location = "login.html";
    })
    .catch((error) => {});
}

window.addmail = addmail;
window.addsecuremail = addsecuremail;
window.signin = signin;
window.check = check;
window.checkstamp = checkstamp;
window.logout = logout;

