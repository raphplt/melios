import { DataContext } from "@context/DataContext";
import { useContext } from "react";
import { Text, View } from "react-native";
import { Trophy } from "../../types/trophy";
import { ScrollView } from "react-native";
import { Iconify } from "react-native-iconify";
import { ThemeContext } from "@context/ThemeContext";
import TrophyBox from "./Trophy";

export default function TrophyRoom() {
	const { trophies } = useContext(DataContext);
	const { theme } = useContext(ThemeContext);

	return (
		<ScrollView className="p-4 mb-4 min-h-screen">
			<View className="flex flex-row flex-wrap items-start mx-auto w-11/12 justify-center">
				{trophies && trophies.length > 0 ? (
					trophies.map((trophy: Trophy) => (
						<TrophyBox key={trophy.id} trophy={trophy} />
					))
				) : (
					<Text className="text-lg font-bold">Pas de trophées disponible</Text>
				)}
			</View>
		</ScrollView>
	);
}
