import ButtonBack from "@components/Shared/ButtonBack";
import ButtonClose from "@components/Shared/ButtonClose";
import { genericLevels } from "@constants/levels";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { getGlobalLevel, getLevelName } from "@utils/levels";
import { levelsBadge } from "@utils/renderBadge";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Dimensions,
	Image,
	Platform,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const levels = () => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const { usersLevels } = useData();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const globalLevel = getGlobalLevel(usersLevels);

	const otherLevels = Object.values(usersLevels).filter(
		(level) => level.levelId !== globalLevel.levelId
	);

	const colors: any = theme.dark
		? ["#a1c4fd", "#c2e9fb", theme.colors.cardBackground]
		: ["#d4fc79", "#96e6a1", "#a1c4fd", theme.colors.cardBackground];

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				flexGrow: 1,
			}}
			showsVerticalScrollIndicator={false}
		>
			<LinearGradient
				style={{
					height: Dimensions.get("screen").height,
					width: "100%",
				}}
				colors={colors}
			>
				<View
					style={{
						paddingTop: 40,
						zIndex: 10,
					}}
				>
					<ButtonClose />
				</View>

				<BlurView
					intensity={100}
					tint="light"
					style={{
						padding: 10,
						borderRadius: 12,
						alignSelf: "center",
						alignItems: "center",
						overflow: "hidden",
						width: "95%",
					}}
				>
					<View className="flex flex-row items-center justify-center gap-2 relative">
						<Image
							source={levelsBadge(globalLevel.currentLevel)}
							style={{
								width: 150,
								height: 150,
							}}
						/>
						<Text
							className="text-4xl absolute"
							style={{
								fontFamily: "BaskervilleBold",
								color: theme.colors.text,
							}}
						>
							{globalLevel.currentLevel}
						</Text>
					</View>
					<Text
						className="text-2xl font-semibold text-center"
						style={{
							color: theme.colors.text,
						}}
					>
						{t("level_general")}
					</Text>
					<Text
						className="text-[16px] mt-1 font-semibold text-center"
						style={{
							color: theme.colors.textTertiary,
						}}
					>
						{getLevelName(globalLevel.currentLevel)}
					</Text>
				</BlurView>
				<View className="mt-4 flex flex-row flex-wrap justify-center">
					{otherLevels.map((level, index) => (
						<BlurView
							intensity={100}
							tint="light"
							style={{
								padding: 10,
								borderRadius: 12,
								alignSelf: "center",
								alignItems: "center",
								overflow: "hidden",
								width: "45%",
								margin: "2.5%",
							}}
							key={level.levelId}
							className="flex flex-col items-center justify-center gap-2 mt-2"
						>
							<View className="flex flex-row items-center justify-center gap-2 relative">
								<Image
									source={levelsBadge(level.currentLevel)}
									style={{
										width: 100,
										height: 100,
									}}
								/>
								<Text
									className="text-2xl absolute"
									style={{
										fontFamily: "BaskervilleBold",
										color: theme.colors.text,
									}}
								>
									{level.currentLevel}
								</Text>
							</View>
							<Text
								className="text-xl font-semibold text-center"
								style={{
									color: theme.colors.text,
								}}
							>
								{genericLevels[index].name}
							</Text>
							<Text
								className=" font-semibold text-center"
								style={{
									color: theme.colors.textTertiary,
								}}
							>
								{getLevelName(level.currentLevel)}
							</Text>
						</BlurView>
					))}
				</View>
			</LinearGradient>
		</ScrollView>
	);
};

export default levels;
