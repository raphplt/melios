import { Category } from "./category";

export type Habit = {
	id: string;
	name: string;
	description: string;
	type: HabitType;
	color: string;
	icon: string;
	difficulty: number;
	duration: number;
	moment: number;
	category: Category;
};

export enum HabitType {
	"Positive" = "Positive",
	"Negative" = "Negative",
	"Neutral" = "Neutral",
}