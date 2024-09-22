import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from ".";

export const LOCAL_STORAGE_GOAL_KEY = "goals";

export const getMemberGoals = async (memberId: string) => {
	try {
		const storedGoal = await AsyncStorage.getItem(LOCAL_STORAGE_GOAL_KEY);

		if (storedGoal) {
			console.log("Fetching goals from local storage");
			return JSON.parse(storedGoal);
		}

		console.log("Fetching goals from firestore");
		const goalCollectionRef = collection(db, "goals");

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
		const goalCollectionRef = collection(db, "goals");

		if (goal.id) {
			const goalDocRef = doc(db, "goals", goal.id);
			console.log("Updating goal");
			await updateDoc(goalDocRef, goal);
			return { id: goal.id, ...goal };
		} else {
			console.log("Creating goal");
			const docRef = await addDoc(goalCollectionRef, {
				...goal,
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

export const deleteMemberGoal = async (memberId: string, goalId: string) => {
	try {
		const goalDocRef = doc(db, "goals", goalId);

		await deleteDoc(goalDocRef);

		const storedGoals = await AsyncStorage.getItem(LOCAL_STORAGE_GOAL_KEY);
		if (storedGoals) {
			const goals = JSON.parse(storedGoals);
			const updatedGoals = goals.filter((goal: any) => goal.id !== goalId);
			await AsyncStorage.setItem(
				LOCAL_STORAGE_GOAL_KEY,
				JSON.stringify(updatedGoals)
			);
		}

		console.log("Goal deleted successfully");
	} catch (error) {
		console.error(
			"Erreur lors de la suppression de l'objectif du membre: ",
			error
		);
		throw error;
	}
};