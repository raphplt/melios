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
	reminderMoment: number;
	confidentiality: "public" | "private" | "friends";
	recommended: boolean;
	keywords?: string[];
};

export type HabitType = "Positif" | "Négatif" | "Personnalisé" | "Routine";
