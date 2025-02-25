import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalWrapperSimple from "@components/Modals/ModalWrapperSimple";
import CachedImage from "@components/Shared/CachedImage";
import { Iconify } from "react-native-iconify";
import { setRewards } from "@db/rewards";
import usePoints from "@hooks/usePoints";

const DAILY_REWARD_KEY = "CLAIMED_REWARD_DATE";

const DailyRewards: React.FC = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { completedHabitsToday } = useData();
	const { addRewardPoints } = usePoints();


	// Les 3 missions à accomplir pour récupérer la récompense
	const [tasks, setTasks] = useState([
		{ text: "Se connecter à Melios", completed: true, slug: "login" },
		{ text: "Compléter 3 habitudes", completed: false, slug: "complete_habits" },
		{
			text: "Supporter un membre dans l'Agora",
			completed: false,
			slug: "support_member",
		},
		{
			text: "Faire une session de travail",
			completed: false,
			slug: "work_session",
		},
	]);

	const [rewardClaimed, setRewardClaimed] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const hasSupportedMemberToday = async () => {
		const latestReaction = await AsyncStorage.getItem("LATEST_REACTION");
		if (!latestReaction) return false;
		const latestReactionDate = new Date(latestReaction);
		const today = new Date();
		return (
			latestReactionDate.getDate() === today.getDate() &&
			latestReactionDate.getMonth() === today.getMonth() &&
			latestReactionDate.getFullYear() === today.getFullYear()
		);
	};

	// Vérifier en asynchrone si la récompense a déjà été claimée aujourd'hui
	useEffect(() => {
		const checkRewardClaimed = async () => {
			try {
				const storedDate = await AsyncStorage.getItem(DAILY_REWARD_KEY);
				if (storedDate) {
					const claimedDate = new Date(storedDate);
					const today = new Date();
					if (
						claimedDate.getFullYear() === today.getFullYear() &&
						claimedDate.getMonth() === today.getMonth() &&
						claimedDate.getDate() === today.getDate()
					) {
						setRewardClaimed(true);
					}
				}
			} catch (error) {
				console.error("Error reading reward claim date", error);
			}
		};

		checkRewardClaimed();
	}, []);

	useEffect(() => {
		// Mise à jour de la tâche "Compléter 3 habitudes"
		setTasks((prev) => {
			const newTasks = [...prev];
			newTasks[1].completed = completedHabitsToday.length >= 3;
			return newTasks;
		});

		// Vérification de la tâche "Supporter un membre"
		hasSupportedMemberToday().then((hasSupported) => {
			setTasks((prev) => {
				const newTasks = [...prev];
				newTasks[2].completed = hasSupported;
				return newTasks;
			});
		});
	}, [completedHabitsToday]);

	// Calcul du nombre de missions (sur les 3 premières) accomplies
	const missionsCompleted = tasks
		.slice(0, 3)
		.filter((task) => task.completed).length;
	const rewardAvailable = missionsCompleted === 3 && !rewardClaimed;

	const claimReward = async () => {
		if (rewardAvailable) {
			setRewardClaimed(true);
			setShowModal(true);
			setRewards("rewards", 3); // database
			addRewardPoints(3) // local (for real time)
			try {
				await AsyncStorage.setItem(DAILY_REWARD_KEY, new Date().toISOString());
			} catch (error) {
				console.error("Error saving reward claim date", error);
			}
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
						<View className="w-11/12 mx-auto font-semibold mb-1 flex flex-row justify-between">
							<Text
								className="text-lg font-bold"
								style={{ color: theme.colors.textTertiary }}
							>
								{missionsCompleted}/3
							</Text>
							<View className="flex flex-row items-center gap-2">
								<Text
									className="text-lg font-bold"
									style={{ color: theme.colors.text }}
								>
									3
								</Text>
								<MoneyMelios width={20} />
							</View>
						</View>
						<Progress.Bar
							progress={missionsCompleted / 3}
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
								{t("reward_claimed_title") || "Récompense récupérée !"}
							</Text>
						</View>
					</View>
				)}
			</View>

			{/* Zone des missions */}
			{!rewardClaimed ? (
				<View className="py-4 flex flex-col gap-4">
					{tasks.map((task, index) => (
						<View
							key={index}
							className="flex-row items-center mx-4 rounded-xl overflow-hidden shadow-lg"
							style={{
								borderWidth: 1,
								borderColor: theme.colors.border,
								backgroundColor: theme.colors.cardBackground,
							}}
						>
							<View
								className="h-full"
								style={{ width: 6, backgroundColor: theme.colors.primary }}
							/>
							<View className="flex-row items-center flex-1 p-4">
								<Ionicons
									name={task.completed ? "checkmark-circle" : "ellipse-outline"}
									size={30}
									color={theme.colors.primary}
								/>
								<Text className="ml-3 text-base" style={{ color: theme.colors.text }}>
									{task.text}
								</Text>
							</View>

							{task.slug === "complete_habits" && (
								<View className="flex-row items-center p-4">
									<Text
										className="text-base font-bold"
										style={{ color: theme.colors.text }}
									>
										{completedHabitsToday.length}/3
									</Text>
								</View>
							)}
						</View>
					))}
					{rewardAvailable && (
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
							"Bravo, tu as complété toutes tes missions quotidiennes !"}
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
						{t("congratulations_reward") || "Félicitations !"}
					</Text>
				</View>
				<Text
					className="text-base text-center mb-6"
					style={{ color: theme.colors.text }}
				>
					{t("reward_modal_message") ||
						"Tu viens de recevoir ta récompense quotidienne. Continue comme ça !"}
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
