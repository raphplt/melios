import React from "react";
import { Pressable, View, Text, Alert } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useTheme } from "@context/ThemeContext";
import { useSelect } from "@context/SelectContext";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";

export default function CategoryHabit({ item }: { item: any }) {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { theme } = useTheme();
	const { setHabit } = useSelect();
	const { habits } = useData();
	const { t } = useTranslation();

	const handlePress = () => {
		if (habits.length > 10)
			return Alert.alert(t("habits_limit_reached"), t("habits_limit_description"));
		setHabit(item);
		navigation.navigate("customHabit");
	};

	const selectedHabit = habits.find((habit) => habit.habitId === item.id);

	return (
		<>
			<Pressable
				key={item.id}
				onPress={handlePress}
				style={{
					backgroundColor: selectedHabit
						? theme.colors.background
						: theme.colors.cardBackground,
					paddingVertical: 16,
					paddingHorizontal: 16,
					marginHorizontal: 16,
					borderRadius: 16,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
				disabled={!!selectedHabit}
			>
				<Text
					style={{
						color: theme.colors.text,
						fontWeight: "bold",
						fontSize: 18,
						width: "85%",
					}}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{item.name}
				</Text>
				{selectedHabit ? (
					<Iconify
						icon="material-symbols:check-circle"
						size={24}
						color={selectedHabit.color || theme.colors.text}
					/>
				) : (
					<Iconify
						icon="solar:round-arrow-right-bold"
						size={24}
						color={theme.colors.textTertiary}
					/>
				)}
			</Pressable>
			{/* <View
				style={{
					height: 1,
					backgroundColor: "#ccc",
					marginHorizontal: 16,
				}}
			/> */}
		</>
	);
}
