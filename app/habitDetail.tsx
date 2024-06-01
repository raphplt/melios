import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, Animated, Pressable } from "react-native";
import { ThemeContext } from "../components/ThemContext";
import { Link, useLocalSearchParams, router } from "expo-router";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Easing } from "react-native-reanimated";
import moment from "moment";
import Checkbox from "expo-checkbox";

export default function HabitDetail() {
	const { theme } = useContext(ThemeContext);
	const [difficulty, setDifficulty] = useState("");
	const translateY = useRef(new Animated.Value(1000)).current;
	const [lastDays, setLastDays] = useState([]);

	const params = useLocalSearchParams();
	const isPresented = router.canGoBack();
	let { habit = "", habitInfos = "" }: any = params;

	if (typeof habitInfos === "string") {
		try {
			habitInfos = JSON.parse(habitInfos);
		} catch (error) {
			console.error("Failed to parse habitInfos:", error);
		}
	}

	useEffect(() => {
		Animated.timing(translateY, {
			toValue: 0,
			duration: 300,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start();

		if (habitInfos) {
			if (habitInfos.difficulty === 1) {
				setDifficulty("Facile");
			}
			if (habitInfos.difficulty === 2) {
				setDifficulty("Moyen");
			}
			if (habitInfos.difficulty >= 3) {
				setDifficulty("Difficile");
			}
		}
	}, [habitInfos]);

	useEffect(() => {
		if (typeof habit === "string") {
			try {
				habit = JSON.parse(habit);
			} catch (error) {
				console.error("Failed to parse habit:", error);
			}
		}

		const last7Days: any = [];
		for (let i = 7; i >= 1; i--) {
			const day = moment().subtract(i, "days").format("YYYY-MM-DD");
			const log = habit.logs.find((log: any) => log.date === day);
			last7Days.push({
				date: day,
				done: log ? log.done : false,
			});
		}
		setLastDays(last7Days);
	}, [habit]);

	const handleBack = () => {
		Animated.timing(translateY, {
			toValue: 1000,
			duration: 300,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start(() => {
			router.back();
		});
	};

	function hexToRgb(hex: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null;
	}

	const rgb = hexToRgb(habitInfos.color);
	const rgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)` : "#FFFFFF";

	return (
		<Animated.ScrollView
			style={{
				backgroundColor: theme.colors.cardBackground,
				paddingTop: 20,
				flex: 1,
				transform: [{ translateY }],
			}}
			className="h-[95vh] mx-auto rounded-t-2xl border-2 border-gray-500 overflow-y-auto bottom-0 absolute"
		>
			{isPresented && (
				<Pressable
					className="flex flex-row items-center justify-center gap-2 py-3 px-4"
					onPress={handleBack}
				>
					<AntDesign name="arrowdown" size={24} color="black" />
				</Pressable>
			)}

			<View className="flex flex-col items-center justify-center mt-12">
				<Text
					style={{
						color: habitInfos.black,
						backgroundColor: rgba,
						borderColor: habitInfos.color,
						borderWidth: 1,
					}}
					className="text-lg py-2 px-6 rounded-lg w-10/12 mx-auto text-center font-semibold"
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
					className="flex flex-col items-center justify-between w-11/12 mx-auto my-5 py-2 px-12 rounded-lg"
					style={{
						backgroundColor: theme.colors.background,
						borderColor: habitInfos.color,
						borderWidth: 1,
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
							height: 1,
							width: "100%",
							backgroundColor: "#000",
							marginVertical: 5,
						}}
					/>
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
							height: 1,
							width: "100%",
							backgroundColor: "#000",
							marginVertical: 5,
						}}
					/>
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
							à {habitInfos.moment} heure
						</Text>
					</View>
					<View
						style={{
							height: 1,
							width: "100%",
							backgroundColor: "#000",
							marginVertical: 5,
						}}
					/>
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
							{difficulty}
						</Text>
					</View>
				</View>

				<Text
					style={{ color: theme.colors.text }}
					className="text-[16px] mt-6 text-center w-10/12 mx-auto font-semibold"
				>
					Derniers jours
				</Text>
				<View className="w-11/12 mx-auto mt-5 flex flex-row justify-center items-center">
					{lastDays &&
						lastDays.map((day: any, index) => (
							<View
								key={index}
								className="flex flex-col items-center justify-center mx-2"
							>
								<Checkbox
									value={day.done}
									disabled={true}
									className="w-8 h-8 mb-1"
									color={day.done ? habitInfos.color : theme.colors.text}
								/>
								<Text style={{ color: theme.colors.text }}>
									{moment(day.date, "YYYY-MM-DD").format("DD")}
								</Text>
							</View>
						))}
				</View>
			</View>
		</Animated.ScrollView>
	);
}
