import {
	getDocs,
	query,
	where,
	collection,
	doc,
	updateDoc,
	arrayUnion,
	getDoc,
	arrayRemove,
	limit,
	orderBy,
	startAfter,
} from "firebase/firestore";
import { db } from ".";
import { auth } from ".";
import { onAuthStateChanged } from "firebase/auth";
import { Member } from "../type/member";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserLevel } from "@type/levels";
import { getUserLevelsByUserId } from "./levels";

export const LOCAL_STORAGE_MEMBER_INFO_KEY = "member_info";

/**
 * Méthode pour récupérer les informations du membre
 * @param options
 * @returns
 */
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
			const memberData = memberDoc.data();

			// Générer un code ami si l'utilisateur n'en a pas encore
			if (!memberData.friendCode) {
				const { generateFriendCode } = require("./friend");
				const newFriendCode = generateFriendCode();

				await updateDoc(memberDoc.ref, {
					friendCode: newFriendCode,
				});

				memberData.friendCode = newFriendCode;
			}

			const structureMember: Member = {
				uid: memberData.uid,
				nom: memberData.nom,
				motivation: memberData.motivation,
				objectifs: memberData.objectifs,
				temps: memberData.temps,
				aspects: memberData.aspects,
				profilePicture: memberData.profilePicture,
				activityConfidentiality: memberData.activityConfidentiality,
				friends: memberData.friends || [],
				friendRequestsReceived: memberData.friendRequestsReceived || [],
				friendRequestsSent: memberData.friendRequestsSent || [],
				friendCode: memberData.friendCode,
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

/**
 * Méthode pour récupérer les informations de l'utilisateur
 * @param uid
 * @returns
 */

export const getMemberProfileByUid = async (
	uid: string
): Promise<Member | undefined> => {
	try {
		const membersCollectionRef = collection(db, "members");

		if (!uid) {
			throw new Error("UID is required to get member profile");
		}

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

/**
 * 	Méthode pour mettre à jour les informations du membre
 * @param name
 *
 **/
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

/**
 * 	Méthode pour mettre à jour l'image de profil
 * @param slug
 */
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
 * Méthode pour vérifier si le nom d'utilisateur est déjà utilisé
 */
export const isUsernameAlreadyUsed = async (username: string) => {
	try {
		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("nom", "==", username))
		);

		return !querySnapshot.empty;
	} catch (error) {
		console.error("Erreur lors de la vérification du nom d'utilisateur :", error);
		throw error;
	}
};


// Méthode pour récupérer les amis du membre
export const getFriends = async () => {
	try {
		const uid: any = auth.currentUser?.uid;

		const membersCollectionRef = collection(db, "members");

		const querySnapshot = await getDocs(
			query(membersCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const memberDoc = querySnapshot.docs[0];
			const friends: string[] = memberDoc.data().friends || [];
			console.log("friends here", friends);

			const friendsData: (Partial<Member> & { currentLevel?: string })[] = [];

			for (const friendUid of friends) {
				const friendQuerySnapshot = await getDocs(
					query(membersCollectionRef, where("uid", "==", friendUid))
				);
				if (!friendQuerySnapshot.empty) {
					const friendDoc = friendQuerySnapshot.docs[0];
					const friendData = friendDoc.data();
					friendsData.push({
						uid: friendUid,
						nom: friendData.nom,
						profilePicture: friendData.profilePicture,
						currentLevel: await getUserLevelsByUserId(friendUid),
					});
				} else {
					console.log("friendDoc not found for uid", friendUid);
				}
			}

			return friendsData;
		} else {
			console.log("Member not found");
			return [];
		}
	} catch (error) {
		console.error("Error fetching friends: ", error);
		throw error;
	}
};