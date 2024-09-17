import { View, Text } from "react-native";

export default function HabitsCount({
	count,
	theme,
}: {
	count: number;
	theme: any;
}) {
	return (
		<View
			className="flex flex-row items-center justify-center rounded-full w-6 h-6"
			style={{
				backgroundColor: theme.colors.primary,
			}}
		>
			<Text
				className="text-[12px]"
				style={{
					color: "white",
				}}
			>
				{count}
			</Text>
		</View>
	);
}
