/**
 * Test pour vérifier que les avatars des bots utilisent bien les icônes locales
 */
import { BotGeneratorService } from "../services/BotGeneratorService";
import { Member } from "../type/member";
import getIcon from "../utils/cosmeticsUtils";

// Mock d'un membre de test
const mockMember: Member = {
	uid: "test-user",
	nom: "TestUser",
	profilePicture: "man",
	league: {
		points: 100,
		leagueId: "test-league",
		rank: 1,
		weeklyPoints: 50,
		lastWeeklyReset: new Date().toISOString(),
	},
};

// Test de génération des bots
function testBotAvatarGeneration() {
	console.log("🧪 Test de génération des avatars de bots...");

	const bots = BotGeneratorService.generateBotsForLeague(
		mockMember,
		"test-league",
		10, // Générer 10 bots
		[]
	);

	console.log(`✅ ${bots.length} bots générés`);

	// Vérifier que chaque bot a un avatar valide
	bots.forEach((bot, index) => {
		const avatarPath = getIcon(bot.profilePicture);
		console.log(
			`Bot ${index + 1}: ${bot.nom} -> ${bot.profilePicture} -> ${avatarPath}`
		);

		// Vérifier que l'avatar est un path local valide
		if (!avatarPath.startsWith("images/cosmetics/")) {
			console.error(`❌ Avatar invalide pour ${bot.nom}: ${avatarPath}`);
		} else {
			console.log(`✅ Avatar valide pour ${bot.nom}`);
		}
	});
}

// Test de correspondance nom-avatar
function testNameToAvatarMapping() {
	console.log("\n🧪 Test de correspondance nom-avatar...");

	const testNames = [
		"Zeus",
		"Athena",
		"Apollo",
		"Hercules",
		"Aphrodite",
		"UnknownName",
	];

	testNames.forEach((name) => {
		// Créer un bot avec ce nom spécifique
		const bot = BotGeneratorService.generateBotsForLeague(
			mockMember,
			"test-league",
			1,
			[]
		).find((b) => b.nom === name);

		if (bot) {
			const avatarPath = getIcon(bot.profilePicture);
			console.log(`${name} -> ${bot.profilePicture} -> ${avatarPath}`);

			// Vérifications spécifiques
			if (name === "Zeus" && bot.profilePicture === "zeus") {
				console.log(`✅ ${name} correctement associé à zeus`);
			} else if (name === "Athena" && bot.profilePicture === "warrior_woman") {
				console.log(`✅ ${name} correctement associé à warrior_woman`);
			} else if (name === "Apollo" && bot.profilePicture === "apollon") {
				console.log(`✅ ${name} correctement associé à apollon`);
			} else {
				console.log(`ℹ️  ${name} utilise un avatar générique ou aléatoire`);
			}
		}
	});
}

// Test de validation des avatars disponibles
function testAvailableAvatars() {
	console.log("\n🧪 Test des avatars disponibles...");

	const availableAvatars = [
		"apollon",
		"dyonisos",
		"hades",
		"hephaistos",
		"man",
		"owl_warrior",
		"poseidon",
		"priestess",
		"soldier",
		"warrior_woman",
		"woman",
		"zeus",
	];

	availableAvatars.forEach((avatar) => {
		const path = getIcon(avatar);
		console.log(`${avatar} -> ${path}`);

		if (path === "images/cosmetics/man.png" && avatar !== "man") {
			console.log(`⚠️  Avatar ${avatar} utilise le fallback par défaut`);
		} else {
			console.log(`✅ Avatar ${avatar} disponible`);
		}
	});
}

// Exécuter les tests
export function runBotAvatarTests() {
	console.log("🚀 Démarrage des tests d'avatars de bots\n");

	testBotAvatarGeneration();
	testNameToAvatarMapping();
	testAvailableAvatars();

	console.log("\n✅ Tests terminés");
}

// Exécuter les tests si le fichier est lancé directement
if (require.main === module) {
	runBotAvatarTests();
}
