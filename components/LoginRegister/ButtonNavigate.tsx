import ZoomableView from "@components/Shared/ZoomableView";
import { ThemeContext, useTheme } from "@context/ThemeContext";
import { useContext } from "react";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { Iconify } from "react-native-iconify";

interface ButtonNavigateProps {
	text: string;
	text2: string;
	onPress: () => void;
	color?: string;
}

export default function ButtonNavigate({
	text,
	text2,
	onPress,
	color,
}: ButtonNavigateProps) {
	const { theme } = useTheme();
	return (
		<Pressable
			onPress={onPress}
			style={{
				backgroundColor: "transparent",
			}}
			className="w-2/3 mx-auto rounded-3xl flex flex-row items-center justify-center px-2 mt-3"
		>
			<Text
				className="] text-center py-2 mr-2 "
				style={{ color: theme.colors.textTertiary }}
			>
				{text}
			</Text>
			<Text
				className=" text-center py-2 mr-2 font-bold"
				style={{ color: theme.colors.primary }}
			>
				{text2}
			</Text>
			<Iconify icon="tabler:arrow-right" color={color || "white"} size={20} />
		</Pressable>
	);
}
