import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Iconify } from "react-native-iconify";

export default function NotificationBox() {
	const { theme } = useContext(ThemeContext);
	const { popup } = useData();
	const { isOpen, message, type, closePopup } = popup;

	const backgroundColor: any = {
		success: theme.colors.greenSecondary,
		error: theme.colors.redSecondary,
		info: theme.colors.blueSecondary,
	}; //TODO type

	if (!isOpen) return null;

	return (
		<View className="z-[999] bg-transparent w-screen absolute top-14 pt-2">
			<View
				className="w-[95%] mx-auto flex flex-row justify-between items-center py-5 px-3 rounded-md"
				style={[
					styles.shadow,
					{
						backgroundColor: backgroundColor[type],
					},
				]}
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
						closePopup();
					}}
				>
					<Iconify
						icon="material-symbols:close"
						size={24}
						color={theme.colors.text}
					/>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});
