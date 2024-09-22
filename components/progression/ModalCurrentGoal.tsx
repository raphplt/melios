import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { deleteMemberGoal } from "@db/goal";
import { Goal } from "@type/goal";
import { Habit } from "@type/habit";
import { calcReward } from "@utils/goal";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useGoal } from "@context/GoalsContext";
import { setRewards } from "@db/rewards";
import * as Progress from "react-native-progress";
import usePoints from "@hooks/usePoints";
import DeleteGoal from "@components/Modals/DeleteGoal";

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
	habit: Habit;
	completedDays: Date[];
}) {
	const { theme } = useContext(ThemeContext);
	const [isConfirmVisible, setIsConfirmVisible] = useState(false);
	const { goals, setGoals } = useGoal();
	const { addRewardPoints } = usePoints();

	const block = "w-11/12 mx-auto py-2";

	const showConfirmPopup = () => {
		setIsConfirmVisible(true);
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
		<Modal
			visible={visible}
			transparent={true}
			hardwareAccelerated={true}
			onRequestClose={() => {
				setVisible(false);
			}}
		>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
					backgroundColor: "rgba(0,0,0,0.4)",
				}}
			>
				<View
					style={{
						backgroundColor: theme.colors.cardBackground,
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
					className="w-[95%] mx-auto rounded-xl "
				>
					<View className="flex flex-row w-full mx-auto justify-between items-center px-5 py-3">
						<Text
							style={{
								color: theme.colors.text,
								fontFamily: "BaskervilleBold",
							}}
							className="text-lg font-semibold text-center w-3/4"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{habit?.name}
						</Text>
						<Pressable
							onPress={() => {
								setVisible(false);
							}}
						>
							<Iconify icon="mdi-close" size={28} color={theme.colors.textTertiary} />
						</Pressable>
					</View>

					<View
						className={block}
						style={{
							borderBottomColor: theme.colors.border,
							borderBottomWidth: 1,
						}}
					>
						<View className="flex flex-row justify-between items-center">
							<View className="flex flex-row items-center">
								<Iconify
									icon="mdi-currency-usd"
									size={24}
									color={theme.colors.primary}
								/>
								<Text
									style={{
										color: theme.colors.text,
									}}
									className="text-[16px] font-semibold py-3 "
								>
									Récompense:{" "}
								</Text>
							</View>
							<View className="flex flex-row items-center">
								<Text
									style={{
										color: theme.colors.text,
									}}
									className="mx-1 font-semibold text-[16px]"
								>
									{calcReward({ duration: goal.duration, habit: habit }) || 0}
								</Text>
								<MoneyMelios />
							</View>
						</View>
					</View>

					<View
						className={block}
						style={{
							borderBottomColor: theme.colors.border,
							borderBottomWidth: 1,
						}}
					>
						<View className="flex flex-row items-center justify-start">
							<Iconify icon="mdi:text" size={24} color={theme.colors.primary} />
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[16px] font-semibold py-3 mx-1"
							>
								Description
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

					<View className={block}>
						<View className="flex flex-row items-center justify-start">
							<Iconify icon="tabler:progress" size={24} color={theme.colors.primary} />
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[16px] font-semibold py-3 mx-1"
							>
								Avancement
							</Text>
						</View>
						<Progress.Bar
							progress={completedDays.length / goal.duration}
							className="w-full"
							height={8}
							borderColor="transparent"
							unfilledColor={theme.colors.border}
							color={theme.colors.primary}
							width={null}
							useNativeDriver={true}
							borderWidth={0}
						/>
						<Text
							style={{ color: theme.colors.textTertiary }}
							className="text-[14px] font-semibold text-center py-2"
						>
							{completedDays.length}/{goal.duration} jours
						</Text>
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
								Terminer l'objectif
							</Text>
						</Pressable>
					) : (
						<Pressable
							onPress={showConfirmPopup}
							style={{
								backgroundColor: theme.colors.redPrimary,
							}}
							className="px-5 py-2 rounded-xl mx-auto my-3 w-11/12 "
						>
							<Text className="font-semibold text-white text-center">
								Supprimer l'objectif
							</Text>
						</Pressable>
					)}
				</View>
			</View>

			{isConfirmVisible && (
				<DeleteGoal
					visible={isConfirmVisible}
					setVisible={setIsConfirmVisible}
					onConfirm={handleConfirmDelete}
				/>
			)}
		</Modal>
	);
}
