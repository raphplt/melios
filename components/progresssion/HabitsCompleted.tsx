import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function HabitsCompleted({
	habits,
	habitLastDaysCompleted,
	activeButton,
	theme,
}: any) {
	const [dateLength, setDateLength] = useState(1);

	useEffect(() => {
		if (activeButton === "Jour") {
			setDateLength(1);
		}
		if (activeButton === "Semaine") {
			setDateLength(7);
		}
		if (activeButton === "Mois") {
			setDateLength(30);
		}
		if (activeButton === "Année") {
			setDateLength(365);
		}
	}, [activeButton]);

	return (
		<View>
			{habits
				.sort((a: any, b: any) => {
					const aCompletion = habitLastDaysCompleted[a.name] || 0;
					const bCompletion = habitLastDaysCompleted[b.name] || 0;
					return bCompletion - aCompletion;
				})
				.map((habit: any, index: number) => {
					return (
						<View
							key={index}
							className="flex flex-row items-center justify-between px-5 my-2 py-3 mx-auto w-11/12 rounded-xl"
							style={{
								backgroundColor:
									habitLastDaysCompleted[habit.name] >= dateLength ? "green" : "red",
							}}
						>
							<Text style={{ color: theme.colors.text }}>{habit.name}</Text>
							<Text style={{ color: theme.colors.text }}>
								{habitLastDaysCompleted[habit.name]} /{" "}
								{activeButton === "Jour"
									? 1
									: activeButton === "Semaine"
									? 7
									: activeButton === "Mois"
									? 30
									: 365}
							</Text>
						</View>
					);
				})}
		</View>
	);
}
