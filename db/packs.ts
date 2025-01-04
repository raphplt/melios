import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCollectionData } from "./fetch";

const LOCAL_STORAGE_PACKS_LIST_KEY = "packs";

export const getAllPacks = async (
	options: {
		signal?: AbortSignal;
		forceRefresh?: boolean;
	} = {}
) => {
	if (!options.forceRefresh) {
		const storedData = await AsyncStorage.getItem(LOCAL_STORAGE_PACKS_LIST_KEY);
		if (storedData) {
			return JSON.parse(storedData);
		}
	}

	return fetchCollectionData(
		"packs",
		LOCAL_STORAGE_PACKS_LIST_KEY,
		options.forceRefresh || false
	);
};
