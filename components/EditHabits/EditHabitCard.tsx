import { View, Text, Pressable, ImageBackground } from "react-native";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
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
import { useHabits } from "@context/HabitsContext";
import { catImgs } from "@utils/categoriesBg";
import { BlurView } from "expo-blur";

export default function EditHabitCard({ habit }: { habit: UserHabit }) {
	const { theme } = useTheme();
	const { categories } = useHabits();
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

	const habitCategory = categories.find((c) => c.category === habit.category);

	return (
		<>
			{/* Card */}

			<ImageBackground
				source={catImgs[habitCategory?.slug || "sport"]}
				style={{ flex: 1 }}
				imageStyle={{ resizeMode: "cover" }}
				className="flex flex-row justify-between items-center py-6 px-2 my-[6px] rounded-xl overflow-hidden w-[95%] mx-auto"
			>
				<BlurView
					tint="dark"
					intensity={80}
					className="flex flex-row items-center py-2 rounded-full w-2/3 overflow-hidden px-2"
				>
					<View className="w-6 ml-1">
						<FontAwesome6 name={habit.icon || "question"} size={16} color={"white"} />
					</View>
					<Text
						className="ml-2 text-sm text-white  font-semibold overflow-clip"
						numberOfLines={1}
					>
						{habit.name}
					</Text>
				</BlurView>
				<Pressable
					onPress={confirmDeleteHabit}
					className="bg-white rounded-full p-2"
				>
					<Iconify
						icon="mdi:trash-outline"
						size={26}
						color={theme.colors.redPrimary}
						className="mr-2"
					/>
				</Pressable>
			</ImageBackground>

			{/* Modal */}
			<DeleteHabit
				visible={modalVisible}
				setVisible={setModalVisible}
				habit={habit}
				handleDelete={handleDeleteConfirm}
			/>
		</>
	);
}
