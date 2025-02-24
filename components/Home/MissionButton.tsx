import { useTheme } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import GradientBox from "./GradientBox";

const MissionButton = () => {
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { t } = useTranslation();
	const { isDayTime } = useIndex();

	return (
		<GradientBox
			position={{ bottom: 20, right: 20 }}
			colors={[theme.colors.primary, theme.colors.backgroundTertiary]}
		>
			<View className="flex flex-row items-center gap-2">
				<Pressable
					className="flex flex-row items-center justify-center px-4 py-2"
					onPress={() => navigation.navigate("dailyRewards")}
				>
					<Iconify
						icon="mdi:rocket"
						color={isDayTime ? "black" : "white"}
						size={20}
					/>
					<Text
						style={{ color: isDayTime ? "black" : "white" }}
						className="text-[14px] font-semibold ml-2"
					>
						{t("missions")}
					</Text>
				</Pressable>
			</View>
		</GradientBox>
	);
};

export default MissionButton;
