import { Member } from "../type/member";

interface BotMember extends Member {
	isBot: boolean;
}

const MYTHOLOGICAL_NAMES = [
	"Athena",
	"Zeus",
	"Apollo",
	"Artemis",
	"Ares",
	"Aphrodite",
	"Hephaestus",
	"Demeter",
	"Dionysus",
	"Hermes",
	"Hestia",
	"Poseidon",
	"Hera",
	"Hades",
	"Persephone",
	"Hecate",
	"Iris",
	"Nike",
	"Tyche",
	"Nemesis",
	"Eos",
	"Selene",
	"Helios",
	"Atlas",
	"Prometheus",
	"Epimetheus",
	"Pandora",
	"Orpheus",
	"Eurydice",
	"Medusa",
	"Perseus",
	"Andromeda",
	"Theseus",
	"Ariadne",
	"Hercules",
	"Achilles",
	"Hector",
	"Paris",
	"Helen",
	"Cassandra",
	"Odysseus",
	"Penelope",
	"Circe",
	"Calypso",
	"Siren",
	"Midas",
	"Icarus",
	"Daedalus",
	"Pegasus",
	"Chiron",
];

const BOT_AVATARS = [
	"apollon",
	"dyonisos",
	"hades",
	"hephaistos",
	"poseidon",
	"zeus",
	"owl_warrior",
	"priestess",
	"soldier",
	"warrior_woman",
	"man",
	"woman",
];

const NAME_TO_AVATAR_MAP: { [key: string]: string } = {
	Zeus: "zeus",
	Apollo: "apollon",
	Dionysus: "dyonisos",
	Hades: "hades",
	Hephaestus: "hephaistos",
	Poseidon: "poseidon",
	Hermes: "man",
	Ares: "soldier",

	// Déesses principales
	Athena: "warrior_woman",
	Artemis: "warrior_woman",
	Hera: "woman",
	Aphrodite: "priestess",
	Demeter: "priestess",
	Hestia: "priestess",
	Persephone: "priestess",
	Hecate: "priestess",

	// Héros et guerriers
	Hercules: "soldier",
	Achilles: "soldier",
	Theseus: "soldier",
	Perseus: "soldier",
	Hector: "soldier",
	Atlas: "soldier",

	// Personnages féminins mythologiques
	Medusa: "warrior_woman",
	Andromeda: "woman",
	Helen: "woman",
	Cassandra: "priestess",
	Penelope: "woman",
	Circe: "priestess",
	Calypso: "priestess",
	Pandora: "woman",
	Eurydice: "woman",
	Ariadne: "woman",

	// Personnages masculins divers
	Odysseus: "man",
	Paris: "man",
	Orpheus: "man",
	Midas: "man",
	Prometheus: "man",
	Epimetheus: "man",
	Icarus: "man",
	Daedalus: "man",

	// Créatures et entités spéciales
	Siren: "priestess",
	Pegasus: "owl_warrior", // Créature mythique
	Chiron: "man", // Centaure sage

	// Divinités mineures
	Iris: "priestess",
	Nike: "warrior_woman",
	Tyche: "woman",
	Nemesis: "warrior_woman",
	Eos: "woman",
	Selene: "priestess",
	Helios: "apollon", // Dieu du soleil, similaire à Apollon
};

export class BotGeneratorService {
	/**
	 * Génère des bots pour remplir une ligue
	 * @param currentMember Le membre actuel
	 * @param currentLeagueId L'ID de la ligue actuelle
	 * @param targetCount Le nombre total de membres souhaités dans la ligue
	 * @param existingMembers Les membres existants dans la ligue
	 * @returns Les bots générés
	 */
	static generateBotsForLeague(
		currentMember: Member,
		currentLeagueId: string,
		targetCount: number = 20,
		existingMembers: Member[] = []
	): BotMember[] {
		const botsNeeded = Math.max(0, targetCount - existingMembers.length - 1); // -1 pour le membre actuel
		if (botsNeeded === 0) return [];

		const bots: BotMember[] = [];
		const usedNames = new Set([
			currentMember.nom,
			...existingMembers.map((m) => m.nom),
		]);

		// Obtenir les points du membre actuel pour générer des scores réalistes
		const currentMemberPoints = currentMember.league?.points ?? 0;

		for (let i = 0; i < botsNeeded; i++) {
			// Sélectionner un nom unique
			let botName =
				MYTHOLOGICAL_NAMES[Math.floor(Math.random() * MYTHOLOGICAL_NAMES.length)];
			let attempts = 0;
			while (usedNames.has(botName) && attempts < 50) {
				botName =
					MYTHOLOGICAL_NAMES[Math.floor(Math.random() * MYTHOLOGICAL_NAMES.length)];
				attempts++;
			}

			if (attempts >= 50) {
				botName = `${
					MYTHOLOGICAL_NAMES[Math.floor(Math.random() * MYTHOLOGICAL_NAMES.length)]
				}_${i}`;
			}

			usedNames.add(botName);

			// Générer des points réalistes autour du score du joueur
			const variation = 0.3; // 30% de variation
			const minPoints = Math.max(0, currentMemberPoints * (1 - variation));
			const maxPoints = currentMemberPoints * (1 + variation);
			const botPoints = Math.floor(
				Math.random() * (maxPoints - minPoints) + minPoints
			);

			// Points hebdomadaires proportionnels
			const weeklyPoints = Math.floor(botPoints * 0.3 + Math.random() * 20);

			// Avatar thématique correspondant au nom
			let avatarSlug = NAME_TO_AVATAR_MAP[botName];

			// Si pas de correspondance spécifique, utiliser un avatar aléatoire approprié
			if (!avatarSlug) {
				avatarSlug = BOT_AVATARS[Math.floor(Math.random() * BOT_AVATARS.length)];
			}

			const bot: BotMember = {
				uid: `bot_${currentLeagueId}_${i}_${Date.now()}`,
				nom: botName,
				profilePicture: avatarSlug,
				isBot: true,
				league: {
					points: botPoints,
					leagueId: currentLeagueId,
					rank: 1, // Sera recalculé lors du tri
					weeklyPoints: weeklyPoints,
					lastWeeklyReset: new Date().toISOString(),
				},
			};

			bots.push(bot);
		}

		return bots;
	}

	/**
	 * Simule l'évolution des scores des bots au fil du temps
	 * @param bots Les bots à faire évoluer
	 * @param playerProgress Les progrès récents du joueur
	 */
	static simulateBotProgression(
		bots: BotMember[],
		playerProgress: number = 0
	): BotMember[] {
		return bots.map((bot) => {
			// Les bots gagnent entre 0 et 5 points par jour
			const dailyProgress = Math.floor(Math.random() * 6);
			const currentPoints = bot.league?.points ?? 0;

			// Si le joueur progresse beaucoup, certains bots progressent aussi
			const competitiveBonus =
				playerProgress > 10 ? Math.floor(Math.random() * 3) : 0;

			return {
				...bot,
				league: {
					...bot.league!,
					points: currentPoints + dailyProgress + competitiveBonus,
					weeklyPoints:
						(bot.league?.weeklyPoints ?? 0) + dailyProgress + competitiveBonus,
				},
			};
		});
	}

	/**
	 * Trie et attribue les rangs à tous les membres d'une ligue
	 * @param members Tous les membres de la ligue (vrais + bots)
	 */
	static assignRanks(members: (Member | BotMember)[]): (Member | BotMember)[] {
		const sortedMembers = [...members].sort((a, b) => {
			const pointsA = a.league?.points ?? 0;
			const pointsB = b.league?.points ?? 0;
			return pointsB - pointsA; // Ordre décroissant
		});

		return sortedMembers.map((member, index) => ({
			...member,
			league: {
				...member.league!,
				rank: index + 1,
			},
		}));
	}

	/**
	 * Vérifie si un membre est un bot
	 */
	static isBot(member: Member | BotMember): member is BotMember {
		return "isBot" in member && member.isBot === true;
	}
}

export type { BotMember };
