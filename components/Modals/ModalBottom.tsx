import { useTheme } from "@context/ThemeContext";
import React, { useEffect, useCallback } from "react";
import {
	Modal,
	View,
	TouchableWithoutFeedback,
	Pressable,
	Animated,
	Easing,
	StatusBar,
	Platform,
	Text,
} from "react-native";
import { Iconify } from "react-native-iconify";

export default function BottomSlideModal({
	visible = false,
	setVisible,
	children,
	title,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	children: React.ReactNode;
	title?: string;
}) {
	const { theme } = useTheme();
	const slideAnim = React.useRef(new Animated.Value(0)).current;
	const opacityAnim = React.useRef(new Animated.Value(0)).current;
	const [showModal, setShowModal] = React.useState(visible);

	const animateIn = useCallback(() => {
		// Réinitialiser les valeurs si nécessaire
		slideAnim.setValue(0);
		opacityAnim.setValue(0);

		// Lancer les animations en parallèle
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: 1,
				duration: 250,
				easing: Easing.bezier(0.0, 0.0, 0.2, 1), // Ease-out optimisé
				useNativeDriver: true,
			}),
			Animated.timing(opacityAnim, {
				toValue: 1,
				duration: 200,
				easing: Easing.bezier(0.0, 0.0, 0.2, 1),
				useNativeDriver: true,
			}),
		]).start();
	}, [slideAnim, opacityAnim]);

	const animateOut = useCallback(() => {
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 200,
				easing: Easing.bezier(0.4, 0.0, 1, 1), // Ease-in optimisé
				useNativeDriver: true,
			}),
			Animated.timing(opacityAnim, {
				toValue: 0,
				duration: 150,
				easing: Easing.bezier(0.4, 0.0, 1, 1),
				useNativeDriver: true,
			}),
		]).start(() => {
			setShowModal(false);
			if (Platform.OS === "android") {
				StatusBar.setBackgroundColor("transparent");
			}
			StatusBar.setBarStyle(theme.dark ? "light-content" : "dark-content");
		});
	}, [slideAnim, opacityAnim, theme.dark]);

	useEffect(() => {
		if (visible) {
			setShowModal(true);
			if (Platform.OS === "android") {
				StatusBar.setBackgroundColor("rgba(0,0,0,0.4)");
			}
			StatusBar.setBarStyle("light-content");
			// Lancer l'animation après le prochain cycle de rendu
			requestAnimationFrame(animateIn);
		} else if (showModal) {
			animateOut();
		}
	}, [visible, showModal, animateIn, animateOut]);

	const translateY = slideAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [300, 0], // Augmenter la distance pour une animation plus visible
	});

	const backdropOpacity = opacityAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
	});

	if (!showModal) return null;

	return (
		<Modal
			visible={showModal}
			transparent={true}
			hardwareAccelerated={true}
			onRequestClose={() => {
				setVisible(false);
			}}
			animationType="none"
		>
			<TouchableWithoutFeedback onPress={() => setVisible(false)}>
				<Animated.View
					style={{
						flex: 1,
						justifyContent: "flex-end",
						backgroundColor: "rgba(0,0,0,0.4)",
						opacity: backdropOpacity,
					}}
				>
					<TouchableWithoutFeedback>
						<Animated.View
							style={{
								transform: [{ translateY }],
								backgroundColor: theme.colors.cardBackground,
								padding: 10,
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								borderColor: theme.dark ? "#B0B0B0" : theme.colors.border,
								borderWidth: 1,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.3,
								shadowRadius: 4,
								elevation: 5,
								maxHeight: "80%",
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 10,
								}}
							>
								{title && (
									<Text
										style={{
											color: theme.colors.text,
											fontSize: 16,
											fontWeight: "bold",
										}}
										className="w-11/12 mx-1"
									>
										{title}
									</Text>
								)}
								<Pressable
									style={{ marginLeft: "auto" }}
									onPress={() => setVisible(false)}
								>
									<Iconify
										icon="material-symbols:close"
										color={theme.colors.textTertiary}
										size={24}
									/>
								</Pressable>
							</View>

							<View style={{ flex: 1 }}>{children}</View>
						</Animated.View>
					</TouchableWithoutFeedback>
				</Animated.View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}