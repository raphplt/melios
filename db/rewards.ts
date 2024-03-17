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
		const uid: any = auth.currentUser?.uid;

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
			await addDoc(collection(db, "rewards"), {
				uid: uid,
				points: 0,
			});
		}
	} catch (error) {
		console.error("Erreur lors de la récupération des récompenses : ", error);
		throw error;
	}
};

export const setRewards = async (points: any) => {
	try {
		const uid: any = auth.currentUser?.uid;

		const rewardsCollectionRef = collection(db, "rewards");

		const querySnapshot = await getDocs(
			query(rewardsCollectionRef, where("uid", "==", uid))
		);

		if (!querySnapshot.empty) {
			const rewardDoc = querySnapshot.docs[0];

			await updateDoc(rewardDoc.ref, {
				points: querySnapshot.docs[0].data().points + points,
			});
		} else {
			await addDoc(collection(db, "rewards"), {
				uid: uid,
				points: points,
			});
		}
	} catch (error) {
		console.error("Erreur lors de la récupération des récompenses : ", error);
		throw error;
	}
};
