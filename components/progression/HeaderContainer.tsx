import { View } from "react-native";

export default function HeaderContainer({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<View className="flex flex-row items-center justify-start w-11/12 gap-1 pt-4 pb-2">
			{children}
		</View>
	);
}
