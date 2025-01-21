import { Ionicons } from "@expo/vector-icons";
import useIndex from "@hooks/useIndex";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Animated, Pressable } from "react-native";

export default function AddHabits() {
	const { theme, handlePressIn, rotate, handlePressOut, isDayTime } = useIndex();

	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<Animated.View style={{ transform: [{ rotate }] }}>
			<Pressable
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={() => {
					navigation.navigate("(select)");
				}}
				className="rounded-full p-2 "
				style={{
					backgroundColor: isDayTime
						? theme.colors.primary
						: theme.colors.background,
				}}
			>
				<Ionicons
					name="add"
					size={24}
					color={isDayTime ? "white" : theme.colors.primary}
				/>
			</Pressable>
		</Animated.View>
	);
}
