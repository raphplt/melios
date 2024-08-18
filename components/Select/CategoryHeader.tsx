import { FontAwesome6, AntDesign } from "@expo/vector-icons";
import { Pressable, View, Text } from "react-native";

export default function CategoryHeader({
	item,
	displayedHabitsCount,
	setDisplayedHabitsCount,
	theme,
}: {
	item: any;
	displayedHabitsCount: any;
	setDisplayedHabitsCount: any;
	theme: any;
}) {
	return (
		<Pressable
			className="w-11/12 mx-auto flex flex-row items-center justify-between py-1 px-2 rounded-2xl mb-2 mt-4"
			style={{
				backgroundColor: theme.colors.background,
				borderColor: item.color,
				borderWidth: 1,
			}}
			onPress={() =>
				setDisplayedHabitsCount((prevState: any) => ({
					...prevState,
					[item.category]: prevState[item.category] > 0 ? 0 : 5,
				}))
			}
		>
			<View className="flex flex-row items-center">
				<FontAwesome6
					name={item.icon}
					size={20}
					color={item.color}
					style={{ marginRight: 5, marginLeft: 5 }}
				/>
				<Text
					className="text-lg font-semibold px-1 italic"
					style={{ color: item.color }}
				>
					{item.category}
				</Text>
			</View>
			<View>
				{displayedHabitsCount[item.category] === 5 ? (
					<AntDesign name="caretup" size={20} color={item.color} />
				) : (
					<AntDesign name="caretdown" size={20} color={item.color} />
				)}
			</View>
		</Pressable>
	);
}
