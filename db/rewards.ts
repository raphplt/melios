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

export const getAllRewards = async () => {
	try {
		const rewardsCollectionRef = collection(db, "rewards");
		const rewardsSnapshot = await getDocs(query(rewardsCollectionRef));

		if (!rewardsSnapshot.empty) {
			const allRewards = await Promise.all(
				rewardsSnapshot.docs.map(async (rewardDoc) => {
					const rewardData = rewardDoc.data();
					const uid = rewardData.uid;

					const membersCollectionRef = collection(db, "members");
					const userSnapshot = await getDocs(
						query(membersCollectionRef, where("uid", "==", uid))
					);

					let userName = "Unknown User";
					if (!userSnapshot.empty) {
						const userDoc = userSnapshot.docs[0];

						const userData = userDoc.data();
						userName = userData.nom || "Unknown User";
					}

					return {
						id: rewardDoc.id,
						...rewardData,
						name: userName,
					};
				})
			);

			return allRewards;
		} else {
			console.log("Aucune récompense trouvée.");
			return [];
		}
	} catch (error) {
		console.log(
			"Erreur lors de la récupération de toutes les récompenses : ",
			error
		);
		throw error;
	}
};
export const getRewardsPaginated = async (lastDoc = null) => {
	try {
		const rewardsCollectionRef = collection(db, "rewards");

		// Créer la requête avec pagination
		let rewardsQuery = query(
			rewardsCollectionRef,
			orderBy("odyssee", "desc"),
			limit(10)
		);

		// Si on a un dernier document, on commence à partir de celui-ci pour paginer
		if (lastDoc) {
			rewardsQuery = query(rewardsQuery, startAfter(lastDoc));
		}

		const rewardsSnapshot = await getDocs(rewardsQuery);
		const lastVisible = rewardsSnapshot.docs[rewardsSnapshot.docs.length - 1];

		const allRewards = await Promise.all(
			rewardsSnapshot.docs.map(async (rewardDoc) => {
				const rewardData = rewardDoc.data();
				const uid = rewardData.uid;

				// Logique pour récupérer l'utilisateur, similaire à ton code
				return {
					id: rewardDoc.id,
					...rewardData,
					// Ajoute d'autres champs si nécessaire
				};
			})
		);

		return { rewards: allRewards, lastVisible };
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des récompenses paginées : ",
			error
		);
		throw error;
	}
};