import moment from "moment";
import { Text, View } from "react-native";
import { DayStatus } from "../../app/habitDetail";
import { Iconify } from "react-native-iconify";
export default function LastDays({
	lastDays,
	theme,
}: {
	lastDays: DayStatus[];
	theme: any;
}) {
	return (
		<View className=" mx-auto mt-5 flex flex-row justify-center items-center">
			{lastDays &&
				lastDays.map((day: DayStatus, index) => (
					<View
						key={index}
						style={{
							backgroundColor: day.done
								? theme.colors.greenSecondary
								: theme.colors.redSecondary,
							borderColor: day.done
								? theme.colors.greenPrimary
								: theme.colors.redPrimary,
						}}
						className="px-2 border rounded-lg flex flex-col items-center mx-1"
					>
						{day.done ? (
							<Iconify size={28} color={theme.colors.text} icon="mdi:check" />
						) : (
							<Iconify size={28} color={theme.colors.text} icon="mdi:close" />
						)}
						<Text style={{ color: theme.colors.text }}>
							{moment(day.date, "YYYY-MM-DD").format("DD")}
						</Text>
					</View>
				))}
		</View>
	);
}
