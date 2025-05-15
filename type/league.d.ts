export interface League {
	id: string;
	name: string;
	rank: number;
	color: string;
	iconUrl?: string;
	promotionCount: number;
	relegationCount: number;
	botScoreRange: [number, number];
}
