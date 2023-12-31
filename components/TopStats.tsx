import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./ThemContext";
import { View, Text } from "./Themed";
import moment from "moment";
import { Image } from "react-native";
import { Link } from "expo-router";

export default function TopStats({ habits }: any) {
	const { theme } = useContext(ThemeContext);
	const [scoreHabits, setScoreHabits] = useState(0);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [lastDaysCompleted, setLastDaysCompleted] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		let score = 0;
		if (habits && habits.length === 0) return setScoreHabits(0);
		habits.forEach((habit: any) => {
			if (habit.logs) {
				const lastLog = habit.logs[habit.logs.length - 1];

				if (lastLog && lastLog.date === date && lastLog.done === true) {
					score += 1;
				}
			}
		});

		if (habits.length) setScoreHabits(Math.floor((score / habits.length) * 100));
	}, [habits, date]);

	useEffect(() => {
		let lastDaysCompleted = 0;
		if (habits.length === 0) return setLastDaysCompleted(0);
		const days = 7;

		for (let i = 0; i < days; i++) {
			const date = moment().subtract(i, "days").format("YYYY-MM-DD");

			let score = 0;
			habits.forEach((habit: any) => {
				if (habit.logs) {
					const lastLog = habit.logs[habit.logs.length - 1];

					if (lastLog && lastLog.date === date && lastLog.done === true) {
						score += 1;
					}
				}
			});

			if (score === habits.length) {
				lastDaysCompleted += 1;
			}
		}

		setLastDaysCompleted(lastDaysCompleted);
	}, [habits, date]);

	return (
		<View
			style={{ backgroundColor: theme.colors.backgroundSecondary }}
			className="pb-3 pt-14 flex items-center justify-around flex-row rounded-b-xl"
		>
			<View
				style={{ backgroundColor: theme.colors.backgroundSecondary }}
				className="flex items-center justify-center flex-col"
			>
				<Image
					source={require("../assets/images/icons/flamme.png")}
					style={{ width: 50, height: 50, resizeMode: "contain" }}
				/>
				<Text style={{ color: theme.colors.text }} className="text-xl mt-1">
					{scoreHabits} %
				</Text>
			</View>

			<View
				style={{ backgroundColor: theme.colors.backgroundSecondary }}
				className="w-2/3 flex flex-col gap-2"
			>
				<Text style={{ color: theme.colors.text }} className="text-xl">
					{lastDaysCompleted} jours d'affilés
				</Text>
				<View className="flex bg-white flex-row justify-evenly py-2 rounded-xl">
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
