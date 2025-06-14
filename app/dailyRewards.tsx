import React, { useState } from "react";
import { ScrollView, View, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@context/ThemeContext";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";
import { setRewards } from "@db/rewards";
import usePoints from "@hooks/usePoints";

import MotivationHeader from "@components/DailyRewards/MotivationHeader";
import AnimatedProgressBar from "@components/DailyRewards/AnimatedProgressBar";
import MissionCard from "@components/DailyRewards/MissionCard";
import ActionFooter from "@components/DailyRewards/ActionFooter";
import RewardModal from "@components/DailyRewards/RewardModal";
import CompletionIllustration from "@components/DailyRewards/CompletionIllustration";
import { StatusBar } from "expo-status-bar";

const DailyRewardsScreen: React.FC = () => {
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

	// Constantes pour la configuration
	const TOTAL_TASKS = 3;
	const REWARD_AMOUNT = 3;

	// Count validated tasks (first 3)
	const validatedTasksCount = dailyTasks
		.slice(0, TOTAL_TASKS)
		.filter((task) => task.validated && task.completed).length;

	const handleValidateTask = async (slug: string) => {
		try {
			await validateTask(slug);
			// Vibration de feedback
			Vibration.vibrate(50);
		} catch (error) {
			console.error("Erreur lors de la validation de la tâche:", error);
		}
	};

	const claimReward = async () => {
		if (canClaimReward) {
			try {
				setShowModal(true);
				await claimDailyReward();
				setRewards("rewards", REWARD_AMOUNT);
				addRewardPoints(REWARD_AMOUNT);

				Vibration.vibrate([100, 200, 100]);
			} catch (error) {
				console.error("Erreur lors de la récupération de la récompense:", error);
				setShowModal(false);
			}
		}
	};

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: theme.colors.background }}
		>
			<StatusBar
				backgroundColor={theme.colors.backgroundTertiary}
				translucent={false}
			/>

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: theme.colors.background }}
			>
				{/* Header */}
				<View
					className="relative"
					style={{ backgroundColor: theme.colors.backgroundTertiary }}
				>
					<MotivationHeader rewardClaimed={rewardClaimed} />
				</View>

				{/* Barre de progression  */}
				<View className="px-6 py-4">
					<AnimatedProgressBar
						validatedTasksCount={validatedTasksCount}
						totalTasks={TOTAL_TASKS}
						rewardAmount={REWARD_AMOUNT}
						rewardClaimed={rewardClaimed}
					/>
				</View>

				{/* Liste des missions */}
				{!rewardClaimed && (
					<View className="px-6 pb-4">
						{dailyTasks.slice(0, TOTAL_TASKS).map((task, index) => (
							<View key={task.slug || index} className="mb-4">
								<MissionCard
									mission={task}
									onValidate={handleValidateTask}
									showProgress={task.slug === "complete_habits"}
									progressValue={
										task.slug === "complete_habits"
											? `${Math.min(3, task.completed ? 3 : 0)}/3`
											: undefined
									}
								/>
							</View>
						))}
					</View>
				)}

				<CompletionIllustration rewardClaimed={rewardClaimed} />

				<View style={{ height: 120 }} />
			</ScrollView>

			<View
				className="absolute bottom-0 left-0 right-0"
				style={{
					backgroundColor: theme.colors.background,
					paddingBottom: 34,
					borderTopWidth: 1,
					borderTopColor: theme.colors.border,
				}}
			>
				<ActionFooter
					canClaimReward={canClaimReward}
					onClaimReward={claimReward}
					rewardClaimed={rewardClaimed}
				/>
			</View>

			{/* Modale de récompense */}
			<RewardModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				rewardAmount={REWARD_AMOUNT}
			/>
		</SafeAreaView>
	);
};

export default DailyRewardsScreen;
