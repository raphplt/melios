import { Ionicons } from "@expo/vector-icons";
import useIndex from "@hooks/useIndex";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Animated, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

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
				className="rounded-full p-[6px]"
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.primary,
					borderWidth: 2,
				}}
			>
				<Iconify icon="ic:round-plus" size={24} color={theme.colors.primary} />
			</Pressable>
		</Animated.View>
	);
}
