import { View, Text } from "react-native";
import Flamme from "@components/Svg/Flamme";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getTodayHabits } from "@utils/habitsUtils";
// import { getTodayHabits } from "@utils/habitsUtils";

export default function Streak() {
	const { streak, completedHabitsToday, habits } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();
	const todayHabits = getTodayHabits(habits);

	const completionPercentage = Math.round(
		(completedHabitsToday.length / todayHabits.length) * 100
	);

	return (
		<View
			className="w-full mx-auto flex flex-row items-center justify-between px-6 pt-2 py-5 rounded-b-3xl"
			style={{
				backgroundColor: theme.colors.backgroundTertiary,
				elevation: 3,
			}}
		>
			<View className="ml-2">
				<Text
					className="text-3xl font-semibold mb-2"
					style={{ color: theme.colors.primary }}
				>
					{t("streak")}
				</Text>
				<View className="mt-2">
					<Text
						className="text-8xl font-bold"
						style={{ color: theme.colors.primary }}
					>
						{streak?.value ?? "0"}
					</Text>
					<Text
						className="text-lg font-semibold"
						style={{ color: theme.colors.primary }}
					>
						{t("days_in_a_row")}
					</Text>
				</View>
			</View>
			<View className="flex flex-col items-center">
				<Flamme color={theme.colors.redPrimary} width={80} height={96} />
				<Text
					style={{
						color: theme.colors.primary,
					}}
					className="text-2xl font-semibold mt-1"
				>
					{completionPercentage} %
				</Text>
				<Text
					style={{
						color: theme.colors.primary,
					}}
					className="font-semibold text-sm"
				>
					{t("completed")}
				</Text>
			</View>
		</View>
	);
}
