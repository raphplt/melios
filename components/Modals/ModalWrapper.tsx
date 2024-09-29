import { useTheme } from "@context/ThemeContext";
import { Modal, View } from "react-native";

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
	return (
		<Modal
			visible={visible}
			transparent={true}
			hardwareAccelerated={true}
			onRequestClose={() => {
				setVisible(false);
			}}
		>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "rgba(0,0,0,0.4)",
				}}
			>
				<View
					style={{
						backgroundColor: theme.colors.cardBackground,
						borderColor: theme.colors.border,
						borderWidth: 1,
						padding: 20,
						borderRadius: 10,
					}}
				>
					{children}
				</View>
			</View>
		</Modal>
	);
}
