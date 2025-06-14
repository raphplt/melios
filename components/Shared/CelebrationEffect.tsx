import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions } from "react-native";
import { useTheme } from "@context/ThemeContext";

interface CelebrationEffectProps {
	isVisible: boolean;
	type: "rankUp" | "achievement" | "victory";
	onComplete?: () => void;
}

const { width, height } = Dimensions.get("window");

export const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
	isVisible,
	type,
	onComplete,
}) => {
	const { theme } = useTheme();
	const confetti = useRef(
		Array.from({ length: 20 }, (_, i) => ({
			id: i,
			x: new Animated.Value(Math.random() * width),
			y: new Animated.Value(-50),
			rotation: new Animated.Value(0),
			scale: new Animated.Value(0),
		}))
	).current;

	const sparkles = useRef(
		Array.from({ length: 15 }, (_, i) => ({
			id: i,
			x: new Animated.Value(width / 2),
			y: new Animated.Value(height / 2),
			opacity: new Animated.Value(0),
			scale: new Animated.Value(0),
		}))
	).current;

	useEffect(() => {
		if (isVisible) {
			startCelebration();
		} else {
			resetAnimations();
		}
	}, [isVisible]);

	const startCelebration = () => {
		// Animation des confettis
		const confettiAnimations = confetti.map((item, index) => {
			const delay = index * 50;
			return Animated.sequence([
				Animated.delay(delay),
				Animated.parallel([
					Animated.timing(item.scale, {
						toValue: 1,
						duration: 300,
						useNativeDriver: true,
					}),
					Animated.timing(item.y, {
						toValue: height + 100,
						duration: 3000,
						useNativeDriver: true,
					}),
					Animated.timing(item.rotation, {
						toValue: 4,
						duration: 3000,
						useNativeDriver: true,
					}),
				]),
			]);
		});

		// Animation des étincelles
		const sparkleAnimations = sparkles.map((item, index) => {
			const angle = (index / sparkles.length) * 2 * Math.PI;
			const radius = 100;
			const targetX = width / 2 + Math.cos(angle) * radius;
			const targetY = height / 2 + Math.sin(angle) * radius;

			return Animated.sequence([
				Animated.delay(index * 30),
				Animated.parallel([
					Animated.timing(item.opacity, {
						toValue: 1,
						duration: 500,
						useNativeDriver: true,
					}),
					Animated.timing(item.scale, {
						toValue: 1,
						duration: 500,
						useNativeDriver: true,
					}),
					Animated.timing(item.x, {
						toValue: targetX,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(item.y, {
						toValue: targetY,
						duration: 1000,
						useNativeDriver: true,
					}),
				]),
				Animated.parallel([
					Animated.timing(item.opacity, {
						toValue: 0,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(item.scale, {
						toValue: 0,
						duration: 1000,
						useNativeDriver: true,
					}),
				]),
			]);
		});

		Animated.parallel([...confettiAnimations, ...sparkleAnimations]).start(() => {
			onComplete?.();
		});
	};

	const resetAnimations = () => {
		confetti.forEach((item) => {
			item.x.setValue(Math.random() * width);
			item.y.setValue(-50);
			item.rotation.setValue(0);
			item.scale.setValue(0);
		});

		sparkles.forEach((item) => {
			item.x.setValue(width / 2);
			item.y.setValue(height / 2);
			item.opacity.setValue(0);
			item.scale.setValue(0);
		});
	};

	const getConfettiColor = (index: number) => {
		const colors = [
			theme.colors.mythologyGold || "#FFD700",
			theme.colors.purplePrimary,
			theme.colors.bluePrimary,
			theme.colors.greenPrimary,
			theme.colors.orangePrimary,
		];
		return colors[index % colors.length];
	};

	const getConfettiShape = (index: number) => {
		const shapes = ["⭐", "🎉", "✨", "🏆", "👑"];
		return shapes[index % shapes.length];
	};

	if (!isVisible) return null;

	return (
		<View
			className="absolute inset-0 pointer-events-none"
			style={{ zIndex: 1000 }}
		>
			{/* Confettis */}
			{confetti.map((item, index) => (
				<Animated.Text
					key={`confetti-${item.id}`}
					className="absolute text-2xl"
					style={{
						transform: [
							{ translateX: item.x },
							{ translateY: item.y },
							{ scale: item.scale },
							{
								rotate: item.rotation.interpolate({
									inputRange: [0, 1],
									outputRange: ["0deg", "360deg"],
								}),
							},
						],
					}}
				>
					{getConfettiShape(index)}
				</Animated.Text>
			))}

			{/* Étincelles */}
			{sparkles.map((item) => (
				<Animated.View
					key={`sparkle-${item.id}`}
					className="absolute w-2 h-2 rounded-full"
					style={{
						backgroundColor: theme.colors.mythologyGold,
						transform: [
							{ translateX: item.x },
							{ translateY: item.y },
							{ scale: item.scale },
						],
						opacity: item.opacity,
						shadowColor: theme.colors.mythologyGold,
						shadowOffset: { width: 0, height: 0 },
						shadowOpacity: 0.8,
						shadowRadius: 4,
						elevation: 5,
					}}
				/>
			))}

			{/* Overlay avec message selon le type */}
			{type === "rankUp" && (
				<View className="absolute inset-0 items-center justify-center">
					<View
						className="rounded-3xl p-6 items-center"
						style={{
							backgroundColor: `${theme.colors.mythologyGold}20`,
							borderWidth: 2,
							borderColor: theme.colors.mythologyGold,
						}}
					>
						<Animated.Text
							className="text-4xl mb-2"
							style={{
								transform: [
									{
										scale:
											sparkles[0]?.scale.interpolate({
												inputRange: [0, 1],
												outputRange: [0.5, 1.2],
											}) || 1,
									},
								],
							}}
						>
							🎉
						</Animated.Text>
						<Animated.Text
							className="text-xl font-bold text-center"
							style={{
								color: theme.colors.mythologyGold,
								fontFamily: theme.fonts.bold.fontFamily,
								opacity: sparkles[0]?.opacity || 1,
							}}
						>
							Montée de rang !
						</Animated.Text>
					</View>
				</View>
			)}
		</View>
	);
};
