import { z } from "zod";

export const createHabitSchema = z.object({
	name: z.string().min(3).max(255),
	description: z.string().min(3).max(255),
	difficulty: z.number().int().min(1).max(5),
	category: z.string().min(3).max(255),
});
