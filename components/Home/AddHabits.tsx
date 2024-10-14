import { Ionicons } from "@expo/vector-icons";
import useIndex from "@hooks/useIndex";
import { Animated, Pressable } from "react-native";

export default function AddHabits() {
	const { theme, handlePressIn, rotate, navigation, handlePressOut, isDayTime } =
		useIndex();

	return (
		<Animated.View style={{ transform: [{ rotate }] }}>
			<Pressable
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={() => {
					navigation.navigate("(select)");
				}}
				className="rounded-full p-2 w-10 h-10"
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
