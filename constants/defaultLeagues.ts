import { League } from "../type/league";

// Configuration par défaut des ligues
export const DEFAULT_LEAGUES: Omit<League, "id">[] = [
	{
		name: "Bois",
		rank: 1,
		color: "#8B4513",
		pointsRequired: 0,
		weeklyPointsRequired: 50,
		iconUrl: "Terre.png",
	},
	{
		name: "Bronze",
		rank: 2,
		color: "#CD7F32",
		pointsRequired: 200,
		weeklyPointsRequired: 100,
		iconUrl: "Bronze.png",
	},
	{
		name: "Fer",
		rank: 3,
		color: "#708090",
		pointsRequired: 500,
		weeklyPointsRequired: 150,
		iconUrl: "Fer.png",
	},
	{
		name: "Argent",
		rank: 4,
		color: "#C0C0C0",
		pointsRequired: 1000,
		weeklyPointsRequired: 200,
		iconUrl: "Argent.png",
	},
	{
		name: "Or",
		rank: 5,
		color: "#FFD700",
		pointsRequired: 2000,
		weeklyPointsRequired: 300,
		iconUrl: "Or.png",
	},
	{
		name: "Platine",
		rank: 6,
		color: "#E5E4E2",
		pointsRequired: 4000,
		weeklyPointsRequired: 400,
		iconUrl: "Platine.png",
	},
	{
		name: "Diamant",
		rank: 7,
		color: "#B9F2FF",
		pointsRequired: 8000,
		weeklyPointsRequired: 500,
		iconUrl: "Diamant.png",
	},
	{
		name: "Maître",
		rank: 8,
		color: "#9932CC",
		pointsRequired: 15000,
		weeklyPointsRequired: 700,
		iconUrl: "Maitre.png",
	},
];

export const getLeagueIcon = (leagueName: string): string => {
	const league = DEFAULT_LEAGUES.find(
		(l) => l.name.toLowerCase() === leagueName.toLowerCase()
	);
	return league?.iconUrl || "🏆";
};

export const getLeagueByRank = (
	rank: number
): Omit<League, "id"> | undefined => {
	return DEFAULT_LEAGUES.find((l) => l.rank === rank);
};

export const getNextLeague = (
	currentRank: number
): Omit<League, "id"> | undefined => {
	return DEFAULT_LEAGUES.find((l) => l.rank === currentRank + 1);
};

export const getPreviousLeague = (
	currentRank: number
): Omit<League, "id"> | undefined => {
	return DEFAULT_LEAGUES.find((l) => l.rank === currentRank - 1);
};
