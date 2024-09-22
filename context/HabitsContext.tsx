import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category } from "@type/category";
import { getHabitsWithCategories } from "@db/fetch";
import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";

interface HabitsContextProps {
	habitsData: Habit[];
	loading: boolean;
	refreshHabits: () => void;
	habitQueue: Habit[];
	setHabitQueue: React.Dispatch<React.SetStateAction<Habit[]>>;
	currentHabit: CombinedHabits | null;
	setCurrentHabit: React.Dispatch<React.SetStateAction<CombinedHabits | null>>;
	showHabitDetail?: boolean;
	setShowHabitDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

export type CombinedHabits = {
	habit: Habit;
	userHabit: UserHabit;
};

export const HabitsContext = createContext<HabitsContextProps>({
	habitsData: [],
	loading: false,
	refreshHabits: function (): void {},
	habitQueue: [],
	setHabitQueue: function (value: React.SetStateAction<Habit[]>): void {},
	currentHabit: null,
	setCurrentHabit: function (
		value: React.SetStateAction<CombinedHabits | null>
	): void {},
	showHabitDetail: false,
	setShowHabitDetail: function (value: React.SetStateAction<boolean>): void {},
});

export const HabitsProvider = ({ children }: any) => {
	const [habitsData, setHabitsData] = useState<Habit[]>([]);

	const [loading, setLoading] = useState(true);
	const [habitQueue, setHabitQueue] = useState<Habit[]>([]);
	const [currentHabit, setCurrentHabit] = useState<CombinedHabits | null>(null);

	// Timer state
	const [showHabitDetail, setShowHabitDetail] = useState(true);

	const fetchHabitsData = async (signal: AbortSignal) => {
		try {
			const data = await getHabitsWithCategories(true);
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

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		fetchHabitsData(signal);

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
