import DeleteAccount from "@components/Account/DeleteAccount";
import EditAccount from "@components/Account/EditAccount";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function EditProfil() {
	const { theme } = useContext(ThemeContext);

	return (
		<View>
			<EditAccount />

			<DeleteAccount />
		</View>
	);
}
