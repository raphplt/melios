import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "./index"; // Importez l'instance app depuis index.ts

const storage = getStorage(app);

export const getImageURL = async () => {
	try {
		const storageRef = ref(storage, "bgCosmetic.jpg");
		console.log("Storage Reference Path:", storageRef);
		const url = await getDownloadURL(storageRef);
		console.log("Image URL:", url);
		return url;
	} catch (error) {
		console.error("Erreur lors de l'accès à Firebase Storage : ", error);
		throw error;
	}
};
