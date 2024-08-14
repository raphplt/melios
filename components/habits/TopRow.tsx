import { Pressable, Text, View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Iconify } from "react-native-iconify";

export default function TopRow({
	icon,
	color,
	text,
	number,
	borderColor,
	textColor,
	resetShow,
	showMore,
}: any) {
	const { theme } = useContext(ThemeContext);

	return (
		<Pressable className="w-full" onPress={resetShow}>
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

				<View className="flex items-center justify-center ml-auto p-1">
					{showMore > 0 ? (
						<Iconify icon="mdi:chevron-up" size={24} color={theme.colors.text} />
					) : (
						<Iconify icon="mdi:chevron-down" size={24} color={theme.colors.text} />
					)}
				</View>
			</View>
		</Pressable>
	);
}
