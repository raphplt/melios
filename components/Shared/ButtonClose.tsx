import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ButtonClose({ color }: { color?: string }) {
	const { theme } = useTheme();

	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const handleQuit = () => {
		navigation.goBack();
	};

	return (
		<Pressable onPress={handleQuit} className="p-4 z-10 relative block">
			<Iconify
				icon="material-symbols:close"
				size={28}
				color={color ?? theme.colors.text}
			/>
		</Pressable>
	);
}
