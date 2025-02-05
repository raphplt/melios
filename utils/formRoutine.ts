import { setMemberHabit } from "@db/userHabit";
import { Habit } from "@type/habit";
import { Member } from "@type/member";
import { router } from "expo-router";

export interface Answers {
	[key: string]: string;
}

/**
 * Renvoie les 10 habitudes recommandées en fonction des réponses du formulaire.
 *
 * @param answers Les réponses de l’utilisateur (clé = id de question, valeur = réponse).
 * @param habits La liste complète des habitudes.
 * @returns Un tableau de 10 UserHabit trié par pertinence.
 */
export function getRecommendedHabits(
	answers: Answers,
	habits: Habit[]
): Habit[] {
	// --- Quelques mappings pour relier réponses et mots-clés dans les habits ---
	const availableTimeMapping: { [key: string]: number } = {
		"Moins de 30 minutes": 30,
		"30 à 60 minutes": 60,
		"1 à 2 heures": 120,
		"Plus de 2 heures": 180,
	};

	const q1Mapping: { [key: string]: string[] } = {
		"Augmenter ma productivité": ["productivité", "gestion", "organisation"],
		"Améliorer ma santé mentale": [
			"santé mentale",
			"bien-être",
			"méditation",
			"journal",
		],
		"Me fixer des objectifs financiers": ["finance", "budget", "argent"],
		"Améliorer ma santé physique": ["sport", "fitness", "physique"],
		"Apprendre de nouvelles compétences": ["apprentissage", "compétence"],
		"Arrêter une mauvaise habitude": ["mauvaise habitude", "arrêter"],
	};

	const q2Mapping: { [key: string]: string[] } = {
		Sport: ["sport", "fitness"],
		Lecture: ["lecture"],
		Méditation: ["méditation", "journal"],
		"Suivi d'une alimentation saine": ["alimentation", "nutrition"],
		"Apprentissage de nouvelles compétences": ["apprentissage", "compétence"],
		"Rien de particulier": [],
	};

	const q6Mapping: { [key: string]: string[] } = {
		"Habitudes physiques (ex : sport)": ["sport", "fitness", "physique"],
		"Habitudes mentales (ex : méditation, journaling)": [
			"méditation",
			"journal",
			"mental",
			"bien-être",
		],
		"Habitudes productives (ex : gestion du temps)": [
			"productivité",
			"gestion",
			"organisation",
			"temps",
		],
		"Habitudes sociales (ex : networking)": ["social", "network", "relations"],
	};

	const q8Mapping: { [key: string]: string[] } = {
		"Perdre du poids": ["sport", "alimentation", "fitness", "nutrition"],
		"Lancer un projet": ["productivité", "organisation", "gestion", "projet"],
		"Obtenir une promotion": ["productivité", "leadership", "management"],
		"Améliorer ma santé mentale": ["santé mentale", "bien-être", "méditation"],
		"Apprendre une nouvelle compétence": ["apprentissage", "compétence"],
		"Autres...": [],
	};

	// --- Récupération et calcul des données issues des réponses ---
	const availableTime = availableTimeMapping[answers["q3"]] || 60; // par défaut 60 minutes
	const motivation = parseInt(answers["q4"]) || 5;
	const routineDifficulty = parseInt(answers["q9"]) || 5;
	// On combine la motivation et la difficulté à suivre des routines pour obtenir un "seuil" effectif.
	const effectiveMotivation = (motivation + (11 - routineDifficulty)) / 2;

	// --- Fonction de calcul du score pour une habitude donnée ---
	const scoreHabit = (habit: Habit): number => {
		let score = 0;
		// Passage en minuscules pour faciliter les comparaisons
		const habitName = habit.name.toLowerCase();
		const habitCategory = habit.category
			? habit.category.category.toLowerCase()
			: "";
		const habitDescription = habit.description
			? habit.description.toLowerCase()
			: "";
		const keywords = habit.keywords?.map((kw) => kw.toLowerCase());

		// Q1 : Objectif principal
		if (answers["q1"] && answers["q1"] !== "Autres...") {
			const keywords = q1Mapping[answers["q1"]];
			if (keywords) {
				for (const keyword of keywords) {
					if (
						habitName.includes(keyword) ||
						habitCategory.includes(keyword) ||
						habitDescription.includes(keyword) ||
						habit.keywords?.includes(keyword)
					) {
						score += 10;
						break;
					}
				}
			}
		}

		// Q2 : Habitudes déjà pratiquées (on pénalise pour éviter les doublons)
		if (answers["q2"] && answers["q2"] !== "Autres...") {
			const existingKeywords = q2Mapping[answers["q2"]];
			if (existingKeywords) {
				for (const keyword of existingKeywords) {
					if (
						habitName.includes(keyword) ||
						habitCategory.includes(keyword) ||
						habitDescription.includes(keyword) ||
						habit.keywords?.includes(keyword)
					) {
						score -= 5;
						break;
					}
				}
			}
		}

		// Q3 : Temps disponible
		if (habit.duration) {
			const timeDiff = availableTime - habit.duration;
			// Si l’habitude tient dans le temps disponible, on ajoute un bonus (jusqu’à +10)
			// Sinon, on pénalise proportionnellement.
			score += (timeDiff / availableTime) * 10;
		}

		// Q4 et Q9 : Motivation et difficulté
		if (habit.difficulty !== undefined) {
			const diffDiff = effectiveMotivation - habit.difficulty;
			// Bonus si la difficulté de l’habitude est inférieure au seuil effectif
			score += diffDiff * 2;
		}

		// Q5 : Sources de motivation
		if (answers["q5"] && answers["q5"] !== "Autres...") {
			const answer5 = answers["q5"];
			if (answer5 === "Sentiment de bien-être") {
				if (
					habitCategory.includes("santé mentale") ||
					habitDescription.includes("bien-être") ||
					habitDescription.includes("santé") ||
					habitCategory.includes("bien-être") ||
					habitCategory.includes("santé") ||
					(keywords && keywords.includes("bien-être")) ||
					(keywords && keywords.includes("santé"))
				) {
					score += 5;
				}
			} else if (answer5 === "Atteindre un objectif spécifique") {
				if (
					habitName.includes("objectif") ||
					habitCategory.includes("productivité") ||
					habitCategory.includes("gestion") ||
					habitCategory.includes("organisation") ||
					(keywords && keywords.includes("objectif")) ||
					(keywords && keywords.includes("productivité")) ||
					(keywords && keywords.includes("gestion")) ||
					(keywords && keywords.includes("organisation"))
				) {
					score += 5;
				}
			} else if (answer5 === "Suivi de progrès visibles") {
				if (habit.duration && habit.duration <= 30) {
					score += 5;
				}
			} else if (answer5 === "Récompenses externes") {
				if (
					habitCategory.includes("social") ||
					habitCategory.includes("récompense") ||
					habitDescription.includes("récompense") ||
					(keywords && keywords.includes("social")) ||
					(keywords && keywords.includes("récompense"))
				) {
					score += 5;
				}
			}
		}

		// Q6 : Type d’habitude recherché
		if (answers["q6"] && answers["q6"] !== "Autres...") {
			const typeKeywords = q6Mapping[answers["q6"]];
			if (typeKeywords) {
				for (const keyword of typeKeywords) {
					if (habitName.includes(keyword) || habitCategory.includes(keyword)) {
						score += 10;
						break;
					}
				}
			}
		}

		// Q7 : Obstacles
		if (answers["q7"] && answers["q7"] !== "Autres...") {
			const answer7 = answers["q7"];
			if (answer7 === "Manque de temps") {
				if (habit.duration > availableTime) {
					score -= 5;
				}
			} else if (answer7 === "Manque de motivation") {
				if (habit.difficulty > effectiveMotivation) {
					score -= 5;
				}
			} else if (answer7 === "Difficulté à rester constant") {
				// if (habit?.frequency) {
				// 	const daysScheduled = Object.values(habit.frequency).filter(
				// 		Boolean
				// 	).length;
				// 	if (daysScheduled > 4) {
				// 		score -= 3;
				// 	}
				// }
			} else if (answer7 === "Manque de connaissances") {
				if (habitDescription.length > 20) {
					score += 3;
				}
			}
		}

		// Q8 : Ambition pour l'année
		if (answers["q8"] && answers["q8"] !== "Autres...") {
			const ambitionKeywords = q8Mapping[answers["q8"]];
			if (ambitionKeywords) {
				for (const keyword of ambitionKeywords) {
					if (
						habitName.includes(keyword) ||
						habitCategory.includes(keyword) ||
						habitDescription.includes(keyword)
					) {
						score += 10;
						break;
					}
				}
			}
		}

		// Q10 : Type de récompense souhaité
		if (answers["q10"] && answers["q10"] !== "Autres...") {
			const answer10 = answers["q10"];
			if (answer10 === "Récompenses immédiates") {
				if (habit.duration && habit.duration <= 30) {
					score += 5;
				}
			} else if (answer10 === "Atteindre des étapes spécifiques") {
				if (habit.duration && habit.duration > 30 && habit.duration <= 60) {
					score += 5;
				}
			} else if (answer10 === "Reconnaissance sociale") {
				if (habitCategory.includes("social")) {
					score += 5;
				}
			}
		}

		return score;
	};

	// --- Application du scoring à toutes les habitudes ---
	const scoredHabits = habits.map((habit) => ({
		habit,
		score: scoreHabit(habit),
	}));

	// Tri décroissant selon le score
	scoredHabits.sort((a, b) => b.score - a.score);

	// On retourne les 10 premières habitudes (ou moins si la liste est plus courte)
	return scoredHabits.slice(0, 10).map((item) => item.habit);
}
const defaultFrequency = {
	monday: true,
	tuesday: true,
	wednesday: true,
	thursday: true,
	friday: true,
	saturday: true,
	sunday: true,
};

export async function addMultipleUserHabits(member: Member, habits: Habit[]) {
	try {
		const formattedHabits = habits.map((habit) => ({
			name: habit.name,
			description: habit.description,
			difficulty: habit.difficulty,
			category: habit.category.category,
			categoryId: habit.category.id,
			color: habit.category.color,
			icon: habit.category.icon,
			moment: habit.moment,
			duration: habit.duration,
			frequency: defaultFrequency,
			type: habit.type,
			memberId: member.uid,
			habitId: habit.id,
			confidentiality: "friends",
			createAt: new Date(),
		}));

		for (const habit of formattedHabits) {
			await setMemberHabit(habit);
		}

		router.push("(navbar)");

		console.log("Habitudes ajoutées avec succès");
		return formattedHabits;
	} catch (error) {
		console.error("Erreur lors de l'ajout des habitudes: ", error);
	}
}
