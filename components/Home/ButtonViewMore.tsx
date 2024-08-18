import { useContext, useState } from "react";
import { Pressable, Text } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { Iconify } from "react-native-iconify";

export default function ButtonViewMore({
	onPress,
	text,
	listLength,
	maxLength,
}: {
	onPress: () => void;
	text: string | null;
	listLength: number;
	maxLength: number;
}) {
	const { theme } = useContext(ThemeContext);
	const [isTouched, setIsTouched] = useState(false);
	let touchStartTimeout: NodeJS.Timeout;

	return (
		<Pressable
			className="rounded-2xl mt-2 mx-auto w-1/5 py-1 flex items-center justify-center flex-row"
			style={{
				borderColor: theme.colors.primary,
				borderWidth: 1,
				backgroundColor: isTouched
					? theme.colors.cardBackground
					: theme.colors.background,
			}}
			onPress={onPress}
			onTouchStart={() => {
				touchStartTimeout = setTimeout(() => setIsTouched(true), 200);
			}}
			onTouchEnd={() => {
				clearTimeout(touchStartTimeout);
				setIsTouched(false);
			}}
			onTouchCancel={() => {
				clearTimeout(touchStartTimeout);
				setIsTouched(false);
			}}
		>
			{listLength < maxLength ? (
				<Iconify icon="mdi:chevron-down" color={theme.colors.primary} size={20} />
			) : (
				<Iconify icon="mdi:chevron-up" color={theme.colors.primary} size={20} />
			)}
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
