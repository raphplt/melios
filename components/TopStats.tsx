import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "./ThemContext";
import { View, Text } from "./Themed";
import moment from "moment";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRewards } from "../db/rewards";
import Points from "./Points";

export default function TopStats({ habits }: any) {
	const { theme } = useContext(ThemeContext);
	const [scoreHabits, setScoreHabits] = useState(0);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [lastDaysCompleted, setLastDaysCompleted] = useState(0);
	const [rewards, setRewards]: any = useState([]);
	const [loading, setLoading] = useState(true);
	const isMounted = useRef(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const data: any = await getRewards();
				if (isMounted.current) {
					setRewards(data[0]);
					setLoading(false);
				}
			} catch (error) {
				setLoading(false);
				console.error("Erreur lors de la récupération des récompenses : ", error);
			}
		})();

		return () => {
			isMounted.current = false;
		};
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
			style={{ backgroundColor: theme.colors.backgroundTertiary }}
			className="flex items-center justify-around flex-row mt-3 w-[95%] py-3 mx-auto rounded-xl"
		>
			<View
				style={{ backgroundColor: theme.colors.backgroundTertiary }}
				className="flex items-center justify-center flex-col"
			>
				<Image
					source={require("../assets/images/icons/flamme.png")}
					style={{ width: 50, height: 50, resizeMode: "contain" }}
				/>
				<Text
					style={{ color: theme.colors.textSecondary }}
					className="text-xl mt-1"
				>
					{scoreHabits} %
				</Text>
			</View>

			<View
				style={{ backgroundColor: theme.colors.backgroundTertiary }}
				className="w-2/3 flex flex-col gap-2"
			>
				<View
					style={{ backgroundColor: theme.colors.backgroundTertiary }}
					className="flex items-center flex-row justify-between"
				>
					<Text style={{ color: theme.colors.textSecondary }} className="text-lg">
						{lastDaysCompleted} jours d'affilés
					</Text>
					<Points />
				</View>

				<View
					className="flex  flex-row justify-evenly py-2 rounded-xl"
					style={{ backgroundColor: theme.colors.background }}
				>
					<Ionicons name="trophy-sharp" size={24} color={theme.colors.text} />
					<Ionicons name="trophy-sharp" size={24} color={theme.colors.text} />
					<Ionicons name="trophy-sharp" size={24} color={theme.colors.text} />
					<Ionicons name="trophy-sharp" size={24} color={theme.colors.text} />
				</View>
			</View>
		</View>
	);
}
