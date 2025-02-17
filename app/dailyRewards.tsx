import React from "react";
import { ScrollView, StatusBar, Text, View, Dimensions } from "react-native";
import * as Progress from "react-native-progress";
import { Iconify } from "react-native-iconify";
import ButtonClose from "@components/Shared/ButtonClose";
import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";
import MoneyMelios from "@components/Svg/MoneyMelios";

const DailyRewards: React.FC = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { completedHabitsToday } = useData();

	const tasks = [
		{ text: "Se connecter à Melios", completed: true },
		{ text: "Compléter 3 habitudes", completed: false },
		{ text: "Supporter un membre dans l'Agora", completed: false },
		{ text: "Écrire son journal de bord quotidien", completed: false },
	];

	tasks[1].completed = completedHabitsToday.length >= 3;

	return (
		<ScrollView
			className="flex-1 pt-10"
			contentContainerStyle={{ flexGrow: 1 }}
			showsVerticalScrollIndicator={false}
			style={{ backgroundColor: theme.colors.background }}
		>
			<StatusBar
				barStyle="light-content"
				backgroundColor={theme.colors.backgroundTertiary}
				translucent
			/>
			<View
				className="rounded-b-lg py-4 px-4"
				style={{ backgroundColor: theme.colors.backgroundTertiary }}
			>
				<ButtonClose />
				<Text
					className="text-xl w-11/12 mx-auto mb-6"
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
				>
					{t("daily_rewards")}
				</Text>

				<View className="w-11/12 mx-auto font-semibold mb-1 flex flex-row justify-between">
					<Text
						className="text-base font-bold"
						style={{ color: theme.colors.textTertiary }}
					>
						{tasks.filter((task) => task.completed).length}/3
					</Text>
					<View className="flex flex-row items-center gap-2">
						<Text
							className="text-base font-bold"
							style={{ color: theme.colors.text }}
						>
							3
						</Text>
						<MoneyMelios width={18} />
					</View>
				</View>
				<Progress.Bar
					progress={tasks.filter((task) => task.completed).length / 3}
					width={Dimensions.get("window").width * 0.85}
					color={theme.colors.primary}
					borderRadius={10}
					height={10}
					className="mx-auto mb-4"
					unfilledColor={theme.colors.cardBackground}
					borderWidth={1}
				/>
			</View>
			<View className="py-4 flex flex-col gap-4">
				{tasks.map((task, index) => (
					<View
						key={index}
						className="flex-row items-center mx-4 rounded-xl overflow-hidden shadow-lg"
						style={{
							borderWidth: 1,
							borderColor: theme.colors.border,
							backgroundColor: theme.colors.cardBackground,
						}}
					>
						<View
							className="h-full"
							style={{ width: 6, backgroundColor: theme.colors.primary }}
						/>
						<View className="flex-row items-center flex-1 p-4">
							<Ionicons
								name={task.completed ? "checkmark-circle" : "ellipse-outline"}
								size={30}
								color={theme.colors.primary}
							/>
							<Text className="ml-3 text-base" style={{ color: theme.colors.text }}>
								{task.text}
							</Text>
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);
};

export default DailyRewards;
