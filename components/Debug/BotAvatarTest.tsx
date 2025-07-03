import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import UserBadge from "../Shared/UserBadge";
import {
	BotGeneratorService,
	BotMember,
} from "../../services/BotGeneratorService";
import { Member } from "../../type/member";

interface BotAvatarTestProps {
	currentMember: Member;
}

/**
 * Composant de test pour visualiser les avatars des bots
 * Utile pour vérifier que les avatars locaux fonctionnent correctement
 */
const BotAvatarTest: React.FC<BotAvatarTestProps> = ({ currentMember }) => {
	const { theme } = useTheme();
	const [bots, setBots] = useState<BotMember[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);

	const generateTestBots = async () => {
		setIsGenerating(true);
		try {
			const testBots = BotGeneratorService.generateBotsForLeague(
				currentMember,
				"test-league",
				12, // Générer 12 bots pour voir différents avatars
				[]
			);
			setBots(testBots);
		} catch (error) {
			console.error("Erreur lors de la génération des bots:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	useEffect(() => {
		generateTestBots();
	}, [currentMember]);

	const avatarTypes = [
		"apollon",
		"dyonisos",
		"hades",
		"hephaistos",
		"man",
		"owl_warrior",
		"poseidon",
		"priestess",
		"soldier",
		"warrior_woman",
		"woman",
		"zeus",
	];

	return (
		<ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<View style={{ padding: 16 }}>
				<Text
					style={{
						fontSize: 20,
						fontFamily: theme.fonts.bold.fontFamily,
						color: theme.colors.text,
						marginBottom: 16,
					}}
				>
					Test des Avatars de Bots
				</Text>

				{/* Section: Avatars disponibles */}
				<View style={{ marginBottom: 24 }}>
					<Text
						style={{
							fontSize: 16,
							fontFamily: theme.fonts.medium.fontFamily,
							color: theme.colors.text,
							marginBottom: 12,
						}}
					>
						Avatars Disponibles
					</Text>
					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
							gap: 8,
						}}
					>
						{avatarTypes.map((avatar) => (
							<View
								key={avatar}
								style={{
									alignItems: "center",
									padding: 8,
									backgroundColor: theme.colors.card,
									borderRadius: 8,
									margin: 4,
									width: 80,
								}}
							>
								<UserBadge width={40} height={40} customProfilePicture={avatar} />
								<Text
									style={{
										fontSize: 10,
										color: theme.colors.text,
										textAlign: "center",
										marginTop: 4,
									}}
								>
									{avatar}
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* Section: Bots générés */}
				<View style={{ marginBottom: 16 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 12,
						}}
					>
						<Text
							style={{
								fontSize: 16,
								fontFamily: theme.fonts.medium.fontFamily,
								color: theme.colors.text,
							}}
						>
							Bots Générés ({bots.length})
						</Text>
						<TouchableOpacity
							onPress={generateTestBots}
							disabled={isGenerating}
							style={{
								backgroundColor: theme.colors.primary,
								paddingHorizontal: 12,
								paddingVertical: 6,
								borderRadius: 6,
								opacity: isGenerating ? 0.5 : 1,
							}}
						>
							<Text
								style={{
									color: "white",
									fontSize: 12,
									fontFamily: theme.fonts.medium.fontFamily,
								}}
							>
								{isGenerating ? "Génération..." : "Regénérer"}
							</Text>
						</TouchableOpacity>
					</View>

					{bots.map((bot, index) => (
						<View
							key={bot.uid}
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: theme.colors.card,
								padding: 12,
								borderRadius: 8,
								marginBottom: 8,
							}}
						>
							<UserBadge
								width={40}
								height={40}
								customProfilePicture={bot.profilePicture}
							/>
							<View style={{ marginLeft: 12, flex: 1 }}>
								<Text
									style={{
										fontSize: 14,
										fontFamily: theme.fonts.medium.fontFamily,
										color: theme.colors.text,
									}}
								>
									{bot.nom}
								</Text>
								<Text
									style={{
										fontSize: 12,
										color: theme.colors.textSecondary,
									}}
								>
									Avatar: {bot.profilePicture}
								</Text>
								<Text
									style={{
										fontSize: 12,
										color: theme.colors.textSecondary,
									}}
								>
									Points: {bot.league?.points || 0}
								</Text>
							</View>
							<View
								style={{
									backgroundColor: theme.colors.primary,
									paddingHorizontal: 8,
									paddingVertical: 4,
									borderRadius: 4,
								}}
							>
								<Text
									style={{
										color: "white",
										fontSize: 10,
										fontFamily: theme.fonts.medium.fontFamily,
									}}
								>
									BOT
								</Text>
							</View>
						</View>
					))}
				</View>
			</View>
		</ScrollView>
	);
};

export default BotAvatarTest;
