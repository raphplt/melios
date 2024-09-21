import { FlatList, View, Dimensions } from "react-native";
import AddGoal from "./AddGoal";
import { useEffect, useState } from "react";
import { Goal } from "@type/goal";
import CurrentGoal from "./CurrentGoal";
import { getMemberGoal } from "@db/goal";
import { useData } from "@context/DataContext";

export default function GoalSection() {
	const [currentGoals, setCurrentGoals] = useState<Goal[]>([]);

	const { member } = useData();

	useEffect(() => {
		const getGoal = async () => {
			if (!member?.uid) return;
			const goal = await getMemberGoal(member?.uid);
			setCurrentGoals([...goal, { id: "add_goal_button" } as any]);
		};
		getGoal();
	}, []);

	const { width } = Dimensions.get("window");

	return (
		<View className="my-1">
			<FlatList
				data={currentGoals}
				renderItem={({ item }) =>
					item.id === "add_goal_button" ? <AddGoal /> : <CurrentGoal goal={item} />
				}
				keyExtractor={(item) => item.id}
				horizontal={true}
				pagingEnabled={true}
				snapToAlignment="center"
				snapToInterval={width} // Définit l'intervalle de défilement à la largeur de l'écran
				decelerationRate="fast" // Optionnel: rend le défilement plus rapide
				showsHorizontalScrollIndicator={false} // Optionnel: cache l'indicateur de défilement horizontal
			/>
		</View>
	);
}
