import React, { useContext } from "react";
import { ScrollView, RefreshControl, StatusBar } from "react-native";

import Streak from "@components/Progression/Streak";
import DailyStats from "@components/Progression/DailyStats";
import HabitsCompleted from "@components/Progression/HabitsCompleted";
import ProgressionGraph from "@components/Progression/ProgressionGraph";
import { ThemeContext } from "@context/ThemeContext";
import { useProgression } from "@hooks/useProgression";
import { DarkTheme } from "../../constants/Theme";
import Stats from "@components/Progression/Stats";
import CalendarHabits from "@components/Progression/Calendar";
import Goal from "@components/Progression/CurrentGoal";
import GoalSection from "@components/Progression/GoalSection";
import { GoalProvider } from "@context/GoalsContext";

const Progression: React.FC = () => {
	const { theme } = useContext(ThemeContext);
	const {
		refreshing,
		onRefresh,
		activeButton,
		setActiveButton,
		todayScoreValue,
		habitCompletionValue,
		comparedToYesterday,
	} = useProgression();

	return (
		<GoalProvider>
			<ScrollView
				style={{
					backgroundColor: theme.colors.background,
					flexGrow: 1,
				}}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				{/* <ProgressionHeader
				activeButton={activeButton}
				handlePress={setActiveButton}
				theme={theme}
				/> */}
				<Streak />
				<Stats />
				<GoalSection />

				<CalendarHabits />

				{/* <ProgressionGraph
				habitLastDaysCompleted={habitCompletionValue}
				activeButton={activeButton}
				theme={theme}
				/>
				{activeButton === "Jour" && (
					<DailyStats
					scoreHabits={todayScoreValue}
					comparedToYesterday={comparedToYesterday}
					theme={theme}
					/>
					)}
					<ScrollView className="flex flex-col mt-2 mb-4">
					<HabitsCompleted
					habitLastDaysCompleted={habitCompletionValue}
					activeButton={activeButton}
					theme={theme}
					/>
					</ScrollView> */}
			</ScrollView>
		</GoalProvider>
	);
};

export default Progression;
