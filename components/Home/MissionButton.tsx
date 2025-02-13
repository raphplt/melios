import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Iconify } from "react-native-iconify";

const MissionButton = () => {
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<Pressable
			className="absolute bottom-20 right-0 mr-4 mb-4 p-4 rounded-xl"
			style={{
				backgroundColor: theme.colors.primary,
				borderColor: theme.colors.textSecondary,
				borderWidth: 1,
			}}
			onPress={() => navigation.navigate("dailyRewards")}
		>
			<Iconify icon="mdi:rocket" size={30} color="white" />
		</Pressable>
	);
};

export default MissionButton;
