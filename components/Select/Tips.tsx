import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function Tips({
	theme,
	setDeleteAdvice,
}: {
	theme: any;
	setDeleteAdvice: any;
}) {
	return (
		<View
			className="flex flex-row items-center w-11/12 mx-auto rounded-xl py-2 px-3 mt-4"
			style={{
				backgroundColor: "#FFC67C",
				borderColor: theme.colors.border,
				borderWidth: 1,
			}}
		>
			<Ionicons name="bulb" size={24} style={{ color: theme.colors.text }} />
			<Text
				className="text-[15px] w-10/12 mx-auto text-left font-semibold"
				style={{ color: theme.colors.text }}
			>
				Vous pouvez sélectionner jusqu'à 20 habitudes.
			</Text>
			<Pressable
				onPress={() => setDeleteAdvice(true)}
				style={{ position: "absolute", right: 10 }}
			>
				<Ionicons name="close" size={24} style={{ color: theme.colors.text }} />
			</Pressable>
		</View>
	);
}
