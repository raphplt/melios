import { useContext } from "react";
import { Pressable, Text } from "react-native";
import { ThemeContext } from "../ThemeContext";

export default function SetTime({ text, handlePress, activeButton }: any) {
	const { theme } = useContext(ThemeContext);
	return (
		<Pressable
			onPress={() => handlePress(text)}
			className="px-5 py-2 m-2 rounded-xl"
			style={{
				backgroundColor:
					activeButton === text
						? theme.colors.primary
						: theme.colors.backgroundSecondary,
			}}
		>
			<Text
				style={{
					color:
						activeButton === text ? theme.colors.textSecondary : theme.colors.text,
				}}
			>
				{text}
			</Text>
		</Pressable>
	);
}
