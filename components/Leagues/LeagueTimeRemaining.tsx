import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { League } from "../../type/league.d";

interface LeagueTimeRemainingProps {
	currentLeague: League | null;
	daysLeft: number;
}

export const LeagueTimeRemaining: React.FC<LeagueTimeRemainingProps> = ({
	currentLeague,
	daysLeft,
}) => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const [timeRemaining, setTimeRemaining] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const calculateTimeRemaining = () => {
			const now = new Date();
			const endOfWeek = new Date(now);
			endOfWeek.setDate(now.getDate() + (7 - now.getDay()) % 7);
			endOfWeek.setHours(23, 59, 59, 999);

			const timeDiff = endOfWeek.getTime() - now.getTime();
			
			if (timeDiff > 0) {
				const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
				const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

				setTimeRemaining({ days, hours, minutes, seconds });
			} else {
				setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			}
		};

		// Calculate immediately
		calculateTimeRemaining();

		// Update every second
		const interval = setInterval(calculateTimeRemaining, 1000);

		return () => clearInterval(interval);
	}, []);

	const getUrgencyColor = () => {
		if (daysLeft <= 1) return theme.colors.redPrimary;
		if (daysLeft <= 3) return theme.colors.orangePrimary;
		return theme.colors.primary;
	};

	const getUrgencyBackgroundColor = () => {
		if (daysLeft <= 1) return theme.colors.redSecondary;
		if (daysLeft <= 3) return theme.colors.orangeSecondary;
		return theme.colors.primary + "15";
	};

	const TimeUnit = ({ value, label }: { value: number; label: string }) => (
		<View style={{ alignItems: "center", minWidth: 35 }}>
			<Text
				style={{
					fontSize: 18,
					fontFamily: theme.fonts.bold.fontFamily,
					color: getUrgencyColor(),
				}}
			>
				{value.toString().padStart(2, "0")}
			</Text>
			<Text
				style={{
					fontSize: 10,
					fontFamily: theme.fonts.regular.fontFamily,
					color: theme.colors.textTertiary,
					marginTop: 2,
				}}
			>
				{label}
			</Text>
		</View>
	);

	if (!currentLeague) return null;

	return (
		<View style={{ marginHorizontal: 16, marginBottom: 16 }}>
			<LinearGradient
				colors={[getUrgencyBackgroundColor(), theme.colors.cardBackground]}
				style={{
					borderRadius: 16,
					padding: 16,
					borderWidth: 1,
					borderColor: getUrgencyColor() + "30",
					shadowColor: theme.colors.border,
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.1,
					shadowRadius: 8,
					elevation: 4,
				}}
			>
				<View
					style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
				>
					<MaterialCommunityIcons
						name="clock-outline"
						size={20}
						color={getUrgencyColor()}
						style={{ marginRight: 8 }}
					/>
					<Text
						style={{
							fontSize: 14,
							fontFamily: theme.fonts.bold.fontFamily,
							color: theme.colors.text,
							flex: 1,
						}}
					>
						{t("leagues.time_remaining.title")}
					</Text>
					{daysLeft <= 1 && (
						<MaterialCommunityIcons
							name="alert"
							size={16}
							color={theme.colors.redPrimary}
						/>
					)}
				</View>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						alignItems: "center",
					}}
				>
					<TimeUnit
						value={timeRemaining.days}
						label={t("leagues.time_remaining.days")}
					/>
					<Text
						style={{
							fontSize: 16,
							color: theme.colors.textTertiary,
							marginHorizontal: 4,
						}}
					>
						:
					</Text>
					<TimeUnit
						value={timeRemaining.hours}
						label={t("leagues.time_remaining.hours")}
					/>
					<Text
						style={{
							fontSize: 16,
							color: theme.colors.textTertiary,
							marginHorizontal: 4,
						}}
					>
						:
					</Text>
					<TimeUnit
						value={timeRemaining.minutes}
						label={t("leagues.time_remaining.minutes")}
					/>
					<Text
						style={{
							fontSize: 16,
							color: theme.colors.textTertiary,
							marginHorizontal: 4,
						}}
					>
						:
					</Text>
					<TimeUnit
						value={timeRemaining.seconds}
						label={t("leagues.time_remaining.seconds")}
					/>
				</View>

				{daysLeft <= 1 && (
					<View
						style={{
							marginTop: 12,
							padding: 8,
							backgroundColor: theme.colors.redPrimary + "20",
							borderRadius: 8,
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<MaterialCommunityIcons
							name="fire"
							size={16}
							color={theme.colors.redPrimary}
							style={{ marginRight: 6 }}
						/>
						<Text
							style={{
								fontSize: 12,
								fontFamily: theme.fonts.medium.fontFamily,
								color: theme.colors.redPrimary,
								flex: 1,
							}}
						>
							{t("leagues.time_remaining.urgent_message")}
						</Text>
					</View>
				)}

				<Text
					style={{
						fontSize: 11,
						color: theme.colors.textTertiary,
						textAlign: "center",
						marginTop: 8,
					}}
				>
					{t("leagues.time_remaining.reset_message")}
				</Text>
			</LinearGradient>
		</View>
	);
};
