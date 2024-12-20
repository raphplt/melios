import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { UserLevel } from "@type/levels";

export const calculateGlobalLevel = (usersLevels: UserLevel[]) => {
	if (Object.keys(usersLevels).length === 0) return 1;
	return (
		Object.values(usersLevels).reduce(
			(total, level) => total + level.currentLevel,
			0
		) - 3
	);
};

export default function Points() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { points, usersLevels } = useData();
	const [helpVisible, setHelpVisible] = useState(false);

	const toggleHelp = () => {
		setHelpVisible(!helpVisible);
	};

	const globalLevel = calculateGlobalLevel(usersLevels);

	return (
		<View className="relative">
			<TouchableOpacity
				onPress={toggleHelp}
				className="flex items-center flex-row rounded-full"
				style={{
					backgroundColor: theme.colors.blueSecondary,
					borderColor: theme.colors.primary,
					borderWidth: 1,
				}}
			>
				<View
					className="flex items-center justify-center flex-row  px-2 ml-2 rounded-l-full"
					style={{
						backgroundColor: theme.colors.blueSecondary,
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
							{globalLevel}
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
								{globalLevel}
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
