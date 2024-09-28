import { HabitType } from "./habit";

export type UserHabit = {
	id: string;
	habitId: string;
	name: string;
	description?: string;
	type: HabitType;
	duration?: number;
	moment?: number;
	color?: string;
	icon?: string;
	frequency?: {
		monday?: boolean;
		tuesday?: boolean;
		wednesday?: boolean;
		thursday?: boolean;
		friday?: boolean;
		saturday?: boolean;
		sunday?: boolean;
	};
	reminderTime?: string;
};
