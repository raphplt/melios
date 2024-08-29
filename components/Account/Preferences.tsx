import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import AccountBlock from "./AccountBlock";
import { View, Text } from "react-native";

export default function Preferences() {
	const { theme } = useContext(ThemeContext);

	return (
		<AccountBlock title="Préférences">
			<View>
				<Text style={{ color: theme.colors.text }} className="text-[16px]">
					cc
				</Text>
			</View>
		</AccountBlock>
	);
}
