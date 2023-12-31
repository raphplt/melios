// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { initializeAuth } from "firebase/auth"; // Import Auth
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth";

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
// Initialize Firebase
export let app = initializeApp(firebaseConfig);

// Initialize Firestore
export let db = getFirestore(app);

// Initialize Auth
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

// Configurez la persistance lors de l'initialisation de l'application
try {
	console.log("Initializing Firebase...");
	app = initializeApp(firebaseConfig);
	console.log("Firebase initialized successfully.");

	console.log("Initializing Firestore...");
	db = getFirestore(app);
	console.log("Firestore initialized successfully.");

	console.log("Firebase Auth persistence set to AsyncStorage.");
} catch (error) {
	console.error("Error initializing Firebase: ", error);
}