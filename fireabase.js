// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEKRic_tOXWzpQMv9LMbOxreav3_glVno",
  authDomain: "fir-auth-ezdrive.firebaseapp.com",
  projectId: "fir-auth-ezdrive",
  storageBucket: "fir-auth-ezdrive.appspot.com",
  messagingSenderId: "618545194770",
  appId: "1:618545194770:web:a4bf45026c823b1797b5cb"
};



export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DATABASE = getFirestore(FIREBASE_APP);
export const auth = getAuth()

export const authSignout = async () => auth.signOut();