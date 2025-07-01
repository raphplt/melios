import React, { useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import CachedImage from "@components/Shared/CachedImage";
import { League } from "../../type/league.d";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.25;
const CARD_MARGIN = 8;

interface LeagueCarouselProps {
	leagues: League[];
	currentLeague: League | null;
	onLeaguePress?: (league: League) => void;
}

export const LeagueCarousel: React.FC<LeagueCarouselProps> = ({
	leagues,
	currentLeague,
	onLeaguePress,
}) => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const scrollRef = useRef<ScrollView>(null);

	const sortedLeagues = leagues.sort((a, b) => a.rank - b.rank);

	const scrollToCurrentLeague = () => {
		if (!currentLeague) return;
		
		const currentIndex = sortedLeagues.findIndex(l => l.id === currentLeague.id);
		if (currentIndex >= 0) {
			const scrollPosition = currentIndex * (CARD_WIDTH + CARD_MARGIN * 2);
			scrollRef.current?.scrollTo({ 
				x: Math.max(0, scrollPosition - screenWidth / 2 + CARD_WIDTH / 2), 
				animated: true 
			});
		}
	};

	React.useEffect(() => {
		// Scroll to current league when component mounts
		setTimeout(scrollToCurrentLeague, 100);
	}, [currentLeague]);

	const renderLeagueCard = (league: League, index: number) => {
		const isCurrentLeague = currentLeague?.id === league.id;
		const isUnlocked = currentLeague ? league.rank <= currentLeague.rank : league.rank === 1;

		return (
			<TouchableOpacity
				key={league.id}
				style={{
					width: CARD_WIDTH,
					marginHorizontal: CARD_MARGIN,
				}}
				onPress={() => onLeaguePress?.(league)}
				activeOpacity={0.8}
			>
				<View
					style={{
						alignItems: "center",
						padding: 12,
						borderRadius: 16,
						backgroundColor: isCurrentLeague 
							? theme.colors.primary + "15" 
							: theme.colors.cardBackground,
						borderWidth: isCurrentLeague ? 2 : 1,
						borderColor: isCurrentLeague 
							? theme.colors.primary 
							: theme.colors.border,
						shadowColor: theme.colors.border,
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: isCurrentLeague ? 0.2 : 0.1,
						shadowRadius: 8,
						elevation: isCurrentLeague ? 6 : 3,
					}}
				>
					{/* League Badge */}
					<View
						style={{
							width: 48,
							height: 48,
							borderRadius: 24,
							backgroundColor: isUnlocked 
								? league.color + "20" 
								: theme.colors.grayPrimary + "20",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 8,
							overflow: "hidden",
						}}
					>
						{isUnlocked ? (
							<CachedImage
								imagePath={`images/badges/${league.iconUrl}`}
								style={{
									width: 36,
									height: 36,
								}}
								placeholder={
									<MaterialCommunityIcons
										name="medal"
										size={24}
										color={league.color}
									/>
								}
							/>
						) : (
							<MaterialCommunityIcons
								name="lock"
								size={24}
								color={theme.colors.grayPrimary}
							/>
						)}
					</View>

					{/* League Name */}
					<Text
						numberOfLines={2}
						style={{
							fontSize: 12,
							textAlign: "center",
							color: isUnlocked 
								? theme.colors.text 
								: theme.colors.grayPrimary,
							fontFamily: isCurrentLeague 
								? theme.fonts.bold.fontFamily 
								: theme.fonts.medium.fontFamily,
							lineHeight: 14,
						}}
					>
						{league.name}
					</Text>

					{/* Current League Indicator */}
					{isCurrentLeague && (
						<View
							style={{
								marginTop: 4,
								paddingHorizontal: 6,
								paddingVertical: 2,
								backgroundColor: theme.colors.primary,
								borderRadius: 8,
							}}
						>
							<Text
								style={{
									fontSize: 8,
									color: theme.colors.textSecondary,
									fontFamily: theme.fonts.bold.fontFamily,
								}}
							>
								{t("leagues.current")}
							</Text>
						</View>
					)}

					{/* Points Required (for locked leagues) */}
					{!isUnlocked && league.pointsRequired > 0 && (
						<Text
							style={{
								fontSize: 9,
								color: theme.colors.grayPrimary,
								fontFamily: theme.fonts.regular.fontFamily,
								marginTop: 2,
								textAlign: "center",
							}}
						>
							{league.pointsRequired} pts
						</Text>
					)}
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View style={{ marginBottom: 20 }}>
			<View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
				<Text
					style={{
						fontSize: 16,
						fontFamily: theme.fonts.bold.fontFamily,
						color: theme.colors.text,
						marginBottom: 4,
					}}
				>
					{t("leagues.all_leagues")}
				</Text>
				<Text
					style={{
						fontSize: 12,
						fontFamily: theme.fonts.regular.fontFamily,
						color: theme.colors.textTertiary,
					}}
				>
					{t("leagues.scroll_to_explore")}
				</Text>
			</View>

			<ScrollView
				ref={scrollRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: 16,
				}}
				decelerationRate="fast"
				snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
				snapToAlignment="start"
			>
				{sortedLeagues.map((league, index) => renderLeagueCard(league, index))}
			</ScrollView>
		</View>
	);
};
