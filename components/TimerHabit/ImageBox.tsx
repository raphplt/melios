import { useHabits } from "@context/HabitsContext";
import getImage from "@utils/getImage";
import { View, Image, Text } from "react-native";

export default function ImageBox() {
	const { currentHabit } = useHabits();
	if (!currentHabit?.habit) return null;

	return (
		<View className="flex flex-col items-center justify-center z-20">
			<View className="w-64 h-64 bg-slate-500 rounded-xl my-10">
				<Image
					source={getImage(currentHabit.habit.category.slug)}
					className="rounded-xl w-64 h-64"
				/>
			</View>

			<Text
				style={{
					fontFamily: "BaskervilleBold",
				}}
				className="text-xl text-center w-1/2 break-words"
			>
				{currentHabit.habit.name}
			</Text>
		</View>
	);
}
