import React, { useContext, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Text,
	View,
	Modal,
	Button,
	StyleSheet,
	TouchableOpacity,
	Pressable,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ThemeContext } from "../../context/ThemeContext";
import * as ScreenOrientation from "expo-screen-orientation";

export default function Graph({ habits, period }: any) {
	const { theme } = useContext(ThemeContext);
	const [modalVisible, setModalVisible] = useState(false);
	const [key, setKey] = useState(0); // Ajout d'une clé pour forcer la mise à jour

	const getMaxDays = () => {
		switch (period) {
			case "Jour":
				return 1;
			case "Semaine":
				return 7;
			case "Mois":
				return 30;
			case "Année":
				return 365;
			default:
				return 7;
		}
	};

	const maxDays = getMaxDays();

	const adjustedData = Object.values(habits).map((value: any) => {
		return (value / maxDays) * 100;
	});

	const renderChart = (width: number, height: number) => (
		<LineChart
			key={key} // Utilisation de la clé pour forcer la mise à jour
			data={{
				labels: Object.keys(habits).map((name) =>
					name.length > 10 ? `${name.substring(0, 6)}..` : name
				),
				datasets: [
					{
						data: adjustedData,
					},
				],
			}}
			width={width}
			height={height}
			yAxisLabel=""
			yAxisSuffix="%"
			verticalLabelRotation={20}
			yAxisInterval={1}
			chartConfig={{
				backgroundColor: theme.colors.primary,
				backgroundGradientFrom: theme.colors.primary,
				backgroundGradientTo: theme.colors.backgroundTertiary,
				decimalPlaces: 2,
				color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
				labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
				style: {
					borderRadius: 12,
				},
				propsForDots: {
					r: "5",
					strokeWidth: "2",
					stroke: "#ffa726",
				},
			}}
			bezier
			style={{
				marginVertical: 8,
				borderRadius: 10,
			}}
		/>
	);

	const handleOpenModal = async () => {
		await ScreenOrientation.lockAsync(
			ScreenOrientation.OrientationLock.LANDSCAPE
		);
		setModalVisible(true);
	};

	const handleCloseModal = async () => {
		await ScreenOrientation.lockAsync(
			ScreenOrientation.OrientationLock.PORTRAIT_UP
		);
		setModalVisible(false);
		setKey((prevKey) => prevKey + 1); // Changer la clé pour forcer la mise à jour
	};

	return (
		<View>
			{habits && Object.keys(habits).length > 0 ? (
				<>
					<TouchableOpacity onPress={handleOpenModal}>
						{renderChart(Dimensions.get("window").width * 0.9, 250)}
					</TouchableOpacity>
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={handleCloseModal}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Pressable
									onPress={handleCloseModal}
									className=" absolute top-20 right-20 z-40 bg-white p-2 rounded-xl"
								>
									<Text style={{ color: theme.colors.primary }}>Fermer</Text>
								</Pressable>
								{renderChart(
									Dimensions.get("window").height,
									Dimensions.get("window").width * 0.9
								)}
							</View>
						</View>
					</Modal>
				</>
			) : (
				<View
					style={{ alignItems: "center", justifyContent: "center", height: 220 }}
				>
					<ActivityIndicator size="large" color={theme.colors.primary} />
					<Text style={{ color: theme.colors.text }}>Chargement du graphique</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
});
