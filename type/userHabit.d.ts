export type UserHabit = {
	id: string;
	logs: Array<Log>;
	moment: number;
	name: string;
};

export type Log = {
	date: string;
	done: boolean;
};