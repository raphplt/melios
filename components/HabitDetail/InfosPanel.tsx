import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { Habit } from "../../types/habit";
import { useEffect, useState } from "react";

export default function InfosPanel({
	habitInfos,
	theme,
}: {
	habitInfos: Habit;
	theme: any;
}) {
	const [difficulty, setDifficulty] = useState<string>("");

	useEffect(() => {
		const temp = habitInfos.difficulty;
		if (temp === 1) {
			setDifficulty("Facile");
		}
		if (temp === 2) {
			setDifficulty("Moyen");
		}
		if (temp >= 3) {
			setDifficulty("Difficile");
		}
	}, [habitInfos.difficulty]);

	const rowStyle =
		"flex flex-row justify-between items-center w-full mx-auto mt-4 px-5";

	const rowBox = "flex flex-row items-center gap-2";

	return (
		<View
			className="flex flex-col items-center justify-between w-11/12 mx-auto py-2 rounded-lg mt-6"
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderColor: habitInfos.category?.color,
				borderWidth: 2,
			}}
		>
			<Text
				style={{
					color: theme.colors.text,
					borderBottomColor: habitInfos.category?.color || theme.colors.border,
				}}
				className="text-[16px] text-center font-semibold pb-2 w-11/12 mx-auto border-b-2"
			>
				{habitInfos.description}
			</Text>
			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={theme.colors.text} icon="mingcute:time-line" />
					<Text style={{ color: theme.colors.text }} className="text-md">
						Durée
					</Text>
				</View>
				<Text style={{ color: theme.colors.text }}>
					{habitInfos.duration} minutes
				</Text>
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
				<Text style={{ color: theme.colors.text }}>
					{habitInfos.category?.category}
				</Text>
			</View>

			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={theme.colors.text} icon="carbon:calendar" />
					<Text style={{ color: theme.colors.text }} className="text-md">
						Moment
					</Text>
				</View>

				<Text style={{ color: theme.colors.text }}>
					à {habitInfos.moment} heure
				</Text>
			</View>

			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={theme.colors.text} icon="mdi:fire" />
					<Text style={{ color: theme.colors.text }} className="text-md">
						Difficulté
					</Text>
				</View>

				<Text style={{ color: theme.colors.text }}>{difficulty}</Text>
			</View>
		</View>
	);
}
