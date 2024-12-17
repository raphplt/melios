import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";

export default function LoaderScreen({ text }: { text?: string }) {
	const { theme } = useTheme();
	const { t } = useTranslation();

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: theme.colors.background,
			}}
		>
			<ActivityIndicator size="large" color={theme.colors.primary} />
			<Text style={{ color: theme.colors.textTertiary }} className="mt-8">
				{text || t("loading")}
			</Text>
		</View>
	);
}
