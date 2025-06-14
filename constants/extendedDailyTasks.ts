import { DailyTask } from "@context/DataContext";

export interface ExtendedDailyTask extends DailyTask {
	description?: string;
	icon?: string;
	category:
		| "connection"
		| "habits"
		| "social"
		| "learning"
		| "wellness"
		| "productivity";
	difficulty: "easy" | "medium" | "hard";
	xpReward: number;
}

export const extendedDailyTasks: ExtendedDailyTask[] = [
	// Missions de connexion (faciles)
	{
		text: "Se connecter à Melios",
		description: "Accède à ton profil et synchronise tes données",
		slug: "connect_to_melios",
		completed: false,
		validated: false,
		icon: "log-in",
		category: "connection",
		difficulty: "easy",
		xpReward: 5,
	},

	// Missions d'habitudes
	{
		text: "Compléter 3 habitudes",
		description: "Termine 3 de tes habitudes quotidiennes",
		slug: "complete_habits",
		completed: false,
		validated: false,
		icon: "checkmark-done",
		category: "habits",
		difficulty: "medium",
		xpReward: 15,
	},

	{
		text: "Commencer sa routine matinale",
		description: "Lance ta première habitude de la journée",
		slug: "start_morning_routine",
		completed: false,
		validated: false,
		icon: "sunny",
		category: "habits",
		difficulty: "easy",
		xpReward: 10,
	},

	// Missions sociales
	{
		text: "Supporter un membre dans l'Agora",
		description: "Aide un autre utilisateur dans la communauté",
		slug: "support_member_agora",
		completed: false,
		validated: false,
		icon: "people",
		category: "social",
		difficulty: "medium",
		xpReward: 20,
	},

	{
		text: "Partager ses progrès",
		description: "Partage tes réussites avec la communauté",
		slug: "share_progress",
		completed: false,
		validated: false,
		icon: "share-social",
		category: "social",
		difficulty: "medium",
		xpReward: 15,
	},

	// Missions d'apprentissage
	{
		text: "Lire l'article du jour",
		description: "Découvre les conseils de développement personnel",
		slug: "read_daily_article",
		completed: false,
		validated: false,
		icon: "library",
		category: "learning",
		difficulty: "easy",
		xpReward: 10,
	},

	{
		text: "Regarder une vidéo éducative",
		description: "Apprends quelque chose de nouveau en 10 minutes",
		slug: "watch_educational_video",
		completed: false,
		validated: false,
		icon: "play-circle",
		category: "learning",
		difficulty: "easy",
		xpReward: 10,
	},

	// Missions bien-être
	{
		text: "Session de méditation",
		description: "Prends 10 minutes pour méditer",
		slug: "meditation_session",
		completed: false,
		validated: false,
		icon: "flower",
		category: "wellness",
		difficulty: "medium",
		xpReward: 15,
	},

	{
		text: "Faire 10 minutes d'exercice",
		description: "Bouge ton corps pour te sentir bien",
		slug: "exercise_session",
		completed: false,
		validated: false,
		icon: "fitness",
		category: "wellness",
		difficulty: "medium",
		xpReward: 15,
	},

	{
		text: "Boire 8 verres d'eau",
		description: "Reste hydraté tout au long de la journée",
		slug: "drink_water",
		completed: false,
		validated: false,
		icon: "water",
		category: "wellness",
		difficulty: "easy",
		xpReward: 5,
	},

	// Missions productivité
	{
		text: "Écrire dans son journal",
		description: "Note tes réflexions et objectifs du jour",
		slug: "write_journal",
		completed: false,
		validated: false,
		icon: "journal",
		category: "productivity",
		difficulty: "easy",
		xpReward: 10,
	},

	{
		text: "Planifier sa journée",
		description: "Organise tes tâches et priorités",
		slug: "plan_day",
		completed: false,
		validated: false,
		icon: "calendar",
		category: "productivity",
		difficulty: "easy",
		xpReward: 10,
	},

	{
		text: "Terminer une tâche importante",
		description: "Accomplis quelque chose de significatif",
		slug: "complete_important_task",
		completed: false,
		validated: false,
		icon: "trophy",
		category: "productivity",
		difficulty: "hard",
		xpReward: 25,
	},

	// Missions bonus/spéciales
	{
		text: "Faire une bonne action",
		description: "Aide quelqu'un dans ton entourage",
		slug: "good_deed",
		completed: false,
		validated: false,
		icon: "heart",
		category: "social",
		difficulty: "medium",
		xpReward: 20,
	},

	{
		text: "Apprendre 5 nouveaux mots",
		description: "Enrichis ton vocabulaire",
		slug: "learn_new_words",
		completed: false,
		validated: false,
		icon: "book",
		category: "learning",
		difficulty: "medium",
		xpReward: 15,
	},
];

// Fonction pour obtenir 3 tâches aléatoires équilibrées
export const getDailyTaskSelection = (): ExtendedDailyTask[] => {
	const easyTasks = extendedDailyTasks.filter(
		(task) => task.difficulty === "easy"
	);
	const mediumTasks = extendedDailyTasks.filter(
		(task) => task.difficulty === "medium"
	);
	const hardTasks = extendedDailyTasks.filter(
		(task) => task.difficulty === "hard"
	);

	// Sélectionner 1 facile, 1 moyen, 1 difficile
	const selectedTasks: ExtendedDailyTask[] = [];

	if (easyTasks.length > 0) {
		const randomEasy = easyTasks[Math.floor(Math.random() * easyTasks.length)];
		selectedTasks.push({ ...randomEasy });
	}

	if (mediumTasks.length > 0) {
		const randomMedium =
			mediumTasks[Math.floor(Math.random() * mediumTasks.length)];
		selectedTasks.push({ ...randomMedium });
	}

	if (hardTasks.length > 0) {
		const randomHard = hardTasks[Math.floor(Math.random() * hardTasks.length)];
		selectedTasks.push({ ...randomHard });
	}

	// Si on n'a pas assez de tâches, compléter avec des tâches aléatoires
	while (selectedTasks.length < 3) {
		const remainingTasks = extendedDailyTasks.filter(
			(task) => !selectedTasks.some((selected) => selected.slug === task.slug)
		);
		if (remainingTasks.length > 0) {
			const randomTask =
				remainingTasks[Math.floor(Math.random() * remainingTasks.length)];
			selectedTasks.push({ ...randomTask });
		} else {
			break;
		}
	}

	return selectedTasks;
};

// Fonction pour obtenir une mission bonus aléatoire
export const getBonusMission = (): ExtendedDailyTask | null => {
	const bonusTasks = extendedDailyTasks.filter(
		(task) => task.category === "social" || task.difficulty === "hard"
	);

	if (bonusTasks.length === 0) return null;

	const randomTask = bonusTasks[Math.floor(Math.random() * bonusTasks.length)];
	return { ...randomTask };
};
