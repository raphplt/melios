import { UserHabit } from "@type/userHabit";
import ModalWrapper from "./ModalWrapper";
import { View, Pressable, Text } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function DeleteHabit({
	visible,
	setVisible,
	handleDelete,
	habit,
}: {
	visible: boolean;
	setVisible: any;
	handleDelete: () => void;
	habit: UserHabit | null;
}) {
	const { theme } = useTheme();
	const { t } = useTranslation();

	if (!habit) return null;
	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View>
				<Text
					className="text-lg font-semibold mb-4"
					style={{ color: theme.colors.text }}
				>
					{t("confirm_delete")}
				</Text>
				<Text
					className="mb-4 py-2 text-[16px]"
					style={{ color: theme.colors.text }}
				>
					{t("are_you_sure_habit")} {habit.name} ?
				</Text>
				<View className="flex flex-row justify-end">
					<Pressable
						onPress={() => setVisible(false)}
						className="rounded-3xl px-5 py-3 mr-2"
						style={{ backgroundColor: theme.colors.grayPrimary }}
					>
						<Text className="font-semibold" style={{ color: "white" }}>
							{t("cancel")}
						</Text>
					</Pressable>

					<Pressable
						onPress={handleDelete}
						className="rounded-3xl px-5 py-3 mr-2"
						style={{ backgroundColor: theme.colors.redPrimary }}
					>
						<Text className="font-semibold" style={{ color: "white" }}>
							{t("delete")}
						</Text>
					</Pressable>
				</View>
			</View>
		</ModalWrapper>
	);
}
