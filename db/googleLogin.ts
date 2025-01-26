import { db } from ".";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LAST_FETCH_KEY } from "./category";
import { User as FirebaseUser } from "firebase/auth";

export const loginOrCreateGoogleUser = async (user: FirebaseUser) => {
	try {
		const memberDocRef = doc(db, "members", user.uid);
		const memberDocSnap = await getDoc(memberDocRef);

		if (!memberDocSnap.exists()) {
			await setDoc(memberDocRef, {
				uid: user.uid,
				nom: user.displayName || "",
				email: user.email || "",
				habits: [],
				objectifs: [],
				aspects: [],
				motivation: "",
				temps: "",
			});
		}

		await AsyncStorage.removeItem("user");
		await AsyncStorage.removeItem("isAuthenticated");
		await AsyncStorage.setItem(LAST_FETCH_KEY, "0");

		await AsyncStorage.setItem("user", JSON.stringify(user));
		await AsyncStorage.setItem("isAuthenticated", "true");

		return { success: true, uid: user.uid };
	} catch (error) {
		console.error("Erreur lors de la création ou connexion Google : ", error);
		throw error;
	}
};
