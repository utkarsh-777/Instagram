import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByKWrttl9RU3_vb6IbpbA4rkLrUnpeS7U",
  authDomain: "instagram-native-9b044.firebaseapp.com",
  projectId: "instagram-native-9b044",
  storageBucket: "instagram-native-9b044.appspot.com",
  messagingSenderId: "1013527914490",
  appId: "1:1013527914490:web:f391610d84bec668c92643",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
