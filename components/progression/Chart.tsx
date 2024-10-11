import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import useChart from "@hooks/useChart";
import { Dimensions, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

export default function Chart() {
	const { theme } = useTheme();

	const { parsedTime, todayScore, todayTime, timePerDay, weeklyStreak } =
		useChart();

	const data = {
		labels: [`Temps passé`, "Complétion"],
		data: [parsedTime, todayScore],
	};
	const screenWidth = Dimensions.get("window").width;

	console.log("weeklyStreak", weeklyStreak);

	return (
		<View className="py-10 mx-auto ">
			<ProgressChart
				data={data}
				width={screenWidth * 0.95}
				height={220}
				strokeWidth={16}
				radius={32}
				style={{
					borderRadius: 16,
				}}
				chartConfig={{
					backgroundColor: theme.colors.background,
					backgroundGradientFrom: theme.colors.primary,

					backgroundGradientTo: theme.colors.backgroundTertiary,
					decimalPlaces: 2, // optional, defaults to 2dp
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					labelColor: (opacity = 1) => theme.colors.text,
					style: {
						borderRadius: 16,
					},
					propsForDots: {
						r: "6",
						strokeWidth: "2",
						stroke: "#ffa726",
					},
				}}
				hideLegend={false}
			/>
		</View>
	);
}
