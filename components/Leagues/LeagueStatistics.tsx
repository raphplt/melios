import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

interface LeagueStatisticsProps {
	totalParticipants: number;
	record: number;
	moyenne: number;
	isSoloLeague: boolean;
}

export const LeagueStatistics: React.FC<LeagueStatisticsProps> = ({
	totalParticipants,
	record,
	moyenne,
	isSoloLeague,
}) => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	if (isSoloLeague) {
		return (
			<View className="mx-4 mb-8">
				{/* Séparateur visuel décoratif */}
				<View className="flex-row items-center mb-6">
					<View
						className="flex-1 h-px"
						style={{ backgroundColor: theme.colors.border + "40" }}
					/>
					<View
						className="mx-4 px-3 py-1 rounded-full"
						style={{
							backgroundColor: theme.colors.bluePrimary + "20",
						}}
					>
						<MaterialCommunityIcons
							name="chart-bar"
							size={16}
							color={theme.colors.bluePrimary}
						/>
					</View>
					<View
						className="flex-1 h-px"
						style={{ backgroundColor: theme.colors.border + "40" }}
					/>
				</View>

				<LinearGradient
					colors={[theme.colors.cardBackground, theme.colors.backgroundSecondary]}
					style={{
						borderRadius: 24,
						padding: 32,
						alignItems: "center",
						shadowColor: theme.colors.border,
						shadowOffset: { width: 0, height: 8 },
						shadowOpacity: 0.1,
						shadowRadius: 12,
						elevation: 8,
					}}
				>
					<MaterialCommunityIcons
						name="account-outline"
						size={48}
						color={theme.colors.textTertiary}
					/>
					<Text
						className="text-lg font-bold mt-4 text-center"
						style={{
							color: theme.colors.text,
							fontFamily: theme.fonts.bold.fontFamily,
						}}
					>
						{t("leagues.empty_state.solo")}
					</Text>
					<Text
						className="text-sm mt-2 text-center"
						style={{
							color: theme.colors.textTertiary,
							fontFamily: theme.fonts.regular.fontFamily,
							lineHeight: 20,
						}}
					>
						{t("continue_earning_points")}
					</Text>
				</LinearGradient>
			</View>
		);
	}

	const stats = [
		{
			icon: "account-group",
			label: t("leagues.stats.participants"),
			value: totalParticipants.toString(),
			color: theme.colors.bluePrimary || "#448BAD",
		},
		{
			icon: "trophy",
			label: t("leagues.stats.record"),
			value: record.toString(),
			color: theme.colors.mythologyGold || "#F4E4A6",
		},
		{
			icon: "chart-line",
			label: t("leagues.stats.average"),
			value: moyenne.toString(),
			color: theme.colors.purplePrimary || "#955CD3",
		},
	];
	return (
		<View className="mx-4 mb-8">
			{/* Séparateur visuel décoratif */}
			<View className="flex-row items-center mb-6">
				<View
					className="flex-1 h-px"
					style={{ backgroundColor: theme.colors.border + "40" }}
				/>
				<View
					className="mx-4 px-3 py-1 rounded-full"
					style={{
						backgroundColor: theme.colors.bluePrimary + "20",
					}}
				>
					<MaterialCommunityIcons
						name="chart-bar"
						size={16}
						color={theme.colors.bluePrimary}
					/>
				</View>
				<View
					className="flex-1 h-px"
					style={{ backgroundColor: theme.colors.border + "40" }}
				/>
			</View>

			<LinearGradient
				colors={[theme.colors.cardBackground, theme.colors.backgroundSecondary]}
				style={{
					borderRadius: 24,
					padding: 24,
					shadowColor: theme.colors.border,
					shadowOffset: { width: 0, height: 8 },
					shadowOpacity: 0.1,
					shadowRadius: 12,
					elevation: 8,
				}}
			>
				{/* Titre */}
				<Text
					className="text-lg font-bold mb-4 text-center"
					style={{
						color: theme.colors.text,
						fontFamily: theme.fonts.bold.fontFamily,
					}}
				>
					{t("league_stats")}
				</Text>

				{/* Statistiques */}
				<View className="flex-row justify-between">
					{stats.map((stat, index) => (
						<View key={index} className="flex-1 items-center">
							{/* Icône */}
							<View
								className="w-14 h-14 rounded-full items-center justify-center mb-3"
								style={{
									backgroundColor: stat.color + "20",
								}}
							>
								<MaterialCommunityIcons
									name={stat.icon as any}
									size={24}
									color={stat.color}
								/>
							</View>

							{/* Valeur */}
							<Text
								className="text-2xl font-bold mb-1"
								style={{
									color: stat.color,
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{stat.value}
							</Text>

							{/* Label */}
							<Text
								className="text-xs text-center"
								numberOfLines={2}
								style={{
									color: theme.colors.textTertiary,
									fontFamily: theme.fonts.regular.fontFamily,
								}}
							>
								{stat.label}
							</Text>
						</View>
					))}
				</View>

				{/* Séparateur décoratif */}
				<View className="flex-row items-center justify-center mt-4">
					<View
						className="flex-1 h-px"
						style={{ backgroundColor: theme.colors.border }}
					/>
					<MaterialCommunityIcons
						name="chart-box-outline"
						size={16}
						color={theme.colors.textTertiary}
						style={{ marginHorizontal: 12 }}
					/>
					<View
						className="flex-1 h-px"
						style={{ backgroundColor: theme.colors.border }}
					/>
				</View>
			</LinearGradient>
		</View>
	);
};
