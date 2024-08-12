import { Entypo } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Congratulations({
	theme,
	completedHabitsData,
	userHabits,
}: {
	//TODO: Define props type
	theme: any;
	completedHabitsData: any;
	userHabits: any;
}) {
	return (
		<View
			style={{
				borderColor: theme.colors.primary,
				borderWidth: 2,
			}}
			className="rounded-lg flex-col flex items-center justify-center mx-auto w-[95%] py-2 px-4"
		>
			<View className="flex flex-row items-center justify-center w-10/12 mx-auto">
				<View className="mx-2">
					<Entypo name="trophy" size={24} color={theme.colors.primary} />
				</View>
				<Text
					className="mx-2 font-bold text-lg"
					style={{ color: theme.colors.primary }}
				>
					Félicitations !
				</Text>
			</View>
			<Text
				style={{ color: theme.colors.primary }}
				className="text-center w-3/4 mx-auto mt-2"
			>
				{completedHabitsData.length === userHabits.length
					? `Vous avez validé toutes vos habitudes pour aujourd'hui !`
					: `Vous n'avez pas d'habitudes à valider pour le moment.`}
			</Text>
		</View>
	);
}
