import { View } from "react-native";
import { Pressable, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function LogoutButton({
	handleLogout,
	theme,
}: {
	handleLogout: () => void;
	theme: any;
}) {
	return (
		<Pressable
			onPress={handleLogout}
			style={{
				borderColor: theme.colors.redPrimary,
			}}
			className="mb-4 border mx-auto w-11/12 rounded-2xl py-2 bg-red-50  flex items-center justify-center flex-row"
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
