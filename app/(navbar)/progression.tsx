import React, { useContext } from "react";
import { ScrollView, RefreshControl, StatusBar } from "react-native";

import Streak from "@components/Progression/Streak";

import { ThemeContext } from "@context/ThemeContext";
import { useProgression } from "@hooks/useProgression";

import Stats from "@components/Progression/Stats";
import CalendarHabits from "@components/Progression/Calendar";
import GoalSection from "@components/Progression/GoalSection";
import { GoalProvider } from "@context/GoalsContext";

const Progression: React.FC = () => {
	const { theme } = useContext(ThemeContext);
	const { refreshing, onRefresh } = useProgression();

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
				<Streak />
				<Stats />
				<GoalSection />

				<CalendarHabits />
			</ScrollView>
		</GoalProvider>
	);
};

export default Progression;
