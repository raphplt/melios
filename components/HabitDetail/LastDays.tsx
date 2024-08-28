import moment from "moment";
import { Text, View, ScrollView } from "react-native";
import { Iconify } from "react-native-iconify";
import { useEffect, useState } from "react";
import { DayStatus } from "../../app/habitDetail";
import HeaderContainer from "@components/Progression/HeaderContainer";

export default function LastDays({ theme, habit }: { theme: any; habit: any }) {
	const [lastDays, setLastDays] = useState<DayStatus[]>([]);

	useEffect(() => {
		if (typeof habit === "string" && habit) {
			try {
				const parsedHabit = JSON.parse(habit);
				const lastDaySnapshot: DayStatus[] = [];
				for (let i = 14; i >= 1; i--) {
					const day = moment().subtract(i, "days").format("YYYY-MM-DD");
					const log = parsedHabit?.logs?.find((log: any) => log.date === day);
					lastDaySnapshot.push({
						date: day,
						done: log ? log.done : false,
					});
				}
				setLastDays(lastDaySnapshot.reverse());
			} catch (error) {
				console.error("Failed to parse habit:", error);
			}
		}
	}, [habit]);

	return (
		<>
			<View className="w-11/12 mx-auto mt-6">
				<HeaderContainer>
					<Iconify
						icon="ph:calendar-check-fill"
						size={20}
						color={theme.colors.text}
					/>
					<Text
						style={{ color: theme.colors.text }}
						className="text-[16px] font-semibold "
					>
						Complétion des derniers jours
					</Text>
				</HeaderContainer>
			</View>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
				className="w-11/12 mx-auto mt-2"
			>
				{lastDays &&
					lastDays.map((day: DayStatus, index) => (
						<View
							key={index}
							style={{
								backgroundColor: day.done
									? theme.colors.greenSecondary
									: theme.colors.cardBackground,
							}}
							className="px-3 py-2 rounded-lg flex flex-col items-center mx-1 my-1"
						>
							{day.done ? (
								<Iconify size={24} color={"black"} icon="mdi:check" />
							) : (
								<Iconify size={24} color={"black"} icon="mdi:close" />
							)}
							<Text style={{ color: "black" }}>
								{moment(day.date, "YYYY-MM-DD").format("DD/MM")}
							</Text>
						</View>
					))}
			</ScrollView>
		</>
	);
}
