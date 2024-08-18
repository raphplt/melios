import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import HeaderContainer from "./HeaderContainer";
import { Iconify } from "react-native-iconify";
import { UserHabit } from "../../types/userHabit";
import CardHabitCompleted from "./CardHabitCompleted";
import { useTabBarPadding } from "@hooks/useTabBar";

export default function HabitsCompleted({
	habits,
	habitLastDaysCompleted,
	activeButton,
	theme,
}: any) {
	const [dateLength, setDateLength] = useState(1);
	const paddingBottom = useTabBarPadding();

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
			style={{
				backgroundColor: theme.colors.background,
				alignItems: "center",
				paddingBottom: paddingBottom,
			}}
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
				.sort((a: UserHabit, b: UserHabit) => {
					const aCompletion = habitLastDaysCompleted[a.name] || 0;
					const bCompletion = habitLastDaysCompleted[b.name] || 0;
					return bCompletion - aCompletion;
				})
				.map((habit: UserHabit, index: number) => {
					return (
						<CardHabitCompleted
							key={index}
							habit={habit}
							habitLastDaysCompleted={habitLastDaysCompleted}
							activeButton={activeButton}
							dateLength={dateLength}
							index={index}
							theme={theme}
						/>
					);
				})}
		</View>
	);
}
