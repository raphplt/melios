import { useHabits } from "@context/HabitsContext";
import { ThemeContext } from "@context/ThemeContext";
import useHabitTimer from "@hooks/useHabitTimer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import getImage from "@utils/getImage";
import { useNavigation } from "expo-router";
import { ReactNode, useContext } from "react";
import { View, Pressable, Image, StyleSheet, StatusBar } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ContainerTimerHabit({
	children,
}: {
	children: ReactNode;
}) {
	const { currentHabit } = useHabits();
	const { theme } = useContext(ThemeContext);
	const { stopTimer } = useHabitTimer();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	if (!currentHabit?.habit) return null;

	const handlePress = () => {
		stopTimer;
		navigation.navigate("habitDetail");
	};

	return (
		<View className="flex flex-col items-center justify-around h-full">
			<Image
				source={getImage(currentHabit.habit.category.slug)}
				style={StyleSheet.absoluteFillObject}
				blurRadius={20}
				resizeMode="cover"
				className="w-full h-full"
			/>

			<Pressable
				onPress={handlePress}
				className="flex justify-end w-11/12 items-end mx-auto p-4 z-10"
			>
				<Iconify
					icon="material-symbols:close"
					size={24}
					color={theme.colors.text}
				/>
			</Pressable>
			{children}
		</View>
	);
}
