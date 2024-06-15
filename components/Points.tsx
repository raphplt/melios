import { useState, useRef, useEffect, useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { getRewards } from "../db/rewards";
import { ThemeContext } from "./ThemeContext";
import Coin from "./Svg/Coin";
import { DataContext, useData } from "../constants/DataContext";

export default function Points() {
	const { theme } = useContext(ThemeContext);
	const { points, setPoints } = useData();

	const [rewards, setRewards]: any = useState([]);
	const [loading, setLoading] = useState(true);
	const isMounted = useRef(true);

	useEffect(() => {
		(async () => {
			try {
				if (isMounted.current) {
					const data: any = await getRewards();
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

	loading && <ActivityIndicator size="large" color="#0000ff" />;

	return (
		<View
			className="flex items-center justify-center flex-row mr-4 py-1 px-4 rounded-full"
			style={{
				backgroundColor: theme.colors.primary,
			}}
		>
			<Text
				style={{
					color: "#DBBB16",
					fontSize: 20,
				}}
				className="font-bold mr-3"
			>
				{points}
			</Text>
			<Coin />
		</View>
	);
}
