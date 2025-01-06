import { UserHabit } from "@type/userHabit";
import ModalWrapper from "./ModalWrapper";
import { View, Pressable, Text } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { FontAwesome6 } from "@expo/vector-icons";
import { Iconify } from "react-native-iconify";
import { resetHabit } from "@db/userHabit";
import { setHabitLog } from "@db/logs";
import { useData } from "@context/DataContext";

export default function RestartHabit({
	visible,
	setVisible,
	habit,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	habit: UserHabit;
}) {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const { date, setCompletedHabitsToday } = useData();
	const handleReset = async () => {
		try {
			await resetHabit(habit.id);
			await setHabitLog(habit.id, date);

			setCompletedHabitsToday((prev) => [...prev, habit]);

			setVisible(false);
		} catch (error) {
			console.error("Erreur lors de la réinitialisation de l'habitude: ", error);
		}
	};

	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View className="w-[95%] mx-auto">
				<Text
					className=" text-lg font-semibold mb-4 pr-5"
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
				>
					{t("restart_habit_question")}
				</Text>
				<Text
					className=" text-lg font-semibold mb-4"
					style={{
						color: theme.colors.text,
					}}
				>
					{habit.name}
				</Text>

				<Text
					className=" text-lg font-semibold mb-4"
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
				></Text>

				<View className="flex flex-row justify-between">
					<Pressable
						onPress={() => setVisible(false)}
						className="flex flex-row items-center justify-center py-3 px-5 rounded-2xl w-2/5"
						style={{
							backgroundColor: theme.colors.primary,
							borderWidth: 2,
							borderColor: theme.colors.primary,
						}}
					>
						<Iconify icon="mdi:close" size={20} color="white" />
						<Text className="text-[16px] font-semibold ml-2 text-white">
							{t("cancel")}
						</Text>
					</Pressable>
					<Pressable
						onPress={handleReset}
						className="flex flex-row items-center justify-center py-3 px-5 rounded-2xl w-2/5"
						style={{
							backgroundColor: theme.colors.redPrimary,
							borderWidth: 2,
							borderColor: theme.colors.redPrimary,
						}}
					>
						<FontAwesome6 name="check" size={20} color="white" />
						<Text className="text-[16px] font-semibold ml-2 text-white">
							{t("confirm")}
						</Text>
					</Pressable>
				</View>
			</View>
		</ModalWrapper>
	);
}
