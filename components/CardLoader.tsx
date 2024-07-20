import { View } from "react-native";

export default function CardPlaceHolder() {
	return (
		<View className="flex animate-spin max-w-lg">
			<View className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-500 w-24 mb-2.5"></View>
			<View className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-500"></View>
		</View>
	);
}
