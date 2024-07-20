import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export const HabitCard = ({ statistic, text, theme }: any) => {
	return (
		<View
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderColor: theme.colors.primary,
			}}
			className="flex items-center justify-center w-36 h-36 border rounded-lg "
		>
			<View className="absolute top-2 left-2">
				{text == "vs hier" ? (
					<Iconify
						icon="material-symbols:percent"
						size={24}
						color={theme.colors.primary}
					/>
				) : (
					<Iconify
						icon="carbon:checkmark-outline"
						size={24}
						color={theme.colors.primary}
					/>
				)}
			</View>
			<Text className="text-3xl mt-1" style={{ color: theme.colors.primary }}>
				{text == "vs hier" && (statistic > 0 ? "+" : "-")}
				{statistic} %
			</Text>
			<Text style={{ color: theme.colors.primary }}>{text}</Text>
		</View>
	);
};
