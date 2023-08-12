import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvjaxyVr4fvV4lWA7zEP4E2IFHyP4lg08",
  authDomain: "clone-2-37e25.firebaseapp.com",
  projectId: "clone-2-37e25",
  storageBucket: "clone-2-37e25.appspot.com",
  messagingSenderId: "364052592416",
  appId: "1:364052592416:web:b41d01446442d105af8945",
  measurementId: "G-V4CJYMLKBV"
};

// const firebaseApp=firebase.initializeApp(firebaseConfig);
// // const firebaseApp = initializeApp(firebaseConfig);

// const db = firebaseApp.firestore();
// const auth = firebase.auth();

// export  { db, auth };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth,createUserWithEmailAndPassword  };

