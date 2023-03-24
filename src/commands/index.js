import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

import {
  doc,
  collection,
  getFirestore,
  where,
  query,
  getDocs,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth();


function checkAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var elem = document.createElement("a");
      elem.innerHTML = "Çıkış yap";
      elem.style.backgroundColor = "#900005";
      elem.style.padding = "6px";
      elem.style.color = "white";
      elem.style.textDecoration = "none";
      elem.style.borderRadius = "2px";
      elem.style.cursor = "pointer";
      elem.onclick = logout();
      document.getElementById("link").appendChild(elem);
      // window.location = "stamp.html";
    } else {
      var elemm = document.createElement("a");
      elemm.innerHTML = "Çıkış yap";
      elemm.style.backgroundColor = "#900005";
      elemm.style.padding = "6px";
      elemm.style.color = "white";
      elemm.style.textDecoration = "none";
      elemm.style.borderRadius = "2px";
      elemm.style.cursor = "pointer";
      elemm.onclick = logout();
      document.getElementById("link").appendChild(elemm);
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

async function getdatabyid(id, username) {
  var eid = id.split("-")[0];

  if (eid == "732873") {
    const q = query(
      collection(db, "secureemails"),
      where("__name__", "==", id),
      where("receiver", "array-contains", username)
    ).withConverter(emailConverter);

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    if (querySnapshot.size > 0) {
      const docRef = doc(db, "secureemails", id);
      querySnapshot.forEach(async (doc) => {
        if (doc.exists()) {
          document.getElementById("context").style.display = "block";
          const email = doc.data();
          if (email.isread == 0) {
            document.getElementById("loading").style.display = "none";
            document.getElementById("divpositive").style.display = "block";
            document.getElementById("sender").innerHTML = email.sender;
            document.getElementById("receiver").innerHTML = email.receiver;
            document.getElementById("date").innerHTML = new Date(email.date.seconds * 1000);
            document.getElementById("body").innerHTML = email.body;

            updateDoc(docRef, {
              isread: 1,
            });
          } else {
            document.getElementById("loading").style.display = "none";
            document.getElementById("divnegative").style.display = "block";
            document.getElementById("sender").innerHTML = email.sender;
            document.getElementById("receiver").innerHTML = email.receiver;
            document.getElementById("date").innerHTML = new Date(email.date.seconds * 1000);
            document.getElementById("body").innerHTML = email.body;
          }
        } else {
          document.getElementById("divnotreceive").style.display = "block";
        }
      });
    } else {
      document.getElementById("divnotreceive").style.display = "block";
    }
  } else {
    const q = query(
      collection(db, "emails"),
      where("__name__", "==", id),
      where("receiver", "array-contains", username)
    ).withConverter(emailConverter);

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    if (querySnapshot.size > 0) {
      const docRef = doc(db, "emails", id);
      querySnapshot.forEach(async (doc) => {
        if (doc.exists()) {
          document.getElementById("context").style.display = "block";
          const email = doc.data();
          if (email.isread == 0) {
            document.getElementById("loading").style.display = "none";
            document.getElementById("divpositive").style.display = "block";
            document.getElementById("sender").innerHTML = email.sender;
            document.getElementById("receiver").innerHTML = email.receiver;
            document.getElementById("date").innerHTML = new Date(email.date.seconds * 1000);
            updateDoc(docRef, {
              isread: 1,
            });
          } else {
            document.getElementById("loading").style.display = "none";
            document.getElementById("divnegative").style.display = "block";
            document.getElementById("sender").innerHTML = email.sender;
            document.getElementById("receiver").innerHTML = email.receiver;
            document.getElementById("date").innerHTML = new Date(email.date.seconds * 1000);
          }
        } else {
          document.getElementById("divnotreceive").style.display = "block";
        }
      });
    } else {
      document.getElementById("divnotreceive").style.display = "block";
    }
  }
}

async function getall() {
  console.log("getall");
  const q = query(collection(db, "emails"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log("getall" + doc.id, " => ", doc.data());
  });
}

const emailConverter = {
  toFirestore: (email) => {
    return {
      date: email.date,
      isread: email.isread,
      qrcode: email.qrcode,
      receiver: email.receiver,
      sender: email.sender,
      body: email.body,
      issecret: email.issecret,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Email(data.date, data.isread, data.qrcode, data.receiver, data.sender, data.body, data.issecret);
  },
};

class Email {
  constructor(date, isread, qrcode, receiver, sender, body, issecret) {
    this.date = date;
    this.isread = isread;
    this.qrcode = qrcode;
    this.receiver = receiver;
    this.sender = sender;
    this.body = body;
    this.issecret = issecret;
  }
  toString() {
    return this.date + ", " + this.receiver + ", " + this.sender;
  }
}

window.checkAuth = checkAuth;
window.getdatabyid = getdatabyid;
window.getall = getall;
