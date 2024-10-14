import { useTheme } from "@context/ThemeContext";
import { Animated, Pressable, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useSelect } from "@context/SelectContext";
import useIndex from "@hooks/useIndex";

export default function ButtonNewHabit() {
	const { setCustomHabit } = useSelect();
	const { rotate, handlePressIn, handlePressOut } = useIndex();
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const handlePress = () => {
		setCustomHabit(true);
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
			<Animated.View style={{ transform: [{ rotate }] }}>
				<Pressable
					className="rounded-full w-16 h-16 flex items-center justify-center mx-2"
					style={{
						backgroundColor: theme.colors.backgroundTertiary,
						borderColor: theme.colors.cardBackground,
						borderWidth: 2,
					}}
					onPress={handlePress}
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
				>
					<Iconify size={24} icon="ic:baseline-plus" color={theme.colors.primary} />
				</Pressable>
			</Animated.View>
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
