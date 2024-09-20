import Flamme from "@components/Svg/Flamme";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function Streak() {
	const { streak } = useData();
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="w-full mx-auto flex flex-row items-center justify-between px-3 pt-4"
			style={{
				backgroundColor: theme.colors.backgroundTertiary,
			}}
		>
			<View>
				<Text
					className="text-4xl font-semibold mb-2"
					style={{ color: theme.colors.primary }}
				>
					Série
				</Text>
				<View className="ml-4 mt-3">
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
