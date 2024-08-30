import { ThemeContext } from "@context/ThemeContext";
import React, { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import HabitsCount from "./HabitCount";

interface RowBlockProps {
	icon: React.ReactNode;
	title: string;
	count?: number;
	onPress?: () => void;
	rightContent?: React.ReactNode;
}

export default function RowBlock({
	icon,
	title,
	count,
	onPress,
	rightContent,
}: RowBlockProps) {
	const { theme } = useContext(ThemeContext);

	return (
		<Pressable
			className="flex flex-row items-center justify-between py-1 "
			onPress={onPress}
		>
			<View className="flex flex-row items-center">
				{icon}
				<Text
					className="text-[16px] ml-2 mr-2"
					style={{
						color: theme.colors.text,
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
