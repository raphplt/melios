import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import { Text, View } from "../../components/Themed";
import { getMemberHabits } from "../../db/member";
import { Pressable } from "react-native";
import moment from "moment";
import { RefreshControl, ScrollView } from "react-native";
import HabitsCompleted from "../../components/progression/HabitsCompleted";
import { HabitCard } from "../../components/progression/HabitCard";
import SetTime from "../../components/progression/SetTime";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import Graph from "../../components/progression/Graph";

export default function Progression() {
	const { theme } = useContext(ThemeContext);
	const isMounted = useRef(true);
	const [habits, setHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [activeButton, setActiveButton] = useState("Jour");
	const [scoreHabits, setScoreHabits] = useState(0);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [habitLastDaysCompleted, setHabitLastDaysCompleted]: any = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [comparedToYesterday, setComparedToYesterday] = useState(0);

	// Update date every second
	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Fetch habits
	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberHabits();
				if (isMounted.current) {
					setHabits(data);
					setLoading(false);
				}
			} catch (error) {
				handleError(error);
				setHabits([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			const data = await getMemberHabits();
			setHabits(data);
			setLoading(false);
		} catch (error) {
			setHabits([]);
			handleError(error);
		} finally {
			setRefreshing(false);
		}
	};

	// Calculate score for habits
	useEffect(() => {
		let score = 0;
		if (habits && habits.length === 0) return setScoreHabits(0);
		habits.forEach((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];

				if (lastLog && lastLog.date === date && lastLog.done === true) {
					score += 1;
				}
			}
		});

		if (habits.length) setScoreHabits(Math.floor((score / habits.length) * 100));
	}, [habits, date]);

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	// Calculate last days completed
	useEffect(() => {
		let habitCompletion: any = {};
		if (habits.length === 0) return setHabitLastDaysCompleted([]);
		let days = 7;

		if (activeButton === "Jour") {
			days = 1;
		} else if (activeButton === "Semaine") {
			days = 7;
		} else if (activeButton === "Mois") {
			days = 30;
		} else if (activeButton === "Année") {
			days = 365;
		}

		habits.forEach((habit: any) => {
			habitCompletion[habit.name] = 0;
			for (let i = 0; i < days; i++) {
				const date = moment().subtract(i, "days").format("YYYY-MM-DD");
				if (habit.logs) {
					const logsForDay = habit.logs.filter(
						(log: any) => log.date === date && log.done === true
					);
					if (logsForDay.length > 0) {
						habitCompletion[habit.name] += 1;
					}
				}
			}
		});

		setHabitLastDaysCompleted(habitCompletion);
	}, [habits, date, activeButton]);

	const handlePress = (button: string) => {
		setActiveButton(button);
	};

	useEffect(() => {
		let habitToday = 0;
		let habitYesterday = 0;
		if (habits.length === 0) return setComparedToYesterday(0);

		habits.forEach((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];
				if (lastLog && lastLog.date === date && lastLog.done === true) {
					habitToday += 1;
				}
				const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
				const logsForYesterday = habit.logs.filter(
					(log: any) => log.date === yesterday && log.done === true
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

	const getTitle = () => {
		switch (activeButton) {
			case "Jour":
				return "Complétion sur les dernières 24 heures";
			case "Semaine":
				return "Complétion sur les 7 derniers jours";
			case "Mois":
				return "Complétion sur les 30 derniers jours";
			case "Année":
				return "Complétion sur l'année écoulée";
			default:
				return "Complétion sur les 7 derniers jours";
		}
	};

	return (
		<>
			<ScrollView
				style={{ backgroundColor: theme.colors.background }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View
					className="flex mt-3 items-center mx-auto justify-between flex-row"
					style={{ backgroundColor: theme.colors.background }}
				>
					<SetTime
						text="Jour"
						handlePress={handlePress}
						activeButton={activeButton}
					/>
					<SetTime
						text="Semaine"
						handlePress={handlePress}
						activeButton={activeButton}
					/>
					<SetTime
						text="Mois"
						handlePress={handlePress}
						activeButton={activeButton}
					/>
					<SetTime
						text="Année"
						handlePress={handlePress}
						activeButton={activeButton}
					/>
				</View>

				<View
					style={{ backgroundColor: theme.colors.background, alignItems: "center" }}
				>
					<Text
						className="w-10/12 mt-4 mb-2 text-[16px] font-semibold"
						style={{ color: theme.colors.text }}
					>
						{getTitle()}
					</Text>
					<Graph habits={habitLastDaysCompleted} />
				</View>
				{activeButton === "Jour" && (
					<View style={{ backgroundColor: theme.colors.background }}>
						<Text
							style={{ color: theme.colors.text }}
							className=" w-10/12 mx-auto mt-4 text-[16px] font-semibold mb-2"
						>
							Statistiques du jour
						</Text>
						<View
							className="flex items-center justify-between flex-row mb-3 w-[90%] mx-auto mt-2"
							style={{ backgroundColor: theme.colors.background }}
						>
							<HabitCard statistic={scoreHabits} text="complétées" theme={theme} />
							<HabitCard
								statistic={comparedToYesterday}
								text="vs hier"
								theme={theme}
							/>
						</View>
					</View>
				)}
				<View
					style={{
						height: 1,
						width: "80%",
					}}
					className="mx-auto my-2 mt-2"
				/>
				<ScrollView className="flex flex-col mt-2 mb-4">
					<HabitsCompleted
						habits={habits}
						habitLastDaysCompleted={habitLastDaysCompleted}
						activeButton={activeButton}
						theme={theme}
					/>
				</ScrollView>
			</ScrollView>
		</>
	);
}
