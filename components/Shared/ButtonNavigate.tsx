import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { Iconify } from "react-native-iconify";

interface ButtonNavigateProps {
	text: string;
	onPress: () => void;
}

export default function ButtonNavigate({ text, onPress }: ButtonNavigateProps) {
	const { theme } = useContext(ThemeContext);

	return (
		<Pressable
			onPress={onPress}
			style={{
				backgroundColor: "transparent",
			}}
			className="w-2/3 mx-auto rounded-3xl fixed bottom-0 flex flex-row items-center justify-center px-2"
		>
			<Text
				className="text-[15px] text-center py-2 mr-2 font-semibold"
				style={{ color: "rgb(8, 32, 159)" }}
			>
				{text}
			</Text>
			<Iconify icon="tabler:arrow-right" color="rgb(8, 32, 159)" size={20} />
		</Pressable>
	);
}
