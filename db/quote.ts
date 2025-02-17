import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs } from "firebase/firestore";
import { db } from ".";

const QUOTE_STORAGE_KEY = "daily_quote";
const DATE_STORAGE_KEY = "quote_date";

const getRandomQuote = async () => {
	const quotesCollection = collection(db, "quotes");
	const quotesSnapshot = await getDocs(quotesCollection);
	const quotesList = quotesSnapshot.docs.map((doc) => doc.data());

	if (quotesList.length === 0) {
		throw new Error("No quotes found in the collection.");
	}

	const randomIndex = Math.floor(Math.random() * quotesList.length);
	return quotesList[randomIndex];
};

export const fetchDailyQuote = async () => {
	try {
		const storedDate = await AsyncStorage.getItem(DATE_STORAGE_KEY);
		const today = new Date().toISOString().split("T")[0];

		if (storedDate === today) {
			const storedQuote = await AsyncStorage.getItem(QUOTE_STORAGE_KEY);
			if (storedQuote) {
				return JSON.parse(storedQuote);
			}
		}

		const newQuote = await getRandomQuote();
		await AsyncStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(newQuote));
		await AsyncStorage.setItem(DATE_STORAGE_KEY, today);
		return newQuote;
	} catch (error) {
		console.log("Error fetching daily quote: ", error);
		throw error;
	}
};
