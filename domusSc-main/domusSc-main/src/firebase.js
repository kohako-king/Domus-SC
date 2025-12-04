import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWNqPRVksBMahDk-yR9p8hUMOxkZSYq6Y",
  authDomain: "domus-f0f1e.firebaseapp.com",
  projectId: "domus-f0f1e",
  storageBucket: "domus-f0f1e.firebasestorage.app",
  messagingSenderId: "596298855370",
  appId: "1:596298855370:web:b61e8ddb93258323aa5533"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const IMAGE_BASE_URL = "http://localhost:3000/uploads";
