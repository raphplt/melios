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

	useEffect(() => {
		Animated.timing(rotationValue, {
			toValue: showHabits ? 0 : 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [showHabits]);
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
			</TouchableOpacity>

			<View style={{ height: showHabits ? "auto" : 0, overflow: "hidden" }}>
				{children}
			</View>
		</View>
	);
}
