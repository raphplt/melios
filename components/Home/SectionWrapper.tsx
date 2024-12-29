import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	LayoutAnimation,
	UIManager,
	Platform,
	Animated,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { ReactNode } from "react";
import { Iconify } from "react-native-iconify";

// Activer LayoutAnimation pour Android
if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SectionWrapper({
	children,
	title,
	icon,
}: {
	children: ReactNode;
	title: string;
	icon?: ReactNode;
}) {
	const { theme } = useTheme();
	const [showHabits, setShowHabits] = useState(true);

	// Valeur animée pour la rotation
	const rotationValue = useRef(new Animated.Value(0)).current;

	// Effet pour gérer l'animation de rotation
	useEffect(() => {
		Animated.timing(rotationValue, {
			toValue: showHabits ? 0 : 1, // 0 pour ouvert, 1 pour fermé
			duration: 300, // Durée de l'animation
			useNativeDriver: true, // Active l'optimisation
		}).start();
	}, [showHabits]);

	// Calculer l'angle de rotation
	const rotation = rotationValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "180deg"], // Tourne de 180 degrés
	});

	const toggleShowHabits = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setShowHabits(!showHabits);
	};

	return (
		<View className="mt-4">
			<TouchableOpacity
				onPress={toggleShowHabits}
				className="flex flex-row items-center w-11/12 mx-auto py-1"
			>
				{icon}
				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-lg font-semibold ml-2"
				>
					{title}
				</Text>
				<View className="absolute right-0">
					{/* Utilisation d'Animated.View pour animer l'icône */}
					<Animated.View style={{ transform: [{ rotate: rotation }] }}>
						{showHabits ? (
							<Iconify
								icon="ic:round-minus"
								size={24}
								color={theme.colors.textTertiary}
							/>
						) : (
							<Iconify
								icon="ic:round-plus"
								size={24}
								color={theme.colors.textTertiary}
							/>
						)}
					</Animated.View>
				</View>
			</TouchableOpacity>

			<View style={{ height: showHabits ? "auto" : 0, overflow: "hidden" }}>
				{children}
			</View>
		</View>
	);
}
