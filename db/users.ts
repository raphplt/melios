import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from ".";

export const createUser = async (email: string, password: string) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		console.log(user);
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
	} catch (error) {
		console.error("Erreur lors de la connexion : ", error);
	}
};
