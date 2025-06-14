import React, { useEffect, useState } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { League } from "../type/league";

interface PromotionNotificationProps {
	visible: boolean;
	oldLeague: League | null;
	newLeague: League | null;
	onDismiss: () => void;
}

export const PromotionNotification: React.FC<PromotionNotificationProps> = ({
	visible,
	oldLeague,
	newLeague,
	onDismiss,
}) => {
	const { theme } = useTheme();
	const [slideAnim] = useState(new Animated.Value(-100));
	const [scaleAnim] = useState(new Animated.Value(0));

	useEffect(() => {
		if (visible && newLeague) {
			// Animation d'entrée
			Animated.parallel([
				Animated.timing(slideAnim, {
					toValue: 20,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.spring(scaleAnim, {
					toValue: 1,
					tension: 50,
					friction: 7,
					useNativeDriver: true,
				}),
			]).start();

			// Auto-dismiss après 4 secondes
			const timer = setTimeout(() => {
				handleDismiss();
			}, 4000);

			return () => clearTimeout(timer);
		} else {
			// Animation de sortie
			Animated.parallel([
				Animated.timing(slideAnim, {
					toValue: -100,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [visible, newLeague]);

	const handleDismiss = () => {
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: -100,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start(() => {
			onDismiss();
		});
	};

	if (!visible || !newLeague) return null;

	return (
		<Animated.View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
			}}
		>
			<TouchableOpacity
				onPress={handleDismiss}
				activeOpacity={0.9}
				style={{
					marginHorizontal: 16,
					marginTop: 50,
				}}
			>
				<LinearGradient
					colors={[newLeague.color, theme.colors.mythologyGold || "#FFD700"]}
					style={{
						borderRadius: 16,
						padding: 16,
						shadowColor: newLeague.color,
						shadowOffset: { width: 0, height: 8 },
						shadowOpacity: 0.3,
						shadowRadius: 12,
						elevation: 10,
					}}
				>
					<View className="flex-row items-center">
						<View className="mr-3">
							<MaterialCommunityIcons name="trophy" size={32} color="white" />
						</View>

						<View className="flex-1">
							<Text
								className="text-lg font-bold text-white mb-1"
								style={{ fontFamily: theme.fonts.bold.fontFamily }}
							>
								🎉 PROMOTION !
							</Text>

							{oldLeague && (
								<Text
									className="text-sm text-white opacity-90"
									style={{ fontFamily: theme.fonts.regular.fontFamily }}
								>
									{oldLeague.name} → {newLeague.name}
								</Text>
							)}

							<Text
								className="text-xs text-white opacity-75 mt-1"
								style={{ fontFamily: theme.fonts.regular.fontFamily }}
							>
								+20 récompenses gagnées ! 🏆
							</Text>
						</View>

						<TouchableOpacity
							onPress={handleDismiss}
							className="ml-2"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.2)",
								borderRadius: 12,
								width: 24,
								height: 24,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<MaterialCommunityIcons name="close" size={16} color="white" />
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</TouchableOpacity>
		</Animated.View>
	);
};
