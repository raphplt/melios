import React from "react";
import { RefreshControl, Image } from "react-native";

// Customs imports
import ParallaxScrollView from "@components/Home/ParallaxScrollView";
import Background from "@components/Svg/Background";
import ActivitiesContainer from "@components/Home/ActivitiesContainer";
import LoaderScreen from "@components/Shared/LoaderScreen";
import WelcomeRow from "@components/Home/WelcomeRow";
import ListHabitsHome from "@components/Home/ListHabitsHome";
import useIndex from "@hooks/useIndex";
import DailyQuote from "@components/Home/DailyQuote";
import { ONE_WEEK_IN_MS } from "@db/category";

export default function Index() {
	const { loading, refreshing, imageSource, isLoading, userHabits, onRefresh } =
		useIndex();

	if (loading || !userHabits || isLoading) {
		return <LoaderScreen text="Chargement de vos habitudes..." />;
	}

	return (
		<ParallaxScrollView
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			headerImage={
				<Image
					source={imageSource}
					style={{ width: "100%", height: 250, resizeMode: "cover" }}
				/>
			}
		>
			<Background />


			<ListHabitsHome />

			<ActivitiesContainer />

			<DailyQuote />
		</ParallaxScrollView>
	);
}
