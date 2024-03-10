import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { Text, View } from "../../components/Themed";
import { getMemberHabits } from "../../db/member";
import { Pressable } from "react-native";
import moment from "moment";
import { RefreshControl, ScrollView } from "react-native";
import HabitsCompleted from "../../components/progression/HabitsCompleted";
import { HabitCard } from "../../components/progression/HabitCard";

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
			habitCompletion[habit.name] = 0; // Initialize each habit with 0 completions
			for (let i = 0; i < days; i++) {
				const date = moment().subtract(i, "days").format("YYYY-MM-DD");
				if (habit.logs) {
					const logsForDay = habit.logs.filter(
						(log: any) => log.date === date && log.done === true
					);
					if (logsForDay.length > 0) {
						habitCompletion[habit.name] += 1; // Increment the completion count for the habit
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
					<Pressable
						onPress={() => handlePress("Jour")}
						className="px-5 py-2 m-2 rounded-xl"
						style={{
							backgroundColor:
								activeButton === "Jour"
									? theme.colors.primary
									: theme.colors.backgroundSecondary,
						}}
					>
						<Text style={{ color: theme.colors.textSecondary }}>Jour</Text>
					</Pressable>
					<Pressable
						onPress={() => handlePress("Semaine")}
						className="px-5 py-2 m-2 rounded-xl"
						style={{
							backgroundColor:
								activeButton === "Semaine"
									? theme.colors.primary
									: theme.colors.backgroundSecondary,
						}}
					>
						<Text style={{ color: theme.colors.text }}>Semaine</Text>
					</Pressable>
					<Pressable
						onPress={() => handlePress("Mois")}
						className="px-5 py-2 m-2 rounded-xl"
						style={{
							backgroundColor:
								activeButton === "Mois"
									? theme.colors.primary
									: theme.colors.backgroundSecondary,
						}}
					>
						<Text style={{ color: theme.colors.text }}>Mois</Text>
					</Pressable>
					<Pressable
						onPress={() => handlePress("Année")}
						className="px-5 py-2 m-2 rounded-xl"
						style={{
							backgroundColor:
								activeButton === "Année"
									? theme.colors.primary
									: theme.colors.backgroundSecondary,
						}}
					>
						<Text style={{ color: theme.colors.text }}>Année</Text>
					</Pressable>
				</View>
				<View
					className="flex items-center justify-around flex-row mb-3"
					style={{ backgroundColor: theme.colors.background }}
				>
					<HabitCard statistic={scoreHabits} text=" complétées" theme={theme} />
					<HabitCard statistic={comparedToYesterday} text="vs hier" theme={theme} />
				</View>
				<ScrollView className="flex flex-col mt-2">
					<Text className="ml-6 text-lg" style={{ color: theme.colors.text }}>
						{/* {Object.keys(habitLastDaysCompleted).length || 0} /{" "}
					{habits && habits.length} */}
						Habitudes complétés
					</Text>

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
