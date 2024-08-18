import { useState, useEffect, useMemo, useRef, useContext } from "react";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { UserHabit } from "../types/userHabit";
import { useHabits } from "./useHabits";
import { DataContext } from "@context/DataContext";

export const useProgression = () => {
	const { habits } = useHabits();
	const isFocused = useIsFocused();
	const [activeButton, setActiveButton] = useState<string>("Jour");
	const abortController = useRef<AbortController | null>(null);
	const [todayScore, setTodayScore] = useState<number>(0);
	const [refreshing, setRefreshing] = useState(false);

	const [habitCompletion, setHabitCompletion] = useState<Record<string, number>>(
		{}
	);
	const [comparedToYesterday, setComparedToYesterday] = useState<number>(0);

	const useDate = (): string => {
		const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

		useEffect(() => {
			const interval = setInterval(() => {
				setDate(moment().format("YYYY-MM-DD"));
			}, 1000);

			return () => clearInterval(interval);
		}, []);

		return date;
	};

	const useTodayScore = (habits: UserHabit[], date: string): number => {
		return useMemo(() => {
			if (habits.length === 0) return 0;

			const score = habits.reduce((acc, habit) => {
				const lastLog = habit.logs?.slice(-1)[0];
				return acc + (lastLog && lastLog.date === date && lastLog.done ? 1 : 0);
			}, 0);

			return Math.floor((score / habits.length) * 100);
		}, [habits, date]);
	};

	// Same fonction without useMemo
	const calculateTodayScore = (habits: UserHabit[], date: string): number => {
		if (habits.length === 0) return 0;

		const score = habits.reduce((acc, habit) => {
			const lastLog = habit.logs?.slice(-1)[0];
			return acc + (lastLog && lastLog.date === date && lastLog.done ? 1 : 0);
		}, 0);

		return Math.floor((score / habits.length) * 100);
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
		const score = calculateTodayScore(habits, moment().format("YYYY-MM-DD"));
		setTodayScore(score);
	};

	const date = useDate();
	const todayScoreValue = useTodayScore(habits, date);
	const habitCompletionValue = useHabitCompletion(habits, activeButton);
	const comparedToYesterdayValue = useComparedToYesterday(habits, date);

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

		return () => {
			abortController.current?.abort();
		};
	}, [
		isFocused,
		habits,
		activeButton,
		todayScoreValue,
		habitCompletionValue,
		comparedToYesterdayValue,
	]);

	return {
		habits,
		activeButton,
		setActiveButton,
		useDate,
		useTodayScore,
		useHabitCompletion,
		todayScore,
		habitCompletion,
		comparedToYesterday,
		onRefresh,
		refreshing,
		habitCompletionValue,
		todayScoreValue,
		updateTodayScore,
	};
};
