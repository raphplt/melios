import React, { useContext } from "react";
import { Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ThemeContext } from "../ThemContext";
import { View } from "react-native";

export default function Graph({ habits }: any) {
	const { theme } = useContext(ThemeContext);

	return (
		<View>
			{habits && Object.keys(habits).length > 0 ? (
				<LineChart
					data={{
						labels: Object.keys(habits).map((name) =>
							name.length > 10 ? `${name.substring(0, 10)}...` : name
						),
						datasets: [
							{
								data: Object.values(habits),
							},
						],
					}}
					width={Dimensions.get("window").width * 0.95}
					height={220}
					yAxisLabel=""
					yAxisSuffix="%"
					yAxisInterval={1}
					chartConfig={{
						backgroundColor: theme.colors.primary,
						backgroundGradientFrom: theme.colors.primary,
						backgroundGradientTo: theme.colors.backgroundTertiary,
						decimalPlaces: 2,
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16,
						},
						propsForDots: {
							r: "6",
							strokeWidth: "2",
							stroke: "#ffa726",
						},
					}}
					bezier
					style={{
						marginVertical: 8,
						borderRadius: 12,
					}}
				/>
			) : (
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
						height: 220,
					}}
				>
					<Text style={{ color: theme.colors.text }}>No data</Text>
				</View>
			)}
		</View>
	);
}
