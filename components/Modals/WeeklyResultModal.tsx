import React, { useEffect, useRef, useState } from "react";
import {
	Text,
	View,
	Animated,
	Dimensions,
	Modal,
	Pressable,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { lightenColor, lightenColorHex } from "@utils/colors";
import ZoomableView from "@components/Shared/ZoomableView";
import { League } from "../../type/league.d";
import { Member } from "../../type/member";
import { LeagueRewardService } from "../../services/LeagueRewardService";

export type WeeklyResultType = "promotion" | "maintained" | "relegated";

export interface WeeklyResultData {
	type: WeeklyResultType;
	currentLeague: League;
	newLeague?: League;
	weeklyPoints: number;
	totalReward: number;
	rankInLeague: number;
	totalParticipants: number;
}

type Props = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	resultData: WeeklyResultData | null;
	member: Member;
};

const WeeklyResultModal = ({
	visible,
	setVisible,
	resultData,
	member,
}: Props) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const animatedProgress = useRef(new Animated.Value(0)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.8)).current;
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(animatedProgress, {
					toValue: 100,
					duration: 2000,
					useNativeDriver: false,
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			// Reset animations
			animatedProgress.setValue(0);
			fadeAnim.setValue(0);
			scaleAnim.setValue(0.8);
		}
	}, [visible]);

	if (!resultData) return null;

	const handleContinue = () => {
		setLoading(true);
		setVisible(false);
		setLoading(false);
	};

	const getResultConfig = () => {
		switch (resultData.type) {
			case "promotion":
				return {
					title: "🎉 PROMOTION !",
					subtitle: `Vous montez en ${resultData.newLeague?.name}`,
					color: theme.colors.greenPrimary,
					icon: "arrow-up-circle",
					message: "Félicitations ! Vous avez été promu dans une ligue supérieure !",
				};
			case "maintained":
				return {
					title: "✅ MAINTENU !",
					subtitle: `Vous restez en ${resultData.currentLeague.name}`,
					color: theme.colors.bluePrimary,
					icon: "check-circle",
					message: "Bien joué ! Vous gardez votre place dans la ligue.",
				};
			case "relegated":
				return {
					title: "📉 RELÉGUÉ",
					subtitle: `Vous descendez en ${resultData.newLeague?.name}`,
					color: theme.colors.redPrimary,
					icon: "arrow-down-circle",
					message:
						"Ne vous découragez pas, revenez plus fort la semaine prochaine !",
				};
		}
	};

	const config = getResultConfig();
	const lightColor = lightenColorHex(config.color);

	return (
		<Modal
			visible={visible}
			transparent={false}
			hardwareAccelerated={true}
			onRequestClose={() => setVisible(false)}
			statusBarTranslucent={true}
			className="w-screen h-screen"
		>
			<Animated.View
				style={{
					flex: 1,
					opacity: fadeAnim,
					transform: [{ scale: scaleAnim }],
				}}
			>
				<LinearGradient
					style={{
						paddingTop: 40,
						height: Dimensions.get("screen").height,
						padding: 20,
						width: "100%",
					}}
					start={[0, 0]}
					colors={[
						lightenColor(config.color, 0.4) || theme.colors.cardBackground,
						theme.colors.background,
						lightenColor(config.color, 0.4) || theme.colors.cardBackground,
					]}
				>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{/* Titre principal */}
						<View style={{ alignItems: "center", marginBottom: 32 }}>
							<MaterialCommunityIcons
								name={config.icon as any}
								size={80}
								color={config.color}
								style={{ marginBottom: 16 }}
							/>
							<Text
								style={{
									fontSize: 28,
									fontFamily: theme.fonts.bold.fontFamily,
									color: theme.colors.text,
									textAlign: "center",
									marginBottom: 8,
								}}
							>
								{config.title}
							</Text>
							<Text
								style={{
									fontSize: 16,
									fontFamily: theme.fonts.medium.fontFamily,
									color: theme.colors.textSecondary,
									textAlign: "center",
								}}
							>
								{config.subtitle}
							</Text>
						</View>

						{/* Message de motivation */}
						<View
							style={{
								backgroundColor: theme.colors.cardBackground,
								borderRadius: 16,
								padding: 16,
								marginBottom: 24,
								borderWidth: 1,
								borderColor: config.color + "20",
							}}
						>
							<Text
								style={{
									fontSize: 14,
									fontFamily: theme.fonts.regular.fontFamily,
									color: theme.colors.text,
									textAlign: "center",
									lineHeight: 20,
								}}
							>
								{config.message}
							</Text>
						</View>

						{/* Statistiques de la semaine */}
						<View
							style={{
								backgroundColor: theme.colors.cardBackground,
								borderRadius: 16,
								padding: 20,
								marginBottom: 24,
								width: "100%",
								maxWidth: 350,
							}}
						>
							<Text
								style={{
									fontSize: 16,
									fontFamily: theme.fonts.bold.fontFamily,
									color: theme.colors.text,
									textAlign: "center",
									marginBottom: 16,
								}}
							>
								📊 Résultats de la semaine
							</Text>

							{/* Points de la semaine */}
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
										fontSize: 14,
										fontFamily: theme.fonts.medium.fontFamily,
										color: theme.colors.textSecondary,
									}}
								>
									Points gagnés
								</Text>
								<Text
									style={{
										fontSize: 16,
										fontFamily: theme.fonts.bold.fontFamily,
										color: config.color,
									}}
								>
									{resultData.weeklyPoints}
								</Text>
							</View>

							{/* Classement */}
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
										fontSize: 14,
										fontFamily: theme.fonts.medium.fontFamily,
										color: theme.colors.textSecondary,
									}}
								>
									Classement
								</Text>
								<Text
									style={{
										fontSize: 16,
										fontFamily: theme.fonts.bold.fontFamily,
										color: theme.colors.text,
									}}
								>
									{resultData.rankInLeague}e / {resultData.totalParticipants}
								</Text>
							</View>

							{/* Récompenses */}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									backgroundColor: theme.colors.background,
									borderRadius: 12,
									padding: 12,
									marginTop: 8,
								}}
							>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Text
										style={{
											fontSize: 14,
											fontFamily: theme.fonts.medium.fontFamily,
											color: theme.colors.textSecondary,
											marginRight: 8,
										}}
									>
										Récompenses
									</Text>
									<MoneyMelios width={20} height={20} />
								</View>
								<Text
									style={{
										fontSize: 18,
										fontFamily: theme.fonts.bold.fontFamily,
										color: theme.colors.yellowPrimary,
									}}
								>
									+{resultData.totalReward}
								</Text>
							</View>
						</View>

						{/* Bouton continuer */}
						<View style={{ width: "100%", maxWidth: 350 }}>
							<ZoomableView>
								<Pressable
									style={{
										backgroundColor: config.color,
										padding: 16,
										borderRadius: 12,
										alignItems: "center",
										justifyContent: "center",
									}}
									onPress={handleContinue}
									disabled={loading}
								>
									{loading ? (
										<ActivityIndicator color="white" />
									) : (
										<Text
											style={{
												color: "white",
												fontSize: 16,
												fontFamily: theme.fonts.bold.fontFamily,
											}}
										>
											Continuer
										</Text>
									)}
								</Pressable>
							</ZoomableView>
						</View>
					</ScrollView>
				</LinearGradient>
			</Animated.View>
		</Modal>
	);
};

export default WeeklyResultModal;
