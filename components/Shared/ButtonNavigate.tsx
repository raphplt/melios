import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Pressable } from "react-native";
import { Text } from "react-native";

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
				backgroundColor: theme.colors.backgroundTertiary,
			}}
			className="w-1/2 mx-auto rounded-3xl fixed bottom-0"
		>
			<Text className="text-[15px] font-semibold text-white text-center py-2">
				{text}
			</Text>
		</Pressable>
	);
}
