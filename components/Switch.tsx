import { Switch, View, Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "./ThemContext";

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
					false: theme.colors.inactiveSwitch,
					true: theme.colors.activeSwitch,
				}}
				thumbColor={value ? theme.colors.activeThumb : theme.colors.inactiveThumb}
			/>
		</TouchableOpacity>
	);
}

export default ToggleButton;
