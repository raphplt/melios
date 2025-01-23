// Type représentant les logs d'une habitude
export type Log = {
	id: string;
	habitId: string;
	logs: DailyLog[];
	mostRecentLog?: Date; // ex: pour stocker la plus récente date complétée
	uid: string; // id utilisateur
	createdAt?: Date;
	updatedAt?: Date;
};

export type DailyLog = {
	date: Date;
	reactions?: Reaction[];
};

export type Reaction = {
	uid: string;
	type: string;
};
