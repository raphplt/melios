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
			className="flex flex-row items-center justify-center rounded-full relative h-6 w-6"
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
