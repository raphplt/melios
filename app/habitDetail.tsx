import { useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "../components/ThemContext";
import { Link, router, useLocalSearchParams } from "expo-router";
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
	const isPresented = router.canGoBack();

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				paddingTop: 20,
				flex: 1,
			}}
			className="max-h-[50vh] mx-auto rounded-t-2xl border-2 border-gray-500 overflow-y-auto bottom-0 absolute"
		>
			{isPresented && (
				<Link href={"../"}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginTop: 10,
							marginLeft: 10,
						}}
					>
						<Ionicons name="chevron-back" size={24} color={theme.colors.text} />
						<Text style={{ color: theme.colors.text, fontSize: 16 }}>Retour</Text>
					</View>
				</Link>
			)}

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
					className="text-[16px] my-6 text-center w-10/12 mx-auto"
				>
					“ {habitInfos.description} ”
				</Text>
				<View
					className="flex flex-col items-center justify-between w-11/12 mx-auto my-2 px-12"
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
							marginVertical: 5,
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
							marginVertical: 5,
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
							marginVertical: 5,
						}}
					>
						<AntDesign name="clockcircleo" size={24} color="black" />
						<Text style={{ color: theme.colors.text, fontSize: 16, marginLeft: 5 }}>
							{habitInfos.moment}
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							width: "100%",
							alignItems: "center",
							marginVertical: 5,
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
