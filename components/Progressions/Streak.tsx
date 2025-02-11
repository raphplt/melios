import { View, Text } from "react-native";
import Flamme from "@components/Svg/Flamme";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function Streak() {
	const { streak } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();

	return (
		<View
			className="w-full mx-auto flex flex-row items-center justify-between px-5 pt-2 py-5 rounded-b-3xl"
			style={{
				backgroundColor: theme.colors.backgroundTertiary,
			}}
		>
			<View className="ml-2">
				<Text
					className="text-3xl font-semibold mb-2"
					style={{ color: theme.colors.primary }}
				>
					{t("streak")}
				</Text>
				<View className="mt-2">
					<Text
						className="text-8xl font-bold"
						style={{ color: theme.colors.primary }}
					>
						{streak?.value ?? "0"}
					</Text>
					<Text
						className="text-lg font-semibold"
						style={{ color: theme.colors.primary }}
					>
						{t("days_in_a_row")}
					</Text>
				</View>
			</View>
			<Flamme color={theme.colors.redPrimary} width={100} height={120} />
		</View>
	);
}
