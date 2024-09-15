import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCollectionData } from "./fetch";

const LOCAL_STORAGE_COSMETICS_ICONS_KEY = "cosmeticsIcons";

export const getAllCosmeticsIcons = async (
	options: {
		signal?: AbortSignal;
		forceRefresh?: boolean;
	} = {}
) => {
	if (!options.forceRefresh) {
		const storedData = await AsyncStorage.getItem(
			LOCAL_STORAGE_COSMETICS_ICONS_KEY
		);
		if (storedData) {
			return JSON.parse(storedData);
		}
	}

	return fetchCollectionData(
		"cosmeticsIcons",
		LOCAL_STORAGE_COSMETICS_ICONS_KEY,
		options.forceRefresh || false
	);
};
