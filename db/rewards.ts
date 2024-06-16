import {
	addDoc,
	collection,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { auth, db } from ".";

export const getRewards = async () => {
	try {
		const uid: any = auth.currentUser?.uid || null;

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
					points: 0,
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
				// 'rewards'
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