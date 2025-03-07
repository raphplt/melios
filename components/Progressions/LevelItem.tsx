import React, { useMemo, useCallback, useState, useEffect } from "react";
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
import { lightenColor } from "@utils/colors";
import { BlurView } from "expo-blur";

const LevelItem = ({ level }: { level: CombinedLevel }) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { width } = Dimensions.get("window");
	const { setSelectedLevel } = useData();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const itemSize = useMemo(() => (width - 40) / 2, [width]);

	const handlePress = useCallback(() => {
		setSelectedLevel(level);
		navigation.navigate("levelDetail");
	}, [level, navigation, setSelectedLevel]);

	const pressableStyle = useMemo(
		() => ({
			backgroundColor: lightenColor(level.color) ?? theme.colors.background,
			width: itemSize,
			height: itemSize,
		}),
		[level.color, itemSize, theme.colors.background]
	);

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			setProgress(level.currentXp / level.nextLevelXp);
		}, 100);
		return () => clearTimeout(timer);
	}, [level.currentXp, level.nextLevelXp]);

	return (
		<ZoomableView>
			<BlurView
				intensity={100}
				tint={theme.dark ? "dark" : "light"}
				style={{
					width: itemSize,
					height: itemSize,
				}}
				className="p-3 rounded-xl my-2 overflow-hidden"
			>
				<Pressable className="" onPress={handlePress}>
					<View className="flex flex-col items-center justify-between h-full">
						<View className="flex flex-row items-center justify-between w-full gap-1 px-1">
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="font-bold text-[14px]"
							>
								{t(level.slug)}
							</Text>
							<FontAwesome6
								name={level.icon || "question"}
								size={18}
								color={theme.colors.textTertiary}
							/>
						</View>

						<View className="flex flex-col items-center justify-center flex-1 gap-y-2">
							{/* <Text
								className="text-[14px] font-semibold"
								style={{
									color: theme.colors.textTertiary,
								}}
							>
								{t("level_title")}
							</Text> */}
							<View className="flex items-center justify-center">
								<Progress.Circle
									progress={progress}
									color={level.color || theme.colors.primary}
									borderWidth={0}
									unfilledColor={theme.colors.border}
									size={100}
									thickness={10}
									animated
								/>
								<Text
									className="absolute font-bold text-2xl"
									style={{
										color: theme.colors.text,
									}}
								>
									{level.currentLevel}
								</Text>
							</View>
						</View>
					</View>
				</Pressable>
			</BlurView>
		</ZoomableView>
	);
};

export default React.memo(LevelItem);
