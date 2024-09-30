import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category } from "@type/category";
import { getHabitsWithCategories } from "@db/fetch";
import { getAllCategories } from "@db/category";
import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";

interface HabitsContextProps {
	habitsData: Habit[];
	loading: boolean;
	refreshHabits: () => void;
	habitQueue: Habit[];
	setHabitQueue: React.Dispatch<React.SetStateAction<Habit[]>>;
	currentHabit: UserHabit | null;
	setCurrentHabit: React.Dispatch<React.SetStateAction<UserHabit | null>>;
	showHabitDetail?: boolean;
	setShowHabitDetail: React.Dispatch<React.SetStateAction<boolean>>;
	categories: Category[];
	refreshCategories: () => void;
}

export const HabitsContext = createContext<HabitsContextProps>({
	habitsData: [],
	loading: false,
	refreshHabits: function (): void {},
	habitQueue: [],
	setHabitQueue: function (value: React.SetStateAction<Habit[]>): void {},
	currentHabit: null,
	setCurrentHabit: function (
		value: React.SetStateAction<UserHabit | null>
	): void {},
	showHabitDetail: false,
	setShowHabitDetail: function (value: React.SetStateAction<boolean>): void {},
	categories: [],
	refreshCategories: function (): void {},
});

export const HabitsProvider = ({ children }: any) => {
	const [habitsData, setHabitsData] = useState<Habit[]>([]);
	const [loading, setLoading] = useState(true);
	const [habitQueue, setHabitQueue] = useState<Habit[]>([]);
	const [currentHabit, setCurrentHabit] = useState<UserHabit | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [showHabitDetail, setShowHabitDetail] = useState(true);

	const fetchHabitsData = async (signal: AbortSignal) => {
		try {
			const data = await getHabitsWithCategories();
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

	const fetchCategoriesData = async (signal: AbortSignal) => {
		try {
			const data = await getAllCategories();
			if (!signal.aborted) {
				setCategories(data);
			}
		} catch (error) {
			if (!signal.aborted) {
				console.log("Erreur lors de la récupération des catégories : ", error);
			}
		}
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		fetchHabitsData(signal);
		fetchCategoriesData(signal); // Appeler la fonction pour récupérer les catégories

		AsyncStorage.getItem("habitQueue").then((data) => {
			if (data) {
				setHabitQueue(JSON.parse(data));
			}
		});
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
				refreshHabits: () => fetchHabitsData(new AbortController().signal),
				habitQueue,
				setHabitQueue,
				currentHabit,
				setCurrentHabit,
				showHabitDetail,
				setShowHabitDetail,
				categories, // Fournir les catégories
				refreshCategories: () => fetchCategoriesData(new AbortController().signal), // Fournir la fonction de rafraîchissement
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