// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { initializeAuth } from "firebase/auth"; // Import Auth
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_API_KEY,
	authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
	projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
	storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
	messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
	appId: process.env.EXPO_PUBLIC_APP_ID,
	measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};
// Initialize Firebase
export let app = initializeApp(firebaseConfig);

// Initialize Firestore
export let db = getFirestore(app);

// Initialize Auth
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

// Export the initialized app and firestore connection
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