import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions } from "react-native";
import { useTheme } from "@context/ThemeContext";

interface ParticleEffectProps {
	isActive?: boolean;
	color?: string;
	particleCount?: number;
}

const { width, height } = Dimensions.get("window");

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
	isActive = false,
	color,
	particleCount = 15,
}) => {
	const { theme } = useTheme();
	const particles = useRef(
		Array.from({ length: particleCount }, (_, i) => ({
			id: i,
			x: new Animated.Value(Math.random() * width),
			y: new Animated.Value(Math.random() * height),
			opacity: new Animated.Value(0),
			scale: new Animated.Value(0),
		}))
	).current;

	useEffect(() => {
		if (isActive) {
			startParticleAnimation();
		} else {
			stopParticleAnimation();
		}
	}, [isActive]);

	const startParticleAnimation = () => {
		particles.forEach((particle, index) => {
			const animateParticle = () => {
				Animated.sequence([
					Animated.parallel([
						Animated.timing(particle.opacity, {
							toValue: 0.8,
							duration: 1000,
							useNativeDriver: true,
						}),
						Animated.timing(particle.scale, {
							toValue: 1,
							duration: 1000,
							useNativeDriver: true,
						}),
					]),
					Animated.parallel([
						Animated.timing(particle.x, {
							toValue: Math.random() * width,
							duration: 3000 + Math.random() * 2000,
							useNativeDriver: true,
						}),
						Animated.timing(particle.y, {
							toValue: Math.random() * height,
							duration: 3000 + Math.random() * 2000,
							useNativeDriver: true,
						}),
					]),
					Animated.parallel([
						Animated.timing(particle.opacity, {
							toValue: 0,
							duration: 1000,
							useNativeDriver: true,
						}),
						Animated.timing(particle.scale, {
							toValue: 0,
							duration: 1000,
							useNativeDriver: true,
						}),
					]),
				]).start(() => {
					if (isActive) {
						// Reset position and restart
						particle.x.setValue(Math.random() * width);
						particle.y.setValue(Math.random() * height);
						setTimeout(() => animateParticle(), Math.random() * 2000);
					}
				});
			};

			// Stagger the start of each particle
			setTimeout(() => animateParticle(), index * 200);
		});
	};

	const stopParticleAnimation = () => {
		particles.forEach((particle) => {
			particle.opacity.setValue(0);
			particle.scale.setValue(0);
		});
	};

	if (!isActive) return null;

	return (
		<View className="absolute inset-0 pointer-events-none">
			{particles.map((particle) => (
				<Animated.View
					key={particle.id}
					className="absolute w-2 h-2 rounded-full"
					style={{
						backgroundColor: color || theme.colors.mythologyGold,
						opacity: particle.opacity,
						transform: [
							{ translateX: particle.x },
							{ translateY: particle.y },
							{ scale: particle.scale },
						],
					}}
				/>
			))}
		</View>
	);
};

// Composant pour les effets de constellation
export const ConstellationEffect: React.FC<{ isActive: boolean }> = ({
	isActive,
}) => {
	const { theme } = useTheme();
	const stars = useRef(
		Array.from({ length: 6 }, (_, i) => ({
			id: i,
			opacity: new Animated.Value(0),
			scale: new Animated.Value(0),
		}))
	).current;

	useEffect(() => {
		if (isActive) {
			startConstellationAnimation();
		} else {
			stopConstellationAnimation();
		}
	}, [isActive]);

	const startConstellationAnimation = () => {
		stars.forEach((star, index) => {
			Animated.loop(
				Animated.sequence([
					Animated.parallel([
						Animated.timing(star.opacity, {
							toValue: 0.8,
							duration: 1000 + index * 200,
							useNativeDriver: true,
						}),
						Animated.timing(star.scale, {
							toValue: 1,
							duration: 1000 + index * 200,
							useNativeDriver: true,
						}),
					]),
					Animated.timing(star.opacity, {
						toValue: 0.3,
						duration: 2000,
						useNativeDriver: true,
					}),
				])
			).start();
		});
	};

	const stopConstellationAnimation = () => {
		stars.forEach((star) => {
			star.opacity.setValue(0);
			star.scale.setValue(0);
		});
	};

	if (!isActive) return null;

	return (
		<View className="absolute inset-0 pointer-events-none">
			{stars.map((star, index) => (
				<Animated.View
					key={star.id}
					className="absolute w-1 h-1 rounded-full"
					style={{
						top: `${15 + index * 12}%`,
						left: `${10 + (index % 2) * 70}%`,
						backgroundColor: theme.colors.mythologyGold,
						opacity: star.opacity,
						transform: [{ scale: star.scale }],
						shadowColor: theme.colors.mythologyGold,
						shadowOffset: { width: 0, height: 0 },
						shadowOpacity: 0.8,
						shadowRadius: 2,
						elevation: 3,
					}}
				/>
			))}
		</View>
	);
};
