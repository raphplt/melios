import { useTheme } from "@context/ThemeContext";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ButtonBack({
	color,
	handleQuit,
}: {
	color?: string;
	handleQuit: () => void;
}) {
	const { theme } = useTheme();
	return (
		<Pressable onPress={handleQuit} className=" z-10">
			<Iconify icon="ep:back" size={24} color={color ?? theme.colors.text} />
		</Pressable>
	);
}
