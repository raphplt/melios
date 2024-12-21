import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Iconify } from "react-native-iconify";
import ModalAddGoal from "./ModalAddGoal";
import { useTranslation } from "react-i18next";

export default function AddGoal() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);

	const { width } = Dimensions.get("window");

	return (
		<View
			className="flex-1 my-2"
			style={{
				width: width,
			}}
		>
			<Pressable
				className="mx-auto flex items-center justify-start flex-row px-2 py-1  h-14"
				style={{
					flexGrow: 1,
					borderStyle: "dashed",
					borderRadius: 16,
					borderWidth: 2,
					borderColor: theme.colors.primary,
					width: width * 0.95,
				}}
				onPress={() => setVisible(true)}
			>
				<Text
					style={{
						color: theme.colors.primary,
					}}
					className="text-[16px] font-semibold mx-2"
				>
					{t("define_goal")}
				</Text>
				<Iconify
					icon="bi:arrow-right"
					size={24}
					color={theme.colors.primary}
					style={{ marginLeft: "auto" }}
				/>
			</Pressable>

			<ModalAddGoal visible={visible} setVisible={setVisible} />
		</View>
	);
}
