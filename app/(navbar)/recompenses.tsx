import { ActivityIndicator, RefreshControl } from "react-native";
import { Text, View } from "../../components/Themed";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { getRewards } from "../../db/rewards";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import Points from "../../components/Points";

export default function TabTwoScreen() {
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
				console.error("Erreur lors de la récupération des récompenses : ", error);
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
			console.error("Erreur lors de la récupération des récompenses : ", error);
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
				<Text style={{ color: theme.colors.text }} className="text-lg mt-8">
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
					className="flex flex-row justify-between my-4 rounded-xl text-white py-3 px-3 w-11/12 mx-auto"
					style={{
						backgroundColor: theme.colors.primary,
					}}
				>
					<Text
						className="text-center text-xl"
						style={{
							color: theme.colors.text,
						}}
					>
						Mes points :
					</Text>
					<Text
						className="text-center text-xl "
						style={{
							color: theme.colors.text,
						}}
					>
						<Points />
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
				{/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
			</ScrollView>
		</>
	);
}
