import React from "react";
import { Text, View, Dimensions, Pressable } from "react-native";
import * as Progress from "react-native-progress";
import { useTheme } from "@context/ThemeContext";
import { CombinedLevel } from "@type/levels";
import { useTranslation } from "react-i18next";
import { useData } from "@context/DataContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import ZoomableView from "@components/Shared/ZoomableView";

const LevelItem = ({ level }: { level: CombinedLevel }) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { width } = Dimensions.get("window");
	const { setSelectedLevel } = useData();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<ZoomableView>
			<Pressable
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
				onPress={() => {
					setSelectedLevel(level);
					navigation.navigate("levelDetail");
				}}
				className="py-2 px-2 my-1 rounded-xl"
			>
				<View className="flex flex-row items-center justify-between py-1 mx-1">
					<View className="flex flex-row items-center">
						<FontAwesome6
							name={level.icon || "question"}
							size={18}
							color={level.color || theme.colors.primary}
						/>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[14px] ml-2 font-bold"
						>
							{level.name}
						</Text>
					</View>

					<View
						style={{
							borderColor: level.color || theme.colors.primary,
							borderWidth: 1,
						}}
						className="px-2 py-[2px] rounded-2xl"
					>
						<Text
							style={{
								color: level.color ?? theme.colors.textTertiary,
							}}
							className="text-sm font-semibold "
						>
							{level.currentXp} / {level.nextLevelXp}
						</Text>
					</View>
				</View>
				<View className="flex flex-row items-center justify-between pt-1">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-[14px] font-semibold ml-2"
					>
						{level.currentLevel}
					</Text>
					<Progress.Bar
						progress={level.currentXp / level.nextLevelXp}
						width={width * 0.85}
						height={10}
						color={level.color || theme.colors.primary}
						borderRadius={15}
						borderWidth={0}
						style={{
							backgroundColor: theme.colors.border,
						}}
					/>
				</View>
			</Pressable>
		</ZoomableView>
	);
};

export default LevelItem;
