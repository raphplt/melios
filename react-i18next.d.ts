import "react-i18next";
import en from "@locales/en.json";
import fr from "@locales/fr.json";

declare module "react-i18next" {
	interface Resources {
		translation: typeof en;
	}
}
