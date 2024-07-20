export type UserHabit = {
	id: string;
	logs: Array<{
		date: string;
		done: boolean;
	}>;
	moment: number;
	name: string;
};
