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
	limit,
	orderBy,
	startAfter,
	runTransaction,
} from "firebase/firestore";
import { db } from ".";
import { auth } from ".";
import { onAuthStateChanged } from "firebase/auth";
import { Member } from "../type/member";
import { UserHabit } from "../type/userHabit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "@type/habit";

export const LOCAL_STORAGE_MEMBER_INFO_KEY = "member_info";

//TODO OLD
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
					// logs: [],
					...habit,
					id: habit.id,
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
				profilePicture: memberDoc.data().profilePicture,
				activityConfidentiality: memberDoc.data().activityConfidentiality,
				friends: memberDoc.data().friends,
				friendRequestsReceived: memberDoc.data().friendRequestsReceived,
				friendRequestsSent: memberDoc.data().friendRequestsSent,
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

export const getMemberProfileByUid = async (
	uid: string
): Promise<Member | undefined> => {
	try {
		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];
			const memberProfile: Member = {
				uid: memberDoc.data().uid,
				nom: memberDoc.data().nom,
				motivation: memberDoc.data().motivation,
				objectifs: memberDoc.data().objectifs,
				temps: memberDoc.data().temps,
				aspects: memberDoc.data().aspects,
				profilePicture: memberDoc.data().profilePicture,
				friends: memberDoc.data().friends,
				friendRequestsSent: memberDoc.data().friendRequestsSent,
				friendRequestsReceived: memberDoc.data().friendRequestsReceived,
				activityConfidentiality: memberDoc.data().activityConfidentiality,
			};

			return memberProfile;
		} else {
			console.log("Member not found");
			return undefined;
		}
	} catch (error) {
		console.error("Erreur lors de la récupération du profil du membre :", error);
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

export const updateMemberField = async (field: keyof Member, value: any) => {
	try {
		const uid = auth.currentUser?.uid;

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];
			const updates: any = { [field]: value };

			await updateDoc(memberDoc.ref, updates);
			console.log(`Member ${field} updated successfully`);
		} else {
			console.log("Member not found");
		}
	} catch (error) {
		console.error(`Error updating member ${field}: `, error);
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

/**
 *
 * Méthode pour récupérer les membres avec pagination
 * @param lastVisibleDoc
 * @param pageSize
 * @returns
 */
export const getMembersPaginated = async (
	lastVisibleDoc: any = null,
	pageSize: number = 10,
	filter: "all" | "friends" | "received" | "sent" = "all",
	member?: Member
) => {
	const uid = auth.currentUser?.uid;
	try {
		const membersCollectionRef = collection(db, "members");

		let membersQuery = query(
			membersCollectionRef,
			orderBy("nom"),
			limit(pageSize)
		);

		if (lastVisibleDoc) {
			membersQuery = query(membersQuery, startAfter(lastVisibleDoc));
		}

		if (filter === "friends" && member?.friends) {
			membersQuery = query(
				membersCollectionRef,
				where("uid", "in", member.friends),
				orderBy("nom"),
				limit(pageSize)
			);
		} else if (filter === "received" && member?.friendRequestsReceived) {
			membersQuery = query(
				membersCollectionRef,
				where("uid", "in", member.friendRequestsReceived),
				orderBy("nom"),
				limit(pageSize)
			);
		} else if (filter === "sent" && member?.friendRequestsSent) {
			membersQuery = query(
				membersCollectionRef,
				where("uid", "in", member.friendRequestsSent),
				orderBy("nom"),
				limit(pageSize)
			);
		}

		const querySnapshot = await getDocs(membersQuery);

		const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

		const uniqueMembers = new Set();
		const members = querySnapshot.docs
			.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			.filter((member: any) => {
				if (uniqueMembers.has(member.uid)) {
					return false;
				}
				uniqueMembers.add(member.uid);
				return true;
			});

		return { members, lastVisible };
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des membres avec pagination: ",
			error
		);
		throw error;
	}
};

/**
 *
 * Méthode pour supprimer un ami
 * @param friendUid
 */
export const removeFriend = async (friendUid: string) => {
	try {
		const currentUid = auth.currentUser?.uid;
		if (!currentUid) throw new Error("Utilisateur non authentifié");

		const currentMemberRef = doc(db, "members", currentUid);
		const friendMemberRef = doc(db, "members", friendUid);

		await updateDoc(currentMemberRef, {
			friends: arrayRemove(friendUid),
		});

		await updateDoc(friendMemberRef, {
			friends: arrayRemove(currentUid),
		});

		console.log(`Ami supprimé : ${friendUid}`);
	} catch (error) {
		console.error("Erreur lors de la suppression d'un ami :", error);
		throw error;
	}
};

/**
 *
 * Méthode pour vérifier si deux membres sont amis
 * @returns
 */
export const areFriends = async (friendUid: string): Promise<boolean> => {
	try {
		const currentUid = auth.currentUser?.uid;
		if (!currentUid) throw new Error("Utilisateur non authentifié");

		const currentMemberRef = doc(db, "members", currentUid);
		const currentMemberSnap = await getDoc(currentMemberRef);

		if (currentMemberSnap.exists()) {
			const friends = currentMemberSnap.data().friends || [];
			return friends.includes(friendUid);
		}
		return false;
	} catch (error) {
		console.error("Erreur lors de la vérification d'amitié :", error);
		throw error;
	}
};

/**
 * Demande d'amitié
 * @param friendUid
 */
export const sendFriendRequest = async (friendUid: string) => {
	try {
		const currentUid = auth.currentUser?.uid;
		if (!currentUid) throw new Error("Utilisateur non authentifié");

		// Rechercher le document du membre courant basé sur la propriété `uid`
		const membersCollection = collection(db, "members");
		const currentMemberQuery = query(
			membersCollection,
			where("uid", "==", currentUid)
		);
		const currentMemberSnapshot = await getDocs(currentMemberQuery);

		if (currentMemberSnapshot.empty) {
			throw new Error(
				"[CURRENT] Document membre introuvable avec la propriété uid."
			);
		}

		const currentMemberDoc = currentMemberSnapshot.docs[0];
		const currentMemberData = currentMemberDoc.data();

		// Rechercher le document du membre ami basé sur la propriété `uid`
		const friendMemberQuery = query(
			membersCollection,
			where("uid", "==", friendUid)
		);
		const friendMemberSnapshot = await getDocs(friendMemberQuery);

		if (friendMemberSnapshot.empty) {
			throw new Error(
				"[FRIEND] Document membre introuvable avec la propriété uid."
			);
		}

		const friendMemberDoc = friendMemberSnapshot.docs[0];
		const friendMemberData = friendMemberDoc.data();

		// Vérifier si une demande d’amitié a déjà été envoyée ou si les utilisateurs sont déjà amis
		if (
			currentMemberData.friendRequestsSent?.includes(friendUid) ||
			friendMemberData.friendRequestsReceived?.includes(currentUid)
		) {
			console.log("Demande d’amitié déjà envoyée ou reçue.");
			return;
		}

		if (currentMemberData.friends?.includes(friendUid)) {
			console.log("Vous êtes déjà amis avec cet utilisateur.");
			return;
		}

		// Mise à jour des données
		await updateDoc(currentMemberDoc.ref, {
			friendRequestsSent: arrayUnion(friendUid),
		});

		await updateDoc(friendMemberDoc.ref, {
			friendRequestsReceived: arrayUnion(currentUid),
		});

		console.log("Demande d'amitié envoyée !");
	} catch (error) {
		console.error("Erreur lors de l'envoi de la demande d'amitié :", error);
		throw error;
	}
};

/**
 * 	Accepter une demande d'amitié
 * @param friendUid
 */

export const acceptFriendRequest = async (friendUid: string) => {
	try {
		const currentUid = auth.currentUser?.uid;
		if (!currentUid) throw new Error("Utilisateur non authentifié");

		console.log("currentUid:", currentUid);
		console.log("friendUid:", friendUid);

		const membersCollectionRef = collection(db, "members");

		// Rechercher le document du membre courant basé sur la propriété `uid`
		const currentMemberQuery = query(
			membersCollectionRef,
			where("uid", "==", currentUid)
		);
		const currentMemberSnapshot = await getDocs(currentMemberQuery);

		if (currentMemberSnapshot.empty) {
			throw new Error(`No document found for current user: ${currentUid}`);
		}

		const currentMemberDoc = currentMemberSnapshot.docs[0];

		// Rechercher le document du membre ami basé sur la propriété `uid`
		const friendMemberQuery = query(
			membersCollectionRef,
			where("uid", "==", friendUid)
		);
		const friendMemberSnapshot = await getDocs(friendMemberQuery);

		if (friendMemberSnapshot.empty) {
			throw new Error(`No document found for friend user: ${friendUid}`);
		}

		const friendMemberDoc = friendMemberSnapshot.docs[0];

		await updateDoc(currentMemberDoc.ref, {
			friends: arrayUnion(friendUid),
			friendRequestsReceived: arrayRemove(friendUid),
		});

		await updateDoc(friendMemberDoc.ref, {
			friends: arrayUnion(currentUid),
			friendRequestsSent: arrayRemove(currentUid),
		});

		console.log(`Demande d'amitié acceptée avec : ${friendUid}`);
	} catch (error) {
		console.error("Erreur lors de l'acceptation de la demande d'amitié :", error);
		throw error;
	}
};

/**
 *  Refuser une demande d'amitié
 * @param friendUid
 */
export const declineFriendRequest = async (friendUid: string) => {
	try {
		const currentUid = auth.currentUser?.uid;
		if (!currentUid) throw new Error("Utilisateur non authentifié");

		const currentMemberRef = doc(db, "members", currentUid);
		const friendMemberRef = doc(db, "members", friendUid);

		await updateDoc(currentMemberRef, {
			friendRequestsReceived: arrayRemove(friendUid),
		});

		await updateDoc(friendMemberRef, {
			friendRequestsSent: arrayRemove(currentUid),
		});

		console.log(`Demande d'amitié refusée avec : ${friendUid}`);
	} catch (error) {
		console.error("Erreur lors du refus de la demande d'amitié :", error);
		throw error;
	}
};
