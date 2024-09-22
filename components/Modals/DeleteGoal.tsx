import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Modal, View, Pressable, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function DeleteGoal({
	visible,
	setVisible,
	onConfirm,
}: {
	visible: boolean;
	setVisible: (isConfirmVisible: boolean) => void;
	onConfirm: () => void;
}) {
	const { theme } = useContext(ThemeContext);
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
					<Text className="text-[18px] leading-6 mb-3 font-semibold">
						Êtes-vous sûr de vouloir supprimer cet objectif ?
					</Text>

					<Text
						className="text-sm my-4"
						style={{ color: theme.colors.textTertiary }}
					>
						Vous ne recevrez pas de récompense pour cet objectif.
					</Text>
					<View className="flex items-center justify-end flex-row">
						<Pressable
							onPress={() => setVisible(false)}
							style={{
								backgroundColor: theme.colors.grayPrimary,
							}}
							className="px-6 py-3 mx-2 rounded-xl"
						>
							<Text style={{ color: "white" }} className="font-semibold text-[16px]">
								Annuler
							</Text>
						</Pressable>
						<Pressable
							onPress={onConfirm}
							style={{
								backgroundColor: theme.colors.redPrimary,
							}}
							className="px-6 py-3 mx-2 rounded-xl"
						>
							<Text style={{ color: "white" }} className="font-semibold text-[16px]">
								Supprimer
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}
