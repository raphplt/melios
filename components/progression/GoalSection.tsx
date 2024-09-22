import { FlatList, View, Dimensions } from "react-native";
import AddGoal from "./AddGoal";
import { useEffect, useState } from "react";
import { Goal } from "@type/goal";
import CurrentGoal from "./CurrentGoal";
import { getMemberGoals } from "@db/goal";
import { useData } from "@context/DataContext";
import { useGoal } from "@context/GoalsContext";

export default function GoalSection() {
	const { goals, loadingGoals } = useGoal();

	const { width } = Dimensions.get("window");

	const goalWithAddButton = [...goals, { id: "add_goal_button" } as any];

	if (loadingGoals) return <View>Loading...</View>;

	return (
		<View className="my-1">
			<FlatList
				data={goalWithAddButton}
				renderItem={({ item }) =>
					item.id === "add_goal_button" ? <AddGoal /> : <CurrentGoal goal={item} />
				}
				keyExtractor={(item) => item.id}
				horizontal={true}
				pagingEnabled={true}
				snapToAlignment="center"
				snapToInterval={width}
				decelerationRate="fast"
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
}
