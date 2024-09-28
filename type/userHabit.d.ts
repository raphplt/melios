import { HabitType } from "./habit";

export type UserHabit = {
	id: string;
	habitId: string;
	name: string;
	description?: string;
	type: HabitType;
	color: string;
	duration?: number;
	moment?: number;
	icon?: string;
	reminderTime?: string;
	frequency?: {
		monday?: boolean;
		tuesday?: boolean;
		wednesday?: boolean;
		thursday?: boolean;
		friday?: boolean;
		saturday?: boolean;
		sunday?: boolean;
	};
};
