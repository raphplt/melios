import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from ".";
import { collection, addDoc } from "firebase/firestore";
import { db } from ".";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useData } from "../context/DataContext";

export const createUser = async (form: any) => {
	try {
		const email =
			form.find((item: any) => item.hasOwnProperty("email"))?.email || "";
		const password =
			form.find((item: any) => item.hasOwnProperty("password"))?.password || "";

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		await AsyncStorage.setItem("user", JSON.stringify(user));
		await AsyncStorage.setItem("isAuthenticated", "true");

		const membersCollectionRef = collection(db, "members");

		const objectifs =
			form.find((item: any) => item.hasOwnProperty("objectifs"))?.objectifs || "";
		const aspects =
			form.find((item: any) => item.hasOwnProperty("aspects"))?.aspects || "";
		const motivation =
			form.find((item: any) => item.hasOwnProperty("motivation"))?.motivation ||
			"";
		const temps =
			form.find((item: any) => item.hasOwnProperty("temps"))?.temps || "";
		const nom = form.find((item: any) => item.hasOwnProperty("nom"))?.nom || "";

		await addDoc(membersCollectionRef, {
			uid: user.uid,
			habits: [],
			objectifs: objectifs,
			aspects: aspects,
			motivation: motivation,
			temps: temps,
			nom: nom,
		});

		return user;
	} catch (error) {
		console.error("Erreur lors de la création de l'utilisateur : ", error);
	}
};

export const disconnectUser = async () => {
	try {
		await AsyncStorage.removeItem("user");
		await AsyncStorage.removeItem("isAuthenticated");
		await AsyncStorage.removeItem("habitsData");
		await AsyncStorage.removeItem("habits");
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

		await AsyncStorage.setItem("user", JSON.stringify(user));
		await AsyncStorage.setItem("isAuthenticated", "true");

		return user;
	} catch (error: any) {
		console.error("Erreur lors de la connexion : ", error, error.code);
		if (error.code === "auth/user-not-found") {
			return { error: "L'utilisateur n'existe pas." };
		}
		if (error.code === "auth/invalid-credential") {
			return { error: "Le couple email/mot de passe est invalide." };
		}
	}
};

export const isUserConnected = async () => {
	try {
		const authPromise = new Promise<string>((resolve, reject) => {
			const unsubscribe = onAuthStateChanged(auth, (user) => {
				if (user) {
					resolve(user.uid);
				} else {
					reject(new Error("User not authenticated"));
				}
				unsubscribe();
			});
		});

		const uid = await authPromise;
		return uid;
	} catch (error) {
		console.log(
			"Member - Erreur lors de la récupération des habitudes : ",
			error
		);
		return null;
	}
};

export const checkEmailExists = async (email: string) => {
	const auth = getAuth();
	const signInMethods = await fetchSignInMethodsForEmail(auth, email);
	return signInMethods.length > 0;
};
