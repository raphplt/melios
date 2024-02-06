import { View, Text } from "react-native";

export default function HabitDetail({ route }: any) {
	const { habit, habitInfos } = route.params || {}; // Assurez-vous que route.params n'est pas undefined

	return (
		<View>
			<Text>{habitInfos && habitInfos.name}</Text>
		</View>
	);
}
