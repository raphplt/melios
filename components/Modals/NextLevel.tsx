import React, { useEffect, useRef, useState } from "react";
import { Text, View, Animated, Dimensions } from "react-native";
import ModalWrapper from "./ModalWrapper";
import * as Progress from "react-native-progress";
import { CombinedLevel } from "@type/levels";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import ConfettiCannon from "react-native-confetti-cannon";

type Props = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	levelData: CombinedLevel | null;
};

const NextLevel = ({ visible, setVisible, levelData }: Props) => {
	const [progress, setProgress] = useState(0);
	const [showConfetti, setShowConfetti] = useState(false);
	const { theme } = useTheme();
	const { t } = useTranslation();
	const animatedProgress = useRef(new Animated.Value(0)).current;
	const confettiRef = useRef<any>(null);

	useEffect(() => {
		if (visible) {
			setShowConfetti(true); // Activer les confettis
			Animated.timing(animatedProgress, {
				toValue: 100,
				duration: 1500,
				useNativeDriver: false,
			}).start(() => {
				setProgress(100);
			});
		} else {
			setShowConfetti(false); // Désactiver les confettis
			Animated.timing(animatedProgress, {
				toValue: 0,
				duration: 500,
				useNativeDriver: false,
			}).start(() => {
				setProgress(0);
			});
		}
	}, [visible]);

	const progressBarWidth = animatedProgress.interpolate({
		inputRange: [0, 100],
		outputRange: ["0%", "100%"],
	});

	if (!levelData) return null;

	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View className="p-2 items-center w-11/12 mx-auto">
				{showConfetti && (
					<ConfettiCannon
						ref={confettiRef}
						count={200}
						fadeOut
						origin={{ x: Dimensions.get("window").width / 2, y: 0 }}
					/>
				)}
				<Text className="text-3xl font-bold mb-3 text-green-600">
					🎉 {t("congratulations")}!
				</Text>
				<Text
					className="text-lg mb-2"
					style={{
						color: theme.colors.textTertiary,
					}}
				>
					{t("you_achieve_a_new_level")}!
				</Text>
				<Text
					className="text-xl font-semibold mb-5"
					style={{
						color: theme.colors.text,
					}}
				>
					{levelData.name}
				</Text>

				<View className="flex-row w-full justify-between items-center mb-3">
					<Text
						className="text-base"
						style={{
							color: theme.colors.textTertiary,
						}}
					>
						{levelData.currentLevel ? levelData.currentLevel - 1 : 0}
					</Text>
					<Text
						className="text-base"
						style={{
							color: theme.colors.textTertiary,
						}}
					>
						{levelData.currentLevel ?? 1}
					</Text>
				</View>

				<Progress.Bar
					progress={progress / 100}
					color={levelData.color || theme.colors.greenPrimary}
					unfilledColor={theme.colors.border}
					borderWidth={0}
					height={10}
					width={Dimensions.get("window").width - 100}
				/>

				<Text className="text-sm text-gray-500">
					{t("progression")}: {progress}%
				</Text>
			</View>
		</ModalWrapper>
	);
};

export default NextLevel;
