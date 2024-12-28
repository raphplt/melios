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
	name: z
		.string()
		.min(3, { message: "Le nom doit contenir au moins 3 caractères." })
		.max(255, { message: "Le nom ne doit pas dépasser 255 caractères." }),
	description: z
		.string()
		.max(255, { message: "La description ne doit pas dépasser 255 caractères." })
		.optional(),
	difficulty: z
		.number()
		.int({ message: "La difficulté doit être un nombre entier." })
		.min(1, { message: "La difficulté doit être au moins 1." })
		.max(5, { message: "La difficulté ne doit pas dépasser 5." }),
	category: z
		.string()
		.min(3, { message: "La catégorie doit contenir au moins 3 caractères." })
		.max(255, { message: "La catégorie ne doit pas dépasser 255 caractères." }),
	categoryId: z.string().optional().nullable(),
	color: z
		.string()
		.min(3, { message: "La couleur doit contenir au moins 3 caractères." })
		.max(255, { message: "La couleur ne doit pas dépasser 255 caractères." }),
	icon: z
		.string()
		.min(3, { message: "L'icône doit contenir au moins 3 caractères." })
		.max(255, { message: "L'icône ne doit pas dépasser 255 caractères." }),
	type: z
		.string()
		.min(3, { message: "Le type doit contenir au moins 3 caractères." })
		.max(255, { message: "Le type ne doit pas dépasser 255 caractères." }),
	duration: z
		.number()
		.int({ message: "La durée doit être un nombre entier." })
		.min(0, { message: "La durée doit être au moins 0." })
		.max(3600, { message: "La durée ne doit pas dépasser 3600 secondes." }),
	moment: z
		.number()
		.int({ message: "Le moment doit être un nombre entier." })
		.min(-1, { message: "Le moment doit être au moins -1." })
		.max(24, { message: "Le moment ne doit pas dépasser 24." }),
	frequency: frequencySchema,
	reminderMoment: z
		.number()
		.int({ message: "Le moment de rappel doit être un nombre entier." })
		.min(0, { message: "Le moment de rappel doit être au moins 0." })
		.max(24, { message: "Le moment de rappel ne doit pas dépasser 24." }),
	memberId: z.string({ message: "L'ID du membre est requis." }),
	habitId: z.string().optional().nullable(),
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