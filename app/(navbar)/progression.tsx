import React from "react";
import { ScrollView, View } from "react-native";
import Streak from "@components/Progression/Streak";
import { useTheme } from "@context/ThemeContext";

import CalendarHabits from "@components/Progression/Calendar";
import GoalSection from "@components/Progression/GoalSection";
import { GoalProvider } from "@context/GoalsContext";
import Chart from "@components/Progression/Chart";
import Levels from "@components/Progression/Levels";

const Progression: React.FC = () => {
	const { theme } = useTheme();

	return (
		<GoalProvider>
			<ScrollView
				style={{
					backgroundColor: theme.colors.background,
					flexGrow: 1,
				}}
				showsVerticalScrollIndicator={false}
			>
				<Streak />
				<GoalSection />

				<Levels />
				<CalendarHabits />

				<Chart />
				<View
					className="h-20 w-full"
					style={{ backgroundColor: theme.colors.cardBackground }}
				></View>
			</ScrollView>
		</GoalProvider>
	);
};

export default Progression;
