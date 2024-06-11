import { Switch, Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function ToggleButton({ title, onToggle, value }: any) {
	const { theme } = useContext(ThemeContext);

	return (
		<TouchableOpacity
			onPress={onToggle}
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				padding: 10,
			}}
		>
			<Text style={{ color: theme.colors.text }}>{title}</Text>
			<Switch
				value={value}
				onValueChange={onToggle}
				trackColor={{
					false: theme.colors.textSecondary,
					true: theme.colors.primary,
				}}
				thumbColor={value ? theme.colors.textSecondary : theme.colors.primary}
			/>
		</TouchableOpacity>
	);
}

export default ToggleButton;
