import { useTheme } from "@context/ThemeContext";
import useChart from "@hooks/useChart";
import { Dimensions, View, Text } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import SectionHeader from "./SectionHeader";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ChartLabel = ({
	color,
	text,
	percentage,
}: {
	color: string;
	text: string;
	percentage: number;
}) => (
	<View className="flex flex-row items-center my-2">
		<Text style={{ color: "#000", fontSize: 14 }}>
			{text}: {Math.round(percentage * 100)}%
		</Text>
		<View
			style={{
				backgroundColor: color,
			}}
			className="w-3 h-3 rounded-full ml-2"
		/>
	</View>
);

export default function Chart() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [showChart, setShowChart] = useState(true);

	const { parsedTime, todayScore, regularity } = useChart();

	const data = {
		data: [parsedTime, todayScore, regularity],
	};
	const screenWidth = Dimensions.get("window").width;

	const colors = [
		theme.colors.bluePrimary,
		theme.colors.greenPrimary,
		theme.colors.orangePrimary,
	];

	// Check if all data values are zero
	const isDataEmpty = data.data.every((value) => value === 0);

	if (isDataEmpty) {
		return (
			<SectionHeader
				title={t("statistics")}
				show={showChart}
				setShow={setShowChart}
				icon="graph"
			>
				<View
					className=" py-3 mx-auto w-11/12 my-3 rounded-xl"
					style={{
						backgroundColor: theme.colors.cardBackground,
					}}
				>
					<Text style={{ textAlign: "center", color: "#000" }}>{t("no_data")}</Text>
				</View>
			</SectionHeader>
		);
	}

	return (
		<SectionHeader
			title="Statistiques"
			show={showChart}
			setShow={setShowChart}
			icon="graph"
		>
			<View
				className=" py-3 mx-auto w-11/12 my-3 rounded-xl"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
			>
				<View style={{ flexDirection: "row", justifyContent: "center" }}>
					<ProgressChart
						data={data}
						width={screenWidth * 0.5}
						height={220}
						strokeWidth={16}
						radius={32}
						style={{
							borderRadius: 16,
						}}
						chartConfig={{
							backgroundColor: theme.colors.cardBackground,
							backgroundGradientFrom: theme.colors.cardBackground,
							backgroundGradientTo: theme.colors.cardBackground,
							color: (opacity = 1, index: any) => {
								const colors = [
									`rgba(68, 139, 173, ${opacity})`,
									`rgba(71, 168, 108, ${opacity})`,
									`rgba(255, 165, 0, ${opacity})`,
								];
								return colors[index % colors.length];
							},
							labelColor: (opacity = 1) => `rgba(8, 32, 159, ${opacity})`,
							propsForLabels: {
								fontSize: 12,
								fontWeight: "bold",
							},
						}}
						hideLegend={true}
					/>
					<View className=" flex flex-col justify-center items-end">
						<ChartLabel
							color={colors[0]}
							text="Temps passé"
							percentage={parsedTime}
						/>
						<ChartLabel color={colors[1]} text="Complétion" percentage={todayScore} />
						<ChartLabel color={colors[2]} text="Régularité" percentage={regularity} />
					</View>
				</View>
			</View>
		</SectionHeader>
	);
}
