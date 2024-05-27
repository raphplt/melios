import { useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "../components/ThemContext";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function HabitDetail() {
	const { theme } = useContext(ThemeContext);

	const params = useLocalSearchParams();
	let { habit = "", habitInfos = "" }: any = params;

	if (typeof habitInfos === "string") {
		try {
			habitInfos = JSON.parse(habitInfos);
		} catch (error) {
			console.error("Failed to parse habitInfos:", error);
		}
	}

	if (habitInfos) {
		console.log(
			"habitInfos",
			JSON.stringify(habitInfos, null, 2),
			typeof habitInfos
		);
	}

	return (
		<ScrollView>
			<View className="flex flex-col items-center justify-center mt-12">
				<Text
					style={{
						color: habitInfos.color,
						backgroundColor: theme.colors.backgroundSecondary,
						borderColor: habitInfos.color,
						borderWidth: 2,
					}}
					className="text-2xl py-2 px-6 rounded-2xl"
				>
					{habitInfos.name}
				</Text>

				<Text
					style={{ color: theme.colors.text }}
					className="text-[16px] my-10 text-center w-10/12 mx-auto"
				>
					“ {habitInfos.description} ”
				</Text>
				<View
					className="flex flex-col items-center justify-between w-11/12 mx-auto my-5 px-12"
					style={{
						backgroundColor: theme.colors.backgroundSecondary,
						borderColor: theme.colors.border,
						borderWidth: 1,
						borderRadius: 10,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							width: "100%",
							alignItems: "center",
							marginVertical: 15,
						}}
					>
						<Ionicons name="time" size={24} color="black" />
						<Text style={{ color: theme.colors.text, fontSize: 16, marginLeft: 5 }}>
							{habitInfos.duration} minutes
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							width: "100%",
							alignItems: "center",
							marginVertical: 15,
						}}
					>
						<MaterialIcons name="category" size={24} color="black" />
						<Text style={{ color: theme.colors.text, fontSize: 16, marginLeft: 5 }}>
							{habitInfos.category}
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							width: "100%",
							alignItems: "center",
							marginVertical: 15,
						}}
					>
						<AntDesign name="linechart" size={24} color="black" />
						<Text style={{ color: theme.colors.text, fontSize: 16, marginLeft: 5 }}>
							{habitInfos.difficulty}
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
