import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./configs/firebase";

const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
const storage = getStorage(firebaseApp);

export { firebaseApp, storage };
