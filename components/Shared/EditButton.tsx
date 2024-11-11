import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";

export default function EditButton({ isEditing }: { isEditing: boolean }) {
	const { theme } = useTheme();
	return (
		<>
			{isEditing ? (
				<Iconify icon="material-symbols:save" color={theme.colors.text} size={24} />
			) : (
				<Iconify icon="fe:edit" color={theme.colors.text} size={24} />
			)}
		</>
	);
}
