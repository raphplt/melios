import {
	collection,
	doc,
	updateDoc,
	addDoc,
	getDoc,
	query,
	where,
	getDocs,
} from "firebase/firestore";
import { db } from ".";
import { UserPack } from "@type/userPack";

// Fonction pour ajouter un user pack
export const setUserPack = async (userPack: UserPack) => {
	try {
		const goalCollectionRef = collection(db, "usersPacks");

		if (userPack.id) {
			const goalDocRef = doc(db, "usersPacks", userPack.id);
			await updateDoc(goalDocRef, userPack);
			const { id, ...rest } = userPack;
			return { id, ...rest };
		} else {
			const docRef = await addDoc(goalCollectionRef, {
				...userPack,
				createdAt: new Date(),
			});
			const newGoal = await getDoc(docRef);
			return { id: docRef.id, ...newGoal.data() };
		}
	} catch (error) {
		console.error(
			"Erreur lors de la définition de l'objectif du membre: ",
			error
		);
		throw error;
	}
};

// Fonction pour récupérer les user packs
export const getUserPacks = async (userUid: string) => {
	try {
		const userPacksCollectionRef = collection(db, "usersPacks");
		const userPacksQuery = query(
			userPacksCollectionRef,
			where("userUid", "==", userUid)
		);
		const querySnapshot = await getDocs(userPacksQuery);
		const userPacks = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as UserPack[];
		return userPacks;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des objectifs du membre: ",
			error
		);
		throw error;
	}
};
