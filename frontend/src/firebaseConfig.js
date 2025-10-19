import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC575B-YoVSqjT6kBB-EjehSz_LoRB2ucI",
  authDomain: "kalaghar-d2746.firebaseapp.com",
  projectId: "kalaghar-d2746",
  storageBucket: "kalaghar-d2746.firebasestorage.app",
  messagingSenderId: "809890944113",
  appId: "1:809890944113:web:07494ecc8d01b52fa837d0",
  measurementId: "G-5T50185M49",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
