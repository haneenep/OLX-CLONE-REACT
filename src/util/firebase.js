import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBuNc9LZjncy0kukPU62JkYFg3sD-9Z64g",
  authDomain: "olx-clone-d2e34.firebaseapp.com",
  projectId: "olx-clone-d2e34",
  storageBucket: "olx-clone-d2e34.firebasestorage.app",
  messagingSenderId: "1073878732536",
  appId: "1:1073878732536:web:ab98a60e47968aa3dbb50d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

const auth = getAuth(app)

const storage = getStorage(app)

export {app,db,auth,storage}