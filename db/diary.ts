import {
	collection,
	query,
	where,
	getDocs,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";
import { db, auth } from ".";

/**
 * Récupère les entrées du journal de l'utilisateur actuellement authentifié.
 */
export const getDiaryEntries = async () => {
	try {
		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");

		const diaryCollectionRef = collection(db, "diary");
		const q = query(diaryCollectionRef, where("uid", "==", uid));

		const querySnapshot = await getDocs(q);

		const diaryEntries = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return diaryEntries;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des entrées du journal :",
			error
		);
		throw error;
	}
};

/**
 * Ajoute une entrée au journal de l'utilisateur actuellement authentifié.
 */
export const createDiaryEntry = async (
	content: string,
	note: string,
	emoji: string
) => {
	try {
		const uid = auth.currentUser?.uid;
		if (!uid) throw new Error("Utilisateur non authentifié");

		const diaryCollectionRef = collection(db, "diary");

		const newDiaryEntry = {
			uid: uid,
			date: serverTimestamp(),
			content: content,
			note: note,
			emoji: emoji,
		};

		const docRef = await addDoc(diaryCollectionRef, newDiaryEntry);
		console.log("Document diary créé avec succès avec l'ID :", docRef.id);
	} catch (error) {
		console.error("Erreur lors de la création de l'entrée du journal :", error);
		throw error;
	}
};
