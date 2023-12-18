import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from ".";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { db } from ".";

export const createUser = async (email: string, password: string) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		console.log(user);

		const membersCollectionRef = collection(db, "members");
		const newMemberRef = await addDoc(membersCollectionRef, {
			uid: user.uid,
			habits: [],
		});

		console.log("Document written with ID: ", newMemberRef.id);
	} catch (error) {
		console.error("Erreur lors de la création de l'utilisateur : ", error);
	}
};

export const disconnectUser = async () => {
	try {
		await getAuth().signOut();
	} catch (error) {
		console.error("Erreur lors de la déconnexion : ", error);
	}
};

export const loginUser = async (email: string, password: string) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		console.log(user);
		return user;
	} catch (error : any) {
		console.error("Erreur lors de la connexion : ", error, error.code);
		if (error.code === "auth/user-not-found") {
			return {error : "L'utilisateur n'existe pas."};
		}
		if (error.code === "auth/invalid-credential") {
			return {error: "Le couple email/mot de passe est invalide."};
		}
	}
};
