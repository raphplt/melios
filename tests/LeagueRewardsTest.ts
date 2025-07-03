import { LeagueRewardService } from "../services/LeagueRewardService";
import { League } from "../type/league.d";

// Test des récompenses de ligue - Vérification des limites
export const testLeagueRewards = () => {
	console.log("=== TEST DES RÉCOMPENSES DE LIGUE ===");

	// Test data - différentes ligues
	const leagues: League[] = [
		{
			id: "1",
			name: "Bronze",
			rank: 1,
			color: "#CD7F32",
			pointsRequired: 0,
			weeklyPointsRequired: 0,
		},
		{
			id: "2",
			name: "Argent",
			rank: 2,
			color: "#C0C0C0",
			pointsRequired: 100,
			weeklyPointsRequired: 20,
		},
		{
			id: "3",
			name: "Or",
			rank: 3,
			color: "#FFD700",
			pointsRequired: 200,
			weeklyPointsRequired: 40,
		},
		{
			id: "4",
			name: "Platine",
			rank: 4,
			color: "#E5E4E2",
			pointsRequired: 300,
			weeklyPointsRequired: 60,
		},
		{
			id: "5",
			name: "Diamant",
			rank: 5,
			color: "#B9F2FF",
			pointsRequired: 400,
			weeklyPointsRequired: 80,
		},
		{
			id: "6",
			name: "Maître",
			rank: 6,
			color: "#FF6B6B",
			pointsRequired: 500,
			weeklyPointsRequired: 100,
		},
		{
			id: "7",
			name: "Grand Maître",
			rank: 7,
			color: "#9B59B6",
			pointsRequired: 600,
			weeklyPointsRequired: 120,
		},
		{
			id: "8",
			name: "Champion",
			rank: 8,
			color: "#F39C12",
			pointsRequired: 700,
			weeklyPointsRequired: 140,
		},
		{
			id: "9",
			name: "Légende",
			rank: 9,
			color: "#E67E22",
			pointsRequired: 800,
			weeklyPointsRequired: 160,
		},
		{
			id: "10",
			name: "Mythique",
			rank: 10,
			color: "#D4AF37",
			pointsRequired: 1000,
			weeklyPointsRequired: 200,
		},
	];

	console.log("\n1. TEST DES RÉCOMPENSES POUR HABITUDES:");
	leagues.forEach((league) => {
		const easyHabit = LeagueRewardService.calculateHabitCompletionReward(
			league,
			1
		);
		const hardHabit = LeagueRewardService.calculateHabitCompletionReward(
			league,
			5
		);

		console.log(`${league.name} (rang ${league.rank}):`);
		console.log(`  - Habitude facile: ${easyHabit.totalReward} points`);
		console.log(`  - Habitude difficile: ${hardHabit.totalReward} points`);
	});

	console.log("\n2. TEST DES RÉCOMPENSES POUR OBJECTIFS:");
	leagues.forEach((league) => {
		const smallGoal = LeagueRewardService.calculateGoalCompletionReward(
			league,
			50
		);
		const bigGoal = LeagueRewardService.calculateGoalCompletionReward(
			league,
			500
		);

		console.log(`${league.name} (rang ${league.rank}):`);
		console.log(`  - Objectif petit: ${smallGoal.totalReward} points`);
		console.log(`  - Objectif grand: ${bigGoal.totalReward} points`);
	});

	console.log("\n3. TEST DES BONUS QUOTIDIENS:");
	leagues.forEach((league) => {
		const dailyBonus = LeagueRewardService.calculateDailyLeagueBonus(league);
		console.log(
			`${league.name} (rang ${league.rank}): ${dailyBonus} points/jour`
		);
	});

	console.log("\n4. TEST DES RÉCOMPENSES HEBDOMADAIRES:");
	leagues.forEach((league) => {
		const promotion = LeagueRewardService.calculateWeeklyReward(
			league,
			"promotion"
		);
		const maintained = LeagueRewardService.calculateWeeklyReward(
			league,
			"maintained"
		);
		const relegated = LeagueRewardService.calculateWeeklyReward(
			league,
			"relegated"
		);

		console.log(`${league.name} (rang ${league.rank}):`);
		console.log(`  - Promotion: ${promotion} points`);
		console.log(`  - Maintien: ${maintained} points`);
		console.log(`  - Relégation: ${relegated} points`);
	});

	console.log("\n5. ANALYSE DES GAINS QUOTIDIENS MAXIMUMS:");
	leagues.forEach((league) => {
		const maxHabits = 3; // Supposons max 3 habitudes par jour
		const maxGoals = 1; // Supposons max 1 objectif par jour
		const dailyBonus = LeagueRewardService.calculateDailyLeagueBonus(league);

		const habitReward = LeagueRewardService.calculateHabitCompletionReward(
			league,
			2
		);
		const goalReward = LeagueRewardService.calculateGoalCompletionReward(
			league,
			100
		);

		const maxDaily =
			habitReward.totalReward * maxHabits +
			goalReward.totalReward * maxGoals +
			dailyBonus;

		console.log(`${league.name}: Max ${maxDaily} points/jour`);

		// Vérifier que c'est bien limité à 2-3 points/jour
		if (maxDaily > 3) {
			console.warn(
				`⚠️  ${league.name} dépasse la limite de 3 points/jour: ${maxDaily} points`
			);
		}
	});

	console.log("\n=== FIN DES TESTS ===");
};

// Fonction pour exécuter les tests
export const runRewardsTests = () => {
	testLeagueRewards();
};
