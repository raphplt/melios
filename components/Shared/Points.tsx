import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import * as Progress from "react-native-progress";

export default function Points() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { points, usersLevels } = useData();
	const [helpVisible, setHelpVisible] = useState(false);

	const toggleHelp = () => {
		setHelpVisible(!helpVisible);
	};

	const globalLevel = usersLevels["P0gwsxEYNJATbmCoOdhc" as any]; //TODO change

	const xpPercentage = globalLevel
		? (globalLevel.currentXp / globalLevel.nextLevelXp) * 100
		: 0;

	return (
		<View className="relative">
			<TouchableOpacity
				onPress={toggleHelp}
				className="flex items-center flex-row rounded-full"
			>
				<View className="flex items-center justify-center flex-row px-2 mx-2 rounded-l-full">
					<View className="flex items-center justify-center">
						<Progress.Circle
							size={28}
							progress={xpPercentage / 100}
							color={theme.colors.primary}
							unfilledColor={theme.colors.border}
							borderWidth={0}
							thickness={4}
						/>
						<Text
							style={{
								fontSize: 12,
								color: theme.colors.primary,
							}}
							className="font-bold absolute"
						>
							{globalLevel?.currentLevel || "1"}
						</Text>
					</View>
				</View>
				<View
					className="flex items-center justify-center flex-row py-1 px-4 rounded-full"
					style={{
						backgroundColor: theme.colors.primary,
					}}
				>
					<Text
						style={{
							color: theme.dark ? "#1B1A1A" : "#DBBB16",
							fontSize: 16,
						}}
						className="font-bold mr-1"
					>
						{points.rewards}
					</Text>
					<MoneyMelios />
				</View>
			</TouchableOpacity>

			{helpVisible && (
				<View
					className="absolute top-full mt-1 left-0 p-2 rounded-md shadow-md w-52"
					style={{
						borderColor: theme.colors.primary,
						borderWidth: 1,
						backgroundColor: theme.colors.background,
					}}
				>
					<View>
						<View className="flex items-center justify-center">
							<Progress.Circle
								size={28}
								progress={xpPercentage / 100}
								color={theme.colors.primary}
								unfilledColor={theme.colors.border}
								borderWidth={0}
								thickness={4}
							/>
							<Text
								style={{
									fontSize: 12,
									color: theme.colors.primary,
								}}
								className="font-bold absolute"
							>
								{globalLevel?.currentLevel || "1"}
							</Text>
						</View>

						<Text style={{ color: theme.colors.text }}>{t("explain_levels")}</Text>
					</View>
					<View className="mt-2">
						<View className="flex items-center justify-center flex-row">
							<Text style={{ color: theme.colors.text }} className="font-bold mr-1">
								{points.rewards}
							</Text>
							<MoneyMelios />
						</View>
						<Text style={{ color: theme.colors.text }}>{t("explain_melios")}</Text>
					</View>
				</View>
			)}
		</View>
	);
}