import React, { useState } from "react";
import {
	ScrollView,
	StatusBar,
	Text,
	View,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import * as Progress from "react-native-progress";
import ButtonClose from "@components/Shared/ButtonClose";
import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";
import MoneyMelios from "@components/Svg/MoneyMelios";
import ModalWrapperSimple from "@components/Modals/ModalWrapperSimple";
import CachedImage from "@components/Shared/CachedImage";
import { Iconify } from "react-native-iconify";
import { setRewards } from "@db/rewards";
import usePoints from "@hooks/usePoints";

const DailyRewards: React.FC = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { addRewardPoints } = usePoints();
	const {
		dailyTasks,
		validateTask,
		rewardClaimed,
		claimDailyReward,
		canClaimReward,
	} = useData();

	const [showModal, setShowModal] = useState(false);

	// Count validated tasks (first 3)
	const validatedTasksCount = dailyTasks
		.slice(0, 3)
		.filter((task) => task.validated && task.completed).length;

	const claimReward = async () => {
		if (canClaimReward) {
			setShowModal(true);
			await claimDailyReward();
			setRewards("rewards", 3); // database
			addRewardPoints(3); // local (for real time)
		}
	};

	return (
		<ScrollView
			className="flex-1"
			showsVerticalScrollIndicator={false}
			style={{ backgroundColor: theme.colors.background }}
		>
			<StatusBar
				barStyle="light-content"
				backgroundColor={theme.colors.backgroundTertiary}
				translucent
			/>

			<View
				className="rounded-b-xl py-6 px-4 pt-12"
				style={{ backgroundColor: theme.colors.backgroundTertiary }}
			>
				<ButtonClose />
				<Text
					className="text-xl text-center mb-6"
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
				>
					{t("daily_rewards")}
				</Text>

				{!rewardClaimed ? (
					<>
						<View className="w-11/12 mx-auto font-semibold flex flex-row justify-between items-center mb-2">
							<Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
								{validatedTasksCount}/3
							</Text>
							<View
								className="flex flex-row items-center gap-1 p-1 py-[2px] rounded-lg"
								style={{ backgroundColor: theme.colors.cardBackground }}
							>
								<Text
									className="text-md font-semibold"
									style={{ color: theme.colors.text }}
								>
									3
								</Text>
								<MoneyMelios width={18} />
							</View>
						</View>
						<Progress.Bar
							progress={validatedTasksCount / 3}
							width={Dimensions.get("window").width * 0.85}
							color={theme.colors.primary}
							borderRadius={10}
							height={12}
							borderWidth={0}
							className="mx-auto mb-4"
							unfilledColor={theme.colors.cardBackground}
						/>
					</>
				) : (
					<View className="py-2">
						<View className="flex flex-row items-center justify-center gap-2 mb-2">
							<Iconify
								icon="mdi:check-circle"
								size={30}
								color={theme.colors.primary}
							/>
							<Text
								className="text-2xl font-bold text-center"
								style={{
									color: theme.colors.primary,
								}}
							>
								{t("reward_claimed_title") || "Récompense récupérée !"}
							</Text>
						</View>
					</View>
				)}
			</View>

			{/* Zone des missions */}
			{!rewardClaimed ? (
				<View className="py-4 flex flex-col gap-4">
					{dailyTasks.map((task, index) => (
						<View
							key={index}
							className="flex-row items-center mx-4 rounded-xl overflow-hidden shadow-lg"
							style={{
								borderWidth: 1,
								borderColor: theme.colors.border,
								backgroundColor: theme.colors.cardBackground,
								opacity: task.completed ? 1 : 0.7,
							}}
						>
							<View
								className="h-full"
								style={{
									width: 6,
									backgroundColor: task.validated
										? theme.colors.primary
										: task.completed
										? theme.colors.greenPrimary
										: theme.colors.border,
								}}
							/>
							<View className="flex-row items-center flex-1 p-4">
								<Ionicons
									name={
										task.validated
											? "checkmark-circle"
											: task.completed
											? "checkbox-outline"
											: "ellipse-outline"
									}
									size={30}
									color={
										task.validated
											? theme.colors.primary
											: task.completed
											? theme.colors.greenPrimary
											: theme.colors.textTertiary
									}
								/>
								<Text
									className="ml-3 text-base"
									style={{
										color: theme.colors.text,
										fontWeight: task.completed ? "bold" : "normal",
									}}
								>
									{task.text}
								</Text>
							</View>

							{task.slug === "complete_habits" && (
								<View className="flex-row items-center p-4">
									<Text
										className="text-base font-bold"
										style={{ color: theme.colors.text }}
									>
										{Math.min(3, dailyTasks[1].completed ? 3 : 0)}/3
									</Text>
								</View>
							)}

							{/* Validation button for completed tasks */}
							{task.completed && !task.validated && (
								<TouchableOpacity
									onPress={() => validateTask(task.slug)}
									className="px-3 py-2 mr-2 rounded-lg"
									style={{ backgroundColor: theme.colors.greenPrimary }}
								>
									<Text style={{ color: "#fff", fontWeight: "bold" }}>
										{t("validate") || "Valider"}
									</Text>
								</TouchableOpacity>
							)}
						</View>
					))}
					{canClaimReward && (
						<TouchableOpacity
							onPress={claimReward}
							className="mx-4 rounded-xl p-4 items-center shadow-lg"
							style={{
								backgroundColor: theme.colors.primary,
								marginTop: 10,
							}}
						>
							<Text
								className="text-lg font-bold"
								style={{ color: theme.colors.textSecondary || "#fff" }}
							>
								{t("claim_reward") || "Récupérer ma récompense"}
							</Text>
						</TouchableOpacity>
					)}
				</View>
			) : (
				<View className="h-screen flex flex-col items-center gap-y-2">
					<Text
						className="text-base text-center w-10/12 mt-8 italic font-semibold"
						style={{ color: theme.colors.textTertiary }}
					>
						{t("reward_claimed_message") ||
							"Bravo, tu as complété toutes tes missions quotidiennes !"}
					</Text>
					<CachedImage
						imagePath="images/illustrations/character2.png"
						style={{ width: "30%", height: "30%", marginVertical: 16 }}
					/>
				</View>
			)}

			{/* Modale de récompense */}
			<ModalWrapperSimple visible={showModal} setVisible={setShowModal}>
				<View className="items-center mb-4">
					<Text
						className="text-2xl font-bold mt-2"
						style={{ color: theme.colors.primary }}
					>
						{t("congratulations_reward") || "Félicitations !"}
					</Text>
				</View>
				<Text
					className="text-base text-center mb-6"
					style={{ color: theme.colors.text }}
				>
					{t("reward_modal_message") ||
						"Tu viens de recevoir ta récompense quotidienne. Continue comme ça !"}
				</Text>
				<View className="flex flex-row items-center justify-center mb-6 gap-x-2">
					<Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
						3
					</Text>
					<MoneyMelios width={30} height={30} />
				</View>

				<TouchableOpacity
					onPress={() => setShowModal(false)}
					className="rounded-full p-3 items-center"
					style={{ backgroundColor: theme.colors.primary }}
				>
					<Text
						className="text-lg font-bold"
						style={{ color: theme.colors.textSecondary || "#fff" }}
					>
						OK
					</Text>
				</TouchableOpacity>
			</ModalWrapperSimple>
		</ScrollView>
	);
};

export default DailyRewards;
