export type GenericLevel = {
	id: string;
	name: string;
	description: string;
	color: string;
	associatedCategoryIds: string[];
	icon?: string;
	priority?: number;
};

export type UserLevel = {
	id: string;
	levelId: string;
	userId: string;
	xp: number;
};
