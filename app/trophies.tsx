import TrophyRoom from "@components/Trophies/TrophiesRoom";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function Trophies() {
	const { theme } = useContext(ThemeContext);

	return (
		<View>
			<View
				className="w-fit mx-auto p-2 rounded-xl my-1 px-5"
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
					Mes trophées
				</Text>
			</View>
			<TrophyRoom />
		</View>
	);
}
