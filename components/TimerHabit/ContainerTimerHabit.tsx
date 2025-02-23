import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";
import useHabitTimer from "@hooks/useHabitTimer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { catImgs } from "@utils/categoriesBg";
import { useNavigation } from "expo-router";
import { ReactNode } from "react";
import {
	View,
	Pressable,
	StyleSheet,
	Alert,
	ImageBackground,
	Dimensions,
} from "react-native";
import { Iconify } from "react-native-iconify";

export default function ({ children }: { children: ReactNode }) {
	const { currentHabit, categories } = useHabits();
	const { theme } = useTheme();
	const { stopTimer } = useHabitTimer();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	if (!currentHabit) return null;

	const handlePress = () => {
		Alert.alert(
			"Êtes-vous sûr de vouloir arrêter cette habitude ?",
			"La progression actuelle sera perdue",
			[
				{
					text: "Annuler",
					style: "cancel",
					onPress: () => {},
				},
				{
					text: "Arrêter",
					style: "destructive",
					onPress: () => {
						stopTimer();
						navigation.navigate("habitDetail");
					},
				},
			]
		);
	};

	const habitCategory = categories.find(
		(c) => c.category === currentHabit.category
	);

	const screenHeight = Dimensions.get("screen").height;

	const slug: string = habitCategory?.slug || "sport";

	return (
		<View className="flex flex-col items-center justify-around h-full">
			<ImageBackground
				source={catImgs[slug]}
				style={[StyleSheet.absoluteFillObject, { height: screenHeight }]}
			/>

			<Pressable
				onPress={handlePress}
				className="flex justify-start w-11/12 items-start mx-auto pt-2 z-10"
			>
				<Iconify
					icon="material-symbols:close"
					size={28}
					color={theme.colors.text}
				/>
			</Pressable>
			{children}
		</View>
	);
}
