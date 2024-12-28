import DeleteAccount from "@components/Account/DeleteAccount";
import EditAccount from "@components/Account/EditAccount";
import { View } from "react-native";

export default function EditProfil() {
	return (
		<View>
			<EditAccount />
			<DeleteAccount />
		</View>
	);
}
