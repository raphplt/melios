import { Pressable, Text } from "react-native";
import { View } from "../Themed";
import { Iconify } from "react-native-iconify";

export default function LogoutButton({ handleLogout, theme }) {
	return (
		<Pressable
			onPress={handleLogout}
			style={{
				borderColor: theme.colors.redPrimary,
			}}
			className="border mx-auto px-5 rounded-lg py-2 bg-red-50 flex items-center justify-center flex-row"
		>
			<View className="mx-2 bg-transparent">
				<Iconify icon="mdi:logout" size={20} color={theme.colors.redPrimary} />
			</View>
			<Text
				className="text-center mx-2 text-white"
				style={{ color: theme.colors.redPrimary }}
			>
				Déconnexion
			</Text>
		</Pressable>
	);
}
