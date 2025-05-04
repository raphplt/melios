import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { GoalProvider } from "@context/GoalsContext";
import Levels from "@components/Progressions/Levels";
import CalendarHabits from "@components/Progressions/Calendar";
import ModalTutorial from "@components/Modals/ModalTutoriel";
import Streak from "@components/Progressions/Streak";
import GoalSection from "@components/Progressions/GoalSection";
import Charts from "@components/Progressions/Charts";
import ShareMonthlyRecap from "@components/Progressions/ShareMonthlyRecap";

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
				<View>
					<Streak />
					<ShareMonthlyRecap />
					<GoalSection />
					<Levels />
					<CalendarHabits />
					<Charts />
					<View className="h-20 w-full"></View>
				</View>
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
