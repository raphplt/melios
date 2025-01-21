import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import { View, Text, Pressable } from "react-native";
import HabitsCount from "./HabitCount";

interface RowBlockProps {
	icon: React.ReactNode;
	title: string;
	count?: number;
	onPress?: () => void;
	rightContent?: React.ReactNode;
	color?: string;
}

export default function RowBlock({
	icon,
	title,
	count,
	onPress,
	rightContent,
	color,
}: RowBlockProps) {
	const { theme } = useContext(ThemeContext);
	const [isTouching, setIsTouching] = useState(false);

	return (
		<Pressable
			className="flex flex-row items-center justify-between py-4 px-3 rounded-xl"
			onPress={onPress}
			onTouchStart={() => setIsTouching(true)}
			onTouchEnd={() => setIsTouching(false)}
			onTouchCancel={() => setIsTouching(false)}
			style={{
				backgroundColor: isTouching
					? theme.colors.backgroundSecondary
					: theme.colors.cardBackground,
			}}
		>
			<View className="flex flex-row items-center">
				<View
					className="rounded-full p-2"
					style={{
						backgroundColor: theme.colors.background,
						borderColor: color || theme.colors.primary,
						borderWidth: 1,
					}}
				>
					{icon}
				</View>
				<Text
					className="text-[16px] ml-2 mr-2"
					style={{
						color: color ?? theme.colors.text,
					}}
				>
					{title}
				</Text>
				{count !== undefined && <HabitsCount count={count} theme={theme} />}
			</View>
			{rightContent}
		</Pressable>
	);
}
