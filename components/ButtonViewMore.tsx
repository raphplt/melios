import { useContext } from "react";
import { Pressable, Text } from "react-native";
import { ThemeContext } from "./ThemeContext";

export default function ButtonViewMore({ onPress, text }: any) {
	const { theme } = useContext(ThemeContext);
	return (
		<Pressable
			className="rounded-2xl p-1 mt-2 px-6 mx-auto w-10/12"
			style={{
				borderColor: theme.colors.primary,
				borderWidth: 1,
				backgroundColor: theme.colors.cardBackground,
			}}
			onPress={onPress}
		>
			<Text
				style={{
					color: theme.colors.primary,
				}}
				className="font-semibold text-center"
			>
				{text}
			</Text>
		</Pressable>
	);
}
