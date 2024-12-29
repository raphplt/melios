import {
	addDoc,
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	updateDoc,
	where,
} from "firebase/firestore";
import { auth, db } from ".";
import { faker } from "@faker-js/faker";

export const getRewards = async (
	options: {
		signal?: AbortSignal;
		forceRefresh?: boolean;
	} = {}
) => {
	try {
		const uid: any = auth.currentUser?.uid || null;

		if (options.signal?.aborted) throw new Error("Get rewards request aborted.");

		const rewardsCollectionRef = collection(db, "rewards");

		const querySnapshot = await getDocs(
			query(rewardsCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const rewards = querySnapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data(),
				};
			});

			return rewards;
		} else {
			if (uid)
				await addDoc(collection(db, "rewards"), {
					uid: uid,
					rewards: 0,
					odyssee: 0,
				});
		}
	} catch (error) {
		console.log("Erreur lors de la récupération des récompenses : ", error);
		throw error;
	}
};

export const setRewards = async (
	type: "odyssee" | "rewards",
	points: number
) => {
	try {
		const uid: any = auth.currentUser?.uid;

		const rewardsCollectionRef = collection(db, "rewards");

		const querySnapshot = await getDocs(
			query(rewardsCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const rewardDoc = querySnapshot.docs[0];
			let updateData = {};

			if (type === "odyssee") {
				updateData = { odyssee: (rewardDoc.data().odyssee || 0) + points };
			} else {
				updateData = { rewards: (rewardDoc.data().rewards || 0) + points };
			}

			await updateDoc(rewardDoc.ref, updateData);
		} else {
			let newData: any = { uid: uid };

			if (type === "odyssee") {
				newData["odyssee"] = points;
			} else {
				// 'rewards'
				newData["rewards"] = points;
			}

			await addDoc(collection(db, "rewards"), newData);
		}
	} catch (error) {
		console.log("Erreur lors de la récupération des récompenses : ", error);
		throw error;
	}
};

export const getAllRewardsPaginated = async (
	lastVisibleDoc = null,
	pageSize = 10
) => {
	try {
		const rewardsCollectionRef = collection(db, "rewards");

		// Crée la requête de pagination
		let rewardsQuery = query(
			rewardsCollectionRef,
			orderBy("odyssee", "desc"),
			limit(pageSize)
		);

		if (lastVisibleDoc) {
			rewardsQuery = query(rewardsQuery, startAfter(lastVisibleDoc));
		}

		const rewardsSnapshot = await getDocs(rewardsQuery);

		const lastVisible = rewardsSnapshot.docs[rewardsSnapshot.docs.length - 1];

		const rewards = await Promise.all(
			rewardsSnapshot.docs.map(async (doc) => {
				const rewardData = doc.data();
				const uid = rewardData.uid;

				const membersCollectionRef = collection(db, "members");
				const userSnapshot = await getDocs(
					query(membersCollectionRef, where("uid", "==", uid))
				);

				let userName = "Unknown User";
				let profilePicture = null;
				if (!userSnapshot.empty) {
					const userDoc = userSnapshot.docs[0];
					const userData = userDoc.data();
					userName = userData.nom || faker.person.firstName();
					profilePicture = userData.profilePicture || null;
				} else {
					userName = faker.person.firstName();
				}

				return {
					id: doc.id,
					...rewardData,
					name: userName,
					profilePicture: profilePicture,
				};
			})
		);
		return {
			rewards,
			lastVisible,
		};
	} catch (error) {
		console.log("Erreur lors de la récupération des récompenses : ", error);
		throw error;
	}
};