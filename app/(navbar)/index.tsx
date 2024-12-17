import React from "react";
import { RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";

import ParallaxScrollView from "@components/Home/ParallaxScrollView";
import Background from "@components/Svg/Background";
import LoaderScreen from "@components/Shared/LoaderScreen";
import useIndex from "@hooks/useIndex";
import DailyQuote from "@components/Home/DailyQuote";
import HabitsSection from "@components/Home/HabitsSection";
import ActivitiesContainer from "@components/Home/ActivitiesContainer";
import ViewHelp from "@components/Home/ViewHelp";

export default function Index() {
	const { loading, refreshing, isLoading, userHabits, onRefresh } = useIndex();
	const { t } = useTranslation();

	// console.log(
	// 	"loading",
	// 	loading,
	// 	"userHabits",
	// 	userHabits,
	// 	"isLoading",
	// 	isLoading
	// );

	if (loading || !userHabits || isLoading) {
		return <LoaderScreen text={t("loading")} />;
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
		</ParallaxScrollView>
	);
}
