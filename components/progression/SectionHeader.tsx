import React, { useEffect, useRef } from "react";
import { Pressable, View, Text, Animated } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Iconify } from "react-native-iconify";
import ZoomableView from "@components/Shared/ZoomableView";

type Props = {
	title: string;
	show: boolean;
	setShow: (show: boolean) => void;
	icon: string;
	children: React.ReactNode;
};

export default function SectionHeader({
	title,
	show,
	setShow,
	icon,
	children,
}: Props) {
	const { theme } = useTheme();

	// Valeur animée pour la rotation
	const rotationValue = useRef(new Animated.Value(0)).current;

	// Effet pour synchroniser la rotation avec l’état "show"
	useEffect(() => {
		Animated.timing(rotationValue, {
			toValue: show ? 1 : 0, // 1 pour "ouvert", 0 pour "fermé"
			duration: 300, // Durée de l’animation
			useNativeDriver: true, // Optimisation pour les animations
		}).start();
	}, [show]);

	// Interpolation pour convertir la valeur en degrés
	const rotation = rotationValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "180deg"], // Rotation de 0 à 180 degrés
	});

	// Rendu de l’icône
	const renderIcon = () => {
		switch (icon) {
			case "calendar":
				return (
					<Iconify icon="mdi-calendar" size={22} color={theme.colors.primary} />
				);
			case "graph":
				return (
					<Iconify icon="mdi-chart-line" size={22} color={theme.colors.primary} />
				);
			case "levels":
				return (
					<Iconify icon="mdi:progress-star" size={22} color={theme.colors.primary} />
				);
		}
	};

	return (
		<>
			<ZoomableView>
				<Pressable
					className="flex flex-row w-[95%] rounded-xl px-2 py-2 mx-auto items-center justify-between mt-1"
					style={{
						backgroundColor: theme.colors.background,
						borderColor: theme.colors.primary,
						borderWidth: 2,
					}}
					onPress={() => setShow(!show)}
				>
					<View className="flex flex-row items-center">
						{renderIcon()}
						<Text
							className="text-[16px] mx-2 font-semibold"
							style={{
								color: theme.colors.text,
							}}
						>
							{title}
						</Text>
					</View>

					{/* Icône animée */}
					<Animated.View style={{ transform: [{ rotate: rotation }] }}>
						<Ionicons
							name="chevron-down" // Icône fixe, rotation gérée par Animated
							size={24}
							color={theme.colors.primary}
						/>
					</Animated.View>
				</Pressable>
			</ZoomableView>

			{/* Affichage conditionnel des enfants */}
			{show && children}
		</>
	);
}
