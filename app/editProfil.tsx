import DeleteAccount from "@components/Account/DeleteAccount";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function EditProfil() {
	const { theme } = useContext(ThemeContext);

	return (
		<View>
			<Text
				className="text-center text-lg"
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
			>
				Infos du profil
			</Text>

			<DeleteAccount />
		</View>
	);
}
