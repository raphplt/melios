import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import BottomSlideModal from "./Modals/ModalBottom";

export const LeagueInfoModal: React.FC<{
	visible: boolean;
	onClose: () => void;
}> = ({ visible, onClose }) => {
	const { theme } = useTheme();

	return (
		<BottomSlideModal
			visible={visible}
			setVisible={(v) => !v && onClose()}
			title="🏆 Système de Ligues Personnelles"
		>
			<ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
				{/* Introduction */}
				<View className="mb-6">
					<Text
						className="text-base leading-6"
						style={{
							color: theme.colors.text,
							fontFamily: theme.fonts.regular.fontFamily,
							lineHeight: 24,
						}}
					>
						Le nouveau système de ligues est entièrement personnel ! Progressez à
						votre rythme selon votre activité, sans compétition directe avec d'autres
						utilisateurs.
					</Text>
				</View>

				{/* Comment ça marche */}
				<View className="mb-6">
					<Text
						className="text-lg font-bold mb-3"
						style={{
							color: theme.colors.text,
							fontFamily: theme.fonts.bold.fontFamily,
						}}
					>
						📚 Comment ça fonctionne
					</Text>

					<View className="space-y-3">
						<View className="flex-row">
							<View
								className="w-6 h-6 rounded-full items-center justify-center mr-3 mt-1"
								style={{ backgroundColor: theme.colors.primary }}
							>
								<Text className="text-white text-xs font-bold">1</Text>
							</View>
							<View className="flex-1">
								<Text
									className="text-sm font-medium mb-1"
									style={{ color: theme.colors.text }}
								>
									Gagnez des points
								</Text>
								<Text
									className="text-sm"
									style={{ color: theme.colors.textTertiary, lineHeight: 20 }}
								>
									Complétez vos habitudes pour gagner des points de ligue (10 points ×
									difficulté)
								</Text>
							</View>
						</View>

						<View className="flex-row">
							<View
								className="w-6 h-6 rounded-full items-center justify-center mr-3 mt-1"
								style={{ backgroundColor: theme.colors.primary }}
							>
								<Text className="text-white text-xs font-bold">2</Text>
							</View>
							<View className="flex-1">
								<Text
									className="text-sm font-medium mb-1"
									style={{ color: theme.colors.text }}
								>
									Montez de ligue
								</Text>
								<Text
									className="text-sm"
									style={{ color: theme.colors.textTertiary, lineHeight: 20 }}
								>
									Atteignez le seuil de points requis pour accéder à la ligue supérieure
								</Text>
							</View>
						</View>

						<View className="flex-row">
							<View
								className="w-6 h-6 rounded-full items-center justify-center mr-3 mt-1"
								style={{ backgroundColor: theme.colors.primary }}
							>
								<Text className="text-white text-xs font-bold">3</Text>
							</View>
							<View className="flex-1">
								<Text
									className="text-sm font-medium mb-1"
									style={{ color: theme.colors.text }}
								>
									Maintenez votre niveau
								</Text>
								<Text
									className="text-sm"
									style={{ color: theme.colors.textTertiary, lineHeight: 20 }}
								>
									Atteignez l'objectif hebdomadaire pour rester dans votre ligue
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Objectifs hebdomadaires */}
				<View className="mb-6">
					<Text
						className="text-lg font-bold mb-3"
						style={{
							color: theme.colors.text,
							fontFamily: theme.fonts.bold.fontFamily,
						}}
					>
						🗓️ Objectifs Hebdomadaires
					</Text>

					<LinearGradient
						colors={[theme.colors.cardBackground, theme.colors.backgroundSecondary]}
						className="rounded-2xl p-4"
					>
						<View className="flex-row items-start">
							<MaterialCommunityIcons
								name="information"
								size={20}
								color={theme.colors.primary}
								style={{ marginTop: 2, marginRight: 8 }}
							/>
							<View className="flex-1">
								<Text
									className="text-sm"
									style={{
										color: theme.colors.text,
										lineHeight: 20,
										fontFamily: theme.fonts.regular.fontFamily,
									}}
								>
									Chaque ligue a un objectif de points hebdomadaire. Si vous n'atteignez
									pas cet objectif, vous risquez de descendre d'une ligue.
								</Text>
								<Text
									className="text-sm mt-2"
									style={{
										color: theme.colors.textTertiary,
										lineHeight: 20,
										fontFamily: theme.fonts.regular.fontFamily,
									}}
								>
									Les compteurs se remettent à zéro chaque semaine !
								</Text>
							</View>
						</View>
					</LinearGradient>
				</View>

				{/* Récompenses */}
				<View className="mb-6">
					<Text
						className="text-lg font-bold mb-3"
						style={{
							color: theme.colors.text,
							fontFamily: theme.fonts.bold.fontFamily,
						}}
					>
						🎁 Récompenses
					</Text>

					<View className="space-y-2">
						<View className="flex-row items-center justify-between py-2">
							<View className="flex-row items-center">
								<Text className="text-base mr-2">🎉</Text>
								<Text className="text-sm" style={{ color: theme.colors.text }}>
									Promotion
								</Text>
							</View>
							<Text
								className="text-sm font-bold"
								style={{ color: theme.colors.mythologyGold }}
							>
								+20 récompenses
							</Text>
						</View>

						<View className="flex-row items-center justify-between py-2">
							<View className="flex-row items-center">
								<Text className="text-base mr-2">✅</Text>
								<Text className="text-sm" style={{ color: theme.colors.text }}>
									Maintien hebdomadaire
								</Text>
							</View>
							<Text
								className="text-sm font-bold"
								style={{ color: theme.colors.mythologyGold }}
							>
								+10 récompenses
							</Text>
						</View>

						<View className="flex-row items-center justify-between py-2">
							<View className="flex-row items-center">
								<Text className="text-base mr-2">📉</Text>
								<Text className="text-sm" style={{ color: theme.colors.text }}>
									Relégation (consolation)
								</Text>
							</View>
							<Text
								className="text-sm font-bold"
								style={{ color: theme.colors.mythologyGold }}
							>
								+5 récompenses
							</Text>
						</View>
					</View>
				</View>

				{/* Podium olympique */}
				<View className="mb-8">
					<Text
						className="text-lg font-bold mb-3"
						style={{
							color: theme.colors.text,
							fontFamily: theme.fonts.bold.fontFamily,
						}}
					>
						🏆 Podium Olympique
					</Text>

					<LinearGradient
						colors={[theme.colors.cardBackground, theme.colors.backgroundSecondary]}
						className="rounded-2xl p-4"
					>
						<Text
							className="text-sm"
							style={{
								color: theme.colors.text,
								lineHeight: 20,
								fontFamily: theme.fonts.regular.fontFamily,
							}}
						>
							Le podium affiche les 3 meilleurs joueurs de votre ligue actuelle. C'est
							le seul endroit où vous pouvez voir et vous comparer aux autres !
						</Text>
					</LinearGradient>
				</View>
			</ScrollView>
		</BottomSlideModal>
	);
};

export const LeagueInfoButton: React.FC = () => {
	const { theme } = useTheme();
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<TouchableOpacity
				onPress={() => setShowModal(true)}
				className="ml-3"
				style={{
					backgroundColor: theme.colors.cardBackground,
					borderRadius: 20,
					width: 40,
					height: 40,
					justifyContent: "center",
					alignItems: "center",
					shadowColor: theme.colors.border,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 4,
					elevation: 3,
				}}
			>
				<MaterialCommunityIcons
					name="help-circle-outline"
					size={24}
					color={theme.colors.textTertiary}
				/>
			</TouchableOpacity>

			<LeagueInfoModal visible={showModal} onClose={() => setShowModal(false)} />
		</>
	);
};
