import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";
import { Trophy } from "../../types/trophy";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";

export default function TrophyBox({ trophy }: { trophy: Trophy }) {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			key={trophy.id}
			style={{
				backgroundColor: theme.colors.backgroundSecondary,
			}}
			className="flex flex-col items-center justify-between p-2 rounded-2xl m-2 py-2 px-2 w-20 h-20"
		>
			<Iconify size={24} color={theme.colors.text} icon="mdi:trophy" />

			<Text
				className="font-semibold text-sm text-center text-[11px] leading-3"
				numberOfLines={2}
				ellipsizeMode="tail"
			>
				{trophy.name}
			</Text>
		</View>
	);
}
