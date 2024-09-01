import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { Iconify } from "react-native-iconify";

interface ButtonNavigateProps {
	text: string;
	onPress: () => void;
	color?: string;
}

export default function ButtonNavigate({
	text,
	onPress,
	color,
}: ButtonNavigateProps) {
	const { theme } = useContext(ThemeContext);

	return (
		<Pressable
			onPress={onPress}
			style={{
				backgroundColor: "transparent",
			}}
			className="w-2/3 mx-auto rounded-3xl flex flex-row items-center justify-center px-2 mt-3"
		>
			<Text
				className="text-[15px] text-center py-2 mr-2 font-semibold"
				style={{ color: color ?? "white" }}
			>
				{text}
			</Text>
			<Iconify icon="tabler:arrow-right" color={color || "white"} size={20} />
		</Pressable>
	);
}
