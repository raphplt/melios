import { collection, getDocs } from "firebase/firestore";
import { db } from ".";

const fetchData = async () => {
	try {
		const usersCol = collection(db, "users");
		const snapshot = await getDocs(usersCol);
		snapshot.forEach((doc) => {
			console.log(doc.id, "=>", doc.data());
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des données : ", error);
	}
};

export default fetchData;
