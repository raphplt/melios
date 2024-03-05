import { View, Text } from "react-native";

export const DateButton = ({ date, setDate, theme }: any) => {
	return (
		<View
			style={{ backgroundColor: theme.colors.backgroundSecondary }}
			className="flex items-center justify-center w-36 h-36 rounded-xl mx-auto mt-5"
		>
			<Text style={{ color: theme.colors.text }} className="text-3xl mt-1">
				{date}
			</Text>
		</View>
	);
};
