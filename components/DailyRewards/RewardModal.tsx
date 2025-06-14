import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import MoneyMelios from "@components/Svg/MoneyMelios";
import ModalWrapperSimple from "@components/Modals/ModalWrapperSimple";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface RewardModalProps {
	visible: boolean;
	onClose: () => void;
	rewardAmount: number;
}

const RewardModal: React.FC<RewardModalProps> = ({
	visible,
	onClose,
	rewardAmount,
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const scaleAnim = useRef(new Animated.Value(0)).current;
	const rotateAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			// Animation d'apparition
			Animated.parallel([
				Animated.spring(scaleAnim, {
					toValue: 1,
					useNativeDriver: true,
					tension: 100,
					friction: 8,
				}),
				Animated.loop(
					Animated.timing(rotateAnim, {
						toValue: 1,
						duration: 2000,
						useNativeDriver: true,
					})
				),
			]).start();
		} else {
			scaleAnim.setValue(0);
			rotateAnim.setValue(0);
		}
	}, [visible]);

	const rotateInterpolate = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	return (
		<ModalWrapperSimple visible={visible} setVisible={onClose}>
			<Animated.View
				style={{
					transform: [{ scale: scaleAnim }],
				}}
			>
				<LinearGradient
					colors={[theme.colors.primary + "10", theme.colors.primary + "05"]}
					className="rounded-3xl p-6"
				>
					{/* Icône de trophée animée */}
					<View className="items-center mb-6">
						<Animated.View
							style={{
								transform: [{ rotate: rotateInterpolate }],
							}}
							className="p-4 rounded-full mb-4"
						>
							<LinearGradient
								colors={[theme.colors.primary, theme.colors.primary + "80"]}
								className="p-4 rounded-full"
							>
								<Ionicons name="trophy" size={48} color={theme.colors.textSecondary} />
							</LinearGradient>
						</Animated.View>

						<Text
							className="text-2xl font-bold text-center mb-2"
							style={{
								color: theme.colors.primary,
								fontFamily: "BaskervilleBold",
							}}
						>
							{t("congratulations_reward") || "Félicitations !"}
						</Text>
					</View>

					{/* Message de récompense */}
					<Text
						className="text-base text-center mb-6"
						style={{
							color: theme.colors.text,
							fontFamily: "Baskerville",
						}}
					>
						{t("reward_modal_message") ||
							"Tu viens de recevoir ta récompense quotidienne. Continue comme ça !"}
					</Text>

					{/* Affichage de la récompense */}
					<View
						className="flex-row items-center justify-center mb-8 p-4 rounded-2xl"
						style={{ backgroundColor: theme.colors.cardBackground }}
					>
						<Text
							className="text-2xl font-bold mr-3"
							style={{
								color: theme.colors.primary,
								fontFamily: "BaskervilleBold",
							}}
						>
							+{rewardAmount}
						</Text>
						<MoneyMelios width={36} height={36} />
					</View>

					{/* Messages d'encouragement */}
					<View className="mb-6">
						<Text
							className="text-sm text-center italic"
							style={{
								color: theme.colors.textTertiary,
								fontFamily: "Baskerville",
							}}
						>
							{t("keep_momentum") ||
								"Garde cette dynamique et continue à progresser ! 🚀"}
						</Text>
					</View>

					{/* Bouton de fermeture */}
					<TouchableOpacity
						onPress={onClose}
						className="rounded-2xl p-4 items-center"
						style={{ backgroundColor: theme.colors.primary }}
					>
						<Text
							className="text-lg font-bold"
							style={{
								color: theme.colors.textSecondary,
								fontFamily: "BaskervilleBold",
							}}
						>
							{t("continue") || "Continuer"}
						</Text>
					</TouchableOpacity>
				</LinearGradient>
			</Animated.View>
		</ModalWrapperSimple>
	);
};

export default RewardModal;
