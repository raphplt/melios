// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Auth

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAgc4HVGcNWUU--NLCQWV-NFS67Wyg-NQk",
	authDomain: "melios-4a03d.firebaseapp.com",
	projectId: "melios-4a03d",
	storageBucket: "melios-4a03d.appspot.com",
	messagingSenderId: "709212823740",
	appId: "1:709212823740:web:560ee68488c5803d05b0b9",
	measurementId: "G-98S1QD8H2L",
};

export let app = initializeApp(firebaseConfig);
export let db = getFirestore(app);
export const auth = getAuth(app);

try {
	console.log("Initializing Firebase...");
	app = initializeApp(firebaseConfig);
	console.log("Firebase initialized successfully.");

	console.log("Initializing Firestore...");
	db = getFirestore(app);
	console.log("Firestore initialized successfully.");
} catch (error) {
	console.error("Error initializing Firebase: ", error);
}
