import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable, Text } from "react-native";

export default function TrophiesMinView() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<Pressable onPress={() => navigation.navigate("trophies")}>
			<Text className="font-bold">Voir mes trophées</Text>
		</Pressable>
	);
}
