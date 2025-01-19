export type Reaction = {
	uid: string;
	type: string;
};

export type Log = {
	id: string;
	habitId: string;
	logs: string[];
	uid: string;
	createAt: Date;
	reactions?: Reaction[];
};
