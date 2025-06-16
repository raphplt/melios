import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import BottomSlideModal from "./Modals/ModalBottom";

export const LeagueInfoModal: React.FC<{
	visible: boolean;
	onClose: () => void;
}> = ({ visible, onClose }) => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	return (
		<BottomSlideModal
			visible={visible}
			setVisible={(v) => !v && onClose()}
			title={t("league_system_title")}
		>
			<ScrollView className="px-4" showsVerticalScrollIndicator={false}>
				{/* Introduction */}
				<View className="mb-6">
					<Text
						className="text-base leading-6"
						style={{
							color: theme.colors.text,
						}}
					>
						{t("league_system_intro")}
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
						{t("league_how_it_works")}
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
									{t("points_explanation")}
								</Text>
								<Text
									className="text-sm"
									style={{ color: theme.colors.textTertiary, lineHeight: 20 }}
								>
									{t("complete_habits_explanation")}
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
									{t("promotion_explanation")}
								</Text>
								<Text
									className="text-sm"
									style={{ color: theme.colors.textTertiary, lineHeight: 20 }}
								>
									{t("league_promotion_detail")}
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
									{t("weekly_objectives_explanation")}
								</Text>
								<Text
									className="text-sm"
									style={{ color: theme.colors.textTertiary, lineHeight: 20 }}
								>
									{t("weekly_objectives_detail")}
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
						🗓️ {t("weekly_objectives_title")}
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
								style={{ color: theme.colors.primary }}
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
								style={{ color: theme.colors.primary }}
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
								style={{ color: theme.colors.primary }}
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
