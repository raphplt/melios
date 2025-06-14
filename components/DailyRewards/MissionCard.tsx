import React, { useRef, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	Vibration,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

interface MissionCardProps {
	mission: {
		slug: string;
		text: string;
		completed: boolean;
		validated: boolean;
		description?: string;
		icon?: string;
		category?:
			| "connection"
			| "habits"
			| "social"
			| "learning"
			| "wellness"
			| "productivity";
		difficulty?: "easy" | "medium" | "hard";
		xpReward?: number;
	};
	onValidate: (slug: string) => void;
	showProgress?: boolean;
	progressValue?: string;
}

const MissionCard: React.FC<MissionCardProps> = ({
	mission,
	onValidate,
	showProgress = false,
	progressValue,
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const opacityAnim = useRef(
		new Animated.Value(mission.completed ? 1 : 0.7)
	).current;

	useEffect(() => {
		Animated.timing(opacityAnim, {
			toValue: mission.completed ? 1 : 0.7,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [mission.completed]);

	const handleValidate = () => {
		// Animation de feedback
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 0.95,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();

		// Vibration légère
		Vibration.vibrate(50);

		onValidate(mission.slug);
	};

	const getIconName = (): any => {
		if (mission.validated) return "checkmark-circle";
		if (mission.completed) return "checkbox-outline";
		if (mission.icon) return mission.icon;
		return "ellipse-outline";
	};

	const getIconColor = () => {
		if (mission.validated) return theme.colors.primary;
		if (mission.completed) return theme.colors.greenPrimary;
		// Couleurs selon la catégorie
		switch (mission.category) {
			case "connection":
				return theme.colors.bluePrimary;
			case "habits":
				return theme.colors.greenPrimary;
			case "social":
				return theme.colors.purplePrimary;
			case "learning":
				return theme.colors.orangePrimary;
			case "wellness":
				return theme.colors.mythologyGreen || theme.colors.greenSecondary;
			case "productivity":
				return theme.colors.yellowPrimary;
			default:
				return theme.colors.textTertiary;
		}
	};

	const getBorderColor = () => {
		if (mission.validated) return theme.colors.primary;
		if (mission.completed) return theme.colors.greenPrimary;
		// Couleur selon la difficulté
		switch (mission.difficulty) {
			case "easy":
				return theme.colors.greenPrimary;
			case "medium":
				return theme.colors.orangePrimary;
			case "hard":
				return theme.colors.redPrimary;
			default:
				return theme.colors.border;
		}
	};

	const getDifficultyLabel = () => {
		switch (mission.difficulty) {
			case "easy":
				return t("easy") || "Facile";
			case "medium":
				return t("medium") || "Moyen";
			case "hard":
				return t("hard") || "Difficile";
			default:
				return "";
		}
	};

	return (
		<Animated.View
			style={{
				transform: [{ scale: scaleAnim }],
				opacity: opacityAnim,
			}}
		>
			<View
				className="rounded-2xl overflow-hidden shadow-sm"
				style={{
					backgroundColor: theme.colors.cardBackground,
					borderLeftWidth: 4,
					borderLeftColor: getBorderColor(),
					shadowColor: theme.colors.border,
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.1,
					shadowRadius: 2,
					elevation: 2,
				}}
			>
				<View className="flex-row items-center p-4">
					{/* Icône de statut */}
					<View className="mr-4">
						<Ionicons name={getIconName()} size={28} color={getIconColor()} />
					</View>

					{/* Contenu de la mission */}
					<View className="flex-1">
						<View className="flex-row items-center justify-between mb-1">
							<Text
								className="text-base font-semibold flex-1 mr-2"
								style={{
									color: theme.colors.text,
									fontFamily: mission.completed ? "BaskervilleBold" : "Baskerville",
								}}
							>
								{t(mission.slug) || mission.text}
							</Text>
							{/* Badge de difficulté */}
							{mission.difficulty && !mission.validated && (
								<View
									className="px-2 py-1 rounded-full"
									style={{
										backgroundColor: getBorderColor() + "20",
									}}
								>
									<Text
										className="text-xs font-bold"
										style={{
											color: getBorderColor(),
											fontFamily: "BaskervilleBold",
										}}
									>
										{getDifficultyLabel()}
									</Text>
								</View>
							)}
						</View>

						{/* Description ou traduction de la description */}
						{mission.description && (
							<Text
								className="text-sm mb-1"
								style={{
									color: theme.colors.textTertiary,
									fontFamily: "Baskerville",
								}}
							>
								{t(mission.slug + "_desc") || mission.description}
							</Text>
						)}

						{/* Récompense XP */}
						{mission.xpReward && !mission.validated && (
							<View className="flex-row items-center">
								<Text
									className="text-xs font-semibold"
									style={{
										color: theme.colors.primary,
										fontFamily: "BaskervilleBold",
									}}
								>
									+{mission.xpReward} XP
								</Text>
							</View>
						)}
					</View>

					{/* Progression pour certaines missions */}
					{showProgress && progressValue && (
						<View className="mr-3">
							<Text
								className="text-base font-bold"
								style={{ color: theme.colors.text }}
							>
								{progressValue}
							</Text>
						</View>
					)}

					{/* Bouton de validation */}
					{mission.completed && !mission.validated && (
						<TouchableOpacity
							onPress={handleValidate}
							className="px-4 py-2 rounded-full ml-2"
							style={{ backgroundColor: theme.colors.greenPrimary }}
						>
							<Text
								className="text-sm font-bold"
								style={{
									color: theme.colors.textSecondary,
									fontFamily: "BaskervilleBold",
								}}
							>
								{t("validate") || "Valider"}
							</Text>
						</TouchableOpacity>
					)}

					{/* Badge de validation */}
					{mission.validated && (
						<View
							className="px-3 py-1 rounded-full ml-2"
							style={{ backgroundColor: theme.colors.primary + "20" }}
						>
							<Text
								className="text-xs font-bold"
								style={{
									color: theme.colors.primary,
									fontFamily: "BaskervilleBold",
								}}
							>
								{t("validated") || "Validé"}
							</Text>
						</View>
					)}
				</View>
			</View>
		</Animated.View>
	);
};

export default MissionCard;
