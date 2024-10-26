import { useTheme } from "@context/ThemeContext";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ButtonBack({ handleQuit }: { handleQuit: () => void }) {
	const { theme } = useTheme();
	return (
		<Pressable onPress={handleQuit} className=" z-10">
			<Iconify icon="ep:back" size={24} color={theme.colors.text} />
		</Pressable>
	);
}
