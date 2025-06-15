import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";

interface StatCardProps {
	icon: string;
	title: string;
	value: string | number;
	subtitle?: string;
	color: string;
	delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
	icon,
	title,
	value,
	subtitle,
	color,
	delay = 0,
}) => {
	const { theme } = useTheme();
	const scaleAnimation = useRef(new Animated.Value(0)).current;
	const fadeAnimation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.sequence([
			Animated.delay(delay),
			Animated.parallel([
				Animated.spring(scaleAnimation, {
					toValue: 1,
					tension: 100,
					friction: 6,
					useNativeDriver: true,
				}),
				Animated.timing(fadeAnimation, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
			]),
		]).start();
	}, [delay]);

	return (
		<Animated.View
			style={{
				transform: [{ scale: scaleAnimation }],
				opacity: fadeAnimation,
			}}
			className="flex-1 mx-1"
		>
			<LinearGradient
				colors={[theme.colors.backgroundSecondary, theme.colors.backgroundTertiary]}
				style={{
					shadowColor: color,
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.15,
					shadowRadius: 8,
					elevation: 6,
					borderWidth: 1,
					borderColor: `${color}20`,
					borderRadius: 12,
					padding: 16,
					alignItems: "center",
				}}
			>
				<View
					className="w-12 h-12 rounded-full items-center justify-center mb-3"
					style={{
						backgroundColor: `${color}20`,
						borderWidth: 2,
						borderColor: `${color}40`,
					}}
				>
					<MaterialCommunityIcons name={icon as any} size={24} color={color} />
				</View>

				<Text
					className="text-sm text-center mb-1"
					style={{
						color: theme.colors.textTertiary,
					}}
				>
					{title}
				</Text>

				<Text
					className="text-xl font-bold text-center"
					style={{
						color: theme.colors.text,
					}}
				>
					{value}
				</Text>

				{subtitle && (
					<Text
						className="text-sm text-center mt-1"
						style={{
							color: theme.colors.textTertiary,
							opacity: 0.8,
						}}
					>
						{subtitle}
					</Text>
				)}
			</LinearGradient>
		</Animated.View>
	);
};

interface LeagueStatsProps {
	participants: number;
	record: number;
	average: number;
}

export const LeagueStats: React.FC<LeagueStatsProps> = ({
	participants,
	record,
	average,
}) => {
	const { theme } = useTheme();

	return (
		<View className="mx-4 mb-6">
			<View className="flex-row items-center mb-4">
				<Iconify
					icon="mingcute:laurel-wreath-line"
					size={24}
					color={theme.colors.text}
				/>

				<Text
					className="text-lg font-bold px-2"
					style={{
						color: theme.colors.text,
						// fontFamily: theme.fonts.bold.fontFamily,
					}}
				>
					Statistiques Olympiques
				</Text>
			</View>

			<View className="flex-row">
				<StatCard
					icon="account-group"
					title="Participants"
					value={participants}
					subtitle="dieux"
					color={theme.colors.bluePrimary}
					delay={0}
				/>

				<StatCard
					icon="trophy"
					title="Record Divin"
					value={record}
					subtitle="points"
					color={theme.colors.orangePrimary || "#FFD700"}
					delay={100}
				/>

				<StatCard
					icon="trending-up"
					title="Moyenne"
					value={average}
					subtitle="pts/dieu"
					color={theme.colors.greenPrimary}
					delay={200}
				/>
			</View>
		</View>
	);
};
