import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Modal, View, Pressable, Text } from "react-native";

export default function DeleteGoal({
	visible,
	setVisible,
	onConfirm,
}: {
	visible: boolean;
	setVisible: (isConfirmVisible: boolean) => void;
	onConfirm: () => void;
}) {
	const { theme } = useTheme();
	const { t } = useTranslation();
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
						{t("delete_goal_confirm")}
					</Text>

					<Text
						className="text-sm my-4"
						style={{ color: theme.colors.textTertiary }}
					>
						{t("you_wont_win_points")}
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
								{t("cancel")}
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
								{t("delete")}
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}
