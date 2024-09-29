import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";

export default function EditButton({ isEditing }: { isEditing: boolean }) {
	const { theme } = useTheme();
	return (
		<>
			{isEditing ? (
				<Iconify
					icon="material-symbols:save"
					color={theme.colors.textTertiary}
					size={24}
				/>
			) : (
				<Iconify
					icon="material-symbols:edit"
					color={theme.colors.textTertiary}
					size={24}
				/>
			)}
		</>
	);
}
