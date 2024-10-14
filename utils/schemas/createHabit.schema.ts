import { z } from "zod";

const frequencySchema = z.object({
	monday: z.boolean().optional(),
	tuesday: z.boolean().optional(),
	wednesday: z.boolean().optional(),
	thursday: z.boolean().optional(),
	friday: z.boolean().optional(),
	saturday: z.boolean().optional(),
	sunday: z.boolean().optional(),
});

export const createHabitSchema = z.object({
	name: z.string().min(3).max(255),
	description: z.string().min(3).max(255),
	difficulty: z.number().int().min(1).max(5),
	category: z.string().min(3).max(255),
	color: z.string().min(3).max(255),
	icon: z.string().min(3).max(255),
	duration: z.number().int().min(0).max(3600),
	moment: z.number().int().min(-1).max(24),
	frequency: frequencySchema,
	reminderMoment: z.number().int().min(0).max(24),
	memberId: z.string().optional(),
	habitId: z.string().optional(),
});

export const frequencyDefaultValues = {
	monday: true,
	tuesday: true,
	wednesday: true,
	thursday: true,
	friday: true,
	saturday: true,
	sunday: true,
};

export const daysList = [
	{
		id: 0,
		name: "Lun",
		slug: "monday",
	},
	{
		id: 1,
		name: "Mar",
		slug: "tuesday",
	},
	{
		id: 2,
		name: "Mer",
		slug: "wednesday",
	},
	{
		id: 3,
		name: "Jeu",
		slug: "thursday",
	},
	{
		id: 4,
		name: "Ven",
		slug: "friday",
	},
	{
		id: 5,
		name: "Sam",
		slug: "saturday",
	},
	{
		id: 6,
		name: "Dim",
		slug: "sunday",
	},
];