import { UserLevel } from "@type/levels";

export const getLevelName = (level: number): string => {
	if (level > 20) return "Divinité";

	const levelNames: { [key: number]: string } = {
		1: "Débutant",
		2: "Novice",
		3: "Apprenti",
		4: "Aventurier",
		5: "Spartiate",
		6: "Guerrier",
		7: "Champion",
		8: "Héros",
		9: "Maître",
		10: "Légende",
		11: "Mythique",
		12: "Sage",
		13: "Philosophe",
		14: "Orateur",
		15: "Stratège",
		16: "Légende",
		17: "Immortel",
		18: "Mythique",
		19: "Olympien",
		20: "Divinité",
	};

	return levelNames[level] || "Inconnu";
};

export const getGlobalLevel = (usersLevels: UserLevel[]): UserLevel => {
	return usersLevels["P0gwsxEYNJATbmCoOdhc" as any];
};
