import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./locales/en-EN/translation.json";
import fr from "./locales/fr-FR/translation.json";

const resources = {
	"en-US": { translation: en },
	"fr-FR": { translation: fr },
};

const initI18n = async () => {
	let savedLanguage = await AsyncStorage.getItem("language");

	if (!savedLanguage) {
		savedLanguage = Localization.locale;
	}

	i18n.use(initReactI18next).init({
		compatibilityJSON: "v4",
		resources,
		lng: savedLanguage,
		fallbackLng: "fr-FR",
		interpolation: {
			escapeValue: false,
		},
	});
};

initI18n();

export default i18n;
