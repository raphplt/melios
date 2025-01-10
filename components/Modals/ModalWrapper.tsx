import { useTheme } from "@context/ThemeContext";
import React, { useEffect } from "react";
import {
	Modal,
	View,
	TouchableWithoutFeedback,
	Pressable,
	StatusBar,
	Platform,
} from "react-native";
import { Iconify } from "react-native-iconify";

export default function ModalWrapper({
	visible = false,
	setVisible,
	children,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	children: React.ReactNode;
}) {
	const { theme } = useTheme();

	useEffect(() => {
		if (visible) {
			if (Platform.OS === "android") {
				StatusBar.setBackgroundColor("rgba(0,0,0,0.4)");
			}
			StatusBar.setBarStyle("light-content");
		} else {
			if (Platform.OS === "android") {
				StatusBar.setBackgroundColor("transparent");
			}
			StatusBar.setBarStyle(theme.dark ? "light-content" : "dark-content");
		}
	}, [visible, theme.dark]);

	return (
		<Modal
			visible={visible}
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
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "rgba(0,0,0,0.4)",
					}}
				>
					<TouchableWithoutFeedback>
						<View
							style={{
								backgroundColor: theme.colors.cardBackground,
								padding: 20,
								borderRadius: 10,
								borderColor: theme.dark ? "#B0B0B0" : theme.colors.border,
								borderWidth: 1,
							}}
						>
							<Pressable
								className="absolute top-3 right-3"
								onPress={() => setVisible(false)}
							>
								<Iconify
									icon="material-symbols:close"
									color={theme.colors.textTertiary}
									size={24}
								/>
							</Pressable>

							{children}
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}