import { Category } from "./category";

export type Habit = {
	category: Category;
	id: string;
	description: string;
	difficulty: number;
	duration: number;
	moment: number;
	name: string;
	reward: number;
};
