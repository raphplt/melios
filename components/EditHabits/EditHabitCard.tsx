import { View, Text } from "react-native";
import { Habit } from "../../types/habit";
import { Iconify } from "react-native-iconify";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { getHabitById } from "@db/habits";
import CardPlaceHolder from "@components/Habits/CardPlaceHolder";
import { UserHabit } from "../../types/userHabit";
import { FontAwesome6 } from "@expo/vector-icons";

export default function EditHabitCard({ habit }: { habit: UserHabit }) {
	const { theme } = useContext(ThemeContext);
	const [habitInfos, setHabitInfos] = useState<Habit>();

	const [loading, setLoading] = useState(true);
	// console.log(habit);

	useEffect(() => {
		async function getHabitInfos() {
			const result = await getHabitById(habit.id);
			setHabitInfos(result);
			setLoading(false);
		}
		getHabitInfos();
	}, []);

	if (loading || !habitInfos) return <CardPlaceHolder />;

	return (
		<View
			className=" flex flex-row items-center justify-between mx-auto w-11/12 py-3 px-2 my-[6px] rounded-xl"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<View className="flex flex-row items-center">
				<View className="w-6">
					<FontAwesome6
						name={habitInfos.category.icon || "question"}
						size={20}
						color={habitInfos.category.color || theme.colors.text}
						cla
					/>
				</View>
				<Text
					className="ml-3 w-10/12 overflow-clip"
					style={{
						color: theme.colors.text,
					}}
					numberOfLines={1}
				>
					{habit.name}
				</Text>
			</View>
			<Iconify icon="mdi:trash" size={26} color={theme.colors.redPrimary} />
		</View>
	);
}
