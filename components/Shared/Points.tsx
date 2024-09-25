import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MoneyMelios from "@components/Svg/MoneyMelios";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";

export default function Points() {
	const { theme } = useContext(ThemeContext);
	const { points } = useData();
	const [helpVisible, setHelpVisible] = useState(false);

	const toggleHelp = () => {
		setHelpVisible(!helpVisible);
	};

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
					className="flex items-center justify-center flex-row py-1 px-2 ml-1 rounded-l-full"
					style={{
						backgroundColor: theme.colors.blueSecondary,
					}}
				>
					<Text
						style={{
							color: theme.dark ? theme.colors.text : theme.colors.primary,
							fontSize: 16,
						}}
						className="font-bold mr-1"
					>
						{points.odyssee}
					</Text>
					<MoneyOdyssee />
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
					className="absolute top-full mt-1 left-0 p-2 rounded-md shadow-md w-44"
					style={{
						borderColor: theme.colors.primary,
						borderWidth: 1,
						backgroundColor: theme.colors.background,
					}}
				>
					<View>
						<MoneyOdyssee />
						<Text style={{ color: theme.colors.text }}>
							Les points Odyssee représentent vos progrès dans l'application.
						</Text>
					</View>
					<View className="mt-2">
						<MoneyMelios />
						<Text style={{ color: theme.colors.text }}>
							Les points Melios peuvent être échangés contre des récompenses.
						</Text>
					</View>
				</View>
			)}
		</View>
	);
}
