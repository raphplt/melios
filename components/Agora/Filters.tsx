import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";

export default function Filters({
	filter,
	setFilter,
	theme,
}: {
	filter: "odyssee" | "rewards";
	setFilter: (filter: "odyssee" | "rewards") => void;
	theme: any;
}) {
	return (
		<View className="mb-4 flex flex-row justify-center">
			<TouchableOpacity
				style={{
					backgroundColor:
						filter === "odyssee" ? theme.colors.primary : theme.colors.background,
					paddingVertical: 10,
					paddingHorizontal: 20,
					borderRadius: 20,
					marginHorizontal: 5,
				}}
				onPress={() => setFilter("odyssee")}
			>
				<Text
					style={{
						color:
							filter === "odyssee" ? theme.colors.textSecondary : theme.colors.text,
					}}
				>
					Points Odyssée
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					backgroundColor:
						filter === "rewards" ? theme.colors.primary : theme.colors.background,
					paddingVertical: 10,
					paddingHorizontal: 20,
					borderRadius: 20,
					marginHorizontal: 5,
				}}
				onPress={() => setFilter("rewards")}
			>
				<Text
					style={{
						color:
							filter === "rewards" ? theme.colors.textSecondary : theme.colors.text,
					}}
				>
					Points Melios
				</Text>
			</TouchableOpacity>
		</View>
	);
}
