import {
	getDocs,
	query,
	where,
	collection,
	doc,
	setDoc,
	updateDoc,
	arrayUnion,
} from "firebase/firestore";
import { db } from ".";
import { auth } from ".";

export const setMemberHabit = async (habit: any) => {
	try {
		const uid: any = auth.currentUser?.uid;

		console.log("uid : ", uid);

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];
			console.log("habit : ", habit);

			const userHabit = {
				id: habit.id,
				name: habit.name,
				logs: [],
			};

			await updateDoc(memberDoc.ref, {
				habits: arrayUnion(userHabit),
			});

			console.log("Document membre mis à jour avec succès");
		} else {
			await setDoc(doc(membersCollectionRef, uid), {
				uid: uid,
				habits: [habit],
			});
			console.log("Document membre créé avec succès");
		}
	} catch (error) {
		console.error(
			"Erreur lors de l'ajout du document dans la collection 'members': ",
			error
		);
		throw error;
	}
};

export const getMemberHabits = async () => {
	try {
		// Récupérer l'uid de l'utilisateur connecté via auth
		const uid: any = auth.currentUser?.uid;

		// Référence à la collection 'members'
		const membersCollectionRef = collection(db, "members");

		// Créer une requête pour récupérer le membre avec le champ 'uid' correspondant
		if (uid === undefined) {
			return [];
		}
		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			// Le membre existe, récupérer le premier document correspondant (il devrait y en avoir qu'un)
			const memberDoc = querySnapshot.docs[0];

			// Récupérer le tableau "habits" du document membre
			const habits = memberDoc.data().habits;

			// Renvoyer le tableau "habits"
			return habits;
		} else {
			// Si le membre n'existe pas, renvoyer un tableau vide
			return [];
		}
	} catch (error) {
		console.error(
			"Erreur lors de la récupération du document dans la collection 'members': ",
			error
		);
		throw error;
	}
};

export const getMemberHabit = async (habitId: any) => {
	try {
		const uid: any = auth.currentUser?.uid;

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];

			const habits = memberDoc.data().habits;

			const habit = habits.find((habit: any) => habit.id === habitId);

			// const date = moment().format("DD-MM-YYYY");

			// if (!habit.logs[date]) {
			// 	habit.logs.push({ date: date, done: false });

			// 	// Add current date to habit logs
			// 	await updateDoc(memberDoc.ref, {
			// 		habits: habits,
			// 	});
			// }

			return habit;
		} else {
			return [];
		}
	} catch (error) {
		console.error(
			"Erreur lors de la récupération du document dans la collection 'members': ",
			error
		);
		throw error;
	}
};

export const setMemberHabitLog = async (habitId: any, date: any, done: any) => {
	try {
		const uid = auth.currentUser?.uid;

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];

			const habits = memberDoc.data().habits;

			const habitIndex = habits.findIndex((h: any) => h.id === habitId);

			if (habitIndex !== -1) {
				const habit = habits[habitIndex];

				const existingLogIndex = habit.logs.findIndex((log: any ) => log.date === date);

				if (existingLogIndex !== -1) {
					// Mettre à jour le log existant
					habit.logs[existingLogIndex].done = done;
				} else {
					// Ajouter un nouveau log
					const newLog = { date, done };
					habit.logs.push(newLog);
				}

				await updateDoc(memberDoc.ref, {
					habits: habits,
				});
			}
		} else {
			// Si le membre n'existe pas, renvoyer un tableau vide
			return [];
		}
	} catch (error) {
		console.error(
			"Erreur lors de la récupération du document dans la collection 'members': ",
			error
		);
		throw error;
	}
};
