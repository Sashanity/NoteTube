import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDwFlh9Wxr7bGQ3svIpk36q8IhxL0x6XUc",
    authDomain: "notetube-f3f9c.firebaseapp.com",
    databaseURL: "https://notetube-f3f9c.firebaseio.com",
    projectId: "notetube-f3f9c",
    storageBucket: "notetube-f3f9c.appspot.com",
    messagingSenderId: "111295025661",
    appId: "1:111295025661:web:fa12d14f6032cc51750994",
    measurementId: "G-VT23B1FVYP"
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
export const db = baseDb;

