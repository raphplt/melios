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
	Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
	const insets = useSafeAreaInsets();
	const slideAnim = React.useRef(new Animated.Value(0)).current;
	const [showModal, setShowModal] = React.useState(visible);

	const { height: screenHeight } = Dimensions.get("window");

	const animateIn = useCallback(() => {
		slideAnim.setValue(0);

		Animated.timing(slideAnim, {
			toValue: 1,
			duration: 300,
			easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
			useNativeDriver: true,
		}).start();
	}, [slideAnim]);

	const animateOut = useCallback(() => {
		Animated.timing(slideAnim, {
			toValue: 0,
			duration: 250,
			easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
			useNativeDriver: true,
		}).start(() => {
			setShowModal(false);
			if (Platform.OS === "android") {
				StatusBar.setBackgroundColor("transparent");
			}
			StatusBar.setBarStyle(theme.dark ? "light-content" : "dark-content");
		});
	}, [slideAnim, theme.dark]);

	useEffect(() => {
		if (visible) {
			setShowModal(true);
			if (Platform.OS === "android") {
				StatusBar.setBackgroundColor("rgba(0,0,0,0.5)");
			}
			StatusBar.setBarStyle("light-content");
			// Délai pour permettre au modal de s'afficher avant l'animation
			setTimeout(animateIn, 50);
		} else if (showModal) {
			animateOut();
		}
	}, [visible, showModal, animateIn, animateOut]);

	const translateY = slideAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [screenHeight, 0],
	});

	const backdropOpacity = slideAnim.interpolate({
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
			statusBarTranslucent={Platform.OS === "android"}
		>
			<TouchableWithoutFeedback onPress={() => setVisible(false)}>
				<Animated.View
					style={{
						flex: 1,
						justifyContent: "flex-end",
						backgroundColor: "transparent",
					}}
				>
					{/* Backdrop avec opacité animée */}
					<Animated.View
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0,0,0,0.5)",
							opacity: backdropOpacity,
						}}
					/>

					<TouchableWithoutFeedback>
						<Animated.View
							style={{
								transform: [{ translateY }],
								backgroundColor: theme.colors.cardBackground,
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								borderColor: theme.dark ? "#333" : theme.colors.border,
								borderTopWidth: 1,
								borderLeftWidth: 1,
								borderRightWidth: 1,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: -2 },
								shadowOpacity: 0.25,
								shadowRadius: 10,
								elevation: 10,
								maxHeight: screenHeight * 0.9,
								paddingBottom: insets.bottom || 10,
							}}
						>
							{/* Handle bar pour iOS */}
							<View
								style={{
									width: 40,
									height: 4,
									backgroundColor: theme.colors.textTertiary,
									borderRadius: 2,
									alignSelf: "center",
									marginTop: 8,
									marginBottom: 12,
									opacity: 0.3,
								}}
							/>

							<View style={{ paddingHorizontal: 16 }}>
								{/* Header */}
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: 16,
									}}
								>
									{title && (
										<Text
											style={{
												color: theme.colors.text,
												fontSize: 18,
												fontWeight: "600",
												flex: 1,
												marginRight: 16,
											}}
										>
											{title}
										</Text>
									)}
									<Pressable
										onPress={() => setVisible(false)}
										style={{
											padding: 4,
											borderRadius: 20,
											backgroundColor: theme.colors.background,
										}}
									>
										<Iconify
											icon="material-symbols:close"
											color={theme.colors.textTertiary}
											size={20}
										/>
									</Pressable>
								</View>

								{/* Content */}
								<View style={{ maxHeight: screenHeight * 0.7 }}>{children}</View>
							</View>
						</Animated.View>
					</TouchableWithoutFeedback>
				</Animated.View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}