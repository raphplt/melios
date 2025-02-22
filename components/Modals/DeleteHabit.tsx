import { UserHabit } from "@type/userHabit";
import { View, Pressable, Text } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { FontAwesome6 } from "@expo/vector-icons";
import BottomSlideModal from "./ModalBottom";

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
		<BottomSlideModal visible={visible} setVisible={setVisible}>
			<View className="w-11/12 mx-auto">
				<Text
					className="text-xl font-semibold mb-4 text-center"
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
				>
					{t("confirm_delete")}
				</Text>

				<View className="flex flex-row flex-wrap items-start justify-start py-3 mb-2">
					<Text className="text-[16px]" style={{ color: theme.colors.text }}>
						{t("are_you_sure_habit")}
					</Text>

					<Text
						className="font-semibold text-[16px]"
						style={{ color: theme.colors.text }}
					>
						{habit.name}
					</Text>
					<Text className="text-[16px]" style={{ color: theme.colors.text }}>
						{" "}
						?
					</Text>
				</View>
				<View className="flex flex-row items-center justify-center py-4">
					<FontAwesome6
						name={habit.icon || "question"}
						size={28}
						color={habit.color || theme.colors.text}
					/>
				</View>

				<View className="flex flex-row justify-evenly py-3">
					<Pressable
						onPress={() => setVisible(false)}
						className="rounded-3xl px-8 py-3"
						style={{ backgroundColor: theme.colors.grayPrimary }}
					>
						<Text className="font-semibold text-lg" style={{ color: "white" }}>
							{t("cancel")}
						</Text>
					</Pressable>

					<Pressable
						onPress={handleDelete}
						className="rounded-3xl px-8 py-3"
						style={{ backgroundColor: theme.colors.redPrimary }}
					>
						<Text className="font-semibold text-lg" style={{ color: "white" }}>
							{t("delete")}
						</Text>
					</Pressable>
				</View>
			</View>
		</BottomSlideModal>
	);
}
