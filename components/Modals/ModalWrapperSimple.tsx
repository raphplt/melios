import { useTheme } from "@context/ThemeContext";
import { Modal, View, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ModalWrapperSimple({
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
				<Pressable
					onPress={() => setVisible(false)}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
					}}
				/>

				<View
					style={{
						backgroundColor: theme.colors.cardBackground,
						padding: 20,
						borderRadius: 10,
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
			</View>
		</Modal>
	);
}
