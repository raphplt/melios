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

export default function Index() {
	const {

		userHabits,
		loading,
		refreshing,
		imageSource,
		isLoading,
		isDayTime,
		onRefresh,
	} = useIndex();

	if (loading || !userHabits || isLoading) {
		return <LoaderScreen text="Chargement de vos habitudes..." />;
	}

	return (
		<ParallaxScrollView
			habits={userHabits}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
			isDayTime={isDayTime}
			headerImage={
				<Image
					source={imageSource}
					style={{ width: "100%", height: 250, resizeMode: "cover" }}
				/>
			}
		>
			<Background />

			<WelcomeRow />

			<ListHabitsHome />

			<ActivitiesContainer />

			<DailyQuote />
		</ParallaxScrollView>
	);
}
