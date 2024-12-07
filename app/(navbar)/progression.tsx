import React, { useEffect, useState } from "react";
import { ScrollView, View, Image } from "react-native";
import Streak from "@components/Progression/Streak";
import { useTheme } from "@context/ThemeContext";

import CalendarHabits from "@components/Progression/Calendar";
import GoalSection from "@components/Progression/GoalSection";
import { GoalProvider } from "@context/GoalsContext";
import Chart from "@components/Progression/Chart";
import Levels from "@components/Progression/Levels";
import { getImageURL } from "@db/image";

const Progression: React.FC = () => {
	const { theme } = useTheme();
	const [imageURL, setImageURL] = useState<string | null>(null);

	useEffect(() => {
		const fetchImageURL = async () => {
			try {
				const url = await getImageURL("images/pack_sleep.jpg");
				setImageURL(url);
			} catch (error) {
				console.error("Failed to fetch image URL:", error);
			}
		};

		fetchImageURL();
	}, []);

	return (
		<GoalProvider>
			<ScrollView
				style={{
					backgroundColor: theme.colors.background,
					flexGrow: 1,
				}}
				showsVerticalScrollIndicator={false}
			>
				{imageURL && (
					<Image source={{ uri: imageURL }} style={{ width: 100, height: 100 }} />
				)}
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
