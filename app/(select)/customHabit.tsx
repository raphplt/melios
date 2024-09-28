import HabitHour from "@components/Select/Containers/HabitHour";
import HabitInfos from "@components/Select/Containers/HabitInfos";
import Notifications from "@components/Select/Items/Notifications";
import RepeatHabit from "@components/Select/Items/RepeatHabit";
import ButtonClose from "@components/Shared/ButtonClose";
import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { View, Text, StatusBar, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function CustomHabit() {
	const { theme } = useTheme();
	const { habit } = useSelect();

	console.log(habit);

	return (
		<View
			style={{
				flex: 1,
				paddingTop: StatusBar.currentHeight,
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<ButtonClose />
			<View className="w-11/12 mx-auto">
				<View className="flex flex-row items-center justify-between ">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-2xl font-semibold w-10/12"
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{(habit && habit.name) || "Nouvelle habitude"}
					</Text>
					<Iconify
						icon="material-symbols:edit"
						size={24}
						color={theme.colors.text}
					/>
				</View>
				{/* <Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-lg mt-1"
				>
					{habit?.category.category || null}
				</Text> */}
				<View
					style={{
						backgroundColor: theme.colors.background,
					}}
					className="rounded-xl p-3 mt-4 flex flex-row items-center justify-between"
				>
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="w-10/12"
					>
						{habit?.description}
					</Text>
					<Iconify icon="lucide:edit" size={22} color={theme.colors.text} />
				</View>

				{/* INFORMATIONS */}
				<HabitInfos habit={habit} />

				{/* HEURE */}
				<HabitHour habit={habit} />

				{/* RÉPÉTER */}
				<RepeatHabit habit={habit} />

				{/* NOTIFICATIONS */}
				<Notifications habit={habit} />

				<Pressable
					style={{
						backgroundColor: theme.colors.primary,
					}}
					className="rounded-xl py-3 mt-4 flex flex-row items-center justify-center"
				>
					<Text
						style={{
							color: "white",
						}}
						className="text-lg"
					>
						Enregistrer
					</Text>
				</Pressable>
			</View>
		</View>
	);
}
