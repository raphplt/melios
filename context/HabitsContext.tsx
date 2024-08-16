import React, { createContext, useContext, useState, useEffect } from "react";
import { getHabitsWithCategories } from "../db/fetch";
import { Habit } from "../types/habit";

interface HabitsContextProps {
	habitsData: Habit[];
	loading: boolean;
	refreshHabits: () => void;
}

const HabitsContext = createContext<HabitsContextProps | undefined>(undefined);

export const HabitsProvider = ({ children }: any) => {
	const [habitsData, setHabitsData] = useState<Habit[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchHabitsData = async (signal: AbortSignal) => {
		try {
			const data = await getHabitsWithCategories();
			if (!signal.aborted) {
				console.log("HabitsProvider - data fetched");
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
