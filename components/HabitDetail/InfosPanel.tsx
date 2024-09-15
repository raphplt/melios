import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { Habit } from "../../type/habit";
import { useEffect, useState } from "react";
import Melios from "@components/Svg/Melios";
import MoneyMelios from "@components/Svg/MoneyMelios";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";

export default function InfosPanel({
	habit,
	theme,
	lightenedColor,
}: {
	habit: Habit;
	theme: any;
	lightenedColor: string;
}) {
	const [difficulty, setDifficulty] = useState<string>("");

	useEffect(() => {
		const temp = habit.difficulty;
		if (temp === 1) {
			setDifficulty("Facile");
		}
		if (temp === 2) {
			setDifficulty("Moyen");
		}
		if (temp >= 3) {
			setDifficulty("Difficile");
		}
	}, [habit.difficulty]);

	const rowStyle =
		"flex flex-row justify-between items-center w-full mx-auto mt-4 px-5";

	const rowBox = "flex flex-row items-center gap-2";

	return (
		<View
			className="flex flex-col items-center justify-between w-11/12 mx-auto py-4 rounded-lg mt-6"
			style={{
				backgroundColor: lightenedColor || theme.colors.cardBackground,
			}}
		>
			<Text
				style={{
					color: theme.colors.text,
					borderBottomColor: habit.category?.color || theme.colors.border,
				}}
				className="text-[15px] text-pretty ml-4  font-semibold pb-2 w-11/12 mx-auto border-b"
			>
				{habit.description}
			</Text>
			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={theme.colors.text} icon="mingcute:time-line" />
					<Text style={{ color: theme.colors.text }} className="text-md">
						Durée
					</Text>
				</View>
				<Text style={{ color: theme.colors.text }}>{habit.duration} minutes</Text>
			</View>

			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify
						size={24}
						color={theme.colors.text}
						icon="material-symbols:category"
					/>
					<Text style={{ color: theme.colors.text }} className="text-md">
						Catégorie
					</Text>
				</View>
				<Text style={{ color: theme.colors.text }}>{habit.category?.category}</Text>
			</View>

			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={theme.colors.text} icon="carbon:calendar" />
					<Text style={{ color: theme.colors.text }} className="text-md">
						Moment
					</Text>
				</View>

				<Text style={{ color: theme.colors.text }}>à {habit.moment} heure</Text>
			</View>

			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={theme.colors.text} icon="mdi:fire" />
					<Text style={{ color: theme.colors.text }} className="text-md">
						Difficulté
					</Text>
				</View>
				<Text style={{ color: theme.colors.text }}>{difficulty ?? ""}</Text>
			</View>
			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={theme.colors.text} icon="ph:coin" />
					<Text style={{ color: theme.colors.text }} className="text-md">
						Points
					</Text>
				</View>
				<View className="flex flex-row gap-3">
					<View className="flex flex-row items-center">
						<MoneyOdyssee />
						<Text style={{ color: theme.colors.text }} className="ml-1">
							{Math.round(habit.reward * (habit.difficulty / 2))}
						</Text>
					</View>
					<View className="flex flex-row items-center gap4">
						<MoneyMelios />
						<Text style={{ color: theme.colors.text }} className="ml-1">
							{habit.difficulty}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
