import {
	getDocs,
	query,
	where,
	collection,
	doc,
	setDoc,
	updateDoc,
	arrayUnion,
	getDoc,
	arrayRemove,
} from "firebase/firestore";
import { db } from ".";
import { auth } from ".";
import { onAuthStateChanged } from "firebase/auth";
import { Member } from "../types/member";

export const setMemberHabit = async (habit: any) => {
	try {
		const uid: any = auth.currentUser?.uid;

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];

			// Vérifier si l'habitude existe déjà
			const existingHabit = memberDoc
				.data()
				.habits.find((h: any) => h.id === habit.id);

			if (!existingHabit) {
				const userHabit = {
					id: habit.id,
					name: habit.name,
					logs: [],
					moment: habit.moment,
				};

				await updateDoc(memberDoc.ref, {
					habits: arrayUnion(userHabit),
				});

				console.log("Document membre mis à jour avec succès");
			} else {
				await updateDoc(memberDoc.ref, {
					habits: arrayRemove(existingHabit),
				});
				console.log("L'habitude a été supprimée avec succès");
			}
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

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (querySnapshot.docs.length > 0) {
			const memberDocRef = querySnapshot.docs[0].ref;
			const memberDocSnapshot = await getDoc(memberDocRef);

			if (memberDocSnapshot.exists()) {
				const habits = memberDocSnapshot.data().habits;
				return habits;
			} else {
				return [];
			}
		} else {
			console.log("Membre non trouvé.");
			return [];
		}
	} catch (error) {
		console.log(
			"Member - Erreur lors de la récupération des habitudes : ",
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

			return habit;
		} else {
			return [];
		}
	} catch (error) {
		console.log(
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

				const existingLogIndex = habit.logs.findIndex(
					(log: any) => log.date === date
				);

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
		console.log(
			"Erreur lors de la récupération du document dans la collection 'members': ",
			error
		);
		throw error;
	}
};

export const getMemberInfos = async (): Promise<Member | undefined> => {
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

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];
			const structureMember: Member = {
				id: memberDoc.id,
				nom: memberDoc.data().nom,
				motivation: memberDoc.data().motivation,
				objectifs: memberDoc.data().objectifs,
				temps: memberDoc.data().temps,
				aspects: memberDoc.data().aspects,
				habits: memberDoc.data().habits,
			};

			return structureMember;
		} else {
			return undefined;
		}
	} catch (error) {
		console.log(
			"Erreur lors de la récupération du document dans la collection 'members': ",
			error
		);
		throw error;
	}
};