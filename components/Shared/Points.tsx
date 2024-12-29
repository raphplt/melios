import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function Points() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { points, usersLevels } = useData();
	const [helpVisible, setHelpVisible] = useState(false);

	const toggleHelp = () => {
		setHelpVisible(!helpVisible);
	};

	const globalLevel = usersLevels["P0gwsxEYNJATbmCoOdhc" as any];

	const xpPercentage = globalLevel
		? (globalLevel.currentXp / globalLevel.nextLevelXp) * 100
		: 0;

	return (
		<View className="relative">
			<TouchableOpacity
				onPress={toggleHelp}
				className="flex items-center flex-row rounded-full"
				style={{
					backgroundColor: "transparent",
				}}
			>
				<View
					className="flex items-center justify-center flex-row  px-2 ml-2 rounded-l-full"
					style={{
						backgroundColor: "transparent",
					}}
				>
					<View className="flex items-center justify-center">
						<Image source={require("@assets/images/badge.png")} className="w-8 h-8" />
						<Text
							style={{
								color: "#fff",
								fontSize: 14,
							}}
							className="font-bold absolute"
						>
							{globalLevel?.currentLevel}
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

			<View className="mt-2 w-full bg-gray-300 rounded-full h-2.5">
				<View
					className="bg-blue-600 h-2.5 rounded-full"
					style={{ width: `${xpPercentage}%` }}
				/>
			</View>

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
							<Image
								source={require("@assets/images/badge.png")}
								className="w-8 h-8"
							/>
							<Text
								style={{
									color: "#fff",
									fontSize: 14,
								}}
								className="font-bold absolute"
							>
								{globalLevel?.currentLevel}
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