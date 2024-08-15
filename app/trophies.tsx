import TrophyRoom from "@components/Trophies/TrophiesRoom";
import { Text, View } from "react-native";

export default function Trophies() {
	return (
		<View>
			<Text className="text-center text-xl mb-3">Mes trophées</Text>
			<TrophyRoom />
		</View>
	);
}
