// HabitsProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Category } from "@type/category";
import { getHabitsWithCategories } from "@db/fetch";
import { getAllCategories } from "@db/category";
import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";
import { GenericLevel } from "@type/levels";

interface HabitsContextProps {
	habitsData: Habit[];
	loading: boolean;
	refreshHabits: (forceRefresh?: boolean) => void;
	currentHabit: UserHabit | null;
	setCurrentHabit: React.Dispatch<React.SetStateAction<UserHabit | null>>;
	showHabitDetail?: boolean;
	setShowHabitDetail: React.Dispatch<React.SetStateAction<boolean>>;
	categories: Category[];
}

export const HabitsContext = createContext<HabitsContextProps>({
	habitsData: [],
	loading: false,
	refreshHabits: () => {},
	currentHabit: null,
	setCurrentHabit: () => {},
	showHabitDetail: false,
	setShowHabitDetail: () => {},
	categories: [],
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

	const fetchHabitsData = async (signal: AbortSignal, forceRefresh = false) => {
		try {
			const data = await getHabitsWithCategories(forceRefresh);
			if (!signal.aborted) {
				setHabitsData(data.habits);
				setCategories(data.categories);
				setLoading(false);
			}
		} catch (error) {
			if (!signal.aborted) {
				console.log("Erreur lors de la récupération des habitudes :", error);
			}
		}
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		fetchHabitsData(signal);

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
