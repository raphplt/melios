import { Text, View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function TopRow({
	icon,
	color,
	text,
	number,
	borderColor,
	textColor,
}: any) {
	const { theme } = useContext(ThemeContext);

	return (
		<View className="flex items-center justify-start flex-row w-[90%] bg-transparent mx-auto my-2">
			<View
				className="flex items-center justify-center rounded-full w-6 h-6 mr-2"
				style={{
					backgroundColor: color,
					borderColor: borderColor || theme.colors.primary,
					borderWidth: 2,
				}}
			>
				<Text
					className="font-bold text-[14px]"
					style={{
						color: textColor || theme.colors.text,
					}}
				>{`${number}`}</Text>
			</View>
			<Text
				className="font-semibold italic ml-1 text-[16px]"
				style={{
					color: theme.colors.text,
				}}
			>
				{text}
			</Text>
		</View>
	);
}
