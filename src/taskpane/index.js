/* eslint-disable no-undef */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-functions.js";
import {
  getFirestore,
  setDoc,
  getDocs,
  where,
  doc,
  query,
  collection,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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
const functions = getFunctions(app);
const addUserAcc = httpsCallable(functions, "addUserAcc");

function addmail(qrcode, sender, receiver, date) {
  $.getJSON("https://json.geoiplookup.io/?callback=?", function (data) {
    var information = JSON.stringify(data, null, 2);
    const user = auth.currentUser;
    setDoc(doc(db, "emails", qrcode), {
      qrcode: qrcode,
      sender: sender,
      receiver: receiver,
      isread: 0,
      date: date,
      userid: user.uid,
      information: information,
    })
      .then(() => {
        document.getElementById("btnmuhurle").style.display = "none";
        document.getElementById("qrdescription").innerHTML =
          "<h3>E-postanız mühürlendi. E-postanızı gönderebilirsiniz.</h3>";
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("myModal").style.display = "block";
        document.getElementsByClassName("modal-body")[0].innerHTML = "<h3>Yetkiniz yok! E-postanız mühürlenemedi<h3>";
      });
  });
}

let updateusers = [];
let updateuserdocs = [];
let addusers = [];

async function getuser(mail) {
  const q = query(collection(db, "users"), where("email", "==", mail)).withConverter(userConverter);

  const querySnapshot = await getDocs(q);
  const para = document.createElement("div");
  if (querySnapshot.size > 0) {
    querySnapshot.forEach(async (doc) => {
      updateuserdocs.push(doc);

      const user = doc.data();

      if (user.phone != "") {
        para.innerHTML =
          "<label for='fname'>" +
          mail +
          "</label><input type='text' id='fname' name='" +
          mail +
          "' value='" +
          user.phone +
          "' placeholder='Telefon numarası girin' onchange=updateuser('" +
          mail +
          "') />";
      } else {
        para.innerHTML =
          "<label for='fname'>" +
          mail +
          "</label><input type='text' id='fname' name='" +
          mail +
          "' value='' placeholder='Telefon numarası girin' onchange=updateuser('" +
          mail +
          "') />";
      }
      document.getElementById("divphonenumber2").appendChild(para);
      // return doc.phone;
    });
  } else {
    para.innerHTML =
      "<label for='fname'>" +
      mail +
      "(Yeni Kayıt)</label><input type='text' id='fname' name='" +
      mail +
      "' value='' placeholder='Telefon numarası girin' onchange=\"adduser('" +
      mail +
      "')\" />";
    document.getElementById("divphonenumber2").appendChild(para);
    // addusers.push(mail);
  }
}

function adduser(mail) {
  if (!addusers.includes(mail)) {
    addusers.push(mail);
  }
}

function updateuser(mail) {
  if (!updateusers.includes(mail)) {
    updateusers.push(mail);
  }
}

function save() {
  if (addusers.length > 0) {
    for (let i = 0; i < addusers.length; i++) {
      var uid = create_UUID();
      var phonevalue = document.getElementsByName(addusers[i])[0].value;
      setDoc(doc(db, "users", uid), {
        email: addusers[i],
        phone: phonevalue,
        id: uid,
        statu: 0,
      });
      addUserAcc({ email: addusers[i], id: uid, phone: phonevalue })
        .then((msg) => {
          document.getElementsByClassName("modal-body")[0].innerHTML = msg;
        })
        .catch((error) => {
          console.log(error);
          document.getElementById("myModal").style.display = "block";
          document.getElementsByClassName("modal-body")[0].innerHTML = error;
        });
    }
  }

  if (updateusers.length > 0) {
    console.log(updateusers);
    for (let j = 0; j < updateusers.length; j++) {
      var phonevalue = document.getElementsByName(updateusers[j])[0].value;

      for (let index = 0; index < updateuserdocs.length; index++) {
        var user = updateuserdocs[index].data();
        console.log(user);
        if (user.email == updateusers[j]) {
          const docRef = doc(db, "users", user.id);
          updateDoc(docRef, {
            phone: phonevalue,
          });
        }
      }
    }
  }
  document.getElementById("divphonenumber").style.display = "none";
}

function addsecuremail(qrcode, sender, receiver, date, body, receiverid) {
  $.getJSON("https://json.geoiplookup.io/?callback=?", function (data) {
    var information = JSON.stringify(data, null, 2);
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
      information: information,
    });
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

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

const userConverter = {
  toFirestore: (user) => {
    return {
      id: user.id,
      phone: user.phone,
      email: user.email,
      statu: user.statu,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new User(data.id, data.phone, data.email, data.statu);
  },
};

class User {
  constructor(id, phone, email, statu) {
    this.id = id;
    this.phone = phone;
    this.email = email;
    this.statu = statu;
  }
  toString() {
    return this.id + ", " + this.phone;
  }
}

window.addmail = addmail;
window.addsecuremail = addsecuremail;
window.signin = signin;
window.check = check;
window.checkstamp = checkstamp;
window.logout = logout;
window.getuser = getuser;
window.adduser = adduser;
window.updateuser = updateuser;
window.save = save;
