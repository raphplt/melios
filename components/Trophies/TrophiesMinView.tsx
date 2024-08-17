import { ThemeContext } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { isDayTime } from "@utils/timeUtils";
import { useNavigation } from "expo-router";
import { useContext } from "react";
import { Pressable, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function TrophiesMinView() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { theme } = useContext(ThemeContext);

	return (
		<Pressable
			onPress={() => navigation.navigate("trophies")}
			className="flex flex-row items-center justify-center"
		>
			<Iconify icon="mdi:trophy" color={theme.colors.text} size={20} />
			<Text
				className="font-bold ml-1"
				style={{
					color: theme.colors.text,
				}}
			>
				Voir mes trophées
			</Text>
		</Pressable>
	);
}
