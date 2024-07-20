import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import { View, ScrollView, RefreshControl, Text } from "react-native";
import moment from "moment";
import { useHabits } from "../../hooks/userHabits";
import ProgressionHeader from "../../components/Progression/ProgressionHeader";
import ProgressionGraph from "../../components/Progression/ProgressionGraph";
import DailyStats from "../../components/Progression/DailyStats";
import HabitsCompleted from "../../components/Progression/HabitsCompleted";
import { UserHabit } from "../../types/userHabit";

export default function Progression() {
	const { theme } = useContext(ThemeContext);
	const { habits, loading, refreshing, onRefresh } = useHabits();
	const [activeButton, setActiveButton] = useState("Jour");
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [scoreHabits, setScoreHabits] = useState(0);
	const [comparedToYesterday, setComparedToYesterday] = useState(0);
	const [habitLastDaysCompleted, setHabitLastDaysCompleted] = useState({});

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		let score = 0;
		if (habits.length === 0) return setScoreHabits(0);

		habits.forEach((habit: UserHabit) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];
				if (lastLog && lastLog.date === date && lastLog.done === true) {
					score += 1;
				}
			}
		});

		if (habits.length) setScoreHabits(Math.floor((score / habits.length) * 100));
	}, [habits, date]);

	useEffect(() => {
		let habitCompletion: Record<string, number> = {};
		if (habits.length === 0) return setHabitLastDaysCompleted([]);
		let days = 7;

		switch (activeButton) {
			case "Jour":
				days = 1;
				break;
			case "Semaine":
				days = 7;
				break;
			case "Mois":
				days = 30;
				break;
			case "Année":
				days = 365;
				break;
		}

		habits.forEach((habit: UserHabit) => {
			habitCompletion[habit.name] = 0;
			for (let i = 0; i < days; i++) {
				const date = moment().subtract(i, "days").format("YYYY-MM-DD");
				if (habit.logs) {
					const logsForDay = habit.logs.filter(
						(log) => log.date === date && log.done === true
					);
					if (logsForDay.length > 0) {
						habitCompletion[habit.name] += 1;
					}
				}
			}
		});

		setHabitLastDaysCompleted(habitCompletion);
	}, [habits, date, activeButton]);

	useEffect(() => {
		let habitToday = 0;
		let habitYesterday = 0;
		if (habits.length === 0) return setComparedToYesterday(0);

		habits.forEach((habit: UserHabit) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];
				if (lastLog && lastLog.date === date && lastLog.done === true) {
					habitToday += 1;
				}
				const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
				const logsForYesterday = habit.logs.filter(
					(log) => log.date === yesterday && log.done === true
				);
				if (logsForYesterday.length > 0) {
					habitYesterday += 1;
				}
			}
		});

		if (habitYesterday > 0 && habitToday > 0) {
			setComparedToYesterday(Math.floor((habitToday / habitYesterday) * 100));
		} else if (habitYesterday === 0 && habitToday > 0) {
			setComparedToYesterday(100);
		} else if (habitYesterday === 0 && habitToday === 0) {
			setComparedToYesterday(0);
		} else if (habitYesterday > 0 && habitToday === 0) {
			setComparedToYesterday(0);
		}
	}, [habits, date]);

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background }}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<ProgressionHeader
				activeButton={activeButton}
				handlePress={setActiveButton}
				theme={theme}
			/>
			<ProgressionGraph
				habitLastDaysCompleted={habitLastDaysCompleted}
				activeButton={activeButton}
				theme={theme}
			/>
			{activeButton === "Jour" && (
				<DailyStats
					scoreHabits={scoreHabits}
					comparedToYesterday={comparedToYesterday}
					theme={theme}
				/>
			)}
			<View style={{ height: 1, width: "80%" }} className="mx-auto my-2 mt-2" />
			<ScrollView className="flex flex-col mt-2 mb-4">
				<HabitsCompleted
					habits={habits}
					habitLastDaysCompleted={habitLastDaysCompleted}
					activeButton={activeButton}
					theme={theme}
				/>
			</ScrollView>
		</ScrollView>
	);
}
