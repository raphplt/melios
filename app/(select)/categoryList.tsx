import ButtonClose from "@components/Shared/ButtonClose";
import { useHabits } from "@context/HabitsContext";
import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { lightenColor } from "@utils/colors";
import { View, Text, StatusBar, FlatList } from "react-native";
import { Iconify } from "react-native-iconify";

export default function CategoryList() {
	const { theme } = useTheme();
	const { category } = useSelect();
	const { habitsData } = useHabits();

	if (!category) {
		return null;
	}

	const lightColor = lightenColor(category.color, 0.2);

	const habits = habitsData.filter(
		(habit) => habit.category?.category === category.category
	);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<View
				style={{
					paddingTop: StatusBar.currentHeight,
					backgroundColor: lightColor || theme.colors.cardBackground,
				}}
				className="rounded-b-3xl"
			>
				<ButtonClose />
				<View className="w-11/12 flex flex-row items-center justify-start mx-auto pt-4  pb-4">
					<Text
						style={{
							color: category.color || theme.colors.text,
						}}
						className="text-3xl font-semibold mr-4"
					>
						{category.category}
					</Text>
					<FontAwesome6
						name={category.icon}
						size={40}
						color={category.color || theme.colors.text}
					/>
				</View>
			</View>

			<FlatList
				data={habits}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View
						key={item.id}
						className="w-full flex flex-row items-center justify-between mx-auto py-4 px-4"
					>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="font-bold text-lg"
						>
							{item.name}
						</Text>
						<Iconify
							icon="fluent:arrow-right-12-regular"
							size={20}
							color={theme.colors.textTertiary}
						/>
					</View>
				)}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
