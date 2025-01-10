import { useTheme } from "@context/ThemeContext";
import React, { useEffect } from "react";
import {
	Modal,
	View,
	TouchableWithoutFeedback,
	Pressable,
	Animated,
	Easing,
	StatusBar,
} from "react-native";
import { Iconify } from "react-native-iconify";

export default function BottomSlideModal({
	visible = false,
	setVisible,
	children,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	children: React.ReactNode;
}) {
	const { theme } = useTheme();
	const slideAnim = React.useRef(new Animated.Value(0)).current;
	const [showModal, setShowModal] = React.useState(visible);

	useEffect(() => {
		if (visible) {
			setShowModal(true);
			StatusBar.setBackgroundColor("rgba(0,0,0,0.4)");
			StatusBar.setBarStyle("light-content");
			Animated.timing(slideAnim, {
				toValue: 1,
				duration: 200,
				easing: Easing.out(Easing.ease),
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 200,
				easing: Easing.in(Easing.ease),
				useNativeDriver: true,
			}).start(() => {
				setShowModal(false);
				StatusBar.setBackgroundColor("transparent");
				StatusBar.setBarStyle(theme.dark ? "light-content" : "dark-content");
			});
		}
	}, [visible, theme.dark, slideAnim]);

	const translateY = slideAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [200, 0],
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
		>
			<TouchableWithoutFeedback onPress={() => setVisible(false)}>
				<View
					style={{
						flex: 1,
						justifyContent: "flex-end",
						backgroundColor: "rgba(0,0,0,0.4)",
					}}
				>
					<TouchableWithoutFeedback>
						<Animated.View
							style={{
								transform: [{ translateY }],
								backgroundColor: theme.colors.cardBackground,
								padding: 20,
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								borderColor: theme.dark ? "#B0B0B0" : theme.colors.border,
								borderWidth: 1,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.3,
								shadowRadius: 4,
								elevation: 5,
							}}
						>
							<Pressable
								style={{ alignSelf: "flex-end", marginBottom: 10 }}
								onPress={() => setVisible(false)}
							>
								<Iconify
									icon="material-symbols:close"
									color={theme.colors.textTertiary}
									size={24}
								/>
							</Pressable>

							{children}
						</Animated.View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}
