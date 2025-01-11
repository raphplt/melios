import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { deleteMemberGoal } from "@db/goal";
import { Goal } from "@type/goal";
import { calcReward } from "@utils/goal";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useGoal } from "@context/GoalsContext";
import { setRewards } from "@db/rewards";
import * as Progress from "react-native-progress";
import usePoints from "@hooks/usePoints";
import DeleteGoal from "@components/Modals/DeleteGoal";
import { useTranslation } from "react-i18next";
import { UserHabit } from "@type/userHabit";
import ModalWrapper from "@components/Modals/ModalWrapper";
import { FontAwesome6 } from "@expo/vector-icons";
import BottomSlideModal from "@components/Modals/ModalBottom";
import { useHabits } from "@context/HabitsContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";

export default function ModalCurrentGoal({
	visible,
	setVisible,
	onValidate,
	goal,
	habit,
	completedDays,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onValidate?: () => void;
	goal: Goal;
	habit: UserHabit;
	completedDays: Date[];
}) {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [isConfirmVisible, setIsConfirmVisible] = useState(false);
	const { goals, setGoals } = useGoal();
	const { addRewardPoints } = usePoints();
	const { setCurrentHabit } = useHabits();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const block = "w-[95%] mx-auto py-2";

	const showConfirmPopup = () => {
		setIsConfirmVisible(true);
	};

	const goHabitDetail = () => {
		setVisible(false);
		setCurrentHabit(habit);
		navigation.navigate("habitDetail");
	};

	const handleConfirmDelete = async () => {
		try {
			await deleteMemberGoal(goal.memberId, goal.id);
			setIsConfirmVisible(false);
			setVisible(false);
			const newGoals = goals.filter((g) => g.id !== goal.id);
			setGoals(newGoals);
			if (onValidate) onValidate();
		} catch (error) {
			console.error("Erreur lors de la suppression de l'objectif: ", error);
		}
	};

	const completed = completedDays.length >= goal.duration;

	const handleEndGoal = async () => {
		const reward = calcReward({ duration: goal.duration, habit: habit });
		if (!reward) return;

		await setRewards("rewards", reward);
		addRewardPoints(reward);

		await deleteMemberGoal(goal.memberId, goal.id);
		setGoals(goals.filter((g) => g.id !== goal.id));
		if (onValidate) onValidate();
		setVisible(false);
	};

	return (
		<BottomSlideModal visible={visible} setVisible={setVisible}>
			<View className="flex flex-col mx-auto justify-between items-center">
				<Text
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
					className="text-xl font-semibold text-center w-10/12"
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{habit?.name}
				</Text>
				<View className="pt-3 pb-1">
					<FontAwesome6
						name={habit.icon}
						size={28}
						color={habit.color ?? theme.colors.primary}
					/>
				</View>
			</View>

			<View
				className={block}
				style={{
					borderBottomColor: theme.colors.border,
					borderBottomWidth: 1,
				}}
			>
				<View className="flex flex-row justify-between items-center w-full">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-[16px] font-semibold py-3"
					>
						{t("description")}
					</Text>
				</View>
				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
				>
					{habit.description}
				</Text>
			</View>

			<View
				className={block}
				style={{
					borderBottomColor: theme.colors.border,
					borderBottomWidth: 1,
				}}
			>
				<View className="flex flex-row justify-between items-center w-full">
					<View className="flex flex-row items-center">
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[16px] font-semibold py-3 "
						>
							{t("reward")}:
						</Text>
					</View>
					<View className="flex flex-row items-center">
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="mx-1 font-semibold text-[16px]"
						>
							{goal.duration - 2 || 0}
						</Text>
						<MoneyMelios width={20} />
					</View>
				</View>
			</View>

			<View className={block}>
				<View className="flex flex-row justify-between items-center w-full">
					<View className="flex flex-row items-center">
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[16px] font-semibold py-3 mx-1"
						>
							{t("progress")}
						</Text>
					</View>
					<View className="flex flex-row items-center">
						<Text
							style={{ color: theme.colors.textTertiary }}
							className="text-[14px] font-semibold"
						>
							{completedDays.length}/{goal.duration} {t("days")}
						</Text>
					</View>
				</View>
				<Progress.Bar
					progress={completedDays.length / goal.duration}
					height={8}
					className="w-full"
					borderColor="transparent"
					unfilledColor={theme.colors.border}
					color={theme.colors.primary}
					width={null}
					useNativeDriver={true}
					borderWidth={0}
				/>
			</View>

			{completed ? (
				<Pressable
					onPress={handleEndGoal}
					style={{
						backgroundColor: theme.colors.greenPrimary,
					}}
					className="px-5 py-2 rounded-xl mx-auto my-3 w-11/12 "
				>
					<Text className="font-semibold text-white text-center">
						{t("finish_goal")}
					</Text>
				</Pressable>
			) : (
				<View className="w-11/12 mx-auto flex flex-row justify-between items-center py-4 mt-4">
					<Pressable
						onPress={goHabitDetail}
						style={{
							backgroundColor: theme.colors.primary,
						}}
						className="p-3 px-6 rounded-2xl flex flex-row items-center gap-2"
					>
						<Iconify
							icon="mdi:information"
							color={theme.colors.textSecondary}
							size={20}
						/>
						<Text className="font-semibold text-white">{t("details")}</Text>
					</Pressable>

					<Pressable
						onPress={showConfirmPopup}
						style={{
							backgroundColor: theme.colors.redPrimary,
						}}
						className="p-3 px-6 rounded-2xl flex flex-row items-center"
					>
						<Iconify icon="mdi-delete" size={20} color={theme.colors.background} />
						<Text className="font-semibold text-white ml-2">{t("delete_goal")}</Text>
					</Pressable>
				</View>
			)}

			{isConfirmVisible && (
				<DeleteGoal
					visible={isConfirmVisible}
					setVisible={setIsConfirmVisible}
					onConfirm={handleConfirmDelete}
				/>
			)}
		</BottomSlideModal>
	);
}
