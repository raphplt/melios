import { View, Text, Pressable, Modal } from "react-native";
import { Iconify } from "react-native-iconify";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
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
	const [modalVisible, setModalVisible] = useState(false);

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

	const confirmDeleteHabit = () => {
		setModalVisible(true);
	};

	const handleDeleteConfirm = () => {
		deleteHabit(habit);
		setModalVisible(false);
	};

	const handleDeleteCancel = () => {
		setModalVisible(false);
	};

	return (
		<View>
			<View
				className="flex flex-row items-center justify-between mx-auto w-11/12 py-3 px-2 my-[6px] rounded-xl"
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
				<Pressable onPress={confirmDeleteHabit}>
					<Iconify
						icon="mdi:trash-outline"
						size={26}
						color={theme.colors.redPrimary}
					/>
				</Pressable>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={handleDeleteCancel}
			>
				<View className="flex-1 justify-center items-center">
					<View
						className="w-11/12 p-5 rounded-xl"
						style={{
							backgroundColor: theme.colors.background,
							borderColor: theme.colors.border,
							borderWidth: 2,
						}}
					>
						<Text
							className="text-lg font-semibold mb-4"
							style={{ color: theme.colors.text }}
						>
							Confirmer la suppression
						</Text>
						<Text
							className="mb-4 py-2 text-[16px]"
							style={{ color: theme.colors.text }}
						>
							Êtes-vous sûr de vouloir supprimer l'habitude {habit.name} ?
						</Text>
						<View className="flex flex-row justify-end">
							<Pressable
								onPress={handleDeleteCancel}
								className="rounded-3xl px-5 py-3 mr-2"
								style={{ backgroundColor: theme.colors.grayPrimary }}
							>
								<Text className="font-semibold" style={{ color: "white" }}>
									Annuler
								</Text>
							</Pressable>

							<Pressable
								onPress={handleDeleteConfirm}
								className="rounded-3xl px-5 py-3 mr-2"
								style={{ backgroundColor: theme.colors.redPrimary }}
							>
								<Text className="font-semibold" style={{ color: "white" }}>
									Supprimer
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}
