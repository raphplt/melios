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
			className="mx-auto w-[95%] mt-4 py-4 px-10 rounded-xl flex flex-col items-center justify-center gap-4"
		>
			<Iconify
				icon="gravity-ui:seal-check"
				size={40}
				color={theme.colors.primary}
			/>
			<Text
				className="text-center text-[15px] font-semibold"
				style={{
					color: theme.colors.primary,
				}}
			>
				{t("habit_already_completed")}
			</Text>
		</View>
	);
}
