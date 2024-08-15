import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View } from "react-native";

export default function CardPlaceHolder() {
	const { theme } = useContext(ThemeContext);
	return (
		<View className="w-11/12 flex flex-row items-center justify-center mx-auto my-2">
			<View
				className="w-8 h-8 rounded-xl"
				style={{ backgroundColor: theme.colors.cardBackground }}
			></View>
			<View
				className="w-10/12 h-10 mx-auto rounded-xl ml-2"
				style={{ backgroundColor: theme.colors.cardBackground }}
			></View>
		</View>
	);
}
