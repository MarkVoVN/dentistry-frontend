import { getStorage } from "firebase/storage";
import firebaseConfig from "./configs/firebase";

class FirebaseService {
  constructor(firebaseApp) {
    // this.auth = getAuth(firebaseApp);
    // this.db = getFirestore(firebaseApp);
    this.storage = getStorage(firebaseApp);
  }
}

// Remove this line since FirebaseService has already been imported in the previous code block
// import FirebaseService from './FirebaseService';

const firebaseServiceInstance = new FirebaseService(firebaseConfig.app);

export default firebaseServiceInstance;
