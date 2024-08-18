import { ThemeContext } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useContext } from "react";
import { Pressable, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function TrophiesMinView() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { theme } = useContext(ThemeContext);
	const { isDayTime } = useIndex();

	return (
		<Pressable
			onPress={() => navigation.navigate("trophies")}
			className="flex flex-row items-center justify-center"
		>
			<Iconify icon="mdi:trophy" color={isDayTime ? "black" : "white"} size={20} />
			<Text
				className="font-bold ml-1"
				style={{
					color: isDayTime ? "black" : "white",
				}}
			>
				Voir mes trophées
			</Text>
		</Pressable>
	);
}
