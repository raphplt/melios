import { useEffect, useState, useContext } from "react";
import { View, Text } from "react-native";
import Flamme from "@components/Svg/Flamme";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { calculateStreak } from "@utils/progressionUtils";
import { Log } from "@type/log";
import { getHabitLogs } from "@db/logs";

export default function Streak() {
	const { habits } = useData();
	const { theme } = useContext(ThemeContext);
	const [logsByHabit, setLogsByHabit] = useState<
		{ habitId: string; logs: Log[] }[]
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const habitsWithLogs = await Promise.all(
					habits.map(async (habit) => {
						const logs = await getHabitLogs(habit.habitId);
						return { habitId: habit.habitId, logs: logs || [] };
					})
				);
				setLogsByHabit(habitsWithLogs);
			} catch (error) {
				console.error("Erreur lors de la récupération des logs :", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLogs();
	}, [habits]);

	// Calcul du streak avec les habitudes enrichies par leurs logs

	const streak = calculateStreak(logsByHabit);
	console.log("logsbyhabit", logsByHabit);

	if (loading) {
		return (
			<View
				className="w-full mx-auto flex flex-row items-center justify-between px-5 pt-2"
				style={{
					backgroundColor: theme.colors.backgroundTertiary,
				}}
			>
				<Text
					className="text-lg font-semibold"
					style={{ color: theme.colors.primary }}
				>
					Chargement...
				</Text>
			</View>
		);
	}

	return (
		<View
			className="w-full mx-auto flex flex-row items-center justify-between px-5 pt-2"
			style={{
				backgroundColor: theme.colors.backgroundTertiary,
			}}
		>
			<View className="ml-2">
				<Text
					className="text-3xl font-semibold mb-2"
					style={{ color: theme.colors.primary }}
				>
					Série
				</Text>
				<View className="mt-2">
					<Text
						className="text-8xl font-bold"
						style={{ color: theme.colors.primary }}
					>
						{streak}
					</Text>
					<Text
						className="text-lg font-semibold"
						style={{ color: theme.colors.primary }}
					>
						jours de suite
					</Text>
				</View>
			</View>
			<Flamme color={theme.colors.redPrimary} width={100} height={120} />
		</View>
	);
}
