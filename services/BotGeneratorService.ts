import { Member } from "../type/member";

interface BotMember extends Member {
	isBot: boolean;
}

// Noms mythologiques pour les bots
const MYTHOLOGICAL_NAMES = [
	"Athena", "Zeus", "Apollo", "Artemis", "Ares", "Aphrodite", "Hephaestus", 
	"Demeter", "Dionysus", "Hermes", "Hestia", "Poseidon", "Hera", "Hades",
	"Persephone", "Hecate", "Iris", "Nike", "Tyche", "Nemesis", "Eos", "Selene",
	"Helios", "Atlas", "Prometheus", "Epimetheus", "Pandora", "Orpheus", "Eurydice",
	"Medusa", "Perseus", "Andromeda", "Theseus", "Ariadne", "Hercules", "Achilles",
	"Hector", "Paris", "Helen", "Cassandra", "Odysseus", "Penelope", "Circe",
	"Calypso", "Siren", "Midas", "Icarus", "Daedalus", "Pegasus", "Chiron"
];

// Avatars par défaut pour les bots
const BOT_AVATARS = [
	"https://api.dicebear.com/7.x/bottts-neutral/svg?seed=",
	"https://api.dicebear.com/7.x/personas/svg?seed=",
	"https://api.dicebear.com/7.x/avataaars-neutral/svg?seed="
];

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
			...existingMembers.map(m => m.nom)
		]);

		// Obtenir les points du membre actuel pour générer des scores réalistes
		const currentMemberPoints = currentMember.league?.points ?? 0;
		
		for (let i = 0; i < botsNeeded; i++) {
			// Sélectionner un nom unique
			let botName = MYTHOLOGICAL_NAMES[Math.floor(Math.random() * MYTHOLOGICAL_NAMES.length)];
			let attempts = 0;
			while (usedNames.has(botName) && attempts < 50) {
				botName = MYTHOLOGICAL_NAMES[Math.floor(Math.random() * MYTHOLOGICAL_NAMES.length)];
				attempts++;
			}
			
			if (attempts >= 50) {
				botName = `${MYTHOLOGICAL_NAMES[Math.floor(Math.random() * MYTHOLOGICAL_NAMES.length)]}_${i}`;
			}
			
			usedNames.add(botName);

			// Générer des points réalistes autour du score du joueur
			const variation = 0.3; // 30% de variation
			const minPoints = Math.max(0, currentMemberPoints * (1 - variation));
			const maxPoints = currentMemberPoints * (1 + variation);
			const botPoints = Math.floor(Math.random() * (maxPoints - minPoints) + minPoints);

			// Points hebdomadaires proportionnels
			const weeklyPoints = Math.floor(botPoints * 0.3 + Math.random() * 20);

			// Avatar aléatoire
			const avatarBase = BOT_AVATARS[Math.floor(Math.random() * BOT_AVATARS.length)];
			const avatarSeed = botName.toLowerCase().replace(/\s+/g, '');

			const bot: BotMember = {
				uid: `bot_${currentLeagueId}_${i}_${Date.now()}`,
				nom: botName,
				profilePicture: `${avatarBase}${avatarSeed}`,
				isBot: true,
				league: {
					points: botPoints,
					leagueId: currentLeagueId,
					rank: 1, // Sera recalculé lors du tri
					weeklyPoints: weeklyPoints,
					lastWeeklyReset: new Date().toISOString(),
				}
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
	static simulateBotProgression(bots: BotMember[], playerProgress: number = 0): BotMember[] {
		return bots.map(bot => {
			// Les bots gagnent entre 0 et 5 points par jour
			const dailyProgress = Math.floor(Math.random() * 6);
			const currentPoints = bot.league?.points ?? 0;

			// Si le joueur progresse beaucoup, certains bots progressent aussi
			const competitiveBonus = playerProgress > 10 ? Math.floor(Math.random() * 3) : 0;

			return {
				...bot,
				league: {
					...bot.league!,
					points: currentPoints + dailyProgress + competitiveBonus,
					weeklyPoints: (bot.league?.weeklyPoints ?? 0) + dailyProgress + competitiveBonus,
				}
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
			}
		}));
	}

	/**
	 * Vérifie si un membre est un bot
	 */
	static isBot(member: Member | BotMember): member is BotMember {
		return 'isBot' in member && member.isBot === true;
	}
}

export type { BotMember };
