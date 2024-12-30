import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

export default function HabitDone() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	return (
		<View
			style={{
				backgroundColor: theme.colors.backgroundTertiary,
				shadowColor: theme.colors.text,
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.25,
				shadowRadius: 3.84,
				elevation: 5,
			}}
			className="mx-auto w-11/12 py-6 px-10 rounded-xl flex flex-col items-center justify-center"
		>
			<Iconify
				icon="gravity-ui:seal-check"
				size={48}
				color={theme.colors.primary}
			/>
			<Text
				className="text-center text-[16px] font-semibold py-2"
				style={{
					color: theme.colors.primary,
				}}
			>
				{t("habit_already_completed")}
			</Text>
		</View>
	);
}
