import {
	doc,
	updateDoc,
	arrayRemove,
	getDoc,
	collection,
	query,
	where,
	getDocs,
	arrayUnion,
} from "firebase/firestore";
import { auth, db } from ".";
import { UserLevel } from "@type/levels";
import { Member } from "@type/member";
import { getUserLevelsByUserId } from "./levels";
import { LOCAL_STORAGE_MEMBER_INFO_KEY } from "./member";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

/**
 * Méthode pour récupérer les amis du membre
 */

export const getFriends = async (): Promise<
	(Partial<Member> & { levels?: UserLevel[] })[]
> => {
	try {
		const currentUid = auth.currentUser?.uid;
		if (!currentUid) throw new Error("Utilisateur non authentifié");

		const membersCollectionRef = collection(db, "members");

		const currentMemberQuery = query(
			membersCollectionRef,
			where("uid", "==", currentUid)
		);
		const currentMemberSnapshot = await getDocs(currentMemberQuery);

		if (currentMemberSnapshot.empty) {
			throw new Error(`No document found for current user: ${currentUid}`);
		}

		const currentMemberDoc = currentMemberSnapshot.docs[0];
		const currentMemberData = currentMemberDoc.data();

		const friendsUids = currentMemberData.friends || [];
		if (friendsUids.length === 0) {
			return [];
		}

		const friendsQuery = query(
			membersCollectionRef,
			where("uid", "in", friendsUids)
		);
		const friendsSnapshot = await getDocs(friendsQuery);

		const friends = await Promise.all(
			friendsSnapshot.docs.map(async (doc) => {
				const data = doc.data();
				const levels = await getUserLevelsByUserId(data.uid);
				return {
					id: doc.id,
					uid: data.uid,
					nom: data.nom,
					profilePicture: data.profilePicture,
					levels,
				} as Partial<Member> & { levels?: UserLevel[] };
			})
		);

		return friends;
	} catch (error) {
		console.error("Erreur lors de la récupération des amis :", error);
		throw error;
	}
};

/**
 * Génère un code d'ami unique pour un membre
 * @returns Un code unique de 8 caractères
 */
export const generateFriendCode = (): string => {
	// Caractères autorisés pour le code (éviter les caractères ambigus comme 0/O ou 1/I)
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let result = "";

	// Générer un code de 8 caractères
	for (let i = 0; i < 8; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return result;
};

/**
 * Récupère un membre par son code d'ami
 * @param friendCode Le code d'ami à rechercher
 * @returns Le membre correspondant ou null si non trouvé
 */
export const getMemberByFriendCode = async (
	friendCode: string
): Promise<Member | null> => {
	try {
		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("friendCode", "==", friendCode))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];
			const memberData = memberDoc.data();

			return {
				uid: memberData.uid,
				nom: memberData.nom,
				motivation: memberData.motivation,
				objectifs: memberData.objectifs,
				temps: memberData.temps,
				aspects: memberData.aspects,
				profilePicture: memberData.profilePicture,
				friendCode: memberData.friendCode,
				friends: memberData.friends || [],
				friendRequestsReceived: memberData.friendRequestsReceived || [],
				friendRequestsSent: memberData.friendRequestsSent || [],
				activityConfidentiality: memberData.activityConfidentiality,
			};
		}

		return null;
	} catch (error) {
		console.error("Erreur lors de la recherche par code d'ami:", error);
		throw error;
	}
};
