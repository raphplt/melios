// Test pour vérifier le bon fonctionnement des bots avec les avatars locaux
import { BotGeneratorService } from "../services/BotGeneratorService";
import { Member } from "../type/member";

// Test de génération de bots
export const testBotGeneration = () => {
	console.log("🧪 Test de génération de bots avec avatars locaux");

	// Mock d'un membre actuel
	const mockMember: Member = {
		uid: "test-user-123",
		nom: "TestUser",
		profilePicture: "zeus",
		league: {
			points: 150,
			leagueId: "bronze-league",
			rank: 1,
			weeklyPoints: 45,
			lastWeeklyReset: new Date().toISOString(),
		},
	};

	// Générer des bots
	const bots = BotGeneratorService.generateBotsForLeague(
		mockMember,
		"bronze-league",
		10,
		[]
	);

	console.log(`✅ ${bots.length} bots générés`);

	// Vérifier que chaque bot a un avatar local valide
	bots.forEach((bot, index) => {
		console.log(`Bot ${index + 1}:`, {
			nom: bot.nom,
			avatar: bot.profilePicture,
			points: bot.league?.points,
			isBot: bot.isBot,
		});

		// Vérifier que l'avatar est bien un slug local
		const isValidAvatar =
			typeof bot.profilePicture === "string" &&
			!bot.profilePicture.startsWith("http") &&
			bot.profilePicture.length > 0;

		if (!isValidAvatar) {
			console.error(`❌ Avatar invalide pour ${bot.nom}: ${bot.profilePicture}`);
		} else {
			console.log(`✅ Avatar valide pour ${bot.nom}: ${bot.profilePicture}`);
		}
	});

	// Test de tri avec rangs
	const allMembers = [mockMember, ...bots];
	const rankedMembers = BotGeneratorService.assignRanks(allMembers);

	console.log("\n📊 Classement final:");
	rankedMembers.slice(0, 5).forEach((member, index) => {
		console.log(`${index + 1}. ${member.nom} - ${member.league?.points} points`);
	});

	return { bots, rankedMembers };
};

// Fonction utilitaire pour debug des avatars
export const debugBotAvatars = () => {
	console.log("🎭 Debug des avatars de bots");

	const avatarsUsed = new Set<string>();
	const nameToAvatarMapping: { [key: string]: string } = {};

	// Générer plusieurs lots de bots pour voir la variété
	for (let i = 0; i < 3; i++) {
		const mockMember: Member = {
			uid: `test-user-${i}`,
			nom: `TestUser${i}`,
			profilePicture: "man",
			league: {
				points: 100 + i * 50,
				leagueId: `league-${i}`,
				rank: 1,
				weeklyPoints: 30,
				lastWeeklyReset: new Date().toISOString(),
			},
		};

		const bots = BotGeneratorService.generateBotsForLeague(
			mockMember,
			`league-${i}`,
			5,
			[]
		);

		bots.forEach((bot) => {
			avatarsUsed.add(bot.profilePicture);
			nameToAvatarMapping[bot.nom] = bot.profilePicture;
		});
	}

	console.log(
		`\n🎨 Avatars utilisés (${avatarsUsed.size}):`,
		Array.from(avatarsUsed)
	);
	console.log("\n🏷️ Mapping nom -> avatar:");
	Object.entries(nameToAvatarMapping).forEach(([name, avatar]) => {
		console.log(`  ${name} -> ${avatar}`);
	});
};

// Instructions d'utilisation en mode développement
if (__DEV__) {
	// Décommenter pour tester
	// testBotGeneration();
	// debugBotAvatars();
}
