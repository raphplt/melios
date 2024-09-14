import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ButtonBack({ handleQuit }: { handleQuit: () => void }) {
	const { theme } = useContext(ThemeContext);
	return (
		<Pressable onPress={handleQuit} className=" p-4 z-10">
			<Iconify icon="ep:back" size={24} color={theme.colors.text} />
		</Pressable>
	);
}
