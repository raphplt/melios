import React, { useRef, useEffect } from "react";
import {
	View,
	Text,
	Pressable,
	LayoutAnimation,
	UIManager,
	Platform,
	Animated,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Iconify } from "react-native-iconify";
import ZoomableView from "@components/Shared/ZoomableView";

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

	useEffect(() => {
		Animated.timing(rotationValue, {
			toValue: show ? 1 : 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [show]);

	// Calculer l'angle de rotation
	const rotation = rotationValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "180deg"],
	});

	const toggleShow = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setShow(!show);
	};

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
					onPress={toggleShow}
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

					<Animated.View style={{ transform: [{ rotate: rotation }] }}>
						<Ionicons name="chevron-down" size={24} color={theme.colors.primary} />
					</Animated.View>
				</Pressable>
			</ZoomableView>

			{show && (
				<View
					style={{
						overflow: "hidden",
					}}
				>
					{children}
				</View>
			)}
		</>
	);
}
