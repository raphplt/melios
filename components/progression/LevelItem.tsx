import React from "react";
import { Text, View, Dimensions } from "react-native";
import * as Progress from "react-native-progress";
import { useTheme } from "@context/ThemeContext";
import { CombinedLevel, UserLevel } from "@type/levels";

const LevelItem = ({ level }: { level: CombinedLevel }) => {
	const { theme } = useTheme();
	const { width } = Dimensions.get("window");

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				borderColor: theme.colors.border,
				borderWidth: 1,
			}}
			className="py-2 px-2 my-1 rounded-xl"
		>
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="text-[16px] font-bold"
			>
				{level.name}
			</Text>
			<View className="flex flex-row items-center justify-between">
				<Text
					style={{
						color: theme.colors.text,
					}}
					className="text-[14px] mb-1 font-semibold"
				>
					Niveau : {level.currentLevel}
				</Text>
				<Text
					style={{
						color: theme.colors.text,
					}}
					className="text-[14px] mb-1"
				>
					{level.currentXp} / {level.nextLevelXp}
				</Text>
			</View>
			<Progress.Bar
				progress={level.currentXp / level.nextLevelXp}
				width={width * 0.9}
				height={12}
				color={level.color || theme.colors.primary}
				borderRadius={15}
				borderWidth={0}
				style={{
					backgroundColor: theme.colors.border,
				}}
			/>
			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="text-[13px] mt-1"
			>
				{level.description}
			</Text>
		</View>
	);
};

export default LevelItem;
