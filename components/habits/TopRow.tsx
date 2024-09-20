import { Pressable, Text, View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Iconify } from "react-native-iconify";
import IconView from "./IconView";
import { IconTopRow } from "@type/icons";

export default function TopRow({
	color,
	text,
	number,
	borderColor,
	textColor,
	resetShow,
	showMore,
	icon,
}: {
	color: string;
	text: string;
	number: number;
	borderColor?: string;
	textColor?: string;
	resetShow: () => void;
	showMore: number;
	icon: IconTopRow;
}) {
	const { theme } = useContext(ThemeContext);

	return (
		<Pressable className="w-full" onPress={resetShow}>
			<View className="flex items-center justify-start flex-row w-[90%] bg-transparent mx-auto my-2">
				<IconView icon={icon} />
				<View className="flex items-center flex-row">
					<Text
						className="ml-2 text-[16px]"
						style={{
							color: theme.colors.text,
						}}
					>
						{text}
					</Text>
					{/* <View
						className="flex items-center justify-center rounded-full w-6 h-6 mx-1"
						style={{
							backgroundColor: borderColor,
						}}
					>
						<Text
							className="font-bold "
							style={{
								color: theme.colors.textSecondary,
							}}
						>{`${number}`}</Text>
					</View> */}
				</View>

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
