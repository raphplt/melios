import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function AccountBlock({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const { theme } = useContext(ThemeContext);

	return (
		<View className="w-11/12 mx-auto mt-4">
			<Text
				style={{
					color: theme.colors.textTertiary,
					fontFamily: "BaskervilleBold",
				}}
				className="mb-2 ml-2 text-[18px]"
			>
				{title}
			</Text>
			<View
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
				className="rounded-xl py-4 px-3 mb-4"
			>
				{children}
			</View>
		</View>
	);
}
