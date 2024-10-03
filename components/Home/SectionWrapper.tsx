import { useTheme } from "@context/ThemeContext";
import { ReactNode } from "react";
import { View, Text } from "react-native";

export default function SectionWrapper({
	children,
	title,
	icon,
}: {
	children: ReactNode;
	title: string;
	icon?: ReactNode;
}) {
	const { theme } = useTheme();
	return (
		<View className="mt-4 ">
			<View className="flex flex-row items-center w-11/12 mx-auto py-1">
				{icon}
				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-lg font-semibold ml-2"
				>
					{title}
				</Text>
			</View>
			{children}
		</View>
	);
}
