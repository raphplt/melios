import useIndex from "@hooks/useIndex";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Animated, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function AddHabits() {
	const { theme, handlePressIn, rotate, handlePressOut } = useIndex();

	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<Animated.View style={{ transform: [{ rotate }] }}>
			<Pressable
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={() => {
					navigation.navigate("(select)");
				}}
				className="rounded-full p-2"
				style={{
					backgroundColor: theme.colors.primary,
				}}
			>
				<Iconify
					icon="ic:round-plus"
					size={24}
					color={theme.colors.textSecondary}
				/>
			</Pressable>
		</Animated.View>
	);
}
