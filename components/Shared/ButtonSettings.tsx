import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ButtonSettings({ onPress }: { onPress: () => void }) {
	const { theme } = useContext(ThemeContext);
	return (
		<Pressable onPress={onPress}>
			<Iconify
				icon="clarity:settings-solid"
				size={24}
				color={theme.colors.textTertiary}
			/>
		</Pressable>
	);
}
