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
							className=""
						>
							<Iconify icon="mdi-close" size={28} color={theme.colors.textTertiary} />
						</Pressable>
					</View>

					<View className={block}>
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

					<View className={block}>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[16px] font-semibold py-3 "
						>
							Jours complétés:
						</Text>
						{completedDays.map((day, index) => (
							<Text
								key={index}
								style={{
									color: theme.colors.text,
								}}
								className="text-[14px] py-1"
							>
								{day.toDateString()}
							</Text>
						))}
					</View>

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
				</View>
			</View>

			{isConfirmVisible && (
				<Modal
					visible={isConfirmVisible}
					transparent={true}
					hardwareAccelerated={true}
					onRequestClose={() => {
						setIsConfirmVisible(false);
					}}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "rgba(0,0,0,0.4)",
						}}
					>
						<View
							style={{
								backgroundColor: theme.colors.cardBackground,
								borderColor: theme.colors.border,
								borderWidth: 1,
								padding: 20,
								borderRadius: 10,
							}}
						>
							<Text
								style={{
									color: theme.colors.text,
									fontFamily: "BaskervilleBold",
									fontSize: 18,
									marginBottom: 20,
								}}
							>
								Êtes-vous sûr de vouloir supprimer cet objectif ?
							</Text>
							<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
								<Pressable
									onPress={() => setIsConfirmVisible(false)}
									style={{
										backgroundColor: theme.colors.grayPrimary,
										padding: 10,
										borderRadius: 5,
										marginRight: 10,
									}}
								>
									<Text style={{ color: theme.colors.text }}>Annuler</Text>
								</Pressable>
								<Pressable
									onPress={handleConfirmDelete}
									style={{
										backgroundColor: theme.colors.redPrimary,
										padding: 10,
										borderRadius: 5,
									}}
								>
									<Text style={{ color: "white" }}>Supprimer</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
			)}
		</Modal>
	);
}
