import React, { useEffect, useRef, useState } from "react";
import { Text, View, Animated } from "react-native";
import ModalWrapper from "./ModalWrapper";

import { CombinedLevel } from "@type/levels";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";

type Props = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	levelData: CombinedLevel | null;
};

const NextLevel = ({ visible, setVisible, levelData }: Props) => {
	const [progress, setProgress] = useState(0);
	const { theme } = useTheme();
	const { t } = useTranslation();
	const animatedProgress = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			// Animate the progress bar to 100%
			Animated.timing(animatedProgress, {
				toValue: 100,
				duration: 1500,
				useNativeDriver: false,
			}).start(() => {
				setProgress(100);
			});
		} else {
			animatedProgress.setValue(0);
			setProgress(0);
		}
	}, [visible, animatedProgress]);

	const progressBarWidth = animatedProgress.interpolate({
		inputRange: [0, 100],
		outputRange: ["0%", "100%"],
	});

	if (!levelData) return null;

	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View className="p-5 items-center">
				<Text
					className="text-2xl mb-2"
					style={{
						fontFamily: "BaskervilleBold",
						color: theme.colors.greenPrimary,
					}}
				>
					🎉 {t("congratulations")} !
				</Text>
				<Text
					className="mb-3 text-lg"
					style={{
						color: theme.colors.text,
					}}
				>
					{t("you_achieve_a_new_level")}!
				</Text>
				<Text
					className="mb-5 text-lg font-semibold"
					style={{
						color: theme.colors.text,
					}}
				>
					{levelData.name}
				</Text>

				<View className="mb-2 flex flex-row w-full justify-between">
					<Text
						className="text-lg mx-2 "
						style={{
							color: theme.colors.textTertiary,
						}}
					>
						{levelData.currentLevel - 1}
					</Text>
					<Text
						className="text-lg mx-2"
						style={{
							color: theme.colors.textTertiary,
						}}
					>
						{levelData.currentLevel}
					</Text>
				</View>

				<View className="w-full h-3 bg-gray-300 rounded-full overflow-hidden mb-2">
					<Animated.View
						style={{
							width: progressBarWidth,
							backgroundColor: levelData.color || theme.colors.greenPrimary,
						}}
						className="h-full"
					/>
				</View>

				<Text className="text-sm text-gray-500">
					{t("progression")} : {progress}%
				</Text>
			</View>
		</ModalWrapper>
	);
};

export default NextLevel;
