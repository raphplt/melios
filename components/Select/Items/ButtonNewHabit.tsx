import { useTheme } from "@context/ThemeContext";
import { Pressable, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";

export default function ButtonNewHabit() {
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const handlePress = () => {
		navigation.navigate("customHabit");
	};

	return (
		<View className="flex flex-row items-center my-2">
			<View
				className="w-1/3 mx-auto my-4"
				style={{
					backgroundColor: theme.colors.grayPrimary,
					height: 1,
				}}
			/>
			<Pressable
				className="rounded-full w-16 h-16 flex items-center justify-center mx-2"
				style={{
					backgroundColor: theme.colors.backgroundTertiary,
					borderColor: theme.colors.cardBackground,
					borderWidth: 2,
				}}
				onPress={handlePress}
			>
				<Iconify size={24} icon="ic:baseline-plus" color={theme.colors.primary} />
			</Pressable>
			<View
				className="w-1/3 mx-auto my-4"
				style={{
					backgroundColor: theme.colors.grayPrimary,
					height: 1,
				}}
			/>
		</View>
	);
}
