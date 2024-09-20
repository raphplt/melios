import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { getHabitById } from "@db/habits";
import CardPlaceHolder from "@components/Habits/CardPlaceHolder";
import { FontAwesome6 } from "@expo/vector-icons";
import { useData } from "@context/DataContext";
import { LOCAL_STORAGE_MEMBER_HABITS_KEY, setMemberHabit } from "@db/member";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";
import useIndex from "@hooks/useIndex";

export default function EditHabitCard({ habit }: { habit: UserHabit }) {
	const { theme } = useContext(ThemeContext);
	const [habitInfos, setHabitInfos] = useState<Habit>();
	const { setHabits } = useData();
	const { getHabitDetails } = useIndex();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		function getHabitInfos() {
			const result = getHabitDetails(habit.id);
			setHabitInfos(result);
			setLoading(false);
		}
		getHabitInfos();
	}, []);

	if (loading || !habitInfos) return <CardPlaceHolder />;

	const deleteHabit = async (habit: UserHabit) => {
		await setMemberHabit(habit);

		setHabits((prev: UserHabit[]) =>
			prev.filter((h: UserHabit) => h.id !== habit.id)
		);

		const storedHabits = await AsyncStorage.getItem(
			LOCAL_STORAGE_MEMBER_HABITS_KEY
		);
		let localHabits = storedHabits ? JSON.parse(storedHabits) : [];
		localHabits = localHabits.filter((h: Habit) => h.id !== habit.id);
	};

	// console.log(habitInfos);

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
			<Pressable onPress={() => deleteHabit(habit)}>
				<Iconify
					icon="mdi:trash-outline"
					size={26}
					color={theme.colors.redPrimary}
				/>
			</Pressable>
		</View>
	);
}
