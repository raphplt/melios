import React from "react";
import { RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";

import ParallaxScrollView from "@components/Home/ParallaxScrollView";
import LoaderScreen from "@components/Shared/LoaderScreen";
import useIndex from "@hooks/useIndex";
import DailyQuote from "@components/Home/DailyQuote";
import HabitsSection from "@components/Home/HabitsSection";
import ActivitiesContainer from "@components/Home/ActivitiesContainer";
import ViewHelp from "@components/Home/ViewHelp";
import ModalTutorial from "@components/Modals/ModalTutoriel";
import NextLevelHandler from "@components/Progression/NextLevelHandler";

export default function Index() {
	const { loading, refreshing, isLoading, userHabits, onRefresh } = useIndex();
	const { t } = useTranslation();

	if (loading || !userHabits || isLoading) {
		return <LoaderScreen text={t("loading")} />;
	}
	return (
		<ParallaxScrollView
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<HabitsSection />
			<ActivitiesContainer />
			<ViewHelp />
			<DailyQuote />

			<NextLevelHandler />
			<ModalTutorial
				title="Comment utiliser la page Accueil"
				paragraphs={[
					"1. Consultez vos habitudes positives et négatives dans les routines.",
					"2. Cliquez sur une habitude pour la valider ou la lancer avec un timer.",
					"3. Ajoutez de nouvelles habitudes en cliquant sur le bouton +.",
				]}
				imagePath="images/illustrations/character3.png"
				slug="index"
			/>
		</ParallaxScrollView>
	);
}
