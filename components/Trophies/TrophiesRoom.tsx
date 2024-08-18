import { DataContext } from "@context/DataContext";
import { useContext } from "react";
import { Text, View } from "react-native";
import { Trophy } from "../../types/trophy";
import { ScrollView } from "react-native";
import { ThemeContext } from "@context/ThemeContext";
import TrophyBox from "./Trophy";

export default function TrophyRoom() {
	const { trophies } = useContext(DataContext);
	const { theme } = useContext(ThemeContext);

	return (
		<>
			<ScrollView
				className="py-3 h-fit w-full mx-auto"
				showsVerticalScrollIndicator={false}
			>
				<View className="flex flex-row flex-wrap items-start justify-center mx-auto mb-5">
					{trophies && trophies.length > 0 ? (
						trophies.map((trophy: Trophy) => (
							<TrophyBox key={trophy.id} trophy={trophy} />
						))
					) : (
						<Text className="text-lg font-bold">Pas de trophées disponible</Text>
					)}
				</View>
			</ScrollView>
		</>
	);
}
