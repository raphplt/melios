import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { getRewards } from "../../db/rewards";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import Points from "../../components/Shared/Points";

export default function Recompenses() {
	const { theme } = useContext(ThemeContext);

	const isMounted = useRef(true);

	const [rewards, setRewards]: any = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data: any = await getRewards();
				if (isMounted.current) {
					setRewards(data[0]);
					setLoading(false);
				}
			} catch (error) {
				setLoading(false);
				console.log("Erreur lors de la récupération des récompenses : ", error);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			const data: any = await getRewards();
			if (isMounted.current) {
				setRewards(data[0]);
			}
		} catch (error) {
			console.log("Erreur lors de la récupération des récompenses : ", error);
		} finally {
			setRefreshing(false);
		}
	};

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text style={{ color: theme.colors.text }} className="text-gray-600 mt-8">
					Chargement des récompenses...
				</Text>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	return (
		<>
			<ScrollView
				className="h-[100vh]"
				style={{
					backgroundColor: theme.colors.background,
				}}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View
					className="flex flex-row justify-between items-center my-4 mx-auto rounded-xl text-white py-2 px-3 w-11/12"
					style={{
						backgroundColor: theme.colors.primary,
					}}
				>
					<Text
						className="text-center text-lg"
						style={{
							color: theme.colors.textSecondary,
						}}
					>
						Mes points
					</Text>

					<Points />
				</View>
				<View
					className="w-11/12 mx-auto rounded-lg py-1 "
					style={{
						borderColor: theme.colors.border,
						borderWidth: 1,
						backgroundColor: theme.colors.cardBackground,
					}}
				>
					<Text
						style={{
							color: theme.colors.text,
						}}
						className=" font-semibold mx-4 text-center"
					>
						Les récompenses ne sont pas encore disponibles. Revenez bientôt !
					</Text>
				</View>

				<View
					className="flex flex-col items-center justify-center"
					style={{
						backgroundColor: theme.colors.background,
					}}
				>
					<Image
						source={require("../../assets/images/brands/brand1.png")}
						style={{ alignSelf: "center" }}
						className="my-2"
					/>
					<Image
						source={require("../../assets/images/brands/brand2.png")}
						style={{ alignSelf: "center" }}
						className="my-2"
					/>
					<Image
						source={require("../../assets/images/brands/brand3.png")}
						className="my-2"
						style={{ alignSelf: "center" }}
					/>
				</View>
			</ScrollView>
		</>
	);
}
