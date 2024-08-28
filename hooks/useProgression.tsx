import { useState, useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { UserHabit } from "../types/userHabit";
import useIndex from "./useIndex";
import { useData } from "@context/DataContext";

export const useProgression = () => {
	const isFocused = useIsFocused();
	const { userHabits, uncompletedHabitsData, completedHabitsData } = useIndex();
	const [activeButton, setActiveButton] = useState<string>("Jour");
	const abortController = useRef<AbortController | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const { todayScore, setTodayScore, date, streak, setStreak } = useData();
	const [comparedToYesterday, setComparedToYesterday] = useState<number>(0);
	const [habitCompletion, setHabitCompletion] = useState<Record<string, number>>(
		{}
	);

	// Fonction pour calculer la streak
	const calculateStreak = (habits: UserHabit[]): number => {
		if (habits.length === 0) return 0;

		let streakCount = 0;
		let daysBack = 0;
		let streakActive = true;

		while (streakActive) {
			const date = moment().subtract(daysBack, "days").format("YYYY-MM-DD");
			let dayCompleted = false;

			for (const habit of habits) {
				if (habit.logs) {
					const logForDay = habit.logs.find((log) => log.date === date && log.done);
					if (logForDay) {
						dayCompleted = true;
						break;
					}
				}
			}

			if (dayCompleted) {
				streakCount += 1;
			} else {
				streakActive = false;
			}

			daysBack += 1;
		}

		return streakCount;
	};

	const useTodayScore = (habits: UserHabit[], date: string): number => {
		return useMemo(() => {
			if (
				!uncompletedHabitsData ||
				uncompletedHabitsData.length === 0 ||
				!completedHabitsData ||
				completedHabitsData.length === 0
			)
				return 0;

			const score =
				completedHabitsData.length /
				(completedHabitsData.length + uncompletedHabitsData.length);

			return Math.floor(score * 100);
		}, [habits, date]);
	};

	const useHabitCompletion = (
		habits: UserHabit[],
		activeButton: string
	): Record<string, number> => {
		return useMemo(() => {
			if (habits.length === 0) return {};

			const days = {
				Jour: 1,
				Semaine: 7,
				Mois: 30,
				Année: 365,
			}[activeButton];

			if (!days) throw new Error("Invalid activeButton");

			const completion = habits.reduce((acc, habit) => {
				acc[habit.name] = 0;
				for (let i = 0; i < days; i++) {
					const date = moment().subtract(i, "days").format("YYYY-MM-DD");
					if (habit.logs?.some((log) => log.date === date && log.done)) {
						acc[habit.name] += 1;
					}
				}
				return acc;
			}, {} as Record<string, number>);

			return completion;
		}, [habits, activeButton]);
	};

	const useComparedToYesterday = (habits: UserHabit[], date: string): number => {
		return useMemo(() => {
			if (habits.length === 0) return 0;

			const yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");

			const [habitToday, habitYesterday] = habits.reduce(
				([today, yesterday], habit) => {
					const lastLog = habit.logs?.slice(-1)[0];
					const logsForYesterday = habit.logs?.filter(
						(log) => log.date === yesterdayDate && log.done
					);
					return [
						today + (lastLog && lastLog.date === date && lastLog.done ? 1 : 0),
						yesterday + (logsForYesterday?.length ? 1 : 0),
					];
				},
				[0, 0]
			);

			if (habitYesterday === 0) return habitToday > 0 ? 100 : 0;
			return Math.floor((habitToday / habitYesterday) * 100);
		}, [habits, date]);
	};

	const updateTodayScore = () => {
		setTodayScore(useTodayScore(userHabits, date));
	};

	const todayScoreValue = useTodayScore(userHabits, date);
	const habitCompletionValue = useHabitCompletion(userHabits, activeButton);
	const comparedToYesterdayValue = useComparedToYesterday(userHabits, date);
	const streakValue = calculateStreak(userHabits); // Calculer la streak

	const onRefresh = () => {
		setRefreshing(true);
		if (abortController.current) {
			abortController.current.abort();
		}
		abortController.current = new AbortController();
		setRefreshing(false);
	};

	useEffect(() => {
		if (!isFocused) return;

		abortController.current = new AbortController();

		setTodayScore(todayScoreValue);
		setHabitCompletion(habitCompletionValue);
		setComparedToYesterday(comparedToYesterdayValue);
		setStreak(streakValue); // Mettre à jour la streak

		return () => {
			abortController.current?.abort();
		};
	}, [
		isFocused,
		userHabits,
		activeButton,
		todayScoreValue,
		habitCompletionValue,
		comparedToYesterdayValue,
		streakValue,
	]);

	return {
		userHabits,
		activeButton,
		setActiveButton,
		useTodayScore,
		useHabitCompletion,
		todayScore,
		habitCompletion,
		comparedToYesterday,
		streak,
		onRefresh,
		refreshing,
		habitCompletionValue,
		todayScoreValue,
		updateTodayScore,
	};
};
