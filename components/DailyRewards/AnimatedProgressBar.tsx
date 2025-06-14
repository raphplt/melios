import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { Iconify } from "react-native-iconify";

interface AnimatedProgressBarProps {
	validatedTasksCount: number;
	totalTasks: number;
	rewardAmount: number;
	rewardClaimed: boolean;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
	validatedTasksCount,
	totalTasks,
	rewardAmount,
	rewardClaimed,
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const progressAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(progressAnim, {
			toValue: validatedTasksCount / totalTasks,
			duration: 800,
			useNativeDriver: false,
		}).start();
	}, [validatedTasksCount, totalTasks]);

	if (rewardClaimed) {
		return (
			<View className="mx-6 -mt-4 mb-6">
				<View
					className="rounded-2xl p-6 shadow-lg"
					style={{ backgroundColor: theme.colors.cardBackground }}
				>
					<View className="flex-row items-center justify-center gap-3">
						<Iconify
							icon="mdi:check-circle"
							size={32}
							color={theme.colors.greenPrimary}
						/>
						<Text
							className="text-xl font-bold"
							style={{
								color: theme.colors.greenPrimary,
								fontFamily: "BaskervilleBold",
							}}
						>
							{t("reward_claimed_title") || "Récompense récupérée !"}
						</Text>
					</View>
				</View>
			</View>
		);
	}

	return (
		<View>
			<View
				className="rounded-2xl p-6 shadow-sm"
				style={{
					backgroundColor: theme.colors.cardBackground,
					shadowColor: theme.colors.border,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 4,
					elevation: 3,
				}}
			>
				{/* Header avec compteur et récompense */}
				<View className="flex-row justify-between items-center mb-4">
					<Text
						className="text-lg font-bold"
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
					>
						{t("progress_title") || "Progression du jour"}
					</Text>
					<View
						className="flex-row items-center gap-2 px-3 py-2 rounded-full"
						style={{ backgroundColor: theme.colors.primary + "15" }}
					>
						<Text
							className="text-base font-bold"
							style={{ color: theme.colors.textSecondary }}
						>
							{rewardAmount}
						</Text>
						<MoneyMelios width={20} height={20} />
					</View>
				</View>

				{/* Compteur et barre de progression */}
				<View className="mb-4">
					<View className="flex-row justify-between items-center mb-3">
						<Text className="text-2xl font-bold" style={{ color: theme.colors.text }}>
							{validatedTasksCount}/{totalTasks}
						</Text>
						<Text className="text-sm" style={{ color: theme.colors.textTertiary }}>
							{t("missions_completed") || "missions accomplies"}
						</Text>
					</View>

					{/* Barre de progression animée */}
					<View
						className="h-3 rounded-full overflow-hidden"
						style={{ backgroundColor: theme.colors.border }}
					>
						<Animated.View
							className="h-full rounded-full"
							style={{
								backgroundColor: theme.colors.primary,
								width: progressAnim.interpolate({
									inputRange: [0, 1],
									outputRange: ["0%", "100%"],
								}),
							}}
						/>
					</View>
				</View>

				{/* Message d'encouragement */}
				<Text
					className="text-sm text-center italic"
					style={{ color: theme.colors.textTertiary }}
				>
					{validatedTasksCount === totalTasks
						? t("all_missions_complete") || "Toutes les missions sont terminées ! 🎉"
						: validatedTasksCount > 0
						? t("keep_going") || "Continue comme ça, tu y es presque ! 💪"
						: t("start_missions") || "Commence par une petite mission ! ✨"}
				</Text>
			</View>
		</View>
	);
};

export default AnimatedProgressBar;
