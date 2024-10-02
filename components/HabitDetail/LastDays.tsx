import moment from "moment";
import { Text, View, ScrollView } from "react-native";
import { Iconify } from "react-native-iconify";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "@context/ThemeContext";
import { UserHabit } from "@type/userHabit";
import { DayStatus } from "../../app/habitDetail";
import { getHabitLogs } from "@db/logs";

export default function LastDays({ habit }: { habit: UserHabit }) {
	const { theme } = useContext(ThemeContext);
	const [lastDays, setLastDays] = useState<DayStatus[]>([]);

	useEffect(() => {
		const fetchHabitLogs = async () => {
			try {
				const logs = await getHabitLogs(habit.id);
				const lastDaySnapshot: DayStatus[] = [];
				for (let i = 14; i >= 1; i--) {
					const day = moment().subtract(i, "days").format("YYYY-MM-DD");
					const done = logs ? logs.includes(day) : false;
					lastDaySnapshot.push({
						date: day,
						done,
					});
				}
				setLastDays(lastDaySnapshot.reverse());
			} catch (error) {
				console.error("Erreur lors de la récupération des logs :", error);
			}
		};

		fetchHabitLogs();
	}, [habit.id]);

	return (
		<>
			<View className="w-11/12 mx-auto ">
				<View className="flex flex-row items-center justify-start w-11/12 gap-1 pt-4 pb-2">
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
				</View>
			</View>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
				className="w-11/12 mx-auto mt-2 mb-6"
			>
				{lastDays &&
					lastDays.map((day: DayStatus, index) => (
						<View
							key={index}
							style={{
								backgroundColor: day.done
									? theme.colors.greenPrimary
									: theme.colors.backgroundSecondary,
							}}
							className="px-3 py-2 rounded-lg flex flex-col items-center mx-1 my-1"
						>
							{day.done ? (
								<Iconify size={24} color={"#f1F1F1"} icon="mdi:check" />
							) : (
								<Iconify size={24} color={theme.colors.text} icon="mdi:close" />
							)}
							<Text
								style={{ color: day.done ? "#f1F1F1" : theme.colors.text }}
								className="font-semibold mt-1"
							>
								{moment(day.date, "YYYY-MM-DD").format("DD/MM")}
							</Text>
						</View>
					))}
			</ScrollView>
		</>
	);
}
