import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./ThemContext";
import { View, Text } from "./Themed";
import { Image } from "react-native";
import moment from "moment";

export default function TopStats({ habits }: any) {
	const { theme } = useContext(ThemeContext);
	const [scoreHabits, setScoreHabits] = useState<any>(0);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		// setScoreHabits(0);
		for (const habit of habits) {
			if (habit.logs) {
				if (
					habit.logs[habit.logs.length - 1] &&
					habit.logs[habit.logs.length - 1].date === date &&
					habit.logs[habit.logs.length - 1].done === true
				) {
					setScoreHabits((scoreHabits: any) => scoreHabits + 1);
				}
			}
		}

		setScoreHabits(
			(scoreHabits: any) => Math.floor(scoreHabits / habits.length) * 10
		);
	}, []);

	return (
		<View
			style={{ backgroundColor: theme.colors.backgroundSecondary }}
			className="pb-3 pt-2 flex items-center justify-around flex-row rounded-b-xl"
		>
			<View
				style={{ backgroundColor: theme.colors.backgroundSecondary }}
				className="flex items-center flex-col"
			>
				<Image
					source={require("../assets/images/icons/flamme.png")}
					style={{ width: 50, height: 50, resizeMode: "contain" }}
				/>
				<Text style={{ color: theme.colors.text }} className="text-xl mt-1">
					{scoreHabits} / {habits.length}
				</Text>
			</View>

			<View
				style={{ backgroundColor: theme.colors.backgroundSecondary }}
				className="w-2/3 flex flex-col gap-2"
			>
				<Text style={{ color: theme.colors.text }} className="text-xl">
					5 jours d'affilés
				</Text>
				{/* <Text style={{ color: theme.colors.text }} className="text-lg">
					{habits.length} habitudes
				</Text> */}
				<View className="flex flex-row gap-4 bg-slate-100 rounded-lg w-fit items-center justify-center">
					<Image
						source={require("../assets/images/icons/trophy.png")}
						style={{ width: 25, height: 25 }}
					/>
					<Image
						source={require("../assets/images/icons/trophy.png")}
						style={{ width: 25, height: 25 }}
					/>
					<Image
						source={require("../assets/images/icons/trophy.png")}
						style={{ width: 25, height: 25 }}
					/>
					<Image
						source={require("../assets/images/icons/trophy.png")}
						style={{ width: 25, height: 25 }}
					/>
				</View>
			</View>
		</View>
	);
}
