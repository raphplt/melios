export type Log = {
	id: string;
	habitId: string;
	uid: string; // id utilisateur
	createdAt?: Date;
	updatedAt?: Date;
	logs?: DailyLog[]; // sous collection
};

export type DailyLog = {
	id: string;
	logDocId: string;
	date: Date;
	reactions?: Reaction[];
};

export type Reaction = {
	uid: string;
	type: string;
};
