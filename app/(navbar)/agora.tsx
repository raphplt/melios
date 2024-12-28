import AllLogs from "@components/Agora/AllLogs";
import MainSubSections from "@components/Agora/MainSubSections";
import { View } from "react-native";

export default function Agora() {
	return (
		<View className="flex-1">
			<MainSubSections />
			<AllLogs />
		</View>
	);
}
