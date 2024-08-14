import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

export default function NotificationBox({
	message,
	type,
	onClose,
}: {
	message: string;
	type: "success" | "error" | "info";
	onClose: () => void;
}) {
	const { theme } = useContext(ThemeContext);
	const backgroundColor = {
		success: theme.colors.greenSecondary,
		error: theme.colors.redSecondary,
		info: theme.colors.blueSecondary,
	};

	return (
		<View style={{ backgroundColor: backgroundColor[type] }}>
			<Text>{message}</Text>
			<Pressable onPress={onClose}>
				<Iconify icon="close" size={24} color={theme.colors.textSecondary} />
			</Pressable>
		</View>
	);
}
