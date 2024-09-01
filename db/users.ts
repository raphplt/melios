import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	fetchSignInMethodsForEmail,
	deleteUser,
	sendEmailVerification,
	sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from ".";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from ".";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createUser = async (form: any) => {
	try {
		const emailQuestion = form.find((item: any) => item.slug === "email");
		const passwordQuestion = form.find((item: any) => item.slug === "password");

		if (!emailQuestion || !passwordQuestion) {
			throw new Error("Email or password question is missing in the form.");
		}

		const email = emailQuestion.answers[0]?.answer || "";
		const password = passwordQuestion.answers[0]?.answer || "";

		if (!email || !password) {
			throw new Error("Email or password is empty.");
		}

		let userCredential;
		try {
			userCredential = await createUserWithEmailAndPassword(auth, email, password);
		} catch (error: any) {
			throw new Error(
				"Failed to create user with email and password: " + String(error.message)
			);
		}

		const user = userCredential.user;

		try {
			await sendEmailVerification(user);
			console.log("Email de vérification envoyé.");
		} catch (error: any) {
			console.error("Erreur lors de l'envoi de l'email de vérification : ", error);
			throw new Error("Failed to send verification email: " + error.message);
		}

		const membersCollectionRef = collection(db, "members");

		const objectifs =
			form
				.find((item: any) => item.slug === "objectifs")
				?.answers.flatMap((a: any) => a.map((ans: any) => ans.answer)) || [];
		const aspects =
			form
				.find((item: any) => item.slug === "aspects")
				?.answers.flatMap((a: any) => a.map((ans: any) => ans.answer)) || [];
		const motivation =
			form.find((item: any) => item.slug === "motivation")?.answers[0]?.answer ||
			"";
		const temps =
			form.find((item: any) => item.slug === "temps")?.answers[0]?.answer || "";
		const nom =
			form.find((item: any) => item.slug === "nom")?.answers[0]?.answer || "";

		try {
			await addDoc(membersCollectionRef, {
				uid: user.uid,
				habits: [],
				objectifs: objectifs,
				aspects: aspects,
				motivation: motivation,
				temps: temps,
				nom: nom,
			});
		} catch (error: any) {
			throw new Error("Failed to add user data to Firestore: " + error.message);
		}

		try {
			await AsyncStorage.setItem("user", JSON.stringify(user));
			await AsyncStorage.setItem("isAuthenticated", "true");
			await AsyncStorage.setItem("lastFetchDate", "0");
		} catch (error: any) {
			throw new Error(
				"Failed to save user data to AsyncStorage: " + String(error.message)
			);
		}

		return user;
	} catch (error) {
		console.error("Erreur lors de la création de l'utilisateur : ", error);
		throw error;
	}
};

export const sendEmailResetPassword = async (email: string) => {
	try {
		if (!email) {
			throw new Error("L'adresse e-mail est requise.");
		}

		await sendPasswordResetEmail(auth, email);
		console.log("Email de réinitialisation de mot de passe envoyé à " + email);
		return { success: true, message: "Email de réinitialisation envoyé." };
	} catch (error: any) {
		console.error(
			"Erreur lors de l'envoi de l'email de réinitialisation : ",
			error
		);
		throw new Error("Failed to send password reset email: " + error.message);
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

		await AsyncStorage.removeItem("user");
		await AsyncStorage.removeItem("isAuthenticated");

		await AsyncStorage.setItem("user", JSON.stringify(user));
		await AsyncStorage.setItem("isAuthenticated", "true");

		return user;
	} catch (error: any) {
		console.log("Erreur lors de la connexion : ", error);

		switch (error.code) {
			case "auth/user-not-found":
				return {
					error:
						"L'utilisateur n'existe pas. Veuillez vérifier votre email et réessayer.",
				};
			case "auth/invalid-credential":
				return {
					error: "Le couple email/mot de passe est invalide. Veuillez réessayer.",
				};
			default:
				return {
					error:
						"Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.",
				};
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

export const deleteUserAccount = async () => {
	try {
		const user = getAuth().currentUser;
		if (user) {
			const userDocRef = doc(db, "members", user.uid);
			await deleteDoc(userDocRef);

			await deleteUser(user);

			await AsyncStorage.removeItem("user");
			await AsyncStorage.removeItem("isAuthenticated");
			await AsyncStorage.removeItem("habitsData");
			await AsyncStorage.removeItem("habits");

			console.log("Utilisateur supprimé avec succès.");
		} else {
			console.error("Aucun utilisateur authentifié trouvé.");
		}
	} catch (error) {
		console.error("Erreur lors de la suppression de l'utilisateur : ", error);
	}
};