import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";

export default function Version() {
	const { theme } = useTheme();
	const { t } = useTranslation();

	return (
		<View
			className="w-full mx-auto pt-5 pb-10 my-4"
			style={{ backgroundColor: theme.colors.background }}
		>
			<Text className=" text-center text-sm" style={{ color: theme.colors.text }}>
				Melios v1.1.28 - © 2025 Melios. {t("all_rights_reserved")}
			</Text>
		</View>
	);
}
