import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import { Button, Text, View } from "react-native";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ButtonBack() {
	const { theme } = useContext(ThemeContext);
	const [menuVisible, setMenuVisible] = useState(false);

	return (
		<>
			<Pressable
				onPress={() => setMenuVisible(!menuVisible)}
				className="absolute top-2 right-2 p-2 z-10"
			>
				<Iconify
					icon="material-symbols:settings"
					size={24}
					color={theme.colors.text}
				/>
			</Pressable>
			{menuVisible && (
				<View className="absolute top-12 right-2 bg-white rounded-md p-2 shadow-lg">
					<Pressable
						className="p-2 rounded-md bg-gray-100"
						onPress={() => {
							/* Action pour éditer */
						}}
					>
						<Text style={{ color: theme.colors.text }}>Éditer</Text>
					</Pressable>
					<Pressable
						className="p-2 rounded-md bg-gray-100"
						onPress={() => {
							/* Action pour supprimer */
						}}
					>
						<Text style={{ color: theme.colors.text }}>Supprimer</Text>
					</Pressable>
				</View>
			)}
		</>
	);
}
