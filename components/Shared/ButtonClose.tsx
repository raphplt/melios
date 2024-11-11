import { ThemeContext } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useContext } from "react";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ButtonClose() {
	const { theme } = useContext(ThemeContext);

	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const handleQuit = () => {
		navigation.goBack();
	};

	return (
		<Pressable onPress={handleQuit} className="p-4">
			<Iconify icon="material-symbols:close" size={28} color={theme.colors.text} />
		</Pressable>
	);
}
