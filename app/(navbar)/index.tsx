import React from "react";
import { RefreshControl, Image, Button } from "react-native";

// Customs imports
import ParallaxScrollView from "@components/Home/ParallaxScrollView";
import Background from "@components/Svg/Background";
import LoaderScreen from "@components/Shared/LoaderScreen";
import useIndex from "@hooks/useIndex";
import DailyQuote from "@components/Home/DailyQuote";
import HabitsSection from "@components/Home/HabitsSection";
import ActivitiesContainer from "@components/Home/ActivitiesContainer";
import ViewHelp from "@components/Home/ViewHelp";
import NextLevel from "@components/Modals/NextLevel";

export default function Index() {
	const { loading, refreshing, isLoading, userHabits, onRefresh } = useIndex();

	if (loading || !userHabits || isLoading) {
		return <LoaderScreen text="Chargement de vos habitudes..." />;
	}

	return (
		<ParallaxScrollView
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}

		>
			<Background />

			<HabitsSection />

			<ActivitiesContainer />
			<ViewHelp />

			<DailyQuote />
			<NextLevel />
		</ParallaxScrollView>
	);
}
