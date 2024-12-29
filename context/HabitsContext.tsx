import React, { createContext, useContext, useState, useEffect } from "react";
import { Category } from "@type/category";
import { getHabitsWithCategories } from "@db/fetch";
import { getAllCategories } from "@db/category";
import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";
import { GenericLevel } from "@type/levels";
import { getAllGenericLevels } from "@db/levels";

interface HabitsContextProps {
	habitsData: Habit[];
	loading: boolean;
	refreshHabits: (forceRefresh?: boolean) => void;
	currentHabit: UserHabit | null;
	setCurrentHabit: React.Dispatch<React.SetStateAction<UserHabit | null>>;
	showHabitDetail?: boolean;
	setShowHabitDetail: React.Dispatch<React.SetStateAction<boolean>>;
	categories: Category[];
	refreshCategories: (forceRefresh?: boolean) => void;
	genericLevels: GenericLevel[];
	setGenericLevels: React.Dispatch<React.SetStateAction<GenericLevel[]>>;
	refreshGenericLevels: (forceRefresh?: boolean) => void;
}

export const HabitsContext = createContext<HabitsContextProps>({
	habitsData: [],
	loading: false,
	refreshHabits: function (): void {},
	currentHabit: null,
	setCurrentHabit: function (
		value: React.SetStateAction<UserHabit | null>
	): void {},
	showHabitDetail: false,
	setShowHabitDetail: function (value: React.SetStateAction<boolean>): void {},
	categories: [],
	refreshCategories: function (): void {},
	genericLevels: [],
	setGenericLevels: function (
		value: React.SetStateAction<GenericLevel[]>
	): void {},
	refreshGenericLevels: function (): void {},
});

type HabitsProviderProps = {
	children: React.ReactNode;
};

export const HabitsProvider = ({ children }: HabitsProviderProps) => {
	const [habitsData, setHabitsData] = useState<Habit[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentHabit, setCurrentHabit] = useState<UserHabit | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [showHabitDetail, setShowHabitDetail] = useState(false);
	const [genericLevels, setGenericLevels] = useState<GenericLevel[]>([]);

	const fetchHabitsData = async (signal: AbortSignal, forceRefresh = false) => {
		try {
			const data = await getHabitsWithCategories(forceRefresh);
			if (!signal.aborted) {
				setHabitsData(data);
				setLoading(false);
			}
		} catch (error) {
			if (!signal.aborted) {
				console.log("Erreur lors de la récupération des habitudes : ", error);
			}
		}
	};

	const fetchCategoriesData = async (
		signal: AbortSignal,
		forceRefresh = false
	) => {
		try {
			const data = await getAllCategories(forceRefresh);
			if (!signal.aborted) {
				setCategories(data);
			}
		} catch (error) {
			if (!signal.aborted) {
				console.log("Erreur lors de la récupération des catégories : ", error);
			}
		}
	};

	const fetchGenericLevelsData = async (
		signal: AbortSignal,
		forceRefresh = false
	) => {
		try {
			const snapshotGenericLevels = await getAllGenericLevels({
				forceRefresh: forceRefresh,
			});
			setGenericLevels(snapshotGenericLevels);
		} catch (error) {
			if (!signal.aborted) {
				console.log(
					"Erreur lors de la récupération des niveaux génériques : ",
					error
				);
			}
		}
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		fetchHabitsData(signal);
		fetchGenericLevelsData(signal);
		fetchCategoriesData(signal); //TODO à retirer

		return () => {
			console.log("HabitsProvider - cleanup");
			controller.abort();
		};
	}, []);

	return (
		<HabitsContext.Provider
			value={{
				habitsData,
				loading,
				refreshHabits: (forceRefresh = false) =>
					fetchHabitsData(new AbortController().signal, forceRefresh),

				currentHabit,
				setCurrentHabit,
				showHabitDetail,
				setShowHabitDetail,
				categories,
				refreshCategories: (forceRefresh = false) =>
					fetchCategoriesData(new AbortController().signal, forceRefresh),
				genericLevels,
				setGenericLevels,
				refreshGenericLevels: function (forceRefresh = false): void {
					fetchGenericLevelsData(new AbortController().signal, forceRefresh);
				},
			}}
		>
			{children}
		</HabitsContext.Provider>
	);
};

export const useHabits = () => {
	const context = useContext(HabitsContext);
	if (!context) {
		throw new Error("useHabits must be used within a HabitsProvider");
	}
	return context;
};
