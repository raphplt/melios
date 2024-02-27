import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { Text, View } from "../../components/Themed";
import { getMemberHabits } from "../../db/member";
import { ScrollView } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import moment from "moment";

export default function Progression() {
	const { theme } = useContext(ThemeContext);
	const isMounted = useRef(true);
	const [habits, setHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [activeButton, setActiveButton] = useState("Jour");
	const [scoreHabits, setScoreHabits] = useState(0);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [habitLastDaysCompleted, setHabitLastDaysCompleted]: any = useState([]);
	const [allHabits, setAllHabits] = useState<any>([]);

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

		if (activeButton === "Semaine") {
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
		// New function
		setActiveButton(button);
	};

	return (
		<View style={{ backgroundColor: theme.colors.background }}>
			<View
				className="flex mt-3 items-center  mx-auto justify-between flex-row"
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

			<Text
				className="text-center mb-4 text-lg mt-3"
				style={{ color: theme.colors.text }}
			>
				{habits && habits.length} habitudes
			</Text>
			<View />
			{activeButton === "Jour" && (
				<View
					style={{ backgroundColor: theme.colors.backgroundSecondary }}
					className="flex items-center justify-center w-36 h-36 rounded-xl mx-auto mt-5"
				>
					<Text style={{ color: theme.colors.text }} className="text-3xl mt-1">
						{scoreHabits} %
					</Text>
					<Text>complétés</Text>
				</View>
			)}
			<ScrollView className="flex flex-col mt-2">
				<Text className="ml-6 text-lg">
					{habitLastDaysCompleted.length}Jours complétés
				</Text>

				{
					// Display habits
					habits
						.sort((a: any, b: any) => {
							const aCompletion = habitLastDaysCompleted[a.name] || 0;
							const bCompletion = habitLastDaysCompleted[b.name] || 0;
							return bCompletion - aCompletion;
						})
						.map((habit: any, index: number) => {
							return (
								<View
									key={index}
									className="flex flex-row items-center justify-between px-5 my-2 py-3 mx-auto w-11/12 rounded-xl"
									style={{
										backgroundColor: theme.colors.backgroundSecondary,
									}}
								>
									<Text style={{ color: theme.colors.text }}>{habit.name}</Text>
									<Text style={{ color: theme.colors.text }}>
										{habitLastDaysCompleted[habit.name]} /{" "}
										{activeButton === "Jour"
											? 1
											: activeButton === "Semaine"
											? 7
											: activeButton === "Mois"
											? 30
											: 365}
									</Text>
								</View>
							);
						})
				}
			</ScrollView>
		</View>
	);
}
