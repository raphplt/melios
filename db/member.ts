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
import { Member } from "../type/member";
import { UserHabit } from "../type/userHabit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "@type/habit";

export const LOCAL_STORAGE_MEMBER_HABITS_KEY = "member_habits";
export const LOCAL_STORAGE_MEMBER_INFO_KEY = "member_info";

export const setMemberHabit = async (habit: Habit) => {
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
				.habits.find((h: UserHabit) => h.id === habit.id);

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

export const getMemberHabits = async (
	options: {
		signal?: AbortSignal;
		forceRefresh?: boolean;
	} = {}
) => {
	try {
		if (!options.forceRefresh) {
			// console.log(`[${new Date().toISOString()}] LocalStorage getMemberHabits`);
			const storedData = await AsyncStorage.getItem(
				LOCAL_STORAGE_MEMBER_HABITS_KEY
			);
			if (storedData) {
				return JSON.parse(storedData);
			}
		}

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

		if (options.signal?.aborted) {
			throw new Error("Get member habits request was aborted");
		}

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (querySnapshot.docs.length > 0) {
			const memberDocRef = querySnapshot.docs[0].ref;
			const memberDocSnapshot = await getDoc(memberDocRef);

			if (memberDocSnapshot.exists()) {
				const habits = memberDocSnapshot.data().habits;
				await AsyncStorage.setItem(
					LOCAL_STORAGE_MEMBER_HABITS_KEY,
					JSON.stringify(habits)
				);
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

export const getMemberHabit = async (habitId: string) => {
	try {
		const uid: any = auth.currentUser?.uid;

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];

			const habits = memberDoc.data().habits;

			const habit = habits.find((habit: UserHabit) => habit.id === habitId);

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

export const setMemberHabitLog = async (
	habitId: string,
	date: any,
	done: any
) => {
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
					habit.logs[existingLogIndex].done = done;
				} else {
					const newLog = { date, done };
					habit.logs.push(newLog);
				}

				await updateDoc(memberDoc.ref, {
					habits: habits,
				});
			}
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

export const getMemberInfos = async (
	options: {
		signal?: AbortSignal;
		forceRefresh?: boolean;
	} = {}
): Promise<Member | undefined> => {
	try {
		if (!options.forceRefresh) {
			const storedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (storedData) {
				return JSON.parse(storedData);
			}
		}

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

		if (options.signal?.aborted) {
			throw new Error("Get member infos request was aborted");
		}

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (options.signal?.aborted) {
			throw new Error("Request was aborted");
		}

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];
			const structureMember: Member = {
				uid: memberDoc.data().uid,
				nom: memberDoc.data().nom,
				motivation: memberDoc.data().motivation,
				objectifs: memberDoc.data().objectifs,
				temps: memberDoc.data().temps,
				aspects: memberDoc.data().aspects,
				habits: memberDoc.data().habits,
				profilePicture: memberDoc.data().profilePicture,
			};

			await AsyncStorage.setItem(
				LOCAL_STORAGE_MEMBER_INFO_KEY,
				JSON.stringify(structureMember)
			);

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

export const updateMemberInfo = async (name: string) => {
	try {
		const uid: any = auth.currentUser?.uid;

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];
			const updates: any = { nom: name };

			await updateDoc(memberDoc.ref, updates);
			console.log("Member info updated successfully");
		} else {
			console.log("Member not found");
		}
	} catch (error) {
		console.error("Error updating member info: ", error);
		throw error;
	}
};

export const updateProfilePicture = async (slug: string) => {
	try {
		const uid: any = auth.currentUser?.uid;

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];

			await updateDoc(memberDoc.ref, {
				profilePicture: slug,
			});

			await AsyncStorage.setItem(
				LOCAL_STORAGE_MEMBER_INFO_KEY,
				JSON.stringify({ ...memberDoc.data(), profilePicture: slug })
			);

			console.log("Profile picture updated successfully");
		} else {
			console.log("Member not found");
		}
	} catch (error) {
		console.error("Error updating profile picture: ", error);
		throw error;
	}
};