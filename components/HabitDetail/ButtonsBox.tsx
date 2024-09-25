import { View } from "react-native";
import ButtonComplete from "./ButtonComplete";
import ButtonStartHabit from "./ButtonStartHabit";
import Separator from "./Separator";

export default function ButtonsBox() {
	return (
		<View className="py-3">
			<ButtonStartHabit />
			<Separator />
			<ButtonComplete />
		</View>
	);
}
