import { FlatList, View, Dimensions } from "react-native";
import AddGoal from "./AddGoal";
import CurrentGoal from "./CurrentGoal";
import { useGoal } from "@context/GoalsContext";

export default function GoalSection() {
	const { goals } = useGoal();

	const { width } = Dimensions.get("screen");

	const goalWithAddButton = [...goals, { id: "add_goal_button" } as any];

	return (
		<View className="mt-1">
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
