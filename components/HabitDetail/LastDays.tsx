import Checkbox from "expo-checkbox";
import moment from "moment";
import { Text, View } from "react-native";
import { DayStatus } from "../../app/habitDetail";
import { Habit } from "../../types/habit";
import { Iconify } from "react-native-iconify";

export default function LastDays({
	lastDays,
	theme,
	habitParsed,
}: {
	lastDays: DayStatus[];
	theme: any;
	habitParsed: Habit;
}) {
	return (
		<View className="w-11/12 mx-auto mt-5 flex flex-row justify-center items-center">
			{lastDays &&
				lastDays.map((day: DayStatus, index) => (
					<View
						key={index}
						className="flex flex-col items-center justify-center mx-2"
					>
						{day.done ? (
							<Iconify size={32} color={theme.colors.text} icon="mdi:check" />
						) : (
							<Iconify size={32} color={theme.colors.text} icon="mdi:close" />
						)}
						<Text style={{ color: theme.colors.text }}>
							{moment(day.date, "YYYY-MM-DD").format("DD")}
						</Text>
					</View>
				))}
		</View>
	);
}
