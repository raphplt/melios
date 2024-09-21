import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from ".";

export const LOCAL_STORAGE_GOAL_KEY = "goal";

export const getMemberGoal = async (memberId: string) => {
	try {
		// const storedGoal = await AsyncStorage.getItem(LOCAL_STORAGE_GOAL_KEY);

		// if (storedGoal) {
		// 	return JSON.parse(storedGoal);
		// }

		const goalCollectionRef = collection(db, "goal");

		const goalSnapshot = await getDocs(
			query(goalCollectionRef, where("memberId", "==", memberId))
		);

		const goalData = goalSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		await AsyncStorage.setItem(LOCAL_STORAGE_GOAL_KEY, JSON.stringify(goalData));
		return goalData;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération de l'objectif du membre: ",
			error
		);
		throw error;
	}
};

export const setMemberGoal = async (goal: any) => {
	try {
		const goalCollectionRef = collection(db, "goal");

		const querySnapshot = await getDocs(
			query(goalCollectionRef, where("memberId", "==", goal.memberId))
		);

		if (!querySnapshot.empty) {
			const goalDoc = querySnapshot.docs[0];

			// Vérifier si l'objectif existe déjà
			if (goalDoc) {
				console.log("Updating goal");
				updateDoc(goalDoc.ref, goal);
				return;
			}
		} else {
			console.log("Creating goal");
			setDoc(doc(goalCollectionRef), {
				...goal,
				createdAt: new Date(),
			});
		}

		await addDoc(goalCollectionRef, goal);
	} catch (error) {
		console.error(
			"Erreur lors de la définition de l'objectif du membre: ",
			error
		);
		throw error;
	}
};
