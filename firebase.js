import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getFirestore, collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, setDoc, orderBy, query, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMuzMN2CAfXJWTriat7bjbHvC_stw6tcw",
  authDomain: "cancha-deportiva-d84be-e3b28.firebaseapp.com",
  projectId: "cancha-deportiva-d84be-e3b28",
  storageBucket: "cancha-deportiva-d84be-e3b28.firebasestorage.app",
  messagingSenderId: "256886470769",
  appId: "1:256886470769:web:a4137401c8de23d63dc3d0",
  measurementId: "G-YZEWHQ1JT0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const COL = {
  courts: () => collection(db, "courts"),
  eventTypes: () => collection(db, "eventTypes"),
  reservations: () => collection(db, "reservations"),
  competitions: () => collection(db, "competitions"),
};

export const FS = {
  listen(colFn, cb, orderField = "order") {
    const q = query(colFn(), orderBy(orderField));
    return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  },
  listenAll(colFn, cb) {
    return onSnapshot(colFn(), snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  },
  async add(colFn, data) {
    return addDoc(colFn(), { ...data, createdAt: serverTimestamp() });
  },
  async set(colFn, id, data) {
    return setDoc(doc(db, colFn().path, id), data);
  },
  async update(colFn, id, data) {
    return updateDoc(doc(db, colFn().path, id), { ...data, updatedAt: serverTimestamp() });
  },
  async delete(colFn, id) {
    return deleteDoc(doc(db, colFn().path, id));
  }
};

export const AUTH = {
  login: (email, pass) => signInWithEmailAndPassword(auth, email, pass),
  logout: () => signOut(auth),
  onChange: (cb) => onAuthStateChanged(auth, cb)
};

export const UTIL = {
  formatDate(str) {
    if (!str) return "";
    const [y, m, d] = str.split("-");
    const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
  },
  formatDateLong(str) {
    if (!str) return "";
    const [y, m, d] = str.split("-");
    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    return `${parseInt(d)} de ${months[parseInt(m)-1]} de ${y}`;
  },
  today() {
    return new Date().toISOString().split("T")[0];
  },
  wa(phone, msg) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  },
  timeAdd(time, hours) {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + hours * 60;
    const nh = Math.floor(total / 60) % 24;
    const nm = total % 60;
    return `${String(nh).padStart(2,"0")}:${String(nm).padStart(2,"0")}`;
  }
};