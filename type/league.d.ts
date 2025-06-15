export interface League {
	id: string;
	name: string;
	rank: number;
	color: string;
	iconUrl?: string;
	pointsRequired: number;
	weeklyPointsRequired: number;
}
