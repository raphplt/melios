import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useData } from "@context/DataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "@type/habit";
import { UserHabit } from "@type/userHabit";
import DeleteHabit from "@components/Modals/DeleteHabit";
import {
	deleteHabitById,
	LOCAL_STORAGE_MEMBER_HABITS_KEY,
} from "@db/userHabit";
import ZoomableView from "@components/Shared/ZoomableView";
import { deleteLogsByHabitId } from "@db/logs";

export default function EditHabitCard({ habit }: { habit: UserHabit }) {
	const { theme } = useContext(ThemeContext);
	const { setHabits } = useData();

	const [modalVisible, setModalVisible] = useState(false);

	const deleteHabit = async (habit: UserHabit) => {
		const habitId = habit.id;
		if (habitId) {
			deleteHabitById(habitId);
			deleteLogsByHabitId(habitId);
		}

		setHabits((prev: UserHabit[]) =>
			prev.filter((h: UserHabit) => h.id !== habit.id)
		);

		const storedHabits = await AsyncStorage.getItem(
			LOCAL_STORAGE_MEMBER_HABITS_KEY
		);
		let localHabits = storedHabits ? JSON.parse(storedHabits) : [];
		localHabits = localHabits.filter((h: Habit) => h.id !== habit.id);
	};

	const confirmDeleteHabit = () => {
		setModalVisible(true);
	};

	const handleDeleteConfirm = () => {
		deleteHabit(habit);
		setModalVisible(false);
	};

	return (
		<ZoomableView>
			<View
				className="flex flex-row items-center justify-between mx-auto w-11/12 py-3 px-2 my-[6px] rounded-2xl"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
			>
				<View className="flex flex-row items-center">
					<View className="w-8 ml-1">
						<FontAwesome6
							name={habit.icon || "question"}
							size={18}
							color={habit.color || theme.colors.text}
						/>
					</View>
					<Text
						className="ml-2 w-10/12 font-semibold overflow-clip"
						style={{
							color: theme.colors.text,
						}}
						numberOfLines={1}
					>
						{habit.name}
					</Text>
				</View>
				<Pressable onPress={confirmDeleteHabit}>
					<Iconify
						icon="mdi:trash-outline"
						size={26}
						color={theme.colors.redPrimary}
						className="mr-2"
					/>
				</Pressable>
			</View>

			<DeleteHabit
				visible={modalVisible}
				setVisible={setModalVisible}
				habit={habit}
				handleDelete={handleDeleteConfirm}
			/>
		</ZoomableView>
	);
}
