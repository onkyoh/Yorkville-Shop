import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyCg85egQlmCuTUw8n2GIW-gTWlLBbedqjg",
    authDomain: "yorkville-shop.firebaseapp.com",
    projectId: "yorkville-shop",
    storageBucket: "yorkville-shop.appspot.com",
    messagingSenderId: "48956371114",
    appId: "1:48956371114:web:4a7e02ef770b181975a0d3",
    measurementId: "G-DGD3K1QWPN"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);