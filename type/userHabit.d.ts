import { HabitType } from "./habit";

export type UserHabit = {
	id: string;
	habitId: string;
	name: string;
	description?: string;
	type: HabitType;
	color: string;
	duration: number;
	moment: number;
	category: string; //TODO Update ?
	difficulty: number;
	icon?: string;
	reminderMoment?: number;
	frequency?: {
		monday?: boolean;
		tuesday?: boolean;
		wednesday?: boolean;
		thursday?: boolean;
		friday?: boolean;
		saturday?: boolean;
		sunday?: boolean;
	};
	confidentiality: "public" | "private" | "friends";
	createAt?: Date;
	resetAt?: Date;
};
