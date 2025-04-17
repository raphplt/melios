import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
} from "react";
import { Category } from "@type/category";
import { getHabitsWithCategories } from "@db/fetch";
import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";
import { ViewMode } from "@components/Home/ViewToggle";

interface HabitsContextProps {
	habitsData: Habit[];
	loading: boolean;
	refreshHabits: (forceRefresh?: boolean) => void;
	currentHabit: UserHabit | null;
	setCurrentHabit: React.Dispatch<React.SetStateAction<UserHabit | null>>;
	showHabitDetail: boolean;
	setShowHabitDetail: React.Dispatch<React.SetStateAction<boolean>>;
	categories: Category[];
	viewMode: ViewMode;
	setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
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
	viewMode: ViewMode.LIST,
	setViewMode: () => {},
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
	const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);

	const fetchHabitsData = useCallback(
		async (signal: AbortSignal, forceRefresh = false) => {
			setLoading(true);
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
					setLoading(false);
				}
			}
		},
		[]
	);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		fetchHabitsData(signal);

		return () => {
			console.log("HabitsProvider - cleanup");
			controller.abort();
		};
	}, [fetchHabitsData]);

	const refreshHabits = useCallback(
		(forceRefresh = false) => {
			fetchHabitsData(new AbortController().signal, forceRefresh);
		},
		[fetchHabitsData]
	);

	const contextValue = useMemo(
		() => ({
			habitsData,
			loading,
			refreshHabits,
			currentHabit,
			setCurrentHabit,
			showHabitDetail,
			setShowHabitDetail,
			categories,
			viewMode,
			setViewMode,
		}),
		[
			habitsData,
			loading,
			refreshHabits,
			currentHabit,
			showHabitDetail,
			categories,
			viewMode,
			setViewMode,
		]
	);

	return (
		<HabitsContext.Provider value={contextValue}>
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
