import React from "react";
import GradientBox from "./GradientBox";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import useIndex from "@hooks/useIndex";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";
import * as Progress from "react-native-progress";

const GlobalLevelBox = () => {
	const { usersLevels } = useData();
	const { t } = useTranslation();

	const globalLevel = usersLevels["P0gwsxEYNJATbmCoOdhc" as any];

	const xpPercentage = globalLevel
		? (globalLevel.currentXp / globalLevel.nextLevelXp) * 100
		: 0;
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { isDayTime } = useIndex();

	return (
		<GradientBox position={{ top: 20, right: 20 }}>
			<View className="flex flex-row items-center gap-2">
				<Pressable
					className="flex flex-row items-center justify-center px-3 py-[6px]"
					onPress={() => navigation.navigate("progression")}
				>
					<View className="flex flex-col gap-1">
						<Text
							className="text-xs font-semibold"
							style={{
								color: isDayTime ? "#191919" : "#f0f0f0",
							}}
						>
							{t("level_title")}
						</Text>
						<View className="flex items-center justify-center flex-row">
							<Progress.Circle
								size={35}
								progress={xpPercentage / 100}
								color={isDayTime ? theme.colors.primary : theme.colors.tertiary}
								unfilledColor={theme.colors.border}
								borderWidth={0}
								thickness={4}
							/>
							<Text
								style={{
									fontSize: 14,
									color: isDayTime ? theme.colors.primary : theme.colors.tertiary,
								}}
								className="font-bold absolute text-lg"
							>
								{globalLevel?.currentLevel || "1"}
							</Text>
						</View>
					</View>
				</Pressable>
			</View>
		</GradientBox>
	);
};

export default GlobalLevelBox;
