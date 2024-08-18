import { Ionicons } from "@expo/vector-icons";
import useIndex from "@hooks/useIndex";
import { Animated, Pressable, Text, View } from "react-native";

export default function WelcomeRow() {
	const {
		theme,
		welcomeMessage,
		handlePressIn,
		rotate,
		navigation,
		handlePressOut,
	} = useIndex();

	return (
		<View
			style={{ backgroundColor: "transparent" }}
			className="flex justify-between flex-row items-center mt-4 w-11/12 mx-auto"
		>
			<Text
				style={{
					color: theme.colors.text,

					fontFamily: "BaskervilleBold",
				}}
				className="text-lg"
			>
				{welcomeMessage || "Bienvenue"}
			</Text>
			<Animated.View style={{ transform: [{ rotate }] }}>
				<Pressable
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
					onPress={() => {
						navigation.navigate("select");
					}}
					className="rounded-full p-2 w-10 h-10"
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
