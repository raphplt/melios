import React from "react";
import { ScrollView, Text, View } from "react-native";
import Streak from "@components/Progression/Streak";
import { useTheme } from "@context/ThemeContext";
import GoalSection from "@components/Progression/GoalSection";
import { GoalProvider } from "@context/GoalsContext";
import Chart from "@components/Progression/Chart";
import Levels from "@components/Progression/Levels";
import CalendarHabits from "@components/Progression/Calendar";
import ModalTutorial from "@components/Modals/ModalTutoriel";

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
				<View className="h-20 w-full absolute top-0 bg-green-500">
					<Text> </Text>
				</View>
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

			<ModalTutorial
				title="Comment utiliser la page Progression"
				paragraphs={[
					"1. Consultez votre série, qui correspond au nombre de jours consécutifs où au moins une habitude est complétée.",
					"2. Explorez vos objectifs pour voir les habitudes à compléter plusieurs jours consécutifs pour gagner des récompenses.",
					"3. Découvrez vos niveaux dans quatre catégories (Croissance et Apprentissage, Santé Globale, Vie Sociale et Relations, Gestion Financière et Responsabilité).",
					"4. Analysez vos statistiques et consultez votre calendrier pour voir votre progression quotidienne.",
				]}
				imagePath="images/illustrations/character2.png"
				slug="progression"
			/>
		</GoalProvider>
	);
};

export default Progression;
