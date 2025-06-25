// Script de test pour les nouveaux composants de la page Leagues
// Ce fichier peut être utilisé pour vérifier le bon fonctionnement des composants

import {
	LigueBadgeProgression,
	ObjectifHebdoProgression,
	PodiumOlympique,
	StatistiquesLigue,
} from "../components/Leagues";
import { League } from "../type/league.d";

// Exemple de ligue pour les tests
export const mockCurrentLeague: League = {
	id: "league_4",
	name: "Argent",
	rank: 4,
	color: "#C0C0C0",
	iconUrl: "Argent.png",
	pointsRequired: 1000,
	weeklyPointsRequired: 200,
};

export const mockNextLeague: League = {
	id: "league_5",
	name: "Or",
	rank: 5,
	color: "#FFD700",
	iconUrl: "Or.png",
	pointsRequired: 2000,
	weeklyPointsRequired: 300,
};

// Exemples de données de test
export const mockData = {
	// Données pour LigueBadgeProgression
	badgeProgression: {
		currentLeague: mockCurrentLeague,
		currentRank: 3,
		currentPoints: 1350,
		nextLeague: mockNextLeague,
		progressPercent: 67.5,
	},

	// Données pour ObjectifHebdoProgression
	weeklyGoal: {
		currentPoints: 85,
		targetPoints: 150,
		daysLeft: 3,
		currentLeague: mockCurrentLeague,
	},

	// Données pour PodiumOlympique
	podiumParticipants: [
		{
			name: "Raphaël",
			points: 1850,
			rank: 1,
			avatarUrl: "https://example.com/avatar1.jpg",
			isCurrentUser: true,
		},
		{
			name: "Sophie",
			points: 1720,
			rank: 2,
			avatarUrl: "https://example.com/avatar2.jpg",
			isCurrentUser: false,
		},
		{
			name: "Marcus",
			points: 1680,
			rank: 3,
			avatarUrl: "https://example.com/avatar3.jpg",
			isCurrentUser: false,
		},
	],

	// Données pour StatistiquesLigue
	leagueStats: {
		totalParticipants: 12,
		record: 1850,
		moyenne: 1430,
		isSoloLeague: false,
	},

	// Cas d'une ligue solo
	soloLeagueStats: {
		totalParticipants: 1,
		record: 0,
		moyenne: 0,
		isSoloLeague: true,
	},
};

// Exemple d'utilisation dans une page de test
/*
<LigueBadgeProgression
  currentLeague={mockLeagues[0]}
  currentRank={mockData.badgeProgression.currentRank}
  currentPoints={mockData.badgeProgression.currentPoints}
  nextLeague={mockLeagues[1]}
  progressPercent={mockData.badgeProgression.progressPercent}
/>

<ObjectifHebdoProgression
  currentPoints={mockData.weeklyGoal.currentPoints}
  targetPoints={mockData.weeklyGoal.targetPoints}
  daysLeft={mockData.weeklyGoal.daysLeft}
  currentLeague={mockLeagues[0]}
/>

<PodiumOlympique
  participants={mockData.podiumParticipants}
  leagueName="Ligue Argent"
/>

<StatistiquesLigue
  totalParticipants={mockData.leagueStats.totalParticipants}
  record={mockData.leagueStats.record}
  moyenne={mockData.leagueStats.moyenne}
  isSoloLeague={mockData.leagueStats.isSoloLeague}
/>
*/
