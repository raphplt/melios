import { DataContext } from "@context/DataContext";
import { useContext } from "react";
import { Text, View } from "react-native";
import { Trophy } from "../../types/trophy";
import { ScrollView } from "react-native";
import { Iconify } from "react-native-iconify";

export default function TrophyRoom() {
	const { trophies } = useContext(DataContext);

	return (
		<ScrollView className="p-4 mb-4">
			{trophies && trophies.length > 0 ? (
				trophies.map((trophy: Trophy) => (
					<View
						key={trophy.id}
						className="flex flex-row items-center justify-between p-2 border-b border-gray-200"
					>
						<Iconify size={24} color="black" icon="mdi:trophy" />

						<Text className="text-lg font-bold">{trophy.name}</Text>
					</View>
				))
			) : (
				<Text className="text-lg font-bold">No trophies available</Text>
			)}
		</ScrollView>
	);
}
