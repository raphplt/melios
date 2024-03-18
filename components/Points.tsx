import { useState, useRef, useEffect, useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { getRewards } from "../db/rewards";
import { ThemeContext } from "./ThemContext";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Points() {
	const { theme } = useContext(ThemeContext);

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
				console.error("Erreur lors de la récupération des récompenses : ", error);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	loading && <ActivityIndicator size="large" color="#0000ff" />;

	return (
		<View
			className="flex items-center justify-center flex-row gap-x-2 mr-4"
			style={{}}
		>
			<Text
				style={{
					color: theme.colors.text,
					fontSize: 20,
				}}
			>
				{rewards.points || 0}
			</Text>
			<FontAwesome5 name="coins" size={24} color={theme.colors.text} />
		</View>
	);
}
