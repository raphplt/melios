import { ScrollView, Text, View, Animated } from "react-native";
import { useData } from "@context/DataContext";
import { useLeague } from "../../hooks/useLeague";
import { LeagueBar } from "../../components/LeagueBar";
import { CurrentLeague } from "../../components/CurrentLeague";
import { WeeklyRanking } from "../../components/WeeklyRanking";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

const LeagueCurrent = () => {
	const { member, setMember } = useData();
	const { leagues, currentLeague, leagueRoom, loading, creatingRoom } =
		useLeague(member || null, setMember);

	const loadingAnimation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (loading) {
			Animated.loop(
				Animated.timing(loadingAnimation, {
					toValue: 1,
					duration: 1500,
					useNativeDriver: true,
				})
			).start();
		}
	}, [loading]);

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<LinearGradient
					colors={["#1F2937", "#374151"]}
					className="rounded-2xl p-8 items-center"
				>
					<Animated.View
						style={{
							transform: [
								{
									rotate: loadingAnimation.interpolate({
										inputRange: [0, 1],
										outputRange: ["0deg", "360deg"],
									}),
								},
							],
						}}
					>
						<MaterialCommunityIcons name="loading" size={48} color="#7C3AED" />
					</Animated.View>
					<Text className="text-gray-300 text-lg mt-4 font-medium">
						Chargement des ligues...
					</Text>
				</LinearGradient>
			</View>
		);
	}

	if (!member) {
		return (
			<View className="flex-1 justify-center items-center p-8">
				<MaterialCommunityIcons name="account-off" size={64} color="#6B7280" />
				<Text className="text-gray-500 text-lg mt-4 text-center">
					Aucun utilisateur connecté
				</Text>
			</View>
		);
	}

	return (
		<ScrollView
			className="flex-1 bg-gray-950"
			showsVerticalScrollIndicator={false}
		>
			{/* Header */}
			<LinearGradient
				colors={["#7C3AED", "#A855F7", "transparent"]}
				className="pt-12 pb-6"
			>
				<Text className="text-3xl font-bold text-white text-center mb-2">
					🏆 Ligues
				</Text>
				<Text className="text-gray-200 text-center text-base">
					Montez en grade et dominez le classement !
				</Text>
			</LinearGradient>

			{/* League Bar */}
			<LeagueBar leagues={leagues} currentLeagueId={member?.league?.leagueId} />

			{/* Current League */}
			{currentLeague && <CurrentLeague league={currentLeague} member={member} />}

			{/* Weekly Ranking */}
			<WeeklyRanking
				leagueRoom={leagueRoom}
				currentMember={member}
				creatingRoom={creatingRoom}
			/>

			{/* Bottom spacing */}
			<View className="h-8" />
		</ScrollView>
	);
};

export default LeagueCurrent;
