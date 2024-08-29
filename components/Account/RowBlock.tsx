import { ThemeContext } from "@context/ThemeContext";
import React, { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

interface RowBlockProps {
	icon: React.ReactNode;
	title: string;
	count?: number;
	onPress?: () => void;
}

export default function RowBlock({
	icon,
	title,
	count,
	onPress,
}: RowBlockProps) {
	const { theme } = useContext(ThemeContext);

	return (
		<Pressable
			className="flex flex-row items-center justify-between py-1"
			onPress={onPress}
		>
			<View className="flex flex-row items-center gap-2">
				{icon}
				<Text className="text-[16px]">{title}</Text>
				{count !== undefined && (
					<View
						className="flex flex-row items-center justify-center rounded-full w-6 h-6"
						style={{
							backgroundColor: theme.colors.primary,
						}}
					>
						<Text
							className="text-[12px]"
							style={{
								color: theme.colors.textSecondary,
							}}
						>
							{count}
						</Text>
					</View>
				)}
			</View>
			<View>
				<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
			</View>
		</Pressable>
	);
}
