import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Modal, View, Pressable, Text } from "react-native";
import ModalWrapper from "./ModalWrapper";

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
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View>
				<View className="w-10/12">
					<Text className="text-[18px] mb-3 font-semibold">
						{t("delete_goal_confirm")}
					</Text>
				</View>

				<Text className="my-4" style={{ color: theme.colors.textTertiary }}>
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
		</ModalWrapper>
	);
}
