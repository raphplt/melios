import { useTheme } from "@context/ThemeContext";
import { getRecentHabitLogs } from "@db/logs";
import { Log } from "@type/log";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import SectionHeader from "./SectionHeader";
import { BlurView } from "expo-blur";

const Charts = () => {
	const { theme } = useTheme();
	const [barData, setBarData] = useState<any[]>([]);
	const [showChart, setShowChart] = useState(true);

	useEffect(() => {
		const fetchLogs = async () => {
			const recentLogs = await getRecentHabitLogs();
			processLogsForChart(recentLogs);
		};

		fetchLogs();
	}, []);

	const processLogsForChart = (logs: Log[]) => {
		// Créer un objet pour compter les habitudes par jour
		const last7Days = getLast7DaysLabels();
		const habitCountByDay: Record<string, number> = {};

		// Initialiser tous les jours à 0
		last7Days.forEach((day) => {
			habitCountByDay[day.date] = 0;
		});

		// Compter les habitudes par jour
		logs.forEach((logItem) => {
			if (logItem.logs && Array.isArray(logItem.logs)) {
				logItem.logs.forEach((log) => {
					// Vérifie si log est un objet et a une propriété date
					if (log && typeof log === "object" && "date" in log) {
						const logDate = new Date(log.date);
						const dateKey = logDate.toISOString().split("T")[0];

						// Vérifier si cette date fait partie des 7 derniers jours
						if (habitCountByDay[dateKey] !== undefined) {
							habitCountByDay[dateKey] += 1;
						}
					}
				});
			}
		});

		// Fonction pour déterminer la couleur en fonction de la valeur
		const getBarColor = (value: number) => {
			if (value === 0) return "lightgray";
			if (value <= 3) return theme.colors.orangePrimary || "#FFA500";
			if (value <= 6) return theme.colors.bluePrimary || "#4CAF50";
			return theme.colors.greenPrimary || "#4CAF50";
		};

		// Créer les données pour le graphique
		const chartData = last7Days.map((day) => ({
			value: habitCountByDay[day.date],
			label: day.label,
			frontColor: getBarColor(habitCountByDay[day.date]),
		}));

		setBarData(chartData);
	};

	const getLast7DaysLabels = () => {
		const days = [];
		const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			days.push({
				date: date.toISOString().split("T")[0],
				label: dayLabels[date.getDay() === 0 ? 6 : date.getDay() - 1],
			});
		}

		return days;
	};

	return (
		<SectionHeader
			title="Statistiques"
			show={showChart}
			setShow={setShowChart}
			icon="graph"
		>
			<BlurView
				className="flex flex-col items-center mx-auto w-[95%] p-2 rounded-xl my-4 overflow-hidden mb-6"
				tint={theme.dark ? "dark" : "light"}
				intensity={100}
			>
				<Text
					className="mt-2 font-bold"
					style={{
						color: theme.colors.text,
					}}
				>
					Habitudes complétées par jour
				</Text>
				<BarChart
					barWidth={22}
					noOfSections={5}
					maxValue={10}
					barBorderRadius={4}
					frontColor="lightgray"
					data={barData}
					yAxisThickness={0}
					xAxisThickness={0}
					hideRules
					yAxisTextStyle={styles.axisText}
					xAxisLabelTextStyle={styles.axisText}
				/>
			</BlurView>
		</SectionHeader>
	);
};

const styles = StyleSheet.create({
	axisText: {
		fontSize: 12,
		color: "#333",
	},
});

export default Charts;
