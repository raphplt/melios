export type GenericLevel = {
	id: string;
	name: string;
	description: string;
	color: string;
	associatedCategoryIds: string[];
	icon: string;
	slug: string;
};

export type UserLevel = {
	id: string;
	levelId: string;
	userId: string;
	currentLevel: number;
	currentXp: number;
	nextLevelXp: number;
};

export type CombinedLevel = UserLevel & GenericLevel & { levelId: string };