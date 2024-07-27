import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeaderContainer from "./HeaderContainer";
import { Iconify } from "react-native-iconify";

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
		<View
			style={{ backgroundColor: theme.colors.background, alignItems: "center" }}
		>
			<HeaderContainer>
				<Iconify
					icon="material-symbols:checklist"
					size={20}
					color={theme.colors.text}
				/>
				<Text
					className="text-[16px] font-semibold"
					style={{ color: theme.colors.text }}
				>
					Complétion des habitudes
				</Text>
			</HeaderContainer>

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
							className="drop-shadow-md flex flex-row items-center justify-between px-5 my-2 py-2 mx-auto w-11/12 rounded-xl"
							style={{
								borderColor:
									habitLastDaysCompleted[habit.name] >= dateLength
										? theme.colors.primary
										: theme.colors.border,
								borderWidth: 1,
								backgroundColor:
									habitLastDaysCompleted[habit.name] >= dateLength
										? "rgba(8, 32, 159, 0.1)"
										: theme.colors.cardBackground,
							}}
						>
							{activeButton !== "Jour" && (
								<View
									className=" absolute top-0 bottom-0 rounded-l-xl left-0 opacity-40"
									style={{
										width: `${(habitLastDaysCompleted[habit.name] / dateLength) * 100}%`,
										backgroundColor: theme.colors.primary,
									}}
								/>
							)}
							<Text
								style={{
									color: theme.colors.text,
								}}
							>
								{habit.name}
							</Text>
							<View>
								{activeButton === "Jour" ? (
									habitLastDaysCompleted[habit.name] ? (
										<Ionicons name="checkmark" size={24} color={theme.colors.text} />
									) : (
										<Ionicons name="close" size={24} color={theme.colors.text} />
									)
								) : (
									<Text
										style={{
											color: theme.colors.text,
										}}
									>
										{habitLastDaysCompleted[habit.name]} /{" "}
										{activeButton === "Semaine" ? 7 : activeButton === "Mois" ? 30 : 365}
									</Text>
								)}
							</View>
						</View>
					);
				})}
		</View>
	);
}
