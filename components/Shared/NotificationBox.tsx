import { ThemeContext } from "@context/ThemeContext";
import usePopup from "@hooks/usePopup";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

export default function NotificationBox({
	message,
	type,
}: {
	message: string;
	type: "success" | "error" | "info";
}) {
	const { theme } = useContext(ThemeContext);
	const { isOpen, openPopup, closePopup } = usePopup();

	const backgroundColor = {
		success: theme.colors.greenSecondary,
		error: theme.colors.redSecondary,
		info: theme.colors.blueSecondary,
	};

	if (!isOpen) return null;

	return (
		<View
			style={{ backgroundColor: backgroundColor[type] }}
			className="z-[999] w-full absolute top-20  px-4 py-2 rounded-md flex flex-row justify-between items-center"
		>
			<Text
				style={{
					color: theme.colors.text,
				}}
			>
				{message}
			</Text>
			<Pressable
				onPress={() => {
					close();
				}}
			>
				<Iconify
					icon="material-symbols:close"
					size={24}
					color={theme.colors.text}
				/>
			</Pressable>
		</View>
	);
}