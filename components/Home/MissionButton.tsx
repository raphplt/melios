import ZoomableView from "@components/Shared/ZoomableView";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Iconify } from "react-native-iconify";

const MissionButton = () => {
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { t } = useTranslation();

	return (
		<TouchableOpacity
			className="absolute bottom-6 right-5 p-3 z-30 rounded-xl"
			style={{
				backgroundColor: theme.colors.primary,
				borderColor: theme.colors.textSecondary,
				borderWidth: 1,
			}}
		>
			<View
				style={{
					backgroundColor: theme.colors.redPrimary,
				}}
				className="absolute top-1 right-1 w-4 h-4 rounded-full z-10 transform translate-x-1/2 -translate-y-1/2"
			/>

			<Pressable
				className="flex flex-row items-center gap-2 relative"
				onPress={() => {
					navigation.navigate("dailyRewards");
				}}
			>
				<Iconify icon="mdi:rocket" color="white" size={20} />
				<Text
					className="font-semibold text-[14px]"
					style={{
						color: "white",
					}}
				>
					{t("missions")}
				</Text>
			</Pressable>
		</TouchableOpacity>
	);
};

export default MissionButton;
