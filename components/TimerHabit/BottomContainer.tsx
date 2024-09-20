import { ReactNode } from "react";
import { View } from "react-native";

export default function BottomContainer({ children }: { children: ReactNode }) {
	return (
		<View className="flex flex-col items-center w-full mt-8 mx-auto z-20">
			{children}
		</View>
	);
}
