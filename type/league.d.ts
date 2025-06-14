export interface League {
	id: string;
	name: string;
	rank: number;
	color: string;
	iconUrl?: string;
	pointsRequired: number; // Points requis pour atteindre cette ligue
	weeklyPointsRequired: number; // Points requis par semaine pour maintenir/progresser
}
