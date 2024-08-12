import { Ionicons } from "@expo/vector-icons";
import { Animated, Pressable, Text, View } from "react-native";

export default function WelcomeRow({
	theme,
	navigation,
	welcomeMessage,
	rotation,
	rotate,
	handlePressIn,
	handlePressOut,
}: {
	//TODO: types
	theme: any;
	navigation: any;
	welcomeMessage: string;
	rotation: any;
	rotate: any;
	handlePressIn: any;
	handlePressOut: any;
}) {
	return (
		<View
			style={{ backgroundColor: "transparent" }}
			className="flex justify-between flex-row items-center mt-4 w-11/12 mx-auto"
		>
			<Text style={{ color: theme.colors.text }} className="text-xl font-bold">
				{welcomeMessage}
			</Text>
			<Animated.View style={{ transform: [{ rotate }] }}>
				<Pressable
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
					onPress={() => {
						navigation.navigate("select");
					}}
					className="rounded-full p-2"
					style={{
						backgroundColor: theme.colors.primary,
					}}
				>
					<Ionicons name="add" size={24} color="white" />
				</Pressable>
			</Animated.View>
		</View>
	);
}
