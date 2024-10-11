import { View, Text } from "react-native";
import Flamme from "@components/Svg/Flamme";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { calculateStreak } from "@utils/progressionUtils";

export default function Streak() {
	const { logs } = useData();
	const { theme } = useTheme();

	const streak = calculateStreak(logs);

	return (
		<View
			className="w-full mx-auto flex flex-row items-center justify-between px-5 pt-2 py-5 rounded-b-3xl"
			style={{
				backgroundColor: theme.colors.backgroundTertiary,
			}}
		>
			<View className="ml-2">
				<Text
					className="text-3xl font-semibold mb-2"
					style={{ color: theme.colors.primary }}
				>
					Série
				</Text>
				<View className="mt-2">
					<Text
						className="text-8xl font-bold"
						style={{ color: theme.colors.primary }}
					>
						{streak}
					</Text>
					<Text
						className="text-lg font-semibold"
						style={{ color: theme.colors.primary }}
					>
						jours de suite
					</Text>
				</View>
			</View>
			<Flamme color={theme.colors.redPrimary} width={100} height={120} />
		</View>
	);
}
