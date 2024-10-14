import { Switch, TouchableOpacity } from "react-native";
import { useTheme } from "@context/ThemeContext";

function ToggleButton({ onToggle, value }: { onToggle: any; value: boolean }) {
	const { theme } = useTheme();

	return (
		<TouchableOpacity
			onPress={onToggle}
			className="h-6 flex items-center justify-center"
		>
			<Switch
				className=""
				value={value}
				onValueChange={onToggle}
				trackColor={{
					false: theme.colors.grayPrimary,
					true: theme.colors.primary,
				}}
				thumbColor={value ? theme.colors.textSecondary : theme.colors.primary}
			/>
		</TouchableOpacity>
	);
}

export default ToggleButton;
