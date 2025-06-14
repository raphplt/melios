import {
	getDocs,
	query,
	where,
	collection,
	updateDoc,
} from "firebase/firestore";
import { db } from ".";
import { auth } from ".";
import { onAuthStateChanged } from "firebase/auth";
import { Member } from "../type/member";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
				const parsedData = JSON.parse(storedData);
				// Nettoyer le timestamp du cache avant de retourner les données
				const { cacheTimestamp, ...memberData } = parsedData;
				return memberData as Member;
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
				league: memberData.league || null,
			};

			// Ajouter un timestamp pour la gestion du cache
			const cacheData = {
				...structureMember,
				cacheTimestamp: Date.now(),
			};

			await AsyncStorage.setItem(
				LOCAL_STORAGE_MEMBER_INFO_KEY,
				JSON.stringify(cacheData)
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
				league: memberDoc.data().league || null,
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

			// Mettre à jour le cache local si c'est le membre actuel
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (cachedData) {
				const parsedData = JSON.parse(cachedData);
				const updatedData = { ...parsedData, [field]: value };
				await AsyncStorage.setItem(
					LOCAL_STORAGE_MEMBER_INFO_KEY,
					JSON.stringify(updatedData)
				);
			}

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

// Fetch random members of a league. Optionally exclude certain uids
export const getMembersByLeague = async (
	leagueId: string,
	exclude: string[] = [],
	limitCount = 10
) => {
	const membersCollectionRef = collection(db, "members");
	const snapshot = await getDocs(
		query(membersCollectionRef, where("league.leagueId", "==", leagueId))
	);
	const allMembers = snapshot.docs.map((doc) => doc.data() as Member);
	const filtered = allMembers.filter((m) => !exclude.includes(m.uid));
	const shuffled = filtered.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, limitCount);
};

// Get all members in a specific league (for podium display)
export const getAllMembersInLeague = async (
	leagueId: string
): Promise<Member[]> => {
	const membersCollectionRef = collection(db, "members");
	const snapshot = await getDocs(
		query(membersCollectionRef, where("league.leagueId", "==", leagueId))
	);
	return snapshot.docs.map((doc) => doc.data() as Member);
};

// Update the league field of any member by uid
export const setMemberLeagueByUid = async (uid: string, league: any) => {
	const membersCollectionRef = collection(db, "members");
	const q = query(membersCollectionRef, where("uid", "==", uid));
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		const docRef = snapshot.docs[0].ref;
		await updateDoc(docRef, { league });
	}
};

// Ajouter des points à la ligue d'un membre (points totaux + points hebdomadaires)
export const addLeaguePoints = async (uid: string, pointsToAdd: number) => {
	const membersCollectionRef = collection(db, "members");
	const querySnapshot = await getDocs(
		query(membersCollectionRef, where("uid", "==", uid))
	);

	if (!querySnapshot.empty) {
		const memberDoc = querySnapshot.docs[0];
		const memberData = memberDoc.data();
		const currentLeague = memberData.league || {
			points: 0,
			leagueId: "",
			rank: 1,
			weeklyPoints: 0,
			lastWeeklyReset: new Date().toISOString(),
		};

		const updatedLeague = {
			...currentLeague,
			points: (currentLeague.points || 0) + pointsToAdd,
			weeklyPoints: (currentLeague.weeklyPoints || 0) + pointsToAdd,
		};

		await updateDoc(memberDoc.ref, { league: updatedLeague });

		// Mettre à jour le cache local si c'est le membre actuel
		const currentUid = auth.currentUser?.uid;
		if (currentUid === uid) {
			const cachedData = await AsyncStorage.getItem(LOCAL_STORAGE_MEMBER_INFO_KEY);
			if (cachedData) {
				const parsedData = JSON.parse(cachedData);
				const updatedData = { ...parsedData, league: updatedLeague };
				await AsyncStorage.setItem(
					LOCAL_STORAGE_MEMBER_INFO_KEY,
					JSON.stringify(updatedData)
				);
			}
		}

		return updatedLeague;
	} else {
		throw new Error("Member not found");
	}
};