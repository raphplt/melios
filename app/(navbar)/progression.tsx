import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { ScrollView, RefreshControl } from "react-native";
import ProgressionHeader from "../../components/Progression/ProgressionHeader";
import ProgressionGraph from "../../components/Progression/ProgressionGraph";
import DailyStats from "../../components/Progression/DailyStats";
import HabitsCompleted from "../../components/Progression/HabitsCompleted";
import { useProgression } from "../../hooks/useProgression";

const Progression: React.FC = () => {
	const { theme } = useContext(ThemeContext);
	const {
		habits,
		refreshing,
		onRefresh,
		activeButton,
		setActiveButton,
		scoreHabits,
		habitLastDaysCompleted,
		comparedToYesterday,
	} = useProgression();

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background }}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			className="w-[95vw] mx-auto"
		>
			<ProgressionHeader
				activeButton={activeButton}
				handlePress={setActiveButton}
				theme={theme}
			/>
			<ProgressionGraph
				habitLastDaysCompleted={habitLastDaysCompleted}
				activeButton={activeButton}
				theme={theme}
			/>
			{activeButton === "Jour" && (
				<DailyStats
					scoreHabits={scoreHabits}
					comparedToYesterday={comparedToYesterday}
					theme={theme}
				/>
			)}
			<ScrollView className="flex flex-col mt-2 mb-4">
				<HabitsCompleted
					habits={habits}
					habitLastDaysCompleted={habitLastDaysCompleted}
					activeButton={activeButton}
					theme={theme}
				/>
			</ScrollView>
		</ScrollView>
	);
};

export default Progression;
