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
				<View className="mb-4">
					<Text
						className="text-sm leading-5"
						style={{
							color: theme.colors.text,
						}}
					>
						{t("league_system_intro")}
					</Text>
				</View>

				{/* Comment ça marche - Version condensée */}
				<View className="mb-4">
					<Text
						className="text-base font-bold mb-3"
						style={{
							color: theme.colors.text,
							fontFamily: theme.fonts.bold.fontFamily,
						}}
					>
						⚡ Comment ça marche
					</Text>

					<LinearGradient
						colors={[theme.colors.cardBackground, theme.colors.backgroundSecondary]}
						className="rounded-xl p-3"
					>
						<Text
							className="text-sm mb-2"
							style={{
								color: theme.colors.text,
								lineHeight: 18,
							}}
						>
							• Complétez vos habitudes pour gagner des points
						</Text>
						<Text
							className="text-sm mb-2"
							style={{
								color: theme.colors.text,
								lineHeight: 18,
							}}
						>
							• Montez dans les ligues supérieures pour plus de récompenses
						</Text>
						<Text
							className="text-sm"
							style={{
								color: theme.colors.text,
								lineHeight: 18,
							}}
						>
							• Atteignez l'objectif hebdomadaire pour éviter la relégation
						</Text>
					</LinearGradient>
				</View>

				{/* Récompenses - Version condensée */}
				<View className="mb-6">
					<Text
						className="text-base font-bold mb-3"
						style={{
							color: theme.colors.text,
							fontFamily: theme.fonts.bold.fontFamily,
						}}
					>
						🎁 Récompenses par ligue
					</Text>

					<View className="space-y-2">
						<View className="flex-row items-center justify-between py-1">
							<Text className="text-sm" style={{ color: theme.colors.text }}>
								🎉 Promotion
							</Text>
							<Text
								className="text-sm font-bold"
								style={{ color: theme.colors.primary }}
							>
								+20 récompenses
							</Text>
						</View>

						<View className="flex-row items-center justify-between py-1">
							<Text className="text-sm" style={{ color: theme.colors.text }}>
								✅ Maintien
							</Text>
							<Text
								className="text-sm font-bold"
								style={{ color: theme.colors.primary }}
							>
								+10 récompenses
							</Text>
						</View>

						<View className="flex-row items-center justify-between py-1">
							<Text className="text-sm" style={{ color: theme.colors.text }}>
								🏆 Podium (top 3)
							</Text>
							<Text
								className="text-sm font-bold"
								style={{ color: theme.colors.primary }}
							>
								Bonus quotidien
							</Text>
						</View>
					</View>
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
